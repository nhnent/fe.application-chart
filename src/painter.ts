import Chart from '@src/charts/chart';
import {
  CircleModel,
  ClipRectAreaModel,
  LinePointsModel,
  PathRectModel,
} from '@t/components/series';
import { TooltipModel } from '@t/components/tooltip';
import { Options } from '@t/store/store';

type BrushModel = ClipRectAreaModel | LinePointsModel | PathRectModel | CircleModel | TooltipModel;
type Brush = (ctx: CanvasRenderingContext2D, brushModel: BrushModel) => void;

export default class Painter {
  width = 0;

  height = 0;

  brushes: Record<string, Brush> = {};

  chart: Chart<Options>;

  canvas!: HTMLCanvasElement;

  ctx!: CanvasRenderingContext2D;

  constructor(chart: Chart<Options>) {
    this.chart = chart;
  }

  setup() {
    const { height, width } = this.chart.store.state.chart;

    if (!this.ctx) {
      const canvas = document.createElement('canvas');

      this.canvas = canvas;

      canvas.style.backgroundColor = '#fff';

      this.chart.el.appendChild(canvas);

      canvas.addEventListener('click', this.chart);
      canvas.addEventListener('mousemove', this.chart);
      canvas.addEventListener('mousedown', this.chart);
      canvas.addEventListener('mouseup', this.chart);

      const ctx = canvas.getContext('2d');

      if (ctx) {
        this.ctx = ctx;
      }
    }

    this.setSize(width, height);
  }

  setSize(width: number, height: number) {
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.width = width || 0;
    this.height = height || 0;

    this.scaleCanvasRatio();
  }

  scaleCanvasRatio() {
    const ratio = window.devicePixelRatio;

    this.ctx.canvas.width = this.width * ratio;
    this.ctx.canvas.height = this.height * ratio;

    this.ctx.scale(ratio, ratio);
  }

  add(name: string, brush: Brush) {
    this.brushes[name] = brush;
  }

  addGroups(groups: any[]) {
    groups.forEach((group) => {
      Object.keys(group).forEach((key) => {
        this.add(key, group[key]);
      });
    });
  }

  paint(name: string, brushModel: any) {
    if (this.brushes[name]) {
      this.brushes[name](this.ctx, brushModel);
    } else {
      throw new Error(`Brush don't exist in painter: ${name}`);
    }
  }

  paintForEach(brushModels: any[]) {
    brushModels.forEach((m) => this.paint(m.type, m));
  }

  beforeFrame() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  beforeDraw(transX: number, transY: number) {
    this.ctx.save();
    this.ctx.translate(transX, transY);
  }

  afterDraw() {
    this.ctx.restore();
  }
}
