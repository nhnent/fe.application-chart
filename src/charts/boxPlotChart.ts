import Chart, { AddSeriesDataInfo, SelectSeriesInfo } from './chart';

import dataRange from '@src/store/dataRange';
import scale from '@src/store/scale';
import axes from '@src/store/axes';
import plot from '@src/store/plot';

import Axis from '@src/component/axis';
import BoxPlotSeries from '@src/component/boxPlotSeries';
import Plot from '@src/component/plot';
import Tooltip from '@src/component/tooltip';
import Legend from '@src/component/legend';
import AxisTitle from '@src/component/axisTitle';
import Title from '@src/component/title';
import ExportMenu from '@src/component/exportMenu';
import HoveredSeries from '@src/component/hoveredSeries';
import SelectedSeries from '@src/component/selectedSeries';

import * as basicBrushes from '@src/brushes/basic';
import * as axisBrushes from '@src/brushes/axis';
import * as legendBrush from '@src/brushes/legend';
import * as labelBrush from '@src/brushes/label';
import * as exportMenuBrush from '@src/brushes/exportMenu';
import * as BoxPlotBrush from '@src/brushes/boxPlot';
import { BoxPlotSeriesType, BoxPlotSeriesData, BoxPlotChartOptions } from '@t/options';

export interface BoxPlotChartProps {
  el: HTMLElement;
  options: BoxPlotChartOptions;
  data: BoxPlotSeriesData;
}

export default class BoxPlotChart extends Chart<BoxPlotChartOptions> {
  modules = [dataRange, scale, axes, plot];

  constructor({ el, options, data: { series, categories } }: BoxPlotChartProps) {
    super({
      el,
      options,
      series: {
        boxPlot: series as BoxPlotSeriesType[],
      },
      categories,
    });
  }

  initialize() {
    super.initialize();

    this.componentManager.add(Title);
    this.componentManager.add(Plot);
    this.componentManager.add(Legend);
    this.componentManager.add(BoxPlotSeries);
    this.componentManager.add(Axis, { name: 'yAxis' });
    this.componentManager.add(Axis, { name: 'xAxis' });
    this.componentManager.add(AxisTitle, { name: 'xAxis' });
    this.componentManager.add(AxisTitle, { name: 'yAxis' });
    this.componentManager.add(ExportMenu, { chartEl: this.el });
    this.componentManager.add(HoveredSeries);
    this.componentManager.add(SelectedSeries);
    this.componentManager.add(Tooltip, { chartEl: this.el });

    this.painter.addGroups([
      basicBrushes,
      axisBrushes,
      BoxPlotBrush,
      legendBrush,
      labelBrush,
      exportMenuBrush,
    ]);
  }

  public addData = (data: number[][], category: string) => {
    this.animationControlFlag.updating = true;
    this.store.dispatch('addData', { data, category });
  };

  public addSeries(data: BoxPlotSeriesType, dataInfo?: AddSeriesDataInfo) {
    this.store.dispatch('addSeries', { data, ...dataInfo });
  }

  public setData(data: BoxPlotSeriesData) {
    const { categories, series } = data;
    this.store.dispatch('setData', { series: { boxPlot: series }, categories });
  }

  public setOptions = (options: BoxPlotChartOptions) => {
    this.dispatchOptionsEvent('initOptions', options);
  };

  public updateOptions = (options: BoxPlotChartOptions) => {
    this.dispatchOptionsEvent('updateOptions', options);
  };

  /**
   * Show tooltip.
   * @param {Object} seriesInfo - Information of the series for the tooltip to be displayed.
   *      @param {number} seriesInfo.index - Index of series.
   *      @param {number} seriesInfo.seriesIndex - Index of data within series.
   * @api
   * @example
   * chart.showTooltip({index: 1, seriesIndex: 2});
   */
  public showTooltip = (seriesInfo: SelectSeriesInfo) => {
    this.eventBus.emit('showTooltip', { ...seriesInfo, state: this.store.state });
  };

  /**
   * Hide tooltip.
   * @api
   * @example
   * chart.hideTooltip();
   */
  public hideTooltip = () => {
    this.eventBus.emit('hideTooltip');
  };
}
