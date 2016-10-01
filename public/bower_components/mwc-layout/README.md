<!--
  Title: Meteor Webcomponents Layout for Meteor Polymer integration
  Description: Layout manager for polymer/webcomponents in meteor.
  -->
# Meteor Webcomponents Layout.

## Installation

### Using meteor package. Meteor 1.3+. Depends on [synthesis](https://github.com/meteorwebcomponents/synthesis)

```sh
meteor add mwc:layout
```

### Using Bower

```sh
bower install mwc-layout --save
```

```html
<link rel="import" href="bower_components/mwc-layout/mwc-layout.html">
```

> Note. Version 1.1.12 is for meteor 1.3+ . For meteor 1.2 use mwc-layout bower components



## Usage


index.html

```html
<head>
  <title>Synthesis</title>
</head>

<body class="fullbleed">

  <mwc-layout id="demo-layout">
    <div region="main"></div>
  </mwc-layout>

</body>
```
Define a polymer element

```html
<dom-module id="test-element">
  <template>
        name : {{name}}
  </template>
</dom-module>
<script>
Polymer({
  is:"test-element",
  properties:{
    name:{
      type:String,
      value:"mwc"
    }
  }

})
</script>
```

Now use  

```js 
mwcLayout.render("demo-layout",{"main":"test-element"});
```

Layout Manager for [Meteor](https://www.meteor.com/) + [Polymer - 1.0](https://www.polymer-project.org/) 

Advanced Example - https://github.com/HedCET/TorrentAlert



