import BarChart from '@src/charts/barChart';
import { budgetData, temperatureRangeData, budgetDataForStack } from './data';
import { BarChartOptions } from '@t/options';

export default {
  title: 'Bar'
};

const width = 500;
const height = 500;
const defaultOptions = {
  chart: {
    width,
    height,
    title: 'Monthly Revenue',
    format: '1,000'
  },
  yAxis: {
    title: 'Amount',
    min: 0,
    max: 9000,
    suffix: '$'
  },
  xAxis: {
    title: 'Month'
  }
};

function createChart(data, options: BarChartOptions = defaultOptions) {
  const el = document.createElement('div');

  el.style.outline = '1px solid red';
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;

  const chart = new BarChart({
    el,
    data,
    options
  });

  return { el, chart };
}

export const basic = () => {
  const { el } = createChart(budgetData);

  return el;
};

export const range = () => {
  const { el } = createChart(temperatureRangeData);

  return el;
};

export const normalStack = () => {
  const { el } = createChart(budgetDataForStack, {
    ...defaultOptions,
    series: {
      stack: true
    }
  });

  return el;
};
