import Chart from './chart';

import treemapScale from '@src/store/treemapScale';
import dataLabels from '@src/store/dataLabels';
import treemapSeriesData from '@src/store/treemapSeriesData';

import Tooltip from '@src/component/tooltip';
import Title from '@src/component/title';
import ExportMenu from '@src/component/exportMenu';
import HoveredSeries from '@src/component/hoveredSeries';
import DataLabels from '@src/component/dataLabels';
import TreemapSeries from '@src/component/treemapSeries';
import SpectrumLegend from '@src/component/spectrumLegend';

import * as basicBrush from '@src/brushes/basic';
import * as legendBrush from '@src/brushes/legend';
import * as labelBrush from '@src/brushes/label';
import * as exportMenuBrush from '@src/brushes/exportMenu';
import * as dataLabelBrush from '@src/brushes/dataLabel';

import { TreemapChartOptions, TreemapSeriesData, TreemapSeriesType } from '@t/options';

interface TreemapChartProps {
  el: Element;
  options: TreemapChartOptions;
  data: TreemapSeriesData;
}

export default class TreemapChart extends Chart<TreemapChartOptions> {
  modules = [treemapSeriesData, treemapScale, dataLabels];

  constructor(props: TreemapChartProps) {
    super({
      el: props.el,
      options: props.options,
      series: {
        treemap: props.data.series as TreemapSeriesType[],
      },
    });
  }

  initialize() {
    super.initialize();

    this.componentManager.add(Title);
    this.componentManager.add(SpectrumLegend);
    this.componentManager.add(TreemapSeries);
    this.componentManager.add(ExportMenu, { chartEl: this.el });
    this.componentManager.add(HoveredSeries);
    this.componentManager.add(DataLabels);
    this.componentManager.add(Tooltip, { chartEl: this.el });

    this.painter.addGroups([basicBrush, legendBrush, labelBrush, exportMenuBrush, dataLabelBrush]);
  }
}
