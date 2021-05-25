import Component from './component';
import { GeoFeatureModel, GeoFeatureResponderModel } from '@t/components/geoFeature';

export default class Outline extends Component {
  models!: GeoFeatureModel[];

  initialize() {
    this.type = 'geoFeature';
    this.name = 'outline';
  }

  render(chartState) {
    const { outline, layout } = chartState;

    this.rect = layout.map;
    this.models = outline.map((feature) => ({ type: 'outline', feature }));
  }

  onClick({ responders }: { responders: GeoFeatureResponderModel[] }) {
    if (responders.length) {
      console.log(responders[0]);
    }
  }
}
