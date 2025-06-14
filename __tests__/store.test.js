import useStore from '../store/useStore';
import * as helpers from '../store/helpers';
import { createEgg } from '../utils/createEgg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import itemData from '../utils/itemData';
import Toast from 'react-native-toast-message';


// Zustand Store Cases
describe('Zustand Store Tests', () => {
  beforeEach(async () => {
    // Clears Async Storage and resets Zustand before every test to be able to test each individually
    await AsyncStorage.clear();
    await useStore.getState().initializeStore();
  });

  it('should initialize egg correctly when no saved egg exists', async () => {
    // Create the default egg
    const expectedEgg = createEgg([]);

    // Check if the egg state is correctly set to the default egg 
    expect(useStore.getState().egg).toEqual(expectedEgg);
  });

  it('should initialize hatched eggs correctly', async () => {
    // No eggs hatched at the start
    const expectedHatchedEggs = [];

    // Should return empty array
    expect(useStore.getState().hatchedEggs).toEqual(expectedHatchedEggs);
  });

  it('should handle egg data loading from AsyncStorage', async () => {
    // Creates a basic egg
    const eggData = {
      color: 'Red',
      type: 'dragon',
      rarity: 1,
      clicksNeeded: 60,
      progress: 0,
      boosts: 0,
      img: '',
    };

    // Store the egg data in AsyncStorage 
    await AsyncStorage.setItem('egg', JSON.stringify(eggData));

    // Initialize store state
    await useStore.getState().initializeStore();

    // Check if the egg state is correctly loaded from AsyncStorage
    expect(useStore.getState().egg).toEqual(eggData);
  });

});

