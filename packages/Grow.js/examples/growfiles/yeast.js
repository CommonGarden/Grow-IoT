module.exports = {
    name: 'Yeast',
    version: '0.1.0', // Not grower tested, any recommendations?
    phases: {
        ferment: {
            length: '2 days',
            targets: {
                // Expect pH to be ~4 when done
                ph: {
                    min: 3.5,
                    max: 9.0,
                },

                // Goes down over time
                dissolved_oxygen: {
                    min: 1.0,
                },

                // Might start as negative or positive and tend toward zero?
                // orp: {
                //   min: 1400,
                //   ideal: 1500,
                //   max: 1700,
                // },

                temperature: {
                    min: 75,
                    ideal: 90,
                    max: 96
                }
            },

            // Cycles are function that have a 'schedule' property
            cycles: {
                feed: {
                    schedule: 'after 6:00am',
                }
            }
        }
    }
};
