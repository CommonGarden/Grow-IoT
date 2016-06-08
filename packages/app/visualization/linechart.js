class LineChartComponent extends CommonComponent {
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

    // TODO: make this a bit more responsive? Perhaps get the width of the div and
    // set the width to that?
    let margin = { 
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    };
    // TODO: make this a bit more reponsive for smaller devices?
    let width = 600 - (margin.left) - (margin.right);
    let height = 400 - (margin.top) - (margin.bottom);
    let x = d3.time.scale().range([
      0,
      width
    ]);
    let y = d3.scale.linear().range([
      height,
      0
    ]);
    
    // Here we namespace the visualization instance so there can be multiple visualizations on a page.
    let instance = {};
    instance[this.property()] = {};
    instance[this.property()].xAxis = d3.svg.axis().scale(x).orient('bottom');
    instance[this.property()].yAxis = d3.svg.axis().scale(y).orient('left');
    instance[this.property()].svg = d3.select(`#${this.property()}`).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    instance[this.property()].svg.append('g').attr('class', 'x axis').attr('transform', `translate(0,${height})`);
    instance[this.property()].svg.append('g').attr('class', 'y axis').append('text').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '.71em').style('text-anchor', 'end').text(''); // TODO: Add unit value if it exists

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

      instance[property].paths = instance[property].svg.selectAll('path.line').data( this.datapoints() );

      x.domain(d3.extent(this.datapoints(), d => d.insertedAt
      ));

      // TODO: scale things to a reasonable amount, it is weird to see it zoomed in too closely.
      y.domain(d3.extent(this.datapoints(), d => d.data.value
      ));

      // Temperature specific HACK
      // y.domain [0, 40]

      let line = d3.svg.line().x(d => x(d.insertedAt)
      ).y(d => y(d.data.value)
      ).interpolate("linear");

      // TODO: fix graph blinking when lots of data or when data is coming in
      // at a different rate.

      //Update X axis
      instance[property].svg.select('.x.axis').transition().duration(1000).call(instance[property].xAxis);
      //Update Y axis
      instance[property].svg.select('.y.axis').transition().duration(1000).call(instance[property].yAxis);
      instance[property].paths
        .enter()
        .append('path')
        .attr('class', 'line')
        .attr('d', line(this.datapoints()))
        .transition()
        .duration(1000)
        .remove();
      instance[property].paths.exit().remove();
      return;
    });
  }
}

LineChartComponent.register('LineChartComponent');
