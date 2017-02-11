const extendDemand = function(tempDemand) {
  const demands = this.properties.demands || { type: Object };
  const value = demands.value || {};
  const newValue = Object.assign({}, value, tempDemand );
  demands.value = newValue;
  this.properties.demands = demands;
}

const beforeRegister = function() {
  this.demandsChanged = function(newDemand) {
    this.fire('demands-change', newDemand);
  };
  // using private method as there is no other workaround for adding observer;
  this._addComplexObserverEffect('demandsChanged(demands.*)'); 
}

export const DemandLatestTemparature = {
  beforeRegister,
  registered() {
    const tempDemand = {
      temperature: {
        path: 'event.event.value', 
        // TODO more params needed. eg. 'type'
      },
    }
    extendDemand.call(this, tempDemand);
  },
}

export const DemandLatestTemperatureEvents = {
  beforeRegister,
  registered() {
    const eDemand = {
      events: {
        path: 'events', 
        // TODO more params needed. eg. 'type, limit'
      },
    }
    extendDemand.call(this, eDemand);
  },
}

export const DemandLatestPH = {
  beforeRegister,
  registered() {
    const eDemand = {
      ph: {
        path: 'event.event.value', 
        // TODO more params needed. eg. 'type, which collection etc'
      },
    }
    extendDemand.call(this, eDemand);
  },
}

export const DemandLatestDO = {
  beforeRegister,
  registered() {
    const eDemand = {
      do: {
        path: 'event.event.value', 
        // TODO more params needed. eg. 'type, which collection etc'
      },
    }
    extendDemand.call(this, eDemand);
  },
}

export const DemandLatestEC = {
  beforeRegister,
  registered() {
    const eDemand = {
      ec: {
        path: 'event.event.value', 
        // TODO more params needed. eg. 'type, which collection etc'
      },
    }
    extendDemand.call(this, eDemand);
  },
}

export const DemandLatestHumidity = {
  beforeRegister,
  registered() {
    const eDemand = {
      humidity: {
        path: 'event.event.value', 
        // TODO more params needed. eg. 'type, which collection etc'
      },
    }
    extendDemand.call(this, eDemand);
  },
}

export const ChildDemands = {
  DemandLatestTemparature,
  DemandLatestTemperatureEvents,
  DemandLatestPH,
  DemandLatestDO,
  DemandLatestEC,
  DemandLatestHumidity,
}

