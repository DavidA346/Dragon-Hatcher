const creatureDataMock = require('../__mocks__/creatureDataMock');
jest.mock('../utils/creatureData', () => require('../__mocks__/creatureDataMock'));
const { createEgg } = require('../utils/createEgg');
const creatureData = require('../utils/creatureData');

describe('createEgg()', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('dummy test: Jest is seeing createEgg.test.js', () => {
    expect(true).toBe(true);
  });

  it('returns the default Red egg when no hatchedEggs are passed', () => {
    const egg    = createEgg([]);
    const redDef = creatureData.Red.egg;

    expect(egg.color).toBe(redDef.color);
    expect(egg.type).toBe(creatureData.Red.type);
    expect(egg.rarity).toBe(redDef.rarity);
    expect(egg.clicksNeeded).toBe(redDef.clicksNeeded);
    expect(egg.progress).toBe(0);
    expect(egg.boosts).toBe(redDef.boosts);
    expect(egg.img).toBe(redDef.images[0]);
  });

  it('selects the first available egg when Math.random() returns 0', () => {
    // Build the same “availableEggs” array that createEgg() uses,
    // but only to extract the firstKey for comparison.
    const availableEggs = Object.entries(creatureData)
      .filter(([color, data]) => color !== 'Red' && (data.egg.weight ?? 1) > 0)
      .flatMap(([color, data]) =>
        Array.from({ length: data.egg.weight ?? 1 }, () => ({ color, data }))
      );
    // The very first entry’s color:
    const firstKey = availableEggs[0].color;
    const firstDef = creatureData[firstKey].egg;

    // Force Math.random() = 0 to pick index 0
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const egg = createEgg(['Red']);

    expect(egg.color).toBe(firstKey);
    expect(egg.type).toBe(creatureData[firstKey].type);
    expect(egg.rarity).toBe(firstDef.rarity);
    expect(egg.clicksNeeded).toBe(firstDef.clicksNeeded);
    expect(egg.progress).toBe(0);
    expect(egg.boosts).toBe(firstDef.boosts ?? 0);
    expect(egg.img).toBe(firstDef.images[0]);
  });

  it('chooses a mid-index egg when Math.random() is in the middle', () => {
    const hatchedEggs = ['Red'];

    // Recreate availableEggs array, respecting weights:
    const availableEggs = Object.entries(creatureData)
      .filter(([color, data]) => !hatchedEggs.includes(color) && (data.egg.weight ?? 1) > 0)
      .flatMap(([color, data]) =>
        Array.from({ length: data.egg.weight ?? 1 }, () => ({ color, data }))
      );

    const midIndex  = Math.floor(availableEggs.length / 2);
    const chosenKey = availableEggs[midIndex].color;
    const chosenDef = creatureData[chosenKey].egg;

    // Force Math.random() to hit exactly midIndex:
    jest.spyOn(Math, 'random').mockReturnValue(midIndex / availableEggs.length);

    const egg = createEgg(hatchedEggs);

    expect(egg.color).toBe(chosenKey);
    expect(egg.type).toBe(creatureData[chosenKey].type);
    expect(egg.rarity).toBe(chosenDef.rarity);
    expect(egg.clicksNeeded).toBe(chosenDef.clicksNeeded);
    expect(egg.progress).toBe(0);
    expect(egg.boosts).toBe(chosenDef.boosts ?? 0);
    expect(egg.img).toBe(chosenDef.images[0]);
  });

  it('returns the Finished egg when no eggs are available', () => {
    // Build an array with all possible egg colors to simulate all hatched
    const allEggColors = Object.entries(creatureData)
      .filter(([color, data]) => (data.egg.weight ?? 1) > 0)
      .map(([color]) => color);

    const egg = createEgg(allEggColors);

    expect(egg).toEqual({
      color: 'none',
      type: 'Finished',
      rarity: 0,
      clicksNeeded: 0,
      progress: 0,
      boosts: null,
      img: null,
    });
  });
});

describe('createEgg with weight edge cases', () => {
  it('filters out eggs with weight 0', () => {
    const egg = createEgg(['Red']); // hatchedEggs includes Red only

    // Egg color should not be Blue (weight 0)
    expect(egg.color).not.toBe('Blue');

    // Egg color should be Green (weight undefined, treated as 1)
    expect(['Green']).toContain(egg.color);
  });
});