describe('Persistence Methods', () => {
  beforeEach(async () => {
    // Clears Async Storage and resets Zustand before every test to be able to test each individually
    await AsyncStorage.clear();
    await useStore.getState().initializeStore();
  });

  it('should save currency to AsyncStorage', async () => {
    // Random currency is chosen
    const currency = 42;

    // Save currency value to Zustand and AsyncStorage
    await useStore.getState().saveCurrency(currency);

    // Get the currency from AsyncStorage and check if it was saved correctly
    const stored = await AsyncStorage.getItem('currency');
    expect(stored).toBe(currency.toString());
  });

  it('should save hatched eggs to AsyncStorage', async () => {
    // Have a random mock egg
    const eggs = [{ color: 'Blue', type: 'dragon' }];

    // Save hatched eggs to Zustand and AsyncStorage
    await useStore.getState().saveHatchedEggs(eggs);

    // Get the hatched eggs from AsyncStorage and check if they were saved correctly
    const stored = await AsyncStorage.getItem('hatchedEggs');
    expect(stored).toBe(JSON.stringify(eggs));
  });

  it('should save current egg to AsyncStorage', async () => {
    const egg = createEgg([]);

    // Save the current egg to Zustand and AsyncStorage
    await useStore.getState().saveCurrentEgg(egg);

    // Get the current egg from AsyncStorage and check if it was saved correctly
    const stored = await AsyncStorage.getItem('egg');
    expect(stored).toBe(JSON.stringify(egg));
  });

  it('should increment currency and persist it', async () => {
    // Get the current state of what is stored
    const state = useStore.getState();
    // Get the initial value of currency
    const initial = state.currency;

    // Increment currency in Zustand
    await state.incrementCurrency();
    const newVal = initial + 1;

    // Check if the currency was updated correctly in Zustand
    expect(useStore.getState().currency).toBe(newVal);

    // Get the updated currency from AsyncStorage and check if it was saved correctly
    const stored = await AsyncStorage.getItem('currency');
    expect(stored).toBe(newVal.toString());
  });

  it('should increment gold and persist it', async () => {
    // Get the current state of what is stored
    const state = useStore.getState();
    // Get the initial value of the gold
    const initial = state.gold;

    // Increment gold in Zustand
    await state.incrementGold({ type: 'dragon', stage: 'adult' });
    const newVal = useStore.getState().gold;

    // Check if the gold was updated in Zustand correctly
    expect(useStore.getState().gold).toBe(newVal);

    expect(newVal).toBeGreaterThan(initial);

    // Get the updated gold from AsyncStorage and check if it was saved correctly
    const stored = await AsyncStorage.getItem('gold');
    expect(stored).toBe(JSON.stringify(newVal));
  });

  it('should save gold explicitly', async () => {
    // Set a random gold value
    const gold = 5;

    // Save the gold value to Zustand and AsyncStorage
    await useStore.getState().saveGold(gold);

    // Get the saved gold from AsyncStorage and check if it was saved correctly
    const stored = await AsyncStorage.getItem('gold');
    expect(stored).toBe(JSON.stringify(gold));
  });

  it('should load inventory from AsyncStorage and update store state', async () => {
    // Create a mock inventory
    const mockInventory = [
      { id: '1', name: 'Red', type: 'dragon', image: 'red.png', stage: 'baby' },
      { id: '2', name: 'Blue', type: 'wyvern', image: 'blue.png', stage: 'adult' },
    ];

    // Store the mock inventory in AsyncStorage
    await AsyncStorage.setItem('creatureInventory', JSON.stringify(mockInventory));

    useStore.setState({ creatureInventory: [] });

    // Load inventory info into Zustand from AsyncStorage
    await useStore.getState().loadInventory();

    // Check if the inventory state was updated correctly with the mock inventory
    expect(useStore.getState().creatureInventory).toEqual(mockInventory);
  });

  it('should load currency from AsyncStorage and set state correctly', async () => {
    const mockCurrency = '42'; 

    // Store the mock currency in AsyncStorage
    await AsyncStorage.setItem('currency', mockCurrency);

    useStore.setState({ currency: 0 });

    // Load currency data into Zustand from AsyncStorage
    await useStore.getState().loadCurrency();

    // Check if the currency was updated correctly in Zustand
    expect(useStore.getState().currency).toBe(42);
  });

  it('should load hatchedEggs from AsyncStorage and set state correctly', async () => {
    const mockHatchedEggs = ['Red', 'Blue'];

    // Store the mock hatched eggs in AsyncStorage
    await AsyncStorage.setItem('hatchedEggs', JSON.stringify(mockHatchedEggs));

    useStore.setState({ hatchedEggs: [] });

    // Load hatched eggs data into Zustand from AsyncStorage
    await useStore.getState().loadHatchedEggs();

    // Check if the hatched eggs state was updated correctly
    expect(useStore.getState().hatchedEggs).toEqual(mockHatchedEggs);
  });

  it('should save inventory to AsyncStorage', async () => {
    const mockInventory = [{ id: '1', name: 'Dragon' }];

    useStore.setState({ creatureInventory: [] });

    // Save inventory to AsyncStorage
    await useStore.getState().saveInventory(mockInventory);

    // Get the saved inventory from AsyncStorage
    const storedInventory = await AsyncStorage.getItem('creatureInventory');

    // Check if the inventory was saved correctly
    expect(storedInventory).toBe(JSON.stringify(mockInventory));
  });

  it('should add a creature to inventory and save it', async () => {
    const mockCreature = { id: '1', name: 'Dragon', type: 'fire' };  // New creature to add
    const initialInventory = [{ id: '2', name: 'Wyvern', type: 'air' }];  // Existing inventory

    // Set the initial inventory state in Zustand
    useStore.setState({ creatureInventory: initialInventory });

    // Add new creature to the inventory and save it in AsyncStorage
    await useStore.getState().addCreatureToInventory(mockCreature);

    // Check if the creature was added to the inventory correctly
    const updatedInventory = useStore.getState().creatureInventory;

    expect(updatedInventory).toEqual([...initialInventory, mockCreature]);

    // Get the updated inventory from AsyncStorage
    const storedInventory = await AsyncStorage.getItem('creatureInventory');

    // Check if the updated inventory was saved correctly
    expect(storedInventory).toBe(JSON.stringify(updatedInventory));
  });
});

