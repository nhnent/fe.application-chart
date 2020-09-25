import { BubbleChartOptions, BubbleSeriesData } from '@t/options';
import { deepMergedCopy } from '@src/helpers/utils';
import { lifeExpectancyPerGDPData, lifeExpectancyPerGDPDataWithDatetime } from './data';
import BubbleChart from '@src/charts/bubbleChart';

export default {
  title: 'chart|Bubble',
};

const width = 1000;
const height = 500;
const defaultOptions = {
  chart: {
    width,
    height,
    title: 'Life Expectancy per GDP',
  },
  yAxis: {
    title: 'Life Expectancy (years)',
  },
  xAxis: {
    title: 'GDP',
  },
  series: {},
  tooltip: {},
  plot: {},
};

function createChart(
  data: BubbleSeriesData,
  customOptions: BubbleChartOptions = {},
  reactive = false
) {
  const el = document.createElement('div');
  const options = reactive ? customOptions : deepMergedCopy(defaultOptions, customOptions);

  el.style.outline = '1px solid red';
  el.style.width = reactive ? '90vw' : `${width}px`;
  el.style.height = reactive ? '100vh' : `${height}px`;

  const chart = new BubbleChart({ el, data, options });

  return { el, chart };
}

export const basic = () => {
  const { el } = createChart(lifeExpectancyPerGDPData);

  return el;
};

export const datetime = () => {
  const { el } = createChart(lifeExpectancyPerGDPDataWithDatetime, {
    xAxis: { date: { format: 'HH:mm:ss' } },
  });

  return el;
};

export const selectable = () => {
  const { el } = createChart(lifeExpectancyPerGDPData, { series: { selectable: true } });

  return el;
};

export const reactive = () => {
  const { el } = createChart(
    lifeExpectancyPerGDPData,
    { chart: { title: 'Life Expectancy per GDP' } },
    true
  );

  return el;
};
