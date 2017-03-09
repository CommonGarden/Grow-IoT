import echarts from 'echarts';
import { DemandLatestEC } from './demand-behaviors';

class ecGauge {
  ready() {
    this.ecGauge = echarts.init(this.$.container);
  }
  beforeRegister() {
    this.properties = {
      ec: {
        type: Number,
        value: 300,
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
    this.is = 'ec-gauge';
    this.observers = ['draw(ec)'];
  }
  get behaviors() {
    return [
      mwcMixin,
      DemandLatestEC,
  ];
  }

  attached () {
    this.draw(this.ec);
  }

  draw(ec) {
    this.ecGauge = this.ecGauge || echarts.init(this.$.container, 'macarons');
    const data = { value: ec, name: 'ec' };
    const  opt = {
      tooltip : {
        formatter: "{a} <br/>{b} : {c}"
      },
      toolbox: {
        show : true,
        feature : {
          mark : {show: true},
          restore : {
            show: true,
            title: 'Restore',
          },
          saveAsImage : {
            show: true,
            title: 'Save as image',
          },
        }
      },

      series : [
        {
          name: 'Conductivity',
          type: 'gauge',
          splitNumber: 10,
          min: 0,
          max: 1000,
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

    this.ecGauge.setOption(opt);
  }
};
Polymer(ecGauge);