describe('incrementEggProgress Tests', () => {
  beforeEach(async () => {
    // Clears Async Storage and resets Zustand before every test to be able to test each individually
    await AsyncStorage.clear();
    await useStore.getState().initializeStore();
  });

  it('should hatch the egg when progress reaches the threshold', async () => {
    const initialEgg = {
      color: 'Red',
      type: 'dragon',
      rarity: 1,
      clicksNeeded: 5,
      progress: 4,
      boosts: 0,
      img: '',
    };

    // Set the initial egg state in Zustand
    useStore.setState({ egg: initialEgg, hatchedEggs: [] });

    // Increment egg progress
    await useStore.getState().incrementEggProgress();

    const newState = useStore.getState();

    // Check if the egg is hatched and added to hatchedEggs
    expect(newState.hatchedEggs).toEqual(['Red']);

    // Check if a new creature has been added to the inventory
    expect(newState.creatureInventory.length).toBe(1);
    expect(newState.creatureInventory[0].name).toBe('Red');

    // Check if the egg state is reset after hatching
    expect(newState.egg.progress).toBe(0);
  });

  it('should save current egg progress and update egg state if not hatched', async () => {
    // Setup an egg whose progress is below threshold
    const initialEgg = {
      color: 'Blue',
      type: 'phoenix',
      rarity: 2,
      clicksNeeded: 5,
      progress: 2,   // less than clicksNeeded - 1
      boosts: 0,
      img: '',
    };

    // Seed Zustand state
    useStore.setState({ egg: initialEgg });

    // Spy/mock saveCurrentEgg function inside Zustand
    const saveCurrentEggSpy = jest.spyOn(useStore.getState(), 'saveCurrentEgg').mockImplementation(() => {});

    // Call incrementEggProgress
    await useStore.getState().incrementEggProgress();

    // Verify saveCurrentEgg was called with updated egg (progress incremented by 1)
    expect(saveCurrentEggSpy).toHaveBeenCalledTimes(1);

    const expectedUpdatedEgg = { ...initialEgg, progress: initialEgg.progress + 1 };
    expect(saveCurrentEggSpy).toHaveBeenCalledWith(expectedUpdatedEgg);

    // Verify Zustand egg state updated correctly
    const newEggState = useStore.getState().egg;
    expect(newEggState.progress).toBe(initialEgg.progress + 1);

    // Cleanup spy
    saveCurrentEggSpy.mockRestore();
  });
});

describe('resetProgress Tests', () => {
  beforeEach(async () => {
    // Clear AsyncStorage and initialize Zustand store before each test
    await AsyncStorage.clear();
    await useStore.getState().initializeStore();
  });

  it('should reset egg progress and hatched eggs state correctly', async () => {
    useStore.setState({ egg: { progress: 10 }, hatchedEggs: ['Red'] });

    await useStore.getState().resetProgress();

    // Check if egg progress and hatched eggs state are reset correctly
    expect(useStore.getState().egg.progress).toBe(0);
    expect(useStore.getState().hatchedEggs).toEqual([]);
  });
});
describe('Get Equipped Items', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await useStore.getState().initializeStore();
  });

  it('getEquippedHammer returns null when there are no hammers', () => {
    expect(useStore.getState().getEquippedHammer()).toBeNull();
  });

  it('getEquippedScroll returns null when there are no scrolls for a given type', () => {
    expect(useStore.getState().getEquippedScroll('dragon')).toBeNull();
  });

  it('getEquippedScrolls returns all null values when no scrolls exist', () => {
    const scrolls = useStore.getState().getEquippedScrolls();
    expect(scrolls).toEqual({
      dragon: null,
      wyvern: null,
      drake: null,
      egg: null,
      gold: null,
    });
  });

  it('getEquippedScrolls returns last scroll ID or null for each category', () => {
    // Reset store so scrolls is empty
    useStore.setState({
      items: {
        hammers: [],
        totems: [],
        scrolls: {},        // no scrolls at all
        potions: [],
      },
    });
    // first assert that with no scrolls we get null for everything
    expect(useStore.getState().getEquippedScrolls()).toEqual({
      dragon: null,
      wyvern: null,
      drake:  null,
      egg:    null,
      gold:   null,
    });
  
    // Seed scrolls for some categories (mixed empty vs non-empty)
    useStore.setState({
      items: {
        hammers: [],
        totems: [],
        scrolls: {
          dragon: ['d1'],
          wyvern: ['w1','w2'],
          drake:  [],        // still empty
          egg:    ['e1'],
          gold:   ['g1','g2'],
        },
        potions: [],
      },
    });
  
    // Now getEquippedScrolls should pick the last ID in each array or null
    expect(useStore.getState().getEquippedScrolls()).toEqual({
      dragon: 'd1',  // single-element array
      wyvern: 'w2',  // last of ['w1','w2']
      drake:  null,  // still empty
      egg:    'e1',
      gold:   'g2',
    });
  });  

});

