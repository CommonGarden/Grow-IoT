<!--
  Title: Meteor Webcomponents Mixin, for Meteor Polymer integration
  Description: Mixin for polymer/webcomponents in meteor.
  -->
# Mixin

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/aruntk/meteorwebcomponents?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Donate](https://dantheman827.github.io/images/donate-button.svg)](https://www.paypal.me/arunkumartk)

## What is mwc mixin?

mwcMixin is a reactive meteor data source for polymer elements. Objective is to use use the reactive meteor collections inside polymer elements.


## Installation

### Method 1 - Meteor Package
Add `mwc:mixin` package to your Meteor App.

```sh
meteor add mwc:mixin
```

### Method 2 - Using bower

```sh
bower install mwc-mixin --save
```
import mwc-mixin.html file.


## How to use it ?

Add `mwcMixin` behavior to your component behaviors. ie. `behaviors:[mwcMixin]`

```js
Polymer({
  is: "custom-elements",
  behaviors:[mwcMixin],
...
})
```

### Trackers

Trackers is observers with meteor's reactivity.
observers defined in trackers array gets rerun when 
1. Observing properties change.
2. Reactive data inside function change.

```js
Polymer({
  is:"custom-element",
  behaviors:[mwcMixin],
  properties{
    propA:String
  },
  trackers:["changeStatus(propA)"],
  ready(){
   this.propA = "Meteor Status is "
  },
  changeStatus:function(p){
    console.log(p,Meteor.status().status); //runs every time propA/meteor status changes.
  }

})
```
For Trackers demo - https://github.com/aruntk/kickstart-meteor-polymer-with-app-route

### Methods

#### tracker

mwcMixin tracker runs first while attaching element and gets destroyed when the element gets detatched. Its just like executing something inside a Meteor tracker. You can set this.anyProperty reactively.

```js
Polymer({
  is:"custom-element",
  behaviors:[mwcMixin],
  properties{
    status:String
  },
  tracker:function(){
    this.status = Meteor.status().status; //runs every time status changes.
  }

})
```
```html
...
<template>
  status : [[status]]
</template>
...
```


#### autorun

Simple tracker autorun with computations stored in __computation property. Use this to use Meteor reactivity outside tracker method(tracker method runs first when attached).

```js
this.autorun(function(){console.log(FlowRouter.getParam('param'))});
```
#### guard

Guard limits reactivity. It triggers the enclosing computation only if the return variable changes.

In the following example tracker gets triggered only if return object changes. Which mean if p == false then tracker method will not be triggered even if qp changes. So no unwanted subscription calls in the example.
  
```js
  ...
  tracker(){
    const data = this.guard(params=>{
      const p = FlowRouter.getParam('p');
      const qp = FlowRouter.getQueryParam('qp');
      return p ? {p:p,qp:qp} : {} ;
    }); // data = 
    this.subscribe('sd_data',data);
  },
  ...
```

#### subscribe

This is similar to Blaze's template level subscriptions.
All subscription handles can be find in __handles property until they are ready. When they are ready handles are pushed to __mwcBin property.
All subscriptions are stopped when the components gets detatched
If you want to subscribe a collection from a polymer components use
```js
  this.subscribe("collectionName"); 
```

waiting for subscriptions to complete

`this.subsReady` changes to `true` when your subscription is complete.

```html

...

<template is="dom-if" if="{{!subsReady}}">
Loading Subscriptions..
</template>

...

```


#### getMeteorData

getMeteorData is tracker with one additional functionality. return value of the getMeteorData function gets set as mwcData. 

`this.mwcData` contains collections which are reactive. Use it as
`{{mwcData.collectionName}}`

```js
Polymer({
  is:"custom-element",
  behaviors:[mwcMixin],
  getMeteorData:function(){
    return {status :  Meteor.status().status}; //runs every time status changes.
  }

})

```
```html
...
<template>
  status : [[mwcData.status]]
</template>
...
```


### Examples

#### With FlowRouter and `mwc:layout`

```js
//Router
FlowRouter.route("/post/:_id", {
    name: 'post-view',
    action: function(params, queryParams) {
        mwcLayout.render('main', {
            "main": "post-view"
        });
    }
});

// Inside post-view element

Polymer({
    is: "post-view",
    behaviors:[mwcMixin], /***** IMPORTANT *****/
    properties:{post:Object,comment:Object},

    tracker: function() {
        
        var postId = FlowRouter.getParam('_id'); // getParam is reactive.
        
        this.subscribe("post"); //all posts
        this.subscribe("comment",{"post_id":postId}); //comments of the current post only.
        
        this.set("post", post.find({
                "_id":postId
            }).fetch());
        this.set("comment",comment.find().fetch());
        };
    }
});

```
[A full fledged example using tracker,getMeteorData and guard](https://jsfiddle.net/cy11v4y7/4/)

[Advanced Example](https://github.com/HedCET/TorrentAlert)

##Related Projects

[MWC Synthesis](https://github.com/meteorwebcomponents/synthesis) - Compiler for polymer/webcomponents in meteor.

[MWC Router](https://github.com/meteorwebcomponents/router) - Reactive routing for polymer/webcomponents in meteor.

[MWC Layout](https://github.com/meteorwebcomponents/layout) - polymer layout renderer

[MWC Flowrouter Demo](https://github.com/aruntk/kickstart-meteor-polymer) - mwc demo with flowrouter as the default router

[MWC App Route Demo](https://github.com/aruntk/kickstart-meteor-polymer-with-app-route) - mwc demo with polymer app route as the default router.

