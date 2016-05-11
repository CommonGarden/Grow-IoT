(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.MyLibrary = factory();
})(this, function () {
  "use strict";

  //
  // Always be sure to define variables.
  // Never export directly, as 6to5 strips
  // all import and export lines.
  //

  var Another = {
    anotherFn: function anotherFn() {
      return "ok";
    },
    multiply: function multiply(a, b) {
      return a * b;
    }
  };

  var MyLibrary = {
    anotherFn: Another.anotherFn,
    multiply: Another.multiply,
    mainFn: function mainFn() {
      return "hello";
    }
  };

  var index = MyLibrary;

  return index;
});
//# sourceMappingURL=./library-dist.js.map