Polymer({
  is: 'size-grow-animation',
  behaviors: [
    Polymer.NeonAnimationBehavior
  ],
  configure: function(config) {
    var node = config.node;
    var rect = node.getBoundingClientRect();
    var height = rect.height;
    var width = rect.width;
    this._effect = new KeyframeEffect(node, [{
      height: (height / 2) + 'px',
      width: (width / 2) + 'px'
    }, {
      height: height + 'px',
      width: width + 'px'
    }], this.timingFromConfig(config));
    return this._effect;
  }
});

Polymer({
  is: 'size-shrink-animation',
  behaviors: [
    Polymer.NeonAnimationBehavior
  ],
  configure: function(config) {
    var node = config.node;
    var rect = node.getBoundingClientRect();
    var height = rect.height;
    var top = rect.top;
    var width = rect.width;
    this.setPrefixedProperty(node, 'transformOrigin', '0 0');
    this._effect = new KeyframeEffect(node, [{
      height: height + 'px',
      width: width + 'px',
      transform: 'translateY(0)'
    }, {
      height: height / 2 + 'px',
      width: width - (width / 20) + 'px',
      transform: 'translateY(-20px)'
    }], this.timingFromConfig(config));
    return this._effect;
  }
});
