'use strict'

let offers = [{
  label: 'Flight 1',
  features: {
    // Quantitative data type
    // 0 cheap ... 1 luxury
    expensiveness: 0.2,
    // Quantitative data type
    // 0 really slow ... 1 super fast
    trip: 0,
    // Nominal scale
    // Amenities
    seat: [0, 0, 0],
    // Binary scale
    // In-flight entertainment
    ife: false,
    // Ordinal scale
    // Meal rank vector
    meal: [1, 2, 3, 4, 5],
    // Quantitative data type
    // Unnormalized
    time: 10
  }
}, {
  label: 'Flight 2',
  features: {
    expensiveness: 0.2,
    trip: 0.8,
    seat: [0, 1, 1],
    ife: true,
    meal: [3, 1, 2, 5, 4],
    time: 2
  }
}, {
  label: 'Flight 3',
  features: {
    expensiveness: 0.5,
    trip: 0.91,
    seat: [0, 0, 1],
    ife: false,
    meal: [4, 5, 1, 3, 2],
    time: 1.75
  }
}, {
  label: 'Flight 4',
  features: {
    expensiveness: 0.3,
    trip: 0,
    seat: [1, 1, 0],
    ife: true,
    meal: [5, 4, 3, 2, 1],
    time: 5
  }
}, {
  label: 'Flight 5',
  features: {
    expensiveness: 0.2,
    trip: 0.87,
    seat: [1, 1, 1],
    ife: true,
    meal: [3, 1, 2, 5, 4],
    time: 1.9
  }
}, {
  label: 'Flight (exact)',
  features: {
    expensiveness: 0,
    trip: 1,
    seat: [1, 1, 1],
    ife: true,
    meal: [1, 2, 3, 4, 5],
    time: 0
  }
}];

let traveler1 = {
  label: 'Traveler 1',
  features: {
    expensiveness: 0,
    trip: 1,
    seat: [1, 1, 1],
    ife: true,
    meal: [1, 2, 3, 4, 5],
    time: 0
  }
};

module.exports = {
  traveler1: traveler1,
  offers: offers
}
