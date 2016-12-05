import echarts from 'echarts';

class phGauge {
  ready() {
    this.phGauge = echarts.init(this.$.container);
  }
  beforeRegister() {
    this.properties = {
      ph: {
        type: Number,
        value: 6.7,
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
    this.is = 'ph-gauge';
    this.observers = ['draw(ph)'];
  }
  get behaviors() {
    return [mwcMixin];
  }
  draw(ph) {
    this.phGauge = this.phGauge || echarts.init(this.$.container, 'macarons');
    const data = { value: ph, name: 'ph' };
    const  opt = {
      tooltip : {
        formatter: "{a} <br/>{b} : {c}"
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
          name: 'Temperature',
          type: 'gauge',
          splitNumber: 14,
          min: 0,
          max: 14,
          axisLine: {
            lineStyle: {
              color: [
                [0.3286, 'rgba(255,0,0,0.4)'],
                [0.4286, 'rgba(255,150,0,0.5)'],
                [0.5286, 'rgba(0,200,0,0.4)'],
                [0.6286, 'rgba(255,150,0,0.5)'],
                [1, 'rgba(255,0,0,0.4)'],
              ], 
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 20,
              shadowOffsetX: 2,
              shadowOffsetY: 6
            }
          },
          axisTick: {
            splitNumber: 14,
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
            formatter:'{value}',
            textStyle: {
              color: 'auto',
              fontWeight: 'bolder'
            }
          },
          data: [data]
        }
      ]
    };

    this.phGauge.setOption(opt);
  }
};
Polymer(phGauge);
