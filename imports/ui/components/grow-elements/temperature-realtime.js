import echarts from 'echarts';

class temperatureRealtime {
  beforeRegister() {
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
    this.is = 'temperature-realtime';
    this.observers = ['draw(events.splices)'];
  }
  attached() {
    this.temperatureRealtime = echarts.init(this.$.container);
    this.data = [];
    const option = {
      title: {
        text: 'Temperature'
      },
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
        name: 'temperature-realtime',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: this.data
      }]
    };

    this.temperatureRealtime.setOption(option);

  }

  draw() {
    const events = this.events;
    if(this.temperatureRealtime && this.data && events) {
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
      this.temperatureRealtime.setOption({
        series: [{
          data: this.data
        }]
      });
    }
  }
}
Polymer(temperatureRealtime);
