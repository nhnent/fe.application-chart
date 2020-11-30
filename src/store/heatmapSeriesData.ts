import { HeatmapSeriesData, Series, StoreModule } from '@t/store/store';
import { extend } from '@src/store/store';
import { HeatmapCategoriesType, RangeDataType } from '@t/options';

function makeHeatmapSeries(
  series: Series,
  categories: HeatmapCategoriesType,
  viewRange?: RangeDataType<number>
): HeatmapSeriesData[] {
  if (!series.heatmap) {
    return [];
  }

  return series.heatmap.data.map((rowSeries, y) => {
    const { yCategory } = rowSeries;
    const data = viewRange ? rowSeries.data.slice(viewRange[0], viewRange[1] + 1) : rowSeries.data;

    return data.map((colorValue, x) => ({
      colorValue,
      category: {
        x: categories.x[x],
        y: yCategory,
      },
      indexes: [x, y],
    }));
  });
}

const heatmapSeriesData: StoreModule = {
  name: 'heatmapSeriesData',
  state: () => ({
    heatmapSeries: [],
  }),
  action: {
    setHeatmapSeriesData({ state, computed }) {
      extend(
        state.heatmapSeries,
        makeHeatmapSeries(
          state.series,
          state.categories as HeatmapCategoriesType,
          computed.viewRange
        )
      );
    },
  },
  observe: {
    updateTreemapSeriesData() {
      this.dispatch('setHeatmapSeriesData');
    },
  },
};

export default heatmapSeriesData;
