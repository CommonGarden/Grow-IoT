class gauge extends CommonComponent {
  onCreated() {
    super.onCreated();

    this.currentDeviceUuid = new ComputedField(() => {
      return FlowRouter.getParam('uuid');
    });

    this.property = new ComputedField(() => {
      let templateData = Template.currentData();
      return templateData.property;
    });

    return this.subscribe('Data.points', this.currentDeviceUuid());
  }

  onRendered() {
    super.onRendered();

    let data = {
      // A labels array that can contain any sort of values
      labels: [],
      // Our series array that contains series objects or in this case series data arrays
      series: []
    };

    var options = {
      // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
      width: undefined,
      // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
      height: undefined,
      // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
      chartPadding: 5,
      // Override the class names that are used to generate the SVG structure of the chart
      classNames: {
        chartPie: 'ct-chart-pie',
        chartDonut: 'ct-chart-donut',
        series: 'ct-series',
        slicePie: 'ct-slice-pie',
        sliceDonut: 'ct-slice-donut',
        label: 'ct-label'
      },
      // The start angle of the pie chart in degrees where 0 points north. A higher value offsets the start angle clockwise.
      startAngle: 270,
      // An optional total you can specify. By specifying a total value, the sum of the values in the series must be this total in order to draw a full pie. You can use this parameter to draw only parts of a pie or gauge charts.
      total: 200,
      // If specified the donut CSS classes will be used and strokes will be drawn instead of pie slices.
      donut: true,
      // Specify the donut stroke width, currently done in javascript for convenience. May move to CSS styles in the future.
      // This option can be set as number or string to specify a relative width (i.e. 100 or '30%').
      donutWidth: 60,
      // If a label should be shown or not
      showLabel: true,
      // Label position offset from the standard position which is half distance of the radius. This value can be either positive or negative. Positive values will position the label away from the center.
      labelOffset: 0,
      // This option can be set to 'inside', 'outside' or 'center'. Positioned with 'inside' the labels will be placed on half the distance of the radius to the border of the Pie by respecting the 'labelOffset'. The 'outside' option will place the labels at the border of the pie and 'center' will place the labels in the absolute center point of the chart. The 'center' option only makes sense in conjunction with the 'labelOffset' option.
      labelPosition: 'inside',
      // An interpolation function for the label value
      labelInterpolationFnc: Chartist.noop,
      // Label direction can be 'neutral', 'explode' or 'implode'. The labels anchor will be positioned based on those settings as well as the fact if the labels are on the right or left side of the center of the chart. Usually explode is useful when labels are positioned far away from the center.
      labelDirection: 'neutral',
      // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
      reverseData: false,
      // If true empty values will be ignored to avoid drawing unncessary slices and labels
      ignoreEmptyValues: false
    };

    let Chart = new Chartist.Pie('.ct-chart', data, options);

    return this.autorun(computation => {
      let { property } = Template.currentData();

      this.datapoints = new ComputedField(() => {
        return Data.documents.find({
          'data.type': property,
          'event': {
            $exists: false
          }
        })
        .fetch();
      });

      this.datapoints().map((currentValue, index, array)=> {
        if (data.labels.length > 1) {
          data.labels.shift();
          data.series.shift();
        }
        data.labels.push(currentValue.data.value);
        data.series.push(currentValue.data.value);
      });

      // Create a new line chart object where as first parameter we pass in a selector
      // that is resolving to our chart container element. The Second parameter
      // is the actual data object.
      Chart.update(data, options);
    });
  }
}

gauge.register('gauge')
