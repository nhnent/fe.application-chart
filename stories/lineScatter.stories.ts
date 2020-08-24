import LineScatterChart from '@src/charts/lineScatterChart';
import { LineSeriesData } from '@t/options';
import { deepMergedCopy } from '@src/helpers/utils';
import { efficiencyAndExpensesData } from './data';
import { withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'chart|LineScatter',
  decorators: [withKnobs],
};

const width = 1000;
const height = 500;
const defaultOptions = {
  chart: {
    width,
    height,
  },
  series: {},
  tooltip: {},
  plot: {},
};

function createChart(data: LineSeriesData, customOptions?: Record<string, any>) {
  const el = document.createElement('div');
  const options = deepMergedCopy(defaultOptions, customOptions || {});

  el.style.outline = '1px solid red';
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;

  const chart = new LineScatterChart({ el, data, options });

  return { el, chart };
}

export const basic = () => {
  const { el } = createChart(efficiencyAndExpensesData, {
    chart: { title: 'Efficiency vs Expenses' },
  });

  return el;
};
