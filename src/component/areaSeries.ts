import Component from './component';
import {
  AreaPointsModel,
  BoundResponderModel,
  CircleModel,
  CircleResponderModel,
  LinePointsModel,
  PointModel,
  AreaSeriesModels,
} from '@t/components/series';
import {
  AreaChartOptions,
  AreaSeriesDataType,
  AreaSeriesType,
  LineTypeSeriesOptions,
  RangeDataType,
} from '@t/options';
import { ClipRectAreaModel } from '@t/components/series';
import { ChartState, StackSeriesData, ValueEdge } from '@t/store/store';
import { crispPixel, getValueRatio, setSplineControlPoint } from '@src/helpers/calculator';
import { TooltipData } from '@t/components/tooltip';
import { getRGBA } from '@src/helpers/color';
import { deepCopyArray, deepMergedCopy, first, last, range, sum } from '@src/helpers/utils';
import { isRangeData } from '@src/helpers/range';
import { LineModel } from '@t/components/axis';
import { getActiveSeriesMap } from '@src/helpers/legend';

interface AreaSeriesDrawModels {
  rect: ClipRectAreaModel[];
  series: AreaPointsModel[];
}

interface RenderOptions {
  pointOnColumn: boolean;
  options: LineTypeSeriesOptions;
  tickDistance: number;
  tickCount: number;
  areaStackSeries?: StackSeriesData<'area'>;
  pairModel?: boolean;
}

type DatumType = number | RangeDataType;

export default class AreaSeries extends Component {
  models: AreaSeriesDrawModels = { rect: [], series: [] };

  drawModels!: AreaSeriesModels;

  responders!: CircleResponderModel[] | BoundResponderModel[];

  activatedResponders: this['responders'] = [];

  tooltipCircleMap?: Record<number, CircleResponderModel[]>;

  linePointsModel!: LinePointsModel[];

  baseValueYPosition!: number;

  isStackChart = false;

  isRangeChart = false;

  seriesOpacity = {
    INACTIVE: 0.2,
    ACTIVE: 1,
  };

  initialize() {
    this.type = 'series';
    this.name = 'areaSeries';
  }

  initUpdate(delta: number) {
    if (!this.drawModels) {
      return;
    }

    this.drawModels.rect[0].width = this.models.rect[0].width * delta;
  }

  getBaseValueYPosition(limit: ValueEdge) {
    const baseValue = limit.min >= 0 ? limit.min : Math.min(limit.max, 0);
    const intervalSize = this.rect.height / (limit.max - limit.min);

    return (limit.max - baseValue) * intervalSize;
  }

  getStackValue(areaStackSeries: StackSeriesData<'area'>, seriesIndex: number, index: number) {
    const { type } = areaStackSeries.stack;
    const { values, sum: sumValue } = areaStackSeries.stackData[index];
    const stackedValue = sum(values.slice(0, seriesIndex + 1));

    return type === 'percent' ? (stackedValue * 100) / sumValue : stackedValue;
  }

  public render(chartState: ChartState<AreaChartOptions>) {
    const {
      layout,
      series,
      scale,
      options,
      axes,
      categories = [],
      legend,
      dataLabels,
      stackSeries,
    } = chartState;

    if (!series.area) {
      throw new Error("There's no area data!");
    }

    let areaStackSeries;

    this.rect = layout.plot;
    this.activeSeriesMap = getActiveSeriesMap(legend);
    this.seriesOpacity.ACTIVE = options?.series?.areaOpacity ?? this.seriesOpacity.ACTIVE;

    const { limit } = scale.yAxis;
    const { tickDistance, pointOnColumn, tickCount } = axes.xAxis!;
    const areaData = series.area.data;
    this.baseValueYPosition = this.getBaseValueYPosition(limit);

    if (stackSeries?.area) {
      this.isStackChart = true;
      areaStackSeries = stackSeries.area;
    } else if (isRangeData(first(areaData)?.data)) {
      this.isRangeChart = true;
    }

    const renderOptions: RenderOptions = {
      pointOnColumn,
      options: options.series || {},
      tickDistance,
      tickCount,
      areaStackSeries,
    };

    this.linePointsModel = this.renderLinePointsModel(areaData, limit, renderOptions);

    const areaSeriesModel = this.renderAreaPointsModel();
    const seriesCircleModel = this.renderCircleModel();
    const tooltipDataArr = this.makeTooltipData(areaData, categories);

    this.models = {
      rect: [this.renderClipRectAreaModel()],
      series: areaSeriesModel,
    };

    if (!this.drawModels) {
      this.drawModels = {
        rect: [this.renderClipRectAreaModel(true)],
        series: deepCopyArray(areaSeriesModel),
      };
    }

    if (dataLabels.visible) {
      this.store.dispatch('appendDataLabels', this.getDataLabels(areaSeriesModel));
    }

    if (this.isStackChart) {
      this.tooltipCircleMap = seriesCircleModel.reduce<Record<string, CircleResponderModel[]>>(
        (acc, cur, dataIndex) => {
          const index = cur.index!;
          const tooltipModel = { ...cur, data: tooltipDataArr[dataIndex] };
          if (!acc[index]) {
            acc[index] = [];
          }
          acc[index].push(tooltipModel);

          return acc;
        },
        {}
      );
    }

    this.responders = this.isStackChart
      ? this.makeBoundResponderModel(renderOptions)
      : this.makeDefaultResponderModel(seriesCircleModel, tooltipDataArr);
  }

