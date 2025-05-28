import useStore from '../store/useStore';
import { createEgg } from '../utils/createEgg';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Zustand Store Cases
describe('Zustand Store Tests', () => {
  beforeEach(async () => {
    // Clears Async Storage and resets Zustand before every test to be able to test each individually
    AsyncStorage.clear();
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
    AsyncStorage.clear();
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
    AsyncStorage.clear();
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
});

describe('resetProgress Tests', () => {
  beforeEach(async () => {
    // Clear AsyncStorage and initialize Zustand store before each test
    AsyncStorage.clear();
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
