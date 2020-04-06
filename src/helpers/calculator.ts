import { ValueEdge } from '@t/store/store';
import * as arrayUtil from '@src/helpers/arrayUtil';
import { range, isInteger } from '@src/helpers/utils';

export const getDecimalLength = (value: string | number) => {
  const valueArr = String(value).split('.');

  return valueArr.length === 2 ? valueArr[1].length : 0;
};

export const findMultipleNum = (...args: number[]) => {
  const underPointLens = args.map(value => getDecimalLength(value));
  const underPointLen = arrayUtil.max(underPointLens);

  return Math.pow(10, underPointLen);
};

export function makeLabelsFromLimit(limit: ValueEdge, step: number) {
  const multipleNum = findMultipleNum(step);
  const min = Math.round(limit.min * multipleNum);
  const max = Math.round(limit.max * multipleNum);
  const labels = range(min, max + 1, step * multipleNum);

  return labels.map(label => label / multipleNum);
}

export function makeTickPixelPositions(
  size: number,
  count: number,
  additionalPosition = 0,
  remainLastBlockIntervalPosition = 0
): number[] {
  let positions: number[] = [];

  additionalPosition = additionalPosition || 0;

  if (count > 0) {
    positions = range(0, count).map(index => {
      const ratio = index === 0 ? 0 : index / (count - 1);

      return ratio * size + additionalPosition;
    });

    // 왜하는지 모르겠음
    // positions[positions.length - 1] -= 1;
  }

  if (remainLastBlockIntervalPosition) {
    positions.push(remainLastBlockIntervalPosition);
  }

  return positions;
}

export function crispPixel(pixel: number, thickness = 1) {
  const halfThickness = thickness / 2;

  return thickness % 2
    ? (isInteger(pixel) ? pixel : Math.round(pixel - halfThickness)) + halfThickness
    : Math.round(pixel);
}

function getControlPoints({ x: x0, y: y0 }, { x: x1, y: y1 }, { x: x2, y: y2 }) {
  // http://scaledinnovation.com/analytics/splines/aboutSplines.html
  const TENSION = 0.333;

  const d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  const fa = (TENSION * d01) / (d01 + d12); // scaling factor for triangle Ta
  const fb = (TENSION * d12) / (d01 + d12); // ditto for Tb, simplifies to fb=t-fa

  return {
    prev: {
      x: x1 - fa * (x2 - x0), // x2-x0 is the width of triangle T
      y: y1 - fa * (y2 - y0) // y2-y0 is the height of T
    },
    next: { x: x1 + fb * (x2 - x0), y: y1 + fb * (y2 - y0) }
  };
}

export function updateSplineCurve(points) {
  let prev = points[0];

  for (let i = 0, pointsSize = points.length; i < pointsSize; i += 1) {
    const point = points[i];

    point.controlPoint = getControlPoints(
      prev,
      point,
      points[Math.min(i + 1, pointsSize - 1) % pointsSize]
    );

    prev = point;
  }
}
