import { ValueEdge } from '@t/store/store';
import * as arrayUtil from '@src/helpers/arrayUtil';
import { range, isInteger } from '@src/helpers/utils';
import { BezierPoint, Point } from '@t/options';

export const getDecimalLength = (value: string | number) => {
  const valueArr = String(value).split('.');

  return valueArr.length === 2 ? valueArr[1].length : 0;
};

export const findMultipleNum = (...args: number[]) => {
  const underPointLens = args.map((value) => getDecimalLength(value));
  const underPointLen = arrayUtil.max(underPointLens);

  return 10 ** underPointLen;
};

export function makeLabelsFromLimit(limit: ValueEdge, stepSize: number) {
  const multipleNum = findMultipleNum(stepSize);
  const min = Math.round(limit.min * multipleNum);
  const max = Math.round(limit.max * multipleNum);
  const labels = range(min, max + 1, stepSize * multipleNum);

  return labels.map((label) => String(label / multipleNum));
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
    positions = range(0, count).map((index) => {
      const ratio = index === 0 ? 0 : index / (count - 1);

      return ratio * size + additionalPosition;
    });
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

function getControlPoints(prev: BezierPoint, cur: BezierPoint, next: BezierPoint) {
  // http://scaledinnovation.com/analytics/splines/aboutSplines.html
  const TENSION = 0.333;
  const { x: x0, y: y0 } = prev;
  const { x: x1, y: y1 } = cur;
  const { x: x2, y: y2 } = next;

  const d12 = getDistance(next, cur);
  const d01 = getDistance(cur, prev);

  const fa = (TENSION * d01) / (d01 + d12) || 0; // scaling factor for triangle Ta
  const fb = (TENSION * d12) / (d01 + d12) || 0; // ditto for Tb, simplifies to fb=t-fa

  return {
    prev: {
      x: x1 - fa * (x2 - x0), // x2-x0 is the width of triangle T
      y: y1 - fa * (y2 - y0), // y2-y0 is the height of T
    },
    next: { x: x1 + fb * (x2 - x0), y: y1 + fb * (y2 - y0) },
  };
}

export function setSplineControlPoint(points: BezierPoint[]) {
  for (let i = 0, pointsSize = points.length, prev = points[0]; i < pointsSize; i += 1) {
    const point = points[i];

    point.controlPoint = getControlPoints(
      prev,
      point,
      points[Math.min(i + 1, pointsSize - 1) % pointsSize]
    );

    prev = point;
  }
}

export function getValueRatio(value: number, { min, max }: ValueEdge) {
  return (value - min) / (max - min);
}

export function getDistance(point1: Point, point2: Point) {
  return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
}

export function getTextWidth(text: string, font: string) {
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.font = font;

  return ctx.measureText(text).width;
}

function limitNegative(value: number, min: number, max: number) {
  if (value >= max) {
    return 0;
  }

  let result = value;

  if (max < 0) {
    result = Math.min(value - max, 0);
  }

  if (value < min) {
    result -= value - min;
  }

  return result;
}

function limitPositive(value: number, min: number, max: number) {
  let result = value;

  if (min > 0) {
    result = Math.max(value - min, 0);
  }

  if (value > max) {
    result -= value - max;
  }

  return result;
}

export function calibrateBoxDrawingValue(value: number, min: number, max: number) {
  return value < 0 ? limitNegative(value, min, max) : limitPositive(value, min, max);
}

export function sumOfPrevValues(values: number[], currentIndex: number, included = false) {
  const curValue = values[currentIndex];

  return values.reduce((total, value, idx) => {
    const isPrev = included ? idx <= currentIndex : idx < currentIndex;
    const isSameSign = value * curValue >= 0;

    if (isPrev && isSameSign) {
      return total + value;
    }

    return total;
  }, 0);
}

export function exceedEdge(values: number[], currentIndex: number, min: number, max: number) {
  const value = values[currentIndex];
  const totalOfPrevValues = sumOfPrevValues(values, currentIndex, false);
  const positive = value >= 0;
  const negative = value < 0;

  return (
    (positive && totalOfPrevValues >= max) ||
    (negative && totalOfPrevValues <= min) ||
    (currentIndex === 0 && positive && value < min) ||
    (currentIndex === 0 && negative && value > max)
  );
}

export function calibrateBoxStackDrawingValue(
  values: number[],
  currentIndex: number,
  min: number,
  max: number
) {
  const totalOfPrevValues = sumOfPrevValues(values, currentIndex, false);
  const totalOfValues = sumOfPrevValues(values, currentIndex, true);

  if (exceedEdge(values, currentIndex, min, max)) {
    return;
  }

  if (currentIndex === 0) {
    return calibrateBoxDrawingValue(values[currentIndex], min, max);
  }

  let result = values[currentIndex];

  if (totalOfValues > max) {
    result = max - totalOfPrevValues;
  }

  if (totalOfValues < min) {
    result = min - totalOfPrevValues;
  }

  if (totalOfPrevValues < min) {
    result = totalOfValues - min;
  }

  if (totalOfPrevValues > max) {
    result = totalOfValues - max;
  }

  return result;
}
