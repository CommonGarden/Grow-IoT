import echarts from 'echarts';

class temperatureElement {
  ready() {
    this.temperatureGauge = echarts.init(this.$.container);
  }
  beforeRegister() {
    this.properties = {
      temperature: {
        type: Number,
        value: '12',
      },
    };
    this.is = 'temperature-element';
    this.observers = ['draw(temperature)'];
  }
  get behaviors() {
    return [mwcMixin];
  }
  draw(temperature) {
    this.temperatureGauge = this.temperatureGauge || echarts.init(this.$.container);
    const intTmp = Math.floor(temperature);
    const data = { value: intTmp, name: 'temperature' };
      opt = {
        tooltip : {
          formatter: "{a} <br/>{b} : {c}°"
        },
        toolbox: {
          show : true,
          feature : {
            mark : {show: true},
            restore : {show: true},
            saveAsImage : {show: true}
          }
        },
        series : [
          {
            name:'temperature',
            type:'gauge',
            detail: {formatter:'{value}°'},
            data: [data]
          }
        ]
      };

    this.temperatureGauge.setOption(opt);
  }
};
Polymer(temperatureElement);
