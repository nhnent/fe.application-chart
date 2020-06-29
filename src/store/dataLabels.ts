import { StoreModule } from '@t/store/store';
import { isFunction, includes, deepMergedCopy } from '@src/helpers/utils';
import { DataLabels, DataLabelStyle, DataLabelAnchor, SeriesDataType } from '@t/options';
import { PointModel, RectModel } from '@t/components/series';
import { DataLabel, DataLabelOption, DataLabelStackTotal } from '@t/components/dataLabels';
import { strokeLabelStyle, labelStyle } from '@src/brushes/label';

const ANCHOR_TYPES = ['center', 'start', 'end'];

export type DefaultDataLabelOptions = {
  visible: boolean;
  anchor: DataLabelAnchor;
  offsetX: number;
  offsetY: number;
  style: Required<DataLabelStyle>;
  stackTotal?: {
    visible: boolean;
    style?: Required<DataLabelStyle>;
  };
};

function getDefaultOptions(type: DataLabelType) {
  const style = {
    font: labelStyle['default'].font,
    color: labelStyle['default'].fillStyle,
    textStrokeColor: strokeLabelStyle.stroke.strokeStyle,
  };

  return {
    point: {
      anchor: 'center',
      style,
    } as DefaultDataLabelOptions,
    rect: {
      anchor: 'end',
      style,
    } as DefaultDataLabelOptions,
    stack: {
      anchor: 'end',
      style,
      stackTotal: {
        visible: true,
        style,
      },
    } as DefaultDataLabelOptions,
  }[type];
}

function getAnchor(
  dataLabelOptions: DataLabels,
  defaultOptions: DefaultDataLabelOptions
): DataLabelAnchor {
  return includes(ANCHOR_TYPES, dataLabelOptions.anchor)
    ? dataLabelOptions.anchor!
    : defaultOptions.anchor;
}

function getStyle(
  dataLabelOptions: DataLabels,
  defaultOptions: DefaultDataLabelOptions
): Required<DataLabelStyle> {
  const { font, color, textStrokeColor } = defaultOptions.style;

  return {
    font: dataLabelOptions.style?.font ?? font,
    color: dataLabelOptions.style?.color ?? color,
    textStrokeColor: dataLabelOptions?.style?.textStrokeColor ?? textStrokeColor,
  };
}

export function getDataLabelsOptions(
  dataLabelOptions: DataLabels,
  type: DataLabelType
): DataLabelOption {
  const defaultOptions = getDefaultOptions(type);
  const anchor = getAnchor(dataLabelOptions, defaultOptions);
  const { offsetX = 0, offsetY = 0 } = dataLabelOptions;
  const formatter = isFunction(dataLabelOptions.formatter)
    ? dataLabelOptions.formatter!
    : function (value: SeriesDataType): string {
        return String(value) || '';
      };
  const style = getStyle(dataLabelOptions, defaultOptions);

  const options: DataLabelOption = { anchor, offsetX, offsetY, formatter, style };

  if (type === 'stack') {
    options.stackTotal = deepMergedCopy(
      dataLabelOptions.stackTotal!,
      defaultOptions.stackTotal!
    ) as DataLabelStackTotal;
  }

  return options;
}

function makePointLabelInfo(point: PointDataLabel, dataLabelOptions: DataLabelOption): DataLabel {
  const { anchor, offsetX = 0, offsetY = 0, formatter, style } = dataLabelOptions;

  let posX = point.x;
  let posY = point.y;

  const textAlign = 'center';
  let textBaseline: CanvasTextBaseline = 'middle';

  if (anchor === 'end') {
    textBaseline = 'bottom';
  } else if (anchor === 'start') {
    textBaseline = 'top';
  }

  posX += offsetX;
  posY += offsetY;

  return {
    x: posX,
    y: posY,
    text: formatter!(point.value!),
    textAlign,
    textBaseline,
    style,
  };
}

type DataLabelType = 'point' | 'rect' | 'stack';
type PointDataLabel = PointModel & {
  type: 'point';
};
type RectDataLabel = RectModel & {
  direction: 'vertical' | 'horizontal';
};

function makeRectLabelInfo(rect: RectDataLabel, dataLabelOptions: DataLabelOption): DataLabel {
  const { value, width, height, direction } = rect;
  const { anchor, offsetX = 0, offsetY = 0, formatter, style } = dataLabelOptions;
  let textAlign: CanvasTextAlign = 'center';
  let textBaseline: CanvasTextBaseline = 'middle';
  let posX = rect.x;
  let posY = rect.y;

  if (direction === 'horizontal') {
    posX += width / 2;

    if (anchor === 'end') {
      textAlign = 'right';
    } else if (anchor === 'start') {
      textAlign = 'left';
    }
  } else if (direction === 'vertical') {
    posY = posY + height / 2;

    if (anchor === 'end') {
      textBaseline = 'top';
    } else if (anchor === 'start') {
      textBaseline = 'bottom';
    }
  }

  posX += offsetX;
  posY += offsetY;

  return {
    x: posX,
    y: posY,
    text: formatter!(value!),
    textAlign,
    textBaseline,
    style,
  };
}

const dataLabels: StoreModule = {
  name: 'dataLabels',
  state: () => ({
    dataLabels: [],
  }),
  action: {
    appendDataLabels({ state }, dataLabelData: Array<PointDataLabel | RectDataLabel>) {
      const { options } = state;
      const dataLabelOptions = options.series?.dataLabels!;

      const labels = dataLabelData.map((model) => {
        if (!model.type) {
          return model;
        }

        const { type } = model;
        const labelOptions = getDataLabelsOptions(dataLabelOptions, type);

        return type === 'point'
          ? makePointLabelInfo(model as PointDataLabel, labelOptions)
          : makeRectLabelInfo(model as RectDataLabel, labelOptions);
      });

      state.dataLabels = [...labels];
    },
  },
};

export default dataLabels;
