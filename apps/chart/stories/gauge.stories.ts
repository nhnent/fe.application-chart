import GaugeChart from '@src/charts/gaugeChart';
import { GaugeSeriesData, GaugeChartOptions } from '@t/options';
import { gaugeData, categoryGaugeData } from './data';
import '@src/css/chart.css';
import { deepMergedCopy } from '@src/helpers/utils';
import { padStart } from './util';

const width = 550;
const height = 500;
const defaultOptions = {
  chart: { width, height, title: 'Speedometer' },
};
const bands = [
  { range: [0, 20], color: '#55bf3b' },
  { range: [20, 50], color: '#dddf0d' },
  { range: [50, 90], color: '#df5353' },
];

export default {
  title: 'chart|Gauge',
};

function createChart(data: GaugeSeriesData, customOptions: GaugeChartOptions = {}) {
  const el = document.createElement('div');
  const options = deepMergedCopy(defaultOptions, customOptions);

  el.style.width = `${width}px`;
  el.style.height = `${height}px`;

  const chart = new GaugeChart({ el, data, options });

  return { el, chart };
}

function getCurrentTime() {
  const currentDate = new Date();
  const hour = currentDate.getHours();

  return {
    hour: hour > 12 ? hour - 12 : hour,
    min: currentDate.getMinutes(),
    sec: currentDate.getSeconds(),
  };
}

function timeFormatter(value) {
  return `${padStart(value, 2, '0')}`;
}

export const basic = () => {
  const { el } = createChart(gaugeData, {
    circularAxis: {
      scale: {
        min: 0,
        max: 100,
      },
      title: { text: 'km/h' },
    },
    plot: {
      bands: [
        { range: [0, 20], color: '#55bf3b' },
        { range: [20, 50], color: '#dddf0d' },
        { range: [50, 110], color: '#df5353' },
      ],
    },
  });

  return el;
};

export const basicWithCategory = () => {
  const { el } = createChart(categoryGaugeData, {
    chart: { title: 'Fruits' },
    circularAxis: {
      label: { margin: 25 },
    },
    plot: {
      bands: [
        { range: ['Apple', 'Watermelon'], color: '#df5353' },
        { range: ['Watermelon', 'Grape'], color: '#8700ff' },
        { range: ['Grape', 'Apple'], color: '#ff9800' },
      ],
    },
  });

  return el;
};

export const selectable = () => {
  const { el } = createChart(gaugeData, {
    circularAxis: {
      scale: {
        min: 0,
        max: 100,
      },
      title: { text: 'km/h' },
    },
    series: {
      selectable: true,
    },
    plot: {
      bands: [
        { range: [0, 20], color: '#55bf3b' },
        { range: [20, 50], color: '#dddf0d' },
        { range: [50, 110], color: '#df5353' },
      ],
    },
  });

  return el;
};

export const angleRange = () => {
  const { el } = createChart(gaugeData, {
    circularAxis: { title: 'km/h' },
    series: {
      angleRange: {
        start: 225,
        end: 135,
      },
    },
    plot: { bands },
    theme: {
      plot: { bands: { barWidth: 40 } },
    },
  });

  return el;
};

export const counterClockwise = () => {
  const { el } = createChart(gaugeData, {
    circularAxis: { title: 'km/h' },
    series: {
      clockwise: false,
      angleRange: {
        start: 315,
        end: 45,
      },
    },
    plot: { bands },
    theme: {
      plot: { bands: { barWidth: 40 } },
    },
  });

  return el;
};

export const clock = () => {
  const { hour, min, sec } = getCurrentTime();

  const data = {
    series: [
      {
        name: 'Speed',
        data: [hour * 5, min, sec],
      },
    ],
  };
  const { el, chart } = createChart(data, {
    chart: { title: '', animation: { duration: 0 } },
    circularAxis: {
      tick: { interval: 5 },
      label: {
        margin: 15,
        interval: 5,
        formatter: (value) => (Number(value) === 0 ? '12' : `${Number(value) / 5}`),
      },
      scale: { stepSize: 1, min: 0, max: 59 },
    },
    plot: {
      bands: [{ range: [0, 60], color: '#ffc107' }],
    },
    series: {
      dataLabels: {
        visible: true,
        offsetY: 80,
        formatter: (value, dataLabelData) => {
          const [h, m, s] = dataLabelData! as number[];

          return `${timeFormatter(h / 5)}:${timeFormatter(m)}:${timeFormatter(s)}`;
        },
      },
    },
    exportMenu: { visible: false },
    theme: {
      series: {
        clockHand: { size: ['50%', '80%', '95%'] },
        dataLabels: {
          fontFamily: 'Impact',
          fontWeight: 500,
          fontSize: 30,
          textBubble: {
            visible: true,
            borderRadius: 0,
          },
        },
      },
      plot: { bands: { barWidth: 20 } },
    },
  });

  setInterval(() => {
    const { hour: h, min: m, sec: s } = getCurrentTime();

    chart.setData({
      series: [
        {
          name: 'Speed',
          data: [h * 5, m, s],
        },
      ],
    });
  }, 1000);

  return el;
};

