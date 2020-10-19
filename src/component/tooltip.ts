import Component from './component';
import { ChartState, Options } from '@t/store/store';
import {
  TooltipInfo,
  TooltipModel,
  TooltipTitleValues,
  TooltipDataValue,
  TooltipModelName,
} from '@t/components/tooltip';
import { getValueString } from '@src/helpers/tooltip';
import {
  getDefaultTemplate,
  getHeaderTemplate,
  getDefaultBodyTemplate,
  getBoxPlotTemplate,
  getBulletTemplate,
  getPieTemplate,
  getHeatmapTemplate,
} from '@src/helpers/tooltipTemplate';
import { isNumber } from '@src/helpers/utils';
import { Formatter, SeriesDataType, TooltipTemplateFunc } from '@t/options';

import '../css/tooltip.css';

type TooltipInfoModels = { [key in TooltipModelName]: TooltipInfo[] };

export default class Tooltip extends Component {
  chartEl!: HTMLDivElement;

  tooltipContainerEl!: HTMLDivElement;

  templateFunc!: TooltipTemplateFunc;

  offsetX!: number;

  offsetY!: number;

  formatter?: Formatter;

  tooltipInfoModels: TooltipInfoModels = {} as TooltipInfoModels;

  onSeriesPointHovered = ({ models, name }: { models: TooltipInfo[]; name: TooltipModelName }) => {
    this.tooltipInfoModels[name] = models?.length ? [...models] : [];
    const isShow = !!this.getTooltipInfoModels().length;
    if (isShow) {
      this.renderTooltip();
    } else {
      this.removeTooltip();
    }
  };

  isTooltipContainerOverflow(x: number, y: number) {
    const { width, height } = this.tooltipContainerEl.getBoundingClientRect();
    const { x: rectX, y: rectY, width: rectWidth, height: rectHeight } = this.rect;

    return {
      overflowX: x > rectX + rectWidth || x + width > rectX + rectWidth,
      overflowY: y > rectY + rectHeight || y + height > rectY + rectHeight,
    };
  }

  getPositionInRect(model: TooltipModel) {
    const { target } = model;

    const startX = this.rect.x + model.x;
    const startY = this.rect.y + model.y;
    let x = startX + target.radius + target.width + this.offsetX;
    let y = startY + this.offsetY;

    const { overflowX, overflowY } = this.isTooltipContainerOverflow(x, y);
    const { width, height } = this.tooltipContainerEl.getBoundingClientRect();

    if (overflowX) {
      x =
        startX - (width + target.radius + this.offsetX) > 0
          ? startX - (width + target.radius + this.offsetX)
          : startX + this.offsetX;
    }

    if (overflowY) {
      y =
        startY + target.height - (height + this.offsetY) > 0
          ? startY + target.height - (height + this.offsetY)
          : y;
    }

    return { x, y };
  }

  setTooltipPosition(model: TooltipModel) {
    const { x: chartX, y: chartY } = this.chartEl.getBoundingClientRect();
    const { x, y } = this.getPositionInRect(model);
    this.tooltipContainerEl.style.left = `${chartX + x}px`;
    this.tooltipContainerEl.style.top = `${chartY + y}px`;
  }

  getTooltipInfoModels() {
    return Object.values(this.tooltipInfoModels).flatMap((item) => item);
  }

  renderTooltip() {
    const model = this.getTooltipInfoModels().reduce<TooltipModel>(
      (acc, item) => {
        const { data, x, y, radius, width, height } = item;

        acc.x = acc.x ? (acc.x + x) / 2 : x;
        acc.y = acc.y ? (acc.y + y) / 2 : y;

        if (isNumber(radius)) {
          acc.target.radius = radius;
        }

        if (width) {
          acc.target.width = width;
        }

        if (height) {
          acc.target.height = height;
        }

        acc.data.push({
          ...data,
          value: Array.isArray(data.value)
            ? (data.value as TooltipTitleValues).map((titleValue) => ({
                ...titleValue,
                formattedValue: this.getFormattedValue(titleValue.value),
              }))
            : data.value,
          formattedValue: this.getFormattedValue(data.value),
        });

        if (!acc.category && data.category) {
          acc.category = data.category;
        }

        if (data.templateType) {
          acc.templateType = data.templateType;
        }

        return acc;
      },
      { type: 'tooltip', x: 0, y: 0, data: [], target: { radius: 0, width: 0, height: 0 } }
    );

    this.tooltipContainerEl.innerHTML = this.templateFunc(model, {
      header: getHeaderTemplate(model),
      body: this.getBodyTemplate(model),
    });
    this.setTooltipPosition(model);
  }

  getBodyTemplate(model: TooltipModel) {
    let tpl;

    if (model.templateType === 'boxPlot') {
      tpl = getBoxPlotTemplate(model);
    } else if (model.templateType === 'bullet') {
      tpl = getBulletTemplate(model);
    } else if (model.templateType === 'pie') {
      tpl = getPieTemplate(model);
    } else if (model.templateType === 'heatmap') {
      tpl = getHeatmapTemplate(model);
    } else {
      tpl = getDefaultBodyTemplate(model);
    }

    return tpl;
  }

  initialize({ chartEl }) {
    this.type = 'tooltip';
    this.name = 'tooltip';

    this.chartEl = chartEl;

    this.tooltipContainerEl = document.createElement('div');
    this.tooltipContainerEl.classList.add('tooltip-container');
    this.chartEl.appendChild(this.tooltipContainerEl);

    this.eventBus.on('seriesPointHovered', this.onSeriesPointHovered);
  }

  removeTooltip() {
    this.tooltipContainerEl.innerHTML = '';
  }

  render({ layout, options }: ChartState<Options>) {
    this.rect = layout.plot;
    this.templateFunc = options?.tooltip?.template ?? getDefaultTemplate;
    this.offsetX = options?.tooltip?.offsetX ?? 10;
    this.offsetY = options?.tooltip?.offsetY ?? 0;
    this.formatter = options?.tooltip?.formatter;
  }

  getFormattedValue(value: TooltipDataValue) {
    return this.formatter ? this.formatter(value as SeriesDataType) : getValueString(value);
  }
}
