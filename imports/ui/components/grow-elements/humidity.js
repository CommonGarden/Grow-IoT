import echarts from 'echarts';
import { DemandLatestHumidity } from './demand-behaviors';

class humidityGauge {
  ready() {
    this.humidityGauge = echarts.init(this.$.container);
  }
  beforeRegister() {
    this.properties = {
      humidity: {
        type: Number,
        value: 50,
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
    this.is = 'humidity-gauge';
    this.observers = ['draw(humidity)'];
  }
  get behaviors() {
    return [
      mwcMixin,
      DemandLatestHumidity,
  ];
  }
  draw(humidity) {
    this.humidityGauge = this.humidityGauge || echarts.init(this.$.container, 'macarons');
    const data = { value: humidity, name: 'humidity' };
    const  opt = {
      tooltip : {
        formatter: "{a} <br/>{b} : {c}%"
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
          name: 'Humidity',
          type: 'gauge',
          splitNumber: 10,
          min: 0,
          max: 100,
          axisLine: {
            lineStyle: {
              color: [
                [1, 'rgba(0,0,200,0.4)'],
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
            formatter:'{value}%RH',
            textStyle: {
              color: 'auto',
              fontWeight: 'bolder'
            }
          },
          data: [data]
        }
      ]
    };

    this.humidityGauge.setOption(opt);
  }
};
Polymer(humidityGauge);