describe('Hammer Bonus Clicks', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await useStore.getState().initializeStore();
  });

  it('getHammerBonusClicks returns 0 when no hammer is equipped', () => {
    expect(useStore.getState().getHammerBonusClicks()).toBe(0);
  });

  it('getHammerBonusClicks returns correct bonusClicks when a hammer is in items.hammers', () => {
    const hammerIds = Object.keys(itemData.hammers);
    const testHammerId = hammerIds[0];
    const prevItems = useStore.getState().items;
    useStore.setState({
      items: {
        ...prevItems,
        hammers: [testHammerId],
      },
    });
    expect(useStore.getState().getHammerBonusClicks()).toBe(
      itemData.hammers[testHammerId].bonusClicks
    );
  });
});

describe('Totem Effects', () => {
  beforeEach(async () => {
    // make sure to await the clear, so initializeStore() really starts from scratch
    await AsyncStorage.clear();
    await useStore.getState().initializeStore();
  });

  it('getTotemEffects returns default effects when no totem is equipped', () => {
    const creature = { type: 'Dragon' };
    const effects = useStore.getState().getTotemEffects(creature);
    expect(effects).toEqual({
      clickBonus: 0,
      goldBonus: 0,
      growTimeMultiplier: 1,
    });
  });

  it('getTotemEffects returns the correct effects when a totem is equipped', () => {
    // Pick the very first key from itemData.totems (keys are lowercase)
    const totemId = Object.keys(itemData.totems)[0];
    const expectedEffects = itemData.totems[totemId].effects;

   // Find how many adult creatures are required for this totem
    const requirementCount = itemData.totems[totemId].requirements.count || 0;
    // Capitalize species (e.g. 'dragon'  'Dragon') because getTotemEffects lowercases it internally
    const capitalized = totemId.charAt(0).toUpperCase() + totemId.slice(1);

    // Build a dummy creatureInventory array with exactly requirementCount adult creatures
    const mockInventory = Array(requirementCount)
      .fill(null)
      .map((_, i) => ({
        id: i.toString(),
        type: capitalized,
        stage: 'adult',
      }));

    // Now update both items.totems and creatureInventory in the store
    useStore.setState({
      creatureInventory: mockInventory,
      items: {
        hammers: [],
        totems: [totemId],
        scrolls: [],
        potions: [],
      },
    });
    const creature = { type: capitalized };

    const effects = useStore.getState().getTotemEffects(creature);
    expect(effects).toEqual(expectedEffects);
  });
});

describe('getGoldMultiplier Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await useStore.getState().resetProgress(); // resets items, gold, hatchedEggs, etc.
  });

  it('returns 1 when no totems are equipped and 2 when a totem is equipped', () => {
    // No totems  multiplier should be 1
    expect(useStore.getState().getGoldMultiplier()).toBe(1);

    // Equip a totem and verify multiplier becomes 2
    const totemId = Object.keys(itemData.totems)[0];
    const prevItems = useStore.getState().items;
    useStore.setState({
      items: {
        ...prevItems,
        totems: [totemId],
      },
    });

    expect(useStore.getState().getGoldMultiplier()).toBe(2);
  });
});

