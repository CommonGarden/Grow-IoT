# \<morph-animation\>

Element to element morphing using Polymer

# Usage

```html
<link rel="import" href="bower_components/morph-animation/morph-animation.html">

<dom-module id="morph-animation">
  <template>
    <style>
:host {
  display: block;
}
    </style>
    <paper-icon-button icon="add" morph-target="#dialog" on-tap="morphThis"></paper-icon-button>
    <paper-dialog id="#dialog">
      <div>
        Contents
      </div>
    </paper-dialog>
  </template>

  <script>
Polymer({

  is: 'morph-animation',
  behaviors: [MorphBehavior],

});
  </script>
</dom-module>
```
