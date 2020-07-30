import { PieChartOptions } from '@t/options';
import PieSeries from '@src/component/pieSeries';
import Store from '@src/store/store';
import EventEmitter from '@src/eventEmitter';
import { deepMergedCopy } from '@src/helpers/utils';

let pieSeries;
const colors = ['#00a9ff', '#ffb840'];

const seriesData = [
  {
    name: 'A',
    data: 50,
  },
  {
    name: 'B',
    data: 50,
  },
];

const chartState = {
  chart: { width: 100, height: 100 },
  layout: {
    plot: { width: 90, height: 90, x: 10, y: 10 },
  },
  series: {
    pie: {
      data: seriesData.map((m, idx) => ({ ...m, color: colors[idx] })),
      seriesCount: seriesData.length,
    },
  },
  options: {
    series: {},
  },
  legend: {
    data: [
      { label: 'A', active: true, checked: true },
      { label: 'B', active: true, checked: true },
    ],
  },
  categories: ['Browser'],
  dataLabels: {
    visible: false,
  },
};

describe('basic', () => {
  beforeEach(() => {
    pieSeries = new PieSeries({
      store: {} as Store<PieChartOptions>,
      eventBus: new EventEmitter(),
    });
  });

  it('should be rendered pie series', () => {
    pieSeries.render(chartState);

    const result = {
      series: [
        {
          color: 'rgba(0, 169, 255, 1)',
          endDegree: 180,
          name: 'A',
          radius: 40.5,
          innerRadius: 0,
          startDegree: 0,
          style: ['default'],
          type: 'sector',
          value: 50,
          x: 45,
          y: 45,
          clockwise: true,
          rangeStartAngle: -90,
        },
        {
          color: 'rgba(255, 184, 64, 1)',
          endDegree: 360,
          name: 'B',
          radius: 40.5,
          innerRadius: 0,
          startDegree: 180,
          style: ['default'],
          type: 'sector',
          value: 50,
          x: 45,
          y: 45,
          clockwise: true,
          rangeStartAngle: -90,
        },
      ],
    };

    const responderResult = [
      {
        type: 'sector',
        name: 'A',
        color: 'rgba(0, 169, 255, 1)',
        x: 45,
        y: 45,
        startDegree: 0,
        endDegree: 180,
        radius: 40.5,
        innerRadius: 0,
        value: 50,
        clockwise: true,
        rangeStartAngle: -90,
        style: ['hover'],
        seriesIndex: 0,
        data: { label: 'A', color: '#00a9ff', value: 50, category: 'Browser' },
      },
      {
        type: 'sector',
        name: 'B',
        color: 'rgba(255, 184, 64, 1)',
        x: 45,
        y: 45,
        startDegree: 180,
        endDegree: 360,
        radius: 40.5,
        innerRadius: 0,
        value: 50,
        clockwise: true,
        rangeStartAngle: -90,
        style: ['hover'],
        seriesIndex: 1,
        data: { label: 'B', color: '#ffb840', value: 50, category: 'Browser' },
      },
    ];
    expect(pieSeries.models).toEqual(result);
    expect(pieSeries.responders).toEqual(responderResult);
  });

  it('should be drawn anticlockwise, if clockwise is a false', () => {
    pieSeries.render(
      deepMergedCopy(chartState, {
        options: {
          series: {
            clockwise: false,
          },
        },
      })
    );

    const result = [
      {
        clockwise: false,
        color: 'rgba(0, 169, 255, 1)',
        endDegree: 180,
        innerRadius: 0,
        name: 'A',
        radius: 40.5,
        rangeStartAngle: -90,
        startDegree: 360,
        style: ['default'],
        type: 'sector',
        value: 50,
        x: 45,
        y: 45,
      },
      {
        clockwise: false,
        color: 'rgba(255, 184, 64, 1)',
        endDegree: 0,
        innerRadius: 0,
        name: 'B',
        radius: 40.5,
        rangeStartAngle: -90,
        startDegree: 180,
        style: ['default'],
        type: 'sector',
        value: 50,
        x: 45,
        y: 45,
      },
    ];

    expect(pieSeries.models.series).toEqual(result);
  });
});