  makeDefaultResponderModel(
    seriesCircleModel: CircleModel[],
    tooltipDataArr: TooltipData[]
  ): CircleResponderModel[] {
    const tooltipDataLength = tooltipDataArr.length;

    return seriesCircleModel.map((m, dataIndex) => ({
      ...m,
      data: tooltipDataArr[dataIndex % tooltipDataLength],
    }));
  }

  makeBoundResponderModel(renderOptions: RenderOptions): BoundResponderModel[] {
    const { pointOnColumn, tickCount, tickDistance } = renderOptions;
    const { height, x, y } = this.rect;
    const halfDetectAreaIndex = pointOnColumn ? [] : [0, tickCount];

    const halfWidth = tickDistance / 2;

    return range(0, tickCount).map((index) => {
      const half = halfDetectAreaIndex.includes(index);
      const width = half ? halfWidth : tickDistance;
      let startX = x;

      if (index !== 0) {
        startX += pointOnColumn ? tickDistance * index : halfWidth + tickDistance * (index - 1);
      }

      return { type: 'bound', y, height, x: startX, width, index };
    });
  }

  renderClipRectAreaModel(isDrawModel?: boolean): ClipRectAreaModel {
    return {
      type: 'clipRectArea',
      x: 0,
      y: 0,
      width: isDrawModel ? 0 : this.rect.width,
      height: this.rect.height,
    };
  }

  makeTooltipData(areaData: AreaSeriesType[], categories: string[]) {
    return areaData.flatMap(({ data, name, color }) => {
      const tooltipData: TooltipData[] = [];

      data.forEach((datum: DatumType, dataIdx) => {
        const value = this.isRangeChart ? `${datum[0]} ~ ${datum[1]}` : (datum as number);
        tooltipData.push({
          label: name,
          color,
          value,
          category: categories[dataIdx],
        });
      });

      return tooltipData;
    });
  }

  getLinePointModelValue(datum: AreaSeriesDataType, pairModel?: boolean) {
    if (this.isRangeChart) {
      return pairModel ? datum[0] : datum[1];
    }

    return datum;
  }

  getLinePointModel(
    series: AreaSeriesType,
    seriesIndex: number,
    limit: ValueEdge,
    renderOptions: RenderOptions
  ): LinePointsModel {
    const { pointOnColumn, options, tickDistance, pairModel, areaStackSeries } = renderOptions;
    const { data, name, color: seriesColor } = series;
    const points: PointModel[] = [];
    const active = this.activeSeriesMap![name];
    const color = getRGBA(
      seriesColor,
      active ? this.seriesOpacity.ACTIVE : this.seriesOpacity.INACTIVE
    );

    data.forEach((datum, idx) => {
      const value = this.getLinePointModelValue(datum, pairModel);
      const stackedValue = this.isStackChart
        ? this.getStackValue(areaStackSeries!, seriesIndex, idx)
        : value;
      const valueRatio = getValueRatio(stackedValue, limit);
      const x = tickDistance * idx + (pointOnColumn ? tickDistance / 2 : 0);
      const y = (1 - valueRatio) * this.rect.height;

      points.push({ x, y, value });
    });

    // @TODO: range spline 처리 필요
    if (options?.spline) {
      setSplineControlPoint(points);
    }

    return {
      type: 'linePoints',
      lineWidth: 6,
      color,
      points,
      seriesIndex,
      name,
    };
  }

  renderLinePointsModel(
    seriesRawData: AreaSeriesType[],
    limit: ValueEdge,
    renderOptions: RenderOptions
  ): LinePointsModel[] {
    const linePointsModels = seriesRawData.map((series, seriesIndex) =>
      this.getLinePointModel(series, seriesIndex, limit, renderOptions)
    );

    if (this.isRangeChart) {
      const renderOptionsForPair = deepMergedCopy(renderOptions, {
        pairModel: true,
      });
      const pair = seriesRawData.map((series, seriesIndex) =>
        this.getLinePointModel(series, seriesIndex, limit, renderOptionsForPair)
      );

      linePointsModels.push(...pair);
    }

    return linePointsModels;
  }

