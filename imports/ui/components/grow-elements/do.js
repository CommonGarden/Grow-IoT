import echarts from 'echarts';
import { DemandLatestDO } from './demand-behaviors';

class doGauge {
  ready() {
    this.doGauge = echarts.init(this.$.container);
  }
  beforeRegister() {
    this.properties = {
      oxygen: {
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
    this.is = 'do-gauge';
    this.observers = ['draw(oxygen)'];
  }

  get behaviors() {
    return [
      mwcMixin,
      DemandLatestDO,
    ];
  }

  attached () {
    this.draw(this.oxygen);
  }

  draw (oxygen) {
    this.doGauge = this.doGauge || echarts.init(this.$.container, 'macarons');
    const data = { value: oxygen, name: 'Dissolved' };
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
          name: 'D.O.',
          type: 'gauge',
          splitNumber: 10,
          min: 0,
          max: 10,
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

    this.doGauge.setOption(opt);
  }
};
Polymer(doGauge);