describe('getScrollMultiplier edge cases', () => {
  it('returns number of owned creatures if type scroll is equipped', () => {
    const scrollId = 's1';
    itemData.scrolls = {
      dragon: [
        {
          id: scrollId,
          effects: { goldMultiplier: true },
        },
      ],
    };

    useStore.setState({
      creatureInventory: [
        { type: 'dragon', stage: 'adult' },
        { type: 'dragon', stage: 'adult' },
      ],
      items: {
        hammers: [],
        totems: [],
        scrolls: {
          dragon: [scrollId],
        },
        potions: [],
      },
    });

    const multiplier = useStore.getState().getScrollMultiplier('dragon');
    expect(multiplier).toBe(2);
  });

  it('getScrollMultiplier returns static multiplier for egg scroll', () => {
    const scrollId = 'eggScroll';
    itemData.scrolls = {
      egg: [{ id: scrollId, effects: { goldMultiplier: 3 } }],
    };

    useStore.setState({
      items: {
        scrolls: { egg: [scrollId] },
        hammers: [],
        totems: [],
        potions: [],
      },
      creatureInventory: [],
    });

    expect(useStore.getState().getScrollMultiplier('egg')).toBe(3);
  });
});



describe('incrementGold bonus logic', () => {
  it('applies totem and scroll bonuses correctly', async () => {
    const scrollId = 'testScroll';
    itemData.scrolls = {
      gold: [{ id: scrollId, effects: { goldBonus: 2, goldMultiplier: 2 } }],
      dragon: [{ id: 'd1', effects: { goldBonus: 1, goldMultiplier: 2 } }],
    };

    const creature = { type: 'Dragon', stage: 'adult' };

    useStore.setState({
      gold: 10,
      creatureInventory: [creature],
      items: {
        hammers: [],
        totems: ['dragon'],
        scrolls: {
          gold: [scrollId],
          dragon: ['d1'],
        },
        potions: [],
      },
    });

    await useStore.getState().incrementGold(creature);

    const newGold = useStore.getState().gold;
    expect(newGold).toBeGreaterThan(10);
  });
});



describe('getEquippedHammer Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await useStore.getState().resetProgress();
  });

  it('returns null when no hammers are equipped', () => {
    expect(useStore.getState().getEquippedHammer()).toBeNull();
  });

  it('returns the hammer ID with the highest bonusClicks when multiple are equipped', () => {
    const hammerIds = Object.keys(itemData.hammers);
    if (hammerIds.length < 2) {
      // If there aren’t at least two hammers in itemData, this test isn’t meaningful
      expect(hammerIds.length).toBeGreaterThan(1);
      return;
    }

    const [idA, idB] = hammerIds;
    const bonusA = itemData.hammers[idA].bonusClicks;
    const bonusB = itemData.hammers[idB].bonusClicks;
    const expected = bonusA >= bonusB ? idA : idB;

    // Equip both hammers
    const prevItems = useStore.getState().items;
    useStore.setState({
      items: {
        ...prevItems,
        hammers: [idA, idB],
      },
    });

    expect(useStore.getState().getEquippedHammer()).toBe(expected);
  });
});

describe('getTotemEffects Tests', () => {
  beforeEach(() => {
    // reset everything
    useStore.setState({
      items: { hammers: [], totems: [], scrolls: [], potions: [] },
      creatureInventory: [],
    });
  })

  it('returns default effects when no totem is equipped', () => {
    expect(useStore.getState().getTotemEffects({ type: 'Dragon' }))
      .toEqual({ clickBonus: 0, goldBonus: 0, growTimeMultiplier: 1 })
  });

  it('returns the real effects when Dragon totem is equipped and requirements are met', () => {
    const totemId = 'dragon'
    // seed the totem
    useStore.setState({
      items: { hammers: [], totems: [totemId], scrolls: [], potions: [] },
    });
    // seed enough adult Dragons
    const required = itemData.totems[totemId].requirements.count
    const adults = Array.from({ length: required }, () => ({
      type: 'Dragon',
      stage: 'adult',
    }));
    useStore.setState({ creatureInventory: adults })

    // now verify
    const expected = itemData.totems[totemId].effects
    const result   = useStore.getState().getTotemEffects({ type: 'Dragon' })
    expect(result).toEqual(expected)
  });
});

