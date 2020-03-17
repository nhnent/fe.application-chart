import Store from '@src/store/store';
import { BaseChartOptions, LineChartOptions, LineSeriesType, Rect } from '../options';

type SeriesType = LineSeriesType;

export type AxisType = 'xAxis' | 'yAxis' | 'yCenterAxis';

export type Series = {
  line?: LineSeriesType[];
};
export type Options = LineChartOptions;

export interface StoreOptions {
  state?: Partial<ChartState> | StateFunc;
  watch?: Record<string, WatchFunc>;
  computed?: Record<string, ComputedFunc>;
  action?: Record<string, ActionFunc> & ThisType<Store>;
  observe?: Record<string, ObserveFunc> & ThisType<Store>;
}

export interface StoreModule extends StoreOptions {
  name: 'plot' | 'axes' | 'scale' | 'layout' | 'seriesData' | 'dataRange';
}

export type Theme = {
  series: {
    colors: string[];
  };
};

export interface ChartState {
  chart: BaseChartOptions;
  layout: {
    [key: string]: Rect;
  };
  scale: {
    [key: string]: ScaleData;
  };
  disabledSeries: string[];
  series: {
    [key: string]: SeriesData;
  };
  // 기존의 limitMap
  dataRange: {
    [key: string]: ValueEdge;
  };
  axes: {
    [key: string]: AxisData;
  };
  theme: Theme;
  options: Options;
  data: {
    series: Series;
    categories?: string[];
  };
  d: number; // @TODO: check where to use
}

export interface AxisData {
  labels: string[];
  tickCount: number;
  validTickCount: number;
  isLabelAxis: boolean;
  relativePositions: number[];
}

export interface ValueEdge {
  max: number;
  min: number;
}

export interface SeriesData {
  seriesCount: number;
  seriesGroupCount: number;
  data: SeriesType[];
}

export interface SeriesGroup {
  seriesCount: number;
  seriesGroupCount: number;
}

export interface ScaleData {
  limit: ValueEdge;
  step: number;
  stepCount: number;
}

type StateFunc = () => Partial<ChartState>;
type ActionFunc = (store: Store, ...args: any[]) => void;
type ComputedFunc = (state: ChartState, computed: Record<string, any>) => any;
export type ObserveFunc = (state: ChartState, computed: Record<string, any>) => void;
type WatchFunc = (value: any) => void;

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
