import echarts from 'echarts';

class temperatureRealtime {
  beforeRegister() {
    this.properties = {
      temperature: {
        type: Number,
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
    this.observers = ['draw(temperature)'];
  }
  attached() {
    this.temperatureRealtime = echarts.init(this.$.container);
    function randomData(i) {
      const now = new Date();
      const date = new Date(+now - (49 - i)* 3000);
      const rnd = i + Math.random() * 30 - 15;
      return {
        name: date.toString(),
        value: [
          date.toString(),
          Math.round(rnd)
        ]
      }
    }
    this.data = _.times(49, randomData);
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

  draw(temperature) {
    if(this.temperatureRealtime && this.data) {

      const now = new Date();
      const value = temperature;
      const point = {
        name: now.toString(),
        value: [
          now.toString(),
          Math.round(value)
        ]
      }
      if(this.data.length >= 50){
        this.data.shift();
      }
      this.data.push(point);
      this.temperatureRealtime.setOption({
        series: [{
            data: this.data
        }]
    });
    }
  }
}
Polymer(temperatureRealtime);