describe('getScrollEffect default behavior', () => {
  it('returns 0 when no scroll is equipped', () => {
    expect(useStore.getState().getScrollEffect('gold')).toBe(0);
  });
});

describe('getEggBoost default behavior', () => {
  it('returns 0 when no scroll is equipped', () => {
    useStore.setState({
      items: { hammers: [], totems: [], scrolls: {}, potions: [] },
    });
    expect(useStore.getState().getEggBoost()).toBe(0);
  });
});

describe('getEggBoost and getScrollEffect edge cases', () => {
  it('getEggBoost returns 0 when no scroll is equipped', () => {
    useStore.setState({
      items: { scrolls: {}, hammers: [], totems: [], potions: [] },
    });
    expect(useStore.getState().getEggBoost()).toBe(0);
  });

  it('getScrollEffect returns 0 when no scroll is equipped', () => {
    expect(useStore.getState().getScrollEffect('gold')).toBe(0);
  });

  it('getScrollEffect returns goldBonus if equipped', () => {
    const scrollId = 'goldScroll';
    itemData.scrolls = {
      gold: [{ id: scrollId, effects: { goldBonus: 5 } }],
    };

    useStore.setState({
      items: {
        scrolls: { gold: [scrollId] },
        hammers: [],
        totems: [],
        potions: [],
      },
    });

    expect(useStore.getState().getScrollEffect('gold')).toBe(5);
  });
});

describe('purchaseItem Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await useStore.getState().initializeStore();
  });

  it('buys a hammer when you have enough gold and persists both items and gold', async () => {
    // Pick a real hammer from itemData
    const hammerId = Object.keys(itemData.hammers)[0];
    const hammerCost = itemData.hammers[hammerId].cost;

    // Seed the store so you have more gold than the cost
    useStore.setState({
      gold: hammerCost + 10,
      items: { hammers: [], totems: [], scrolls: {}, potions: [] },
    });

    // Perform the purchase
    await useStore.getState().purchaseItem('hammers', hammerId);

    const state = useStore.getState();
    // In‐memory state should now include the hammer
    expect(state.items.hammers).toContain(hammerId);
    // Gold should have been reduced by exactly hammerCost
    expect(state.gold).toBe(hammerCost + 10 - hammerCost);

    // AsyncStorage should have been updated
    const storedItems = JSON.parse(await AsyncStorage.getItem('items'));
    expect(storedItems.hammers).toContain(hammerId);

    const storedGold = await AsyncStorage.getItem('gold');
    expect(storedGold).toBe((hammerCost + 10 - hammerCost).toString());
  });
});

describe('purchaseItem edge cases', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('does not purchase an item if already owned', async () => {
    const hammerId = 'wooden'; // choose a valid hammer ID from itemData
    const category = 'hammers';

    // Seed item into the store
    useStore.setState({
      items: {
        hammers: [hammerId],
        totems: [],
        scrolls: {},
        potions: [],
      },
      gold: 100,
    });

    // Spy on console.warn to verify it's called
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Attempt to purchase again
    await useStore.getState().purchaseItem(category, hammerId);

    // Ensure the warning was issued
    expect(warnSpy).toHaveBeenCalledWith(`Already own item: ${category}, ${hammerId}, null`);

    // Ensure item wasn't duplicated
    const state = useStore.getState();
    expect(state.items.hammers.filter(id => id === hammerId).length).toBe(1);
  });
});

