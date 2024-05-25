const { calculateFlightPath } = require('../server');

test('single flight', () => {
  expect(calculateFlightPath([['SFO', 'EWR']])).toEqual(['SFO', 'EWR']);
});

test('two flights', () => {
  expect(calculateFlightPath([['ATL', 'EWR'], ['SFO', 'ATL']])).toEqual(['SFO', 'ATL', 'EWR']);
});

test('multiple flights', () => {
  expect(calculateFlightPath([
    ['IND', 'EWR'],
    ['SFO', 'ATL'],
    ['GSO', 'IND'],
    ['ATL', 'GSO']
  ])).toEqual(['SFO', 'ATL', 'GSO', 'IND', 'EWR']);
});

test('cycle detection', () => {
  expect(() => calculateFlightPath([
    ['SFO', 'ATL'],
    ['ATL', 'EWR'],
    ['EWR', 'SFO']
  ])).toThrow('Cycle detected or disconnected segments');
});

test('disconnected segments', () => {
  expect(() => calculateFlightPath([
    ['SFO', 'ATL'],
    ['LAX', 'EWR']
  ])).toThrow('Cycle detected or disconnected segments');
});
