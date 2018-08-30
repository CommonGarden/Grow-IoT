module.exports = {
    actuators: [
        {
            type: 'relay',
            state: 'off',
            number: 1,
            title: 'Fan',
            role: 'fan'
        },
        {
            type: 'relay',
            state: 'off',
            number: 2,
            title: 'Humidifier',
            role: 'humidifier'
        },
        {
            type: 'relay',
            state: 'off',
            number: 3,
            title: 'Heater',
            role: 'heater'
        },
        {
            type: 'relay',
            state: 'off',
            number: 4,
            title: 'Light',
            role: 'light'
        }
    ],
    sensors: [
        {
            type: 'temperature',
            title: 'Temperature in greenhouse 1',
            icon: 'wi wi-thermometer',
            unit: 'wi wi-celsius',
            max: 40
        },
        {
            type: 'orp',
            title: 'ORP',
            icon: 'wi wi-raindrop',
            min: -2000,
            max: 2000
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
            type: 'co2',
            title: 'Carbon Dioxide',
            max: 5000,
        },
    ]
};