  addBottomPoints(points: PointModel[]) {
    const firstPoint = first(points);
    const lastPoint = last(points);

    if (!firstPoint || !lastPoint) {
      return points;
    }

    return [
      ...points,
      { x: lastPoint.x, y: this.baseValueYPosition },
      { x: firstPoint.x, y: this.baseValueYPosition },
    ];
  }

  getCombinedLinePointsModel(): LinePointsModel[] {
    if (!this.isRangeChart && !this.isStackChart) {
      return this.linePointsModel.map((m) => ({
        ...m,
        points: this.addBottomPoints(m.points),
      }));
    }

    const len = this.isRangeChart ? this.linePointsModel.length / 2 : this.linePointsModel.length;

    return range(0, len).reduce<LinePointsModel[]>((acc, i) => {
      const start = this.isRangeChart ? i : i - 1;
      const end = this.isRangeChart ? len + i : i;
      const points =
        this.isStackChart && i === 0
          ? this.addBottomPoints(this.linePointsModel[i].points)
          : [
              ...this.linePointsModel[start].points,
              ...[...this.linePointsModel[end].points].reverse(),
            ];

      return [...acc, { ...this.linePointsModel[i], points }];
    }, []);
  }

  renderAreaPointsModel(): AreaPointsModel[] {
    return this.getCombinedLinePointsModel().map((m) => ({
      ...m,
      type: 'areaPoints',
      lineWidth: 0,
      color: 'rgba(0, 0, 0, 0)', // make area border transparent
      fillColor: m.color,
    }));
  }

  renderCircleModel(): CircleModel[] {
    return this.linePointsModel.flatMap(({ points, color, seriesIndex }) =>
      points.map(({ x, y }, index) => ({
        type: 'circle',
        x,
        y,
        radius: 7,
        color,
        style: ['default', 'hover'],
        seriesIndex,
        index,
      }))
    );
  }

  applyAreaOpacity(opacity: number) {
    this.drawModels.series.forEach((model) => {
      if (
        (opacity === this.seriesOpacity.ACTIVE && this.activeSeriesMap![model.name]) ||
        opacity === this.seriesOpacity.INACTIVE
      ) {
        model.fillColor = getRGBA(model.fillColor, opacity);
      }
    });
  }

  renderGuideLineModel(circleModels: CircleResponderModel[]): LineModel[] {
    const x = crispPixel(circleModels[0].x);

    return [
      {
        type: 'line',
        x,
        y: 0,
        x2: x,
        y2: this.rect.height,
        strokeStyle: '#ddd',
        lineWidth: 1,
      },
    ];
  }

  onMouseMoveStackType(responders: BoundResponderModel[]) {
    let circleModels: CircleResponderModel[] = [];
    let guideLine: LineModel[] = [];

    if (responders.length) {
      const index = responders[0].index!;
      circleModels = this.tooltipCircleMap![index];
      guideLine = this.renderGuideLineModel(circleModels);
    }

    this.eventBus.emit('renderHoveredSeries', [...guideLine, ...circleModels]);
    this.activatedResponders = circleModels;
  }

  onMouseMoveDefault(responders: CircleResponderModel[]) {
    const pairCircleModels: CircleResponderModel[] = [];
    if (this.isRangeChart) {
      responders.forEach((circle) => {
        const pairCircleModel = (this.responders as CircleResponderModel[])
          .filter((responder) => responder.seriesIndex === circle.seriesIndex)
          .find((responder) => responder.x === circle.x && responder.y !== circle.y)!;
        pairCircleModels.push(pairCircleModel);
      });
    }

    const linePoints = responders.reduce<LinePointsModel[]>(
      (acc, { seriesIndex }) => [
        ...acc,
        ...this.linePointsModel.filter((model) => model.seriesIndex === seriesIndex),
      ],
      []
    );

    const hoveredSeries = [...linePoints, ...responders, ...pairCircleModels];
    this.applyAreaOpacity(
      hoveredSeries.length ? this.seriesOpacity.INACTIVE : this.seriesOpacity.ACTIVE
    );

    this.eventBus.emit('renderHoveredSeries', hoveredSeries);
    this.activatedResponders = responders;
  }

  onMousemove({ responders }: { responders: CircleResponderModel[] | BoundResponderModel[] }) {
    if (this.isStackChart) {
      this.onMouseMoveStackType(responders as BoundResponderModel[]);
    } else {
      this.onMouseMoveDefault(responders as CircleResponderModel[]);
    }

    this.eventBus.emit('seriesPointHovered', this.activatedResponders);
    this.eventBus.emit('needDraw');
  }

  onMouseoutComponent() {
    this.eventBus.emit('seriesPointHovered', []);
    this.eventBus.emit('renderHoveredSeries', []);
    this.applyAreaOpacity(this.seriesOpacity.ACTIVE);
  }

  getDataLabels(seriesModels: AreaPointsModel[]) {
    return seriesModels.flatMap(({ points }) =>
      points.map((point) => ({ type: 'point', ...point }))
    );
  }
}
