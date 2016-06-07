class UIComponent extends BlazeComponent {
  // A version of BlazeComponent.subscribe which logs errors to the console if no error callback is specified.
  subscribe(...args) {
    let lastArgument = args[args.length - 1];

    let callbacks = {};
    if (_.isFunction(lastArgument)) {
      callbacks.onReady = params.pop();
    } else if (_.any([lastArgument.onReady, lastArgument.onError, lastArgument.onStop], _.isFunction)) {
      callbacks = params.pop();
    }

    if (!callbacks.onError && !callbacks.onStop) {
      callbacks.onStop = error => {
        if (error) { return console.error(`Subscription '${args[0]}' error`, error); }
      };
    }

    args.push(callbacks);

    return super.subscribe(...args);
  }

  pathFor(pathName, kwargs) {
    let params = kwargs.hash.params || {};
    let queryParams = kwargs.hash.query || {};

    return FlowRouter.path(pathName, params, queryParams);
  }

  ancestorComponent(componentClass) {
    let component = this;
    while (component && !(component instanceof componentClass)) {
      component = component.parentComponent();
    }
    return component;
  }

  $or(...args) {
    // Removing kwargs.
    assert(args[args.length - 1] instanceof Spacebars.kw);
    args.pop();

    return _.some(args);
  }

  $and(...args) {
    // Removing kwargs.
    assert(args[args.length - 1] instanceof Spacebars.kw);
    args.pop();

    return _.every(args);
  }

  $not(...args) {
    // Removing kwargs.
    assert(args[args.length - 1] instanceof Spacebars.kw);
    args.pop();

    return !args[0];
  }

  insertDOMElement(parent, node, before, next) {
    if (typeof next === 'undefined' || next === null) { next = () => {
      super.insertDOMElement(parent, node, before);
      return true;
    }; }

    if (!this.callFirstWith(this, 'insertDOMElement', parent, node, before, next)) { return next(); }

    // It has been handled.
    return true;
  }

  moveDOMElement(parent, node, before, next) {
    if (typeof next === 'undefined' || next === null) { next = () => {
      super.moveDOMElement(parent, node, before);
      return true;
    }; }

    if (!this.callFirstWith(this, 'moveDOMElement', parent, node, before, next)) { return next(); }

    // It has been handled.
    return true;
  }

  removeDOMElement(parent, node, next) {
    if (typeof next === 'undefined' || next === null) { next = () => {
      super.removeDOMElement(parent, node);
      return true;
    }; }

    if (!this.callFirstWith(this, 'removeDOMElement', parent, node, next)) { return next(); }

    // It has been handled.
    return true;
  }
}

class UIMixin extends UIComponent {
  data() {
    return this.mixinParent().data();
  }

  callFirstWith(...args) {
    return this.mixinParent().callFirstWith(...args);
  }

  autorun(...args) {
    return this.mixinParent().autorun(...args);
  }
}