export const dataLabels = () => {
  const { el } = createChart(gaugeData, {
    circularAxis: {
      scale: {
        min: 0,
        max: 100,
      },
      title: 'km/h',
    },
    series: {
      dataLabels: { visible: true },
    },
    plot: {
      bands: [
        { range: [0, 20], color: '#55bf3b' },
        { range: [20, 50], color: '#dddf0d' },
        { range: [50, 110], color: '#df5353' },
      ],
    },
  });

  return el;
};

export const solid = () => {
  const { el } = createChart(gaugeData, {
    series: { solid: true },
  });

  return el;
};

export const solidWithTheme = () => {
  const color = 'rgba(189, 67, 67, 1)';
  const { el } = createChart(gaugeData, {
    series: {
      solid: true,
      dataLabels: { visible: true, formatter: (value) => `${value}%` },
    },
    theme: {
      circularAxis: {
        label: { fontFamily: 'monaco' },
        lineWidth: 2,
        strokeStyle: color,
        tick: { strokeStyle: color, lineWidth: 2 },
      },
      series: {
        colors: [color],
        hover: {
          solid: {
            color: '#ff0000',
            lineWidth: 5,
            strokeStyle: '#000',
          },
        },
        select: {
          solid: {
            lineWidth: 3,
            strokeStyle: '#000',
          },
        },
        solid: {
          barWidth: '10%',
          lineWidth: 5,
          strokeStyle: '#000',
          backgroundSector: { color: 'rgba(189, 67, 67, 0.1)' },
        },
        dataLabels: { textBubble: { visible: false }, fontSize: 16, fontFamily: 'monaco' },
      },
    },
  });

  return el;
};

export const solidWithAngleRange = () => {
  const { el } = createChart(gaugeData, {
    chart: { width: 700, height: 400 },
    circularAxis: { scale: { min: 0, max: 100 }, title: 'km/h' },
    series: {
      solid: true,
      angleRange: {
        start: 270,
        end: 90,
      },
    },
  });

  return el;
};

export const solidWithoutClockHand = () => {
  const { el } = createChart(gaugeData, {
    series: {
      solid: { clockHand: false },
      dataLabels: { visible: true, offsetY: -30, formatter: (value) => `${value}%` },
    },
    theme: {
      circularAxis: {
        lineWidth: 0,
        strokeStyle: 'rgba(0, 0, 0, 0)',
        tick: {
          lineWidth: 0,
          strokeStyle: 'rgba(0, 0, 0, 0)',
        },
        label: {
          color: 'rgba(0, 0, 0, 0)',
        },
      },
      series: {
        dataLabels: {
          fontSize: 40,
          fontFamily: 'Impact',
          fontWeight: 600,
          color: '#00a9ff',
          textBubble: {
            visible: false,
          },
        },
      },
    },
  });

  return el;
};

export const theme = () => {
  const baseColor = '#650434';
  const { el } = createChart(gaugeData, {
    chart: { width: 700, height: 400 },
    circularAxis: { title: 'km/h', scale: { min: 0, max: 100 } },
    series: {
      angleRange: {
        start: 270,
        end: 90,
      },
      dataLabels: { visible: true, offsetY: -200, formatter: (value) => `${value} %` },
    },
    plot: {
      bands: [
        { range: [0, 20], color: '#e4a0c2' },
        { range: [20, 50], color: '#dc4d94' },
        { range: [50, 100], color: '#a90757' },
      ],
    },
    theme: {
      chart: { fontFamily: 'Impact' },
      circularAxis: {
        title: { fontWeight: 500, fontSize: 30, color: baseColor },
        label: { color: baseColor, fontSize: 15 },
        tick: { strokeStyle: baseColor },
        strokeStyle: baseColor,
      },
      series: {
        clockHand: {
          color: baseColor,
          baseLine: 10,
        },
        pin: {
          radius: 10,
          color: baseColor,
          borderWidth: 5,
          borderColor: 'rgba(101, 4, 52, 0.3)',
        },
        dataLabels: {
          fontSize: 30,
          color: '#fff',
          textBubble: {
            visible: true,
            backgroundColor: baseColor,
            paddingX: 5,
            paddingY: 5,
          },
        },
      },
      plot: { bands: { barWidth: 50 } },
    },
  });

  return el;
};
