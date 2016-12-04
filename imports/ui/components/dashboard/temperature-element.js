import echarts from 'echarts';

class temperatureElement {
  ready() {
    this.temperatureGauge = echarts.init(this.$.container);
  }
  beforeRegister() {
    this.properties = {
      temperature: {
        type: Number,
        value: 12,
      },
      chartHeight: {
        type: Number,
        value: 400,
      },
      chartWidth: {
        type: Number,
        value: 380,
      },
    };
    this.is = 'temperature-element';
    this.observers = ['draw(temperature)'];
  }
  get behaviors() {
    return [mwcMixin];
  }
  draw(temperature) {
    this.temperatureGauge = this.temperatureGauge || echarts.init(this.$.container, 'macarons');
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
            name:'Temperature',
            type:'gauge',
            splitNumber: 10,
            axisLine: {
                lineStyle: {
                    color: [
                      [0.2, 'rgba(255,0,0,0.4)'],
                      [0.4, 'rgba(255,150,0,0.5)'],
                      [0.6, 'rgba(0,200,0,0.4)'],
                      [0.8, 'rgba(255,150,0,0.5)'],
                      [1, 'rgba(255,0,0,0.4)'],
                      ], 
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  shadowBlur: 20,
                  shadowOffsetX: 2,
                  shadowOffsetY: 6
                }
            },
            axisTick: {
                splitNumber: 10,
                length :12,
                lineStyle: {
                    color: 'auto'
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                show: true,
                length :30,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer : {
                width : 5
            },
            title : {
                show : true,
                offsetCenter: [0, '-40%'],
                textStyle: {
                  fontWeight: 'bolder',
                  color: '#999',
                }
            },
            detail : {
                formatter:'{value}°',
                textStyle: {
                    color: 'auto',
                    fontWeight: 'bolder'
                }
            },
            data: [data]
          }
        ]
      };

    this.temperatureGauge.setOption(opt);
  }
};
Polymer(temperatureElement);