describe('purchaseItem warnings', () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    jest.clearAllMocks();
  });

  it("logs 'Item doesn't exist' if item is falsy", () => {
    jest.spyOn(helpers, 'getItem').mockReturnValue(undefined); // item not found

    const purchase = useStore.getState().purchaseItem;

    purchase('category', 'id', null);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Item not found"));
  });

  it("logs 'Not enough money' if item exists but other condition fails", () => {
    jest.spyOn(helpers, 'getItem').mockReturnValue({ id: 'id', cost: 100 }); // item found

    // Seed store so gold is less than item cost (simulate insufficient money)
    useStore.setState({ gold: 50 });

    const purchase = useStore.getState().purchaseItem;

    purchase('category', 'id', null);

    expect(warnSpy).toHaveBeenCalledWith("Not enough money");
  });
});

describe('Auto-Clicker Functions', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
  });

  afterEach(() => {
    // Clean up
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('startPotionOneAutoClicker schedules an interval and stores its ID', () => {
    // Ensure the field is empty
    useStore.setState({ potionOneAutoClicker: null });

    // Kick off the auto-clicker
    useStore.getState().startPotionOneAutoClicker(123);

    // State should now hold a numeric timer ID
    const id1 = useStore.getState().potionOneAutoClicker;
    expect(['number','object']).toContain(typeof id1);

    // And Jest should have one timer scheduled
    expect(jest.getTimerCount()).toBe(1);
  });

  it('startPotionTwoAutoClicker schedules an interval and stores its ID', () => {
    useStore.setState({ potionTwoAutoClicker: null });
    useStore.getState().startPotionTwoAutoClicker(456);

    const id2 = useStore.getState().potionTwoAutoClicker;
    expect(['number','object']).toContain(typeof id2);
    expect(jest.getTimerCount()).toBe(1);
  });
});

it('should save and load items from AsyncStorage', async () => {
  const initialItems = useStore.getState().items;
  // write to AsyncStorage
  await useStore.getState().savedItems(initialItems);
  const raw = await AsyncStorage.getItem('items');
  expect(JSON.parse(raw)).toEqual(initialItems);

  // reset in-memory items and reload
  useStore.setState({ items: { hammers: [], totems: [], scrolls: [], potions: [] } });
  await useStore.getState().loadItems();
  expect(useStore.getState().items).toEqual(initialItems);
});


describe('growBabiesToAdults Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStore.setState({
      creatureInventory: [],
      items: { hammers: [], totems: [], scrolls: [], potions: [] },
    });
  });

  it('should grow baby to adult if enough time has passed', () => {
    const now = Date.now();
    const baby = {
      id: '1',
      name: 'Red',
      type: 'Dragon',
      stage: 'baby',
      hatchedAt: now - 120000, // over 60s
      image: 'baby.png',
    };

    useStore.setState({ creatureInventory: [baby] });

    useStore.getState().growBabiesToAdults();

    const updated = useStore.getState().creatureInventory[0];
    expect(updated.stage).toBe('adult');
    expect(Toast.show).toHaveBeenCalled();
  });

  it('returns the original creature if it has not grown yet', () => {
    const now = Date.now();
    
    const babyNotReady = {
      id: '2',
      name: 'Blue',
      type: 'Dragon',
      stage: 'baby',
      hatchedAt: now - 30000, // Less than default 60s growthTimeMs
      image: 'baby.png',
    };

    // Setup Zustand state with one baby not ready to grow
    useStore.setState({
      creatureInventory: [babyNotReady],
      items: { hammers: [], totems: [], scrolls: [], potions: [] },
    });

    // Spy on saveInventory so we can check it was called with expected updated array
    const saveInventorySpy = jest.spyOn(useStore.getState(), 'saveInventory').mockImplementation(() => {});

    // Call the function under test
    useStore.getState().growBabiesToAdults();

    // Get updated state
    const updatedInventory = useStore.getState().creatureInventory;

    // The creature should be unchanged (stage still 'baby')
    expect(updatedInventory[0]).toEqual(babyNotReady);

    // saveInventory should be called with array containing original creature (not replaced)
    expect(saveInventorySpy).toHaveBeenCalledWith([babyNotReady]);

    saveInventorySpy.mockRestore();
  });
});