describe('donut', () => {
  beforeEach(() => {
    pieSeries = new PieSeries({
      store: {} as Store<PieChartOptions>,
      eventBus: new EventEmitter(),
    });

    pieSeries.render(
      deepMergedCopy(chartState, {
        options: {
          series: {
            radiusRange: [40, 100],
          },
        },
      })
    );
  });

  it('should be rendered donut-shaped pie series', () => {
    const result = {
      series: [
        {
          color: 'rgba(0, 169, 255, 1)',
          endDegree: 180,
          name: 'A',
          radius: 40.5,
          innerRadius: 18,
          startDegree: 0,
          style: ['default'],
          type: 'sector',
          value: 50,
          x: 45,
          y: 45,
          clockwise: true,
          rangeStartAngle: -90,
        },
        {
          color: 'rgba(255, 184, 64, 1)',
          endDegree: 360,
          name: 'B',
          radius: 40.5,
          innerRadius: 18,
          startDegree: 180,
          style: ['default'],
          type: 'sector',
          value: 50,
          x: 45,
          y: 45,
          clockwise: true,
          rangeStartAngle: -90,
        },
      ],
    };

    const responderResult = [
      {
        type: 'sector',
        name: 'A',
        color: 'rgba(0, 169, 255, 1)',
        x: 45,
        y: 45,
        startDegree: 0,
        endDegree: 180,
        radius: 40.5,
        innerRadius: 18,
        value: 50,
        clockwise: true,
        rangeStartAngle: -90,
        style: ['hover'],
        seriesIndex: 0,
        data: { label: 'A', color: '#00a9ff', value: 50, category: 'Browser' },
      },
      {
        type: 'sector',
        name: 'B',
        color: 'rgba(255, 184, 64, 1)',
        x: 45,
        y: 45,
        startDegree: 180,
        endDegree: 360,
        radius: 40.5,
        innerRadius: 18,
        value: 50,
        clockwise: true,
        rangeStartAngle: -90,
        style: ['hover'],
        seriesIndex: 1,
        data: { label: 'B', color: '#ffb840', value: 50, category: 'Browser' },
      },
    ];
    expect(pieSeries.models).toEqual(result);
    expect(pieSeries.responders).toEqual(responderResult);
  });

  describe('semi circle', () => {
    beforeEach(() => {
      pieSeries = new PieSeries({
        store: {} as Store<PieChartOptions>,
        eventBus: new EventEmitter(),
      });

      pieSeries.render(
        deepMergedCopy(chartState, {
          options: {
            series: {
              startAngle: -90,
              endAngle: 90,
            },
          },
        })
      );
    });

    it('should be 180 arc to be draw all series of the angles', () => {
      expect(pieSeries.totalAngle).toBe(180);
    });

    it('should be rendered semi circle entering start angle and end angle', () => {
      const result = [
        {
          clockwise: true,
          color: 'rgba(0, 169, 255, 1)',
          endDegree: 90,
          innerRadius: 0,
          name: 'A',
          radius: 72.9,
          rangeStartAngle: -180,
          startDegree: 0,
          style: ['default'],
          type: 'sector',
          value: 50,
          x: 45,
          y: 81,
        },
        {
          clockwise: true,
          color: 'rgba(255, 184, 64, 1)',
          endDegree: 180,
          innerRadius: 0,
          name: 'B',
          radius: 72.9,
          rangeStartAngle: -180,
          startDegree: 90,
          style: ['default'],
          type: 'sector',
          value: 50,
          x: 45,
          y: 81,
        },
      ];

      expect(pieSeries.models.series).toEqual(result);
    });
  });
});
