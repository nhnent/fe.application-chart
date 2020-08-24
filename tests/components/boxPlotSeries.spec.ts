import BoxPlotSeries from '@src/component/boxPlotSeries';
import Store from '@src/store/store';
import EventEmitter from '@src/eventEmitter';
import { Options } from '@t/store/store';

let boxPlotSeries;

const seriesData = [
  {
    name: 'han',
    data: [[1, 2, 3, 4, 5]],
    outliers: [[0, 10]],
    color: '#aaaaaa',
  },
  {
    name: 'cho',
    data: [[2, 4, 6, 8, 10]],
    outliers: [],
    color: '#bbbbbb',
  },
];

const chartState = {
  chart: { width: 120, height: 120 },
  layout: {
    xAxis: { x: 10, y: 80, width: 80, height: 10 },
    yAxis: { x: 10, y: 10, width: 10, height: 80 },
    plot: { width: 100, height: 100, x: 10, y: 10 },
  },
  scale: { yAxis: { limit: { min: 0, max: 10 }, stepSize: 1, stepCount: 1 } },
  series: {
    boxPlot: {
      data: seriesData,
    },
  },
  axes: {
    xAxis: {
      pointOnColumn: true,
      tickDistance: 100,
    },
  },
  categories: ['A'],
  options: {},
  legend: {
    data: [
      { label: 'han', active: true, checked: true },
      { label: 'cho', active: true, checked: true },
    ],
  },
};

describe('boxplot series', () => {
  beforeEach(() => {
    boxPlotSeries = new BoxPlotSeries({
      store: {} as Store<Options>,
      eventBus: new EventEmitter(),
    });

    boxPlotSeries.render(chartState);
  });

  const result = {
    models: {
      series: [
        {
          type: 'rect',
          color: 'rgba(170, 170, 170, 1)',
          name: 'han',
          x: 24,
          y: 60,
          width: 14,
          height: 20,
          style: [],
          thickness: 0,
        },
        {
          type: 'line',
          lineWidth: 1,
          strokeStyle: 'rgba(170, 170, 170, 1)',
          x: 31,
          y: 90,
          x2: 31,
          y2: 50,
          name: 'han',
          detectionDistance: 3,
        },
        {
          type: 'line',
          lineWidth: 1,
          strokeStyle: 'rgba(170, 170, 170, 1)',
          x: 27.5,
          y: 50,
          x2: 34.5,
          y2: 50,
          name: 'han',
          detectionDistance: 3,
        },
        {
          type: 'line',
          lineWidth: 1,
          strokeStyle: 'rgba(170, 170, 170, 1)',
          x: 27.5,
          y: 90,
          x2: 34.5,
          y2: 90,
          name: 'han',
          detectionDistance: 3,
        },
        {
          type: 'line',
          lineWidth: 1,
          strokeStyle: '#ffffff',
          x: 24,
          y: 70,
          x2: 38,
          y2: 70,
          name: 'han',
          detectionDistance: 3,
        },
        {
          type: 'circle',
          color: '#ffffff',
          name: 'han',
          x: 31,
          y: 0,
          radius: 4,
          style: [{ strokeStyle: 'rgba(170, 170, 170, 1)', lineWidth: 2 }],
        },
        {
          type: 'rect',
          color: 'rgba(187, 187, 187, 1)',
          name: 'cho',
          x: 62,
          y: 20,
          width: 14,
          height: 40,
          style: [],
          thickness: 0,
        },
        {
          type: 'line',
          lineWidth: 1,
          strokeStyle: 'rgba(187, 187, 187, 1)',
          x: 69,
          y: 80,
          x2: 69,
          y2: 0,
          name: 'cho',
          detectionDistance: 3,
        },
        {
          type: 'line',
          lineWidth: 1,
          strokeStyle: 'rgba(187, 187, 187, 1)',
          x: 65.5,
          y: 0,
          x2: 72.5,
          y2: 0,
          name: 'cho',
          detectionDistance: 3,
        },
        {
          type: 'line',
          lineWidth: 1,
          strokeStyle: 'rgba(187, 187, 187, 1)',
          x: 65.5,
          y: 80,
          x2: 72.5,
          y2: 80,
          name: 'cho',
          detectionDistance: 3,
        },
        {
          type: 'line',
          lineWidth: 1,
          strokeStyle: '#ffffff',
          x: 62,
          y: 40,
          x2: 76,
          y2: 40,
          name: 'cho',
          detectionDistance: 3,
        },
      ],
      selectedSeries: [],
    },
    responders: [
      {
        type: 'boxPlot',
        color: 'rgba(170, 170, 170, 1)',
        name: 'han',
        x: 24,
        y: 60,
        rect: {
          x: 24,
          y: 60,
          width: 14,
          height: 20,
          style: ['shadow'],
          thickness: 4,
        },
        median: { x: 24, y: 70, x2: 38, y2: 70, detectionDistance: 3 },
        whisker: { x: 31, y: 90, x2: 31, y2: 50, detectionDistance: 3 },
        minimum: { x: 27.5, y: 90, x2: 34.5, y2: 90, detectionDistance: 3 },
        maximum: { x: 27.5, y: 50, x2: 34.5, y2: 50, detectionDistance: 3 },
        data: {
          label: 'han',
          color: '#aaaaaa',
          value: [
            {
              title: 'Maximum',
              value: 5,
            },
            {
              title: 'Upper Quartile',
              value: 4,
            },
            {
              title: 'Median',
              value: 3,
            },
            {
              title: 'Lower Quartile',
              value: 2,
            },
            {
              title: 'Minimum',
              value: 1,
            },
          ],
          category: 'A',
        },
      },
      {
        type: 'circle',
        name: 'han',
        x: 31,
        y: 0,
        radius: 4,
        style: [{ strokeStyle: 'rgba(170, 170, 170, 1)', lineWidth: 2 }],
        color: 'rgba(170, 170, 170, 1)',
        data: {
          label: 'han',
          color: '#aaaaaa',
          value: [{ title: 'Outlier', value: 10 }],
          category: 'A',
        },
      },
      {
        type: 'boxPlot',
        color: 'rgba(187, 187, 187, 1)',
        name: 'cho',
        x: 62,
        y: 20,
        rect: {
          x: 62,
          y: 20,
          width: 14,
          height: 40,
          style: ['shadow'],
          thickness: 4,
        },
        median: { x: 62, y: 40, x2: 76, y2: 40, detectionDistance: 3 },
        whisker: { x: 69, y: 80, x2: 69, y2: 0, detectionDistance: 3 },
        minimum: { x: 65.5, y: 80, x2: 72.5, y2: 80, detectionDistance: 3 },
        maximum: { x: 65.5, y: 0, x2: 72.5, y2: 0, detectionDistance: 3 },
        data: {
          label: 'cho',
          color: '#bbbbbb',
          value: [
            {
              title: 'Maximum',
              value: 10,
            },
            {
              title: 'Upper Quartile',
              value: 8,
            },
            {
              title: 'Median',
              value: 6,
            },
            {
              title: 'Lower Quartile',
              value: 4,
            },
            {
              title: 'Minimum',
              value: 2,
            },
          ],
          category: 'A',
        },
      },
    ],
  };

  ['models', 'responders'].forEach((modelName) => {
    it(`should make ${modelName} properly when calling render`, () => {
      expect(boxPlotSeries[modelName]).toEqual(result[modelName]);
    });
  });
});
