import { CommonComponent } from 'meteor/peerlibrary:blaze-components';
import './layout.html';

class BaseLayoutComponent extends CommonComponent {
  onCreated() {
    super.onCreated(...arguments);

    // To make it easier to use region values in methods and minimize reactivity.
    this.regions = {};
    for (let region in this.constructor.REGIONS) {
      let name = this.constructor.REGIONS[region];
      (name => {
        return this.regions[name] = new ComputedField(() => {
          return __guardFunc__(__guard__(this.data(), x => x[name]), f => f()) || null;
        }
        );
      })(name);
    }

    return this.autorun(computation => {
      let unknownRegions = _.difference(_.keys(this.data()), _.values(this.constructor.REGIONS));

      if (unknownRegions.length) {
        throw new Error(`Unknown layout region(s) requested: ${unknownRegions.join(', ')}.`);
      }
    }
    );
  }

  _renderRegion(regionName, parentComponent) {
    if (!regionName) { return null; }

    assert(_.has(this.regions, regionName), regionName);

    let componentName = this.regions[regionName]();

    if (!componentName) { return null; }

    let component = CommonComponent.getComponent(componentName);

    if (!component) { throw new Error(`Unknown component '${componentName}'.`); }

    if (typeof parentComponent === 'undefined' || parentComponent === null) { parentComponent = this.currentComponent(); }

    // To force no data context in rendered region component.
    return new Blaze.Template(() => {
      return Blaze.With(null, () => {
        return component.renderComponent(parentComponent);
      }
      );
    }
    );
  }
}

function __guardFunc__(func, transform) {
  return typeof func === 'function' ? transform(func) : undefined;
}

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}

class MainLayoutComponent extends BaseLayoutComponent {
  renderMain(parentComponent) {
    return this._renderRegion(this.constructor.REGIONS.MAIN, parentComponent);
  }
}

MainLayoutComponent.register('MainLayoutComponent');
MainLayoutComponent.REGIONS({MAIN: 'main'});
