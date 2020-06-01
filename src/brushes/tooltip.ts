import { pathRect, label as labelBrush, line } from '@src/brushes/basic';
import { TooltipData, TooltipModel } from '@t/components/tooltip';
import { rect } from '@src/brushes/boxSeries';
import { LabelModel, LabelStyle } from '@t/components/axis';
import { Point } from '@t/options';
import { deepMergedCopy } from '@src/helpers/utils';
import { getTextWidth } from '@src/helpers/calculator';

const MINIMUM_TOOLTIP_TEXT_WIDTH = 100;
const CATEGORY_FONT_STYLE = 'bold 13px Arial';
const LABEL_FONT_STYLE = 'normal 12px Arial';
const COLOR_RECT_SIZE = 13;
const CATEGORY_TEXT_HEIGHT = 13;
const padding = { X: 15, Y: 10, DATA_Y: 4 };

type CategoryAreaInfo = {
  xStartPoint: number;
  yStartPoint: number;
  text: string;
  width: number;
} & Point;

type DataItemAreaInfo = {
  xStartPoint: number;
  width: number;
  x: number;
  y: number;
} & Pick<TooltipData, 'label' | 'value' | 'color'>;

function getValueString(value: string | number | [number, number]) {
  if (Array.isArray(value)) {
    return `(${value[0]}, ${value[1]})`;
  }

  return String(value);
}

function getMaximumTooltipTextWidth(tooltipModel: TooltipModel) {
  const { data, category } = tooltipModel;
  const categoryWidth = category ? getTextWidth(category, CATEGORY_FONT_STYLE) : 0;
  const textWidth = data.reduce((acc, { value, label }) => {
    const valueWidth = getTextWidth(getValueString(value), LABEL_FONT_STYLE);
    const labelWidth = getTextWidth(label, LABEL_FONT_STYLE);

    return Math.max(valueWidth + labelWidth + COLOR_RECT_SIZE, acc);
  }, -1);

  return Math.max(MINIMUM_TOOLTIP_TEXT_WIDTH, categoryWidth, textWidth);
}

function renderCategoryArea(ctx: CanvasRenderingContext2D, categoryAreaInfo: CategoryAreaInfo) {
  const { xStartPoint, yStartPoint, text, width, x, y } = categoryAreaInfo;

  labelBrush(ctx, {
    type: 'label',
    x: xStartPoint,
    y: yStartPoint,
    text,
    style: [
      'default',
      {
        textBaseline: 'top',
        fillStyle: '#fff',
        font: CATEGORY_FONT_STYLE,
        textAlign: 'left',
      },
    ],
  });

  line(ctx, {
    type: 'line',
    x,
    y: y + CATEGORY_TEXT_HEIGHT,
    x2: x + width,
    y2: y + CATEGORY_TEXT_HEIGHT,
    strokeStyle: 'rgba(0, 0, 0, 0.1)',
  });
}

function renderLabelModel(text: string, point: Point, styleObj?: LabelStyle) {
  const labelStyle = {
    textBaseline: 'top',
    fillStyle: '#fff',
    font: 'normal 12px Arial',
    textAlign: 'left',
  } as LabelStyle;

  return {
    ...point,
    type: 'label',
    text,
    style: ['default', styleObj ? deepMergedCopy(labelStyle, styleObj) : labelStyle],
  } as LabelModel;
}

function renderDataItem(ctx: CanvasRenderingContext2D, dataItemAreaInfo: DataItemAreaInfo) {
  const { xStartPoint, x, y, label, color, value, width } = dataItemAreaInfo;

  rect(ctx, {
    type: 'rect',
    x: xStartPoint,
    y,
    width: COLOR_RECT_SIZE,
    height: COLOR_RECT_SIZE,
    color,
  });

  labelBrush(ctx, renderLabelModel(label, { x: xStartPoint + 20, y }));
  labelBrush(
    ctx,
    renderLabelModel(getValueString(value), { x: x + width - padding.X, y }, { textAlign: 'right' })
  );
}

export function tooltip(ctx: CanvasRenderingContext2D, tooltipModel: TooltipModel) {
  const { x, y, data, category } = tooltipModel;
  const xStartPoint = x + padding.X;
  const yStartPoint = y + padding.Y;

  const bgColor = 'rgba(85, 85, 85, 0.95)';
  const categoryHeight = category ? 30 : 0;

  const dataHeight = 13;
  const width = getMaximumTooltipTextWidth(tooltipModel) + padding.X * 2 + 15;
  const height = padding.Y * 2 + categoryHeight + dataHeight * data.length;

  pathRect(ctx, {
    type: 'pathRect',
    x,
    y,
    width,
    height,
    radius: 5,
    fill: bgColor,
    stroke: bgColor,
  });

  if (category) {
    renderCategoryArea(ctx, { xStartPoint, yStartPoint, x, y, width, text: category });
  }

  data.forEach(({ label, color, value }, index) => {
    const dataPoint = yStartPoint + categoryHeight + 15 * index;

    renderDataItem(ctx, { x, y: dataPoint, xStartPoint, label, color, value, width });
  });
}
