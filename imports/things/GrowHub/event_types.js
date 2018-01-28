module.exports = {
  actuators: [
      {
          type: 'relay',
          number: 1
      },
      {
          type: 'relay',
          number: 2
      },      {
          type: 'relay',
          number: 3
      },      {
          type: 'relay',
          number: 4
      }
  ],
  sensors: [
      {
        type: 'temp',
        title: 'Air Temperature',
        icon: 'wi wi-thermometer',
        unit: 'wi wi-celsius',
        max: 40
      },
      {
        type: 'humidity',
        title: 'Humidity',
        icon: 'wi wi-humidity',
        max: 100
      },
      {
        type: 'pressure',
        title: 'Atmospheric pressure',
        icon: 'wi wi-barometer',
        max: 2000
      },
      {
        type: 'orp',
        title: 'ORP',
        icon: 'wi wi-raindrop',
        min: -2000,
        max: 2000
      },
      {
        type: 'lux',
        title: 'Lux',
        icon: 'wi wi-day-sunny',
        max: 10000
      },
      {
        type: 'dissolved_oxygen',
        title: 'Dissolved Oxygen',
        icon: 'wi wi-raindrop',
        max: 36,
      },
      {
        type: 'ph',
        title: 'pH',
        icon: 'wi wi-raindrop',
        max: 14,
      },
      {
        type: 'ec',
        title: 'Conductivity (ppm)',
        icon: 'wi wi-barometer',
        max: 2000,
      },
      {
        type: 'water_temperature',
        title: 'Water temperature',
        icon: 'wi wi-thermometer',
        unit: 'wi wi-celsius',
        max: 40,
      },
      {
        type: 'water_level',
        title: 'Water level',
        max: 100,
      },
      {
        type: 'co2',
          title: 'Carbon Dioxide',
        max: 5000,
      },
      {
        type: 'moisture_1',
        title: 'Moisture sensor #1',
        max: 100
      },
      {
        type: 'moisture_2',
        title: 'Moisture sensor #2',
        max: 100
      }
    ]
}
