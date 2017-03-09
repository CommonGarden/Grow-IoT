import echarts from 'echarts';
import { DemandLatestTemperatureEvents } from './demand-behaviors';

class lightRealtime {
  beforeRegister() {
    this.is = 'light-realtime';
    this.properties = {
      events: {
        type: Array,
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
    this.observers = ['draw(events.splices)'];
  }
  get behaviors() {
    return [
      DemandLatestTemperatureEvents
    ]
  }
  attached() {
    this.lightRealtime = echarts.init(this.$.container);
    this.data = [];
    const option = {
      // title: {
      //   text: 'Light'
      // },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          params = params[0];
          const date = new Date(params.name);
          const nowDate = new Date();
          return Math.round((nowDate - date)/1000) + 's ago: ' + params.value[1];
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [{
        name: 'light-realtime',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: this.data
      }]
    };

    this.lightRealtime.setOption(option);

  }

  draw() {
    const events = this.events;
    if(this.lightRealtime && this.data && events) {
      this.data = _.map(events, (event) => {
        const now = event.insertedAt;
        const value = event.event.value;
        const point = {
          name: now.toString(),
          value: [
            now.toString(),
            Math.round(value)
          ]
        }
        return point;
      });
      this.lightRealtime.setOption({
        series: [{
          data: this.data
        }]
      });
    }
  }
}
Polymer(lightRealtime);
