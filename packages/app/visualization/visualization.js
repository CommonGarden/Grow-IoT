Device.VisualizationComponent = class VisualizationComponent extends CommonComponent {
  onCreated() {
    super.onCreated();

    let templateData = Template.currentData();
    this.chartType = templateData.chartType;
    if (this.chartType === "line") {
      this.lineChart = true;
    } 

    return this.property = templateData.property;
  }
};

Device.VisualizationComponent.register('Device.VisualizationComponent');
