import Store from '@src/store/store';
import root from '@src/store/root';
import layout from '@src/store/layout';
import seriesData from '@src/store/seriesData';
import category from '@src/store/category';
import legend from '@src/store/legend';
import EventEmitter from '@src/eventEmitter';
import ComponentManager from '@src/component/componentManager';
import Painter from '@src/painter';
import Animator from '@src/animator';
import { debounce } from '@src/helpers/utils';
import { ChartProps } from '@t/options';
import { responderDetectors } from '@src/responderDetectors';
import { Options, StoreModule } from '@t/store/store';
import { ComponentType } from '@src/component/component';

export default abstract class Chart<T extends Options> {
  store: Store<T>;

  ___animId___ = null;

  animator: Animator;

  readonly el: Element;

  ctx!: CanvasRenderingContext2D;

  painter = new Painter(this);

  readonly eventBus: EventEmitter = new EventEmitter();

  readonly componentManager: ComponentManager<T>;

  modules?: StoreModule[];

  hoveredComponentType: ComponentType[] = [];

  constructor(props: ChartProps<T>) {
    const { el, options, series, categories } = props;

    this.el = el;

    this.animator = new Animator();

    this.store = new Store({
      series,
      categories,
      options,
    });

    this.componentManager = new ComponentManager({
      store: this.store,
      eventBus: this.eventBus,
    });

    this.eventBus.on(
      'needLoop',
      debounce(() => {
        this.eventBus.emit('loopStart');

        this.animator.add({
          onCompleted: () => {
            this.eventBus.emit('loopComplete');
          },
          chart: this,
          duration: 1000,
          requester: this,
        });
      }, 10)
    );

    this.eventBus.on('needSubLoop', (opts) => {
      this.animator.add({ ...opts, chart: this });
    });

    this.eventBus.on(
      'needDraw',
      debounce(() => {
        this.draw();
      }, 10)
    );

    // for using class field "modules"
    setTimeout(() => {
      this.initialize();

      this.store.observe(() => {
        this.painter.setup();
      });
    }, 0);
  }

  handleEvent(event: MouseEvent) {
    const delegationMethod = `on${event.type[0].toUpperCase() + event.type.substring(1)}`;

    const { clientX, clientY } = event;

    const canvasRect = this.painter.ctx.canvas.getBoundingClientRect();

    const mousePosition = {
      x: clientX - canvasRect.left,
      y: clientY - canvasRect.top,
    };

    const newHoveredComponent: ComponentType[] = [];

    if (event.type === 'mousemove') {
      this.componentManager.forEach((component) => {
        const { x, y, height, width } = component.rect;
        const exist = this.hoveredComponentType.some((type) => type === component.type);
        const hovered =
          mousePosition.x >= x &&
          mousePosition.x <= x + width &&
          mousePosition.y >= y &&
          mousePosition.y <= y + height;

        if (hovered) {
          newHoveredComponent.push(component.type);
          if (!exist && component.onMouseenterComponent) {
            component.onMouseenterComponent();
          }
        } else if (exist && component.onMouseoutComponent) {
          component.onMouseoutComponent();
        }
      });

      this.hoveredComponentType = newHoveredComponent;
    }

    this.componentManager.forEach((component) => {
      if (!component[delegationMethod]) {
        return;
      }

      if (!responderDetectors.rect(mousePosition, component.rect)) {
        return;
      }

      const detected = (component.responders || []).filter((m) => {
        return responderDetectors[m.type](mousePosition, m, component.rect);
      });

      component[delegationMethod]({ mousePosition, responders: detected }, event);
    });
  }

  protected initStore(defaultModules: StoreModule[]) {
    [...defaultModules, ...(this.modules ?? [])].forEach((module) => this.store.setModule(module));
  }

  protected initialize() {
    this.initStore([root, seriesData, legend, layout, category]);
  }

  draw() {
    this.painter.beforeFrame();

    this.componentManager.forEach((component) => {
      if (!component.isShow) {
        return;
      }

      this.painter.beforeDraw(component.rect.x, component.rect.y);
      if (component.beforeDraw) {
        component.beforeDraw(this.painter);
      }
      component.draw(this.painter);
      this.painter.afterDraw();
    });
  }

  update(delta: number) {
    this.componentManager.invoke('update', delta);
  }

  initUpdate(delta: number) {
    this.componentManager.invoke('initUpdate', delta);
  }
}
