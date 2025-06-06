// store.test.js

import useStore from '../store/useStore';
import { createEgg } from '../utils/createEgg';
import creatureData from '../utils/creatureData';
import itemData from '../utils/itemData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// -----------------------------------------------------------------------------
// Mock Toast.show so it doesn’t actually render anything
// -----------------------------------------------------------------------------
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

// -----------------------------------------------------------------------------
// “Initialization” / “Persistence” tests (unchanged from before)
// -----------------------------------------------------------------------------
describe('Zustand Store Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await useStore.getState().initializeStore();
  });

  it('should initialize egg correctly when no saved egg exists', async () => {
    const expectedEgg = createEgg([]);
    expect(useStore.getState().egg).toEqual(expectedEgg);
  });

  it('should initialize hatched eggs correctly', () => {
    expect(useStore.getState().hatchedEggs).toEqual([]);
  });

  it('should handle egg data loading from AsyncStorage', async () => {
    const eggData = {
      color: 'Red',
      type: 'dragon',
      rarity: 1,
      clicksNeeded: 60,
      progress: 0,
      boosts: 0,
      img: '',
    };

    await AsyncStorage.setItem('egg', JSON.stringify(eggData));
    await useStore.getState().initializeStore();
    expect(useStore.getState().egg).toEqual(eggData);
  });
});

describe('Persistence Methods', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await useStore.getState().initializeStore();
  });

  it('should save currency to AsyncStorage', async () => {
    const currency = 42;
    await useStore.getState().saveCurrency(currency);
    const stored = await AsyncStorage.getItem('currency');
    expect(stored).toBe(currency.toString());
  });

  it('should save hatched eggs to AsyncStorage', async () => {
    const eggs = [{ color: 'Blue', type: 'dragon' }];
    await useStore.getState().saveHatchedEggs(eggs);
    const stored = await AsyncStorage.getItem('hatchedEggs');
    expect(stored).toBe(JSON.stringify(eggs));
  });

  it('should save current egg to AsyncStorage', async () => {
    const egg = createEgg([]);
    await useStore.getState().saveCurrentEgg(egg);
    const stored = await AsyncStorage.getItem('egg');
    expect(stored).toBe(JSON.stringify(egg));
  });

  it('should increment currency and persist it', async () => {
    const state = useStore.getState();
    const initial = state.currency;

    await state.incrementCurrency();
    const newVal = initial + 1;

    expect(useStore.getState().currency).toBe(newVal);
    const stored = await AsyncStorage.getItem('currency');
    expect(stored).toBe(newVal.toString());
  });

  it('should increment gold and persist it', async () => {
    const state = useStore.getState();
    const initial = state.gold;

    // stub out scroll/totem so it doesn’t introduce extra branches here:
    jest.spyOn(state, 'getScrollEffect').mockReturnValue(0);
    jest.spyOn(state, 'getTotemEffects').mockReturnValue({ goldBonus: 0 });

    await state.incrementGold({ type: 'dragon', stage: 'adult' });
    const newVal = useStore.getState().gold;

    expect(newVal).toBeGreaterThan(initial);
    const stored = await AsyncStorage.getItem('gold');
    expect(stored).toBe(JSON.stringify(newVal));

    state.getScrollEffect.mockRestore();
    state.getTotemEffects.mockRestore();
  });

  it('should save gold explicitly', async () => {
    const gold = 5;
    await useStore.getState().saveGold(gold);
    const stored = await AsyncStorage.getItem('gold');
    expect(stored).toBe(JSON.stringify(gold));
  });

  it('should load inventory from AsyncStorage and update store state', async () => {
    const mockInventory = [
      { id: '1', name: 'Red', type: 'dragon', image: 'red.png', stage: 'baby' },
      { id: '2', name: 'Blue', type: 'wyvern', image: 'blue.png', stage: 'adult' },
    ];

    await AsyncStorage.setItem('creatureInventory', JSON.stringify(mockInventory));
    useStore.setState({ creatureInventory: [] });

    await useStore.getState().loadInventory();
    expect(useStore.getState().creatureInventory).toEqual(mockInventory);
  });

  it('should load currency from AsyncStorage and set state correctly', async () => {
    const mockCurrency = '42';
    await AsyncStorage.setItem('currency', mockCurrency);
    useStore.setState({ currency: 0 });

    await useStore.getState().loadCurrency();
    expect(useStore.getState().currency).toBe(42);
  });

  it('should load hatchedEggs from AsyncStorage and set state correctly', async () => {
    const mockHatchedEggs = ['Red', 'Blue'];
    await AsyncStorage.setItem('hatchedEggs', JSON.stringify(mockHatchedEggs));
    useStore.setState({ hatchedEggs: [] });

    await useStore.getState().loadHatchedEggs();
    expect(useStore.getState().hatchedEggs).toEqual(mockHatchedEggs);
  });

  it('should save inventory to AsyncStorage', async () => {
    const mockInventory = [{ id: '1', name: 'Dragon' }];
    useStore.setState({ creatureInventory: [] });

    await useStore.getState().saveInventory(mockInventory);
    const storedInventory = await AsyncStorage.getItem('creatureInventory');
    expect(storedInventory).toBe(JSON.stringify(mockInventory));
  });

  it('should add a creature to inventory and save it', async () => {
    const mockCreature = { id: '1', name: 'Dragon', type: 'fire' };
    const initialInventory = [{ id: '2', name: 'Wyvern', type: 'air' }];

    useStore.setState({ creatureInventory: initialInventory });

    await useStore.getState().addCreatureToInventory(mockCreature);
    const updatedInventory = useStore.getState().creatureInventory;

    expect(updatedInventory).toEqual([...initialInventory, mockCreature]);

    const storedInventory = await AsyncStorage.getItem('creatureInventory');
    expect(storedInventory).toBe(JSON.stringify(updatedInventory));
  });
});

describe('incrementEggProgress Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await useStore.getState().initializeStore();

    // ────────────────────────────────────────────────────────────────────────────
    // STUB getEggBoost, getHammerBonusClicks, and getTotemEffects ON STATE
    // so that incrementEggProgress never sees “undefined” for clickBonus, etc.
    // ────────────────────────────────────────────────────────────────────────────
    useStore.setState({
      getEggBoost: () => 0,
      getHammerBonusClicks: () => 0, 
      getTotemEffects: () => ({
        clickBonus: 0,
        goldBonus: 0,
        growTimeMultiplier: 1,
      }),
    });
    // ────────────────────────────────────────────────────────────────────────────
  });

  it('should hatch the egg when progress reaches the threshold', async () => {
    // We choose clicksNeeded=5 and progress=4, so the very next call to
    // incrementEggProgress() will trigger the “hatch” branch
    const initialEgg = {
      color: 'Red',
      type: 'dragon',
      rarity: 1,
      clicksNeeded: 5,
      progress: 4,
      boosts: 0,
      img: '',
    };

    useStore.setState({ egg: initialEgg, hatchedEggs: [] });
    await useStore.getState().incrementEggProgress();

    const newState = useStore.getState();
    expect(newState.hatchedEggs).toEqual(['Red']);
    expect(newState.creatureInventory.length).toBe(1);
    expect(newState.creatureInventory[0].name).toBe('Red');
    expect(newState.egg.progress).toBe(0);
  });
});

describe('resetProgress Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await useStore.getState().initializeStore();
  });

  it('should reset egg progress and hatched eggs state correctly', async () => {
    useStore.setState({ egg: { progress: 10 }, hatchedEggs: ['Red'] });
    await useStore.getState().resetProgress();

    expect(useStore.getState().egg.progress).toBe(0);
    expect(useStore.getState().hatchedEggs).toEqual([]);
  });
});

describe('Additional Branch Coverage Tests (Scrolls)', () => {
  it('getEquippedScroll, getScrollEffect, and getScrollMultiplier behave correctly when egg or gold scroll is equipped', () => {
    const { scrolls } = itemData;

    // ── EGG SCROLL ─────────────────────────────────────────────────────────────
    const eggScrollId = Object.keys(scrolls.egg)[0];
    useStore.setState({
      items: {
        hammers: [],
        totems: [],
        scrolls: { egg: [eggScrollId] },
        potions: [],
      },
      creatureInventory: [],
    });

    // Instead of assuming 0/1, compute exactly what itemData says for this scroll:
    const eggEffects      = itemData.scrolls.egg[eggScrollId].effects;
    const expectedEggBonus = eggEffects.goldBonus ?? 0;
    const expectedEggMult  = eggEffects.goldMultiplier ?? 1;

    expect(useStore.getState().getEquippedScroll('egg')).toBe(eggScrollId);
    expect(useStore.getState().getScrollEffect('egg')).toBe(expectedEggBonus);
    expect(useStore.getState().getScrollMultiplier('egg')).toBe(expectedEggMult);
 

    // ── GOLD SCROLL ────────────────────────────────────────────────────────────
    const goldScrollId = Object.keys(scrolls.gold)[0];
    useStore.setState({
      items: {
        hammers: [],
        totems: [],
        scrolls: { gold: [goldScrollId] },
        potions: [],
      },
      creatureInventory: [],
    });

    // Likewise, compute from itemData so we stay in sync:
    const goldEffects       = itemData.scrolls.gold[goldScrollId].effects;
    const expectedGoldBonus = goldEffects.goldBonus ?? 0;
    const expectedGoldMult  = goldEffects.goldMultiplier ?? 1;

    expect(useStore.getState().getEquippedScroll('gold')).toBe(goldScrollId);
    expect(useStore.getState().getScrollEffect('gold')).toBe(expectedGoldBonus);
    expect(useStore.getState().getScrollMultiplier('gold')).toBe(expectedGoldMult);
   });
    
  });

  it('getScrollMultiplier returns ownedCount when a non-egg/gold scroll is equipped', () => {
    const dragonScrollId = Object.keys(itemData.scrolls.dragon)[0];
    useStore.setState({
      items: {
        hammers: [],
        totems: [],
        scrolls: { dragon: [dragonScrollId] },
        potions: [],
      },
      creatureInventory: [
        { type: 'dragon', stage: 'adult' },
        { type: 'dragon', stage: 'adult' },
        { type: 'dragon', stage: 'baby' },
      ],
    });

    expect(useStore.getState().getEquippedScroll('dragon')).toBe(dragonScrollId);
    expect(useStore.getState().getScrollMultiplier('dragon')).toBe(1);
});

describe('Currency and Gold Persistence Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useStore.setState({ currency: 999, gold: 888 });
  });

  it('saveCurrency writes to AsyncStorage, and loadCurrency reads it (including default branch)', async () => {
    // (A) save an arbitrary currency number:
    await useStore.getState().saveCurrency(123);
    useStore.setState({ currency: 0 });
    expect(useStore.getState().currency).toBe(0);

    await useStore.getState().loadCurrency();
    expect(useStore.getState().currency).toBe(123);

    // (B) default branch when no "currency" key is stored:
    await AsyncStorage.removeItem('currency');
    useStore.setState({ currency: 555 });
    await useStore.getState().loadCurrency();
    expect(useStore.getState().currency).toBe(0);
  });

  it('saveGold writes to AsyncStorage, and loadGold reads it', async () => {
    // (A) save a gold number
    await useStore.getState().saveGold(777);
    useStore.setState({ gold: 0 });
    expect(useStore.getState().gold).toBe(0);

    await useStore.getState().loadGold();
    expect(useStore.getState().gold).toBe(777);

    // (B) default branch: if no "gold" key exists, loadGold should leave gold unchanged
    await AsyncStorage.removeItem('gold');
    useStore.setState({ gold: 999 });
    await useStore.getState().loadGold();
    expect(useStore.getState().gold).toBe(999);
  });
});

describe('Egg Persistence Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useStore.setState({
      hatchedEggs: ['foo', 'bar'],
      egg: { color: 'dummy', progress: 42, clicksNeeded: 100, img: 'xyz' },
    });
  });

  it('saveHatchedEggs and loadHatchedEggs persist and retrieve correctly', async () => {
    const sampleHatched = ['dragon', 'wyvern', 'drake'];
    await useStore.getState().saveHatchedEggs(sampleHatched);

    useStore.setState({ hatchedEggs: [] });
    expect(useStore.getState().hatchedEggs).toEqual([]);

    await useStore.getState().loadHatchedEggs();
    expect(useStore.getState().hatchedEggs).toEqual(sampleHatched);

    await AsyncStorage.removeItem('hatchedEggs');
    useStore.setState({ hatchedEggs: ['not-zero'] });
    await useStore.getState().loadHatchedEggs();
    expect(useStore.getState().hatchedEggs).toEqual([]);
  });

  it('saveCurrentEgg and loadCurrentEgg persist and retrieve correctly', async () => {
    const customEgg = { color: 'testColor', progress: 5, clicksNeeded: 10, img: 'someImage' };
    await useStore.getState().saveCurrentEgg(customEgg);

    useStore.setState({ egg: { color: 'abc', progress: 99, clicksNeeded: 99, img: 'wrong' } });
    expect(useStore.getState().egg.color).toBe('abc');

    await useStore.getState().loadCurrentEgg();
    expect(useStore.getState().egg).toEqual(customEgg);

    await AsyncStorage.removeItem('egg');
    useStore.setState({ egg: { color: 'xyz', progress: 999, clicksNeeded: 999, img: 'wrong' } });
    await useStore.getState().loadCurrentEgg();

    const expectedDefaultEgg = createEgg([]);
    expect(useStore.getState().egg).toEqual(expectedDefaultEgg);
  });
});

describe('incrementEggProgress: Stage Transitions & Hatch Branch', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    const eggColor = Object.keys(creatureData)[0];
    const baseEgg = {
      color: eggColor,
      progress: 0,
      clicksNeeded: 3,
      img: creatureData[eggColor].egg.images[0],
      type: eggColor,
      rarity: creatureData[eggColor].rarity,
      boosts: 0,
    };

    // Ensure we always stub out getEggBoost, getHammerBonusClicks, and getTotemEffects:
    useStore.setState({
      egg: { ...baseEgg },
      hatchedEggs: [],
      creatureInventory: [],
      items: { hammers: [], totems: [], scrolls: {}, potions: [] },
      getEggBoost: () => 0,
      getHammerBonusClicks: () => 0,
      getTotemEffects: () => ({ clickBonus: 0, goldBonus: 0, growTimeMultiplier: 1 }),
    });
  });

  it('first click (progress=1) yields stage 1, second click (progress=2) yields stage 2, but does not yet hatch', async () => {
    const eggColor = Object.keys(creatureData)[0];

    await useStore.getState().incrementEggProgress();
    expect(useStore.getState().egg.img).toBe(creatureData[eggColor].egg.images[1]);
    expect(useStore.getState().hatchedEggs).toEqual([]);

    await useStore.getState().incrementEggProgress();
    expect(useStore.getState().egg.img).toBe(creatureData[eggColor].egg.images[2]);
    expect(useStore.getState().hatchedEggs).toEqual([]);
  });

  it('third click (progress=3) meets clicksNeeded, so egg hatches: hatchedEggs updated and egg resets', async () => {
    const eggColor = Object.keys(creatureData)[0];
    useStore.setState((state) => ({
      egg: { ...state.egg, progress: 2 },
    }));

    expect(useStore.getState().hatchedEggs).toEqual([]);

    const spySaveHat = jest.spyOn(useStore.getState(), 'saveHatchedEggs');

    await useStore.getState().incrementEggProgress();

    const newHatchedArr = useStore.getState().hatchedEggs;
    expect(newHatchedArr).toContain(eggColor);
    expect(spySaveHat).toHaveBeenCalled();

    const reEgg = useStore.getState().egg;
    expect(reEgg.progress).toBe(0);
    expect(reEgg.img).toBe(creatureData[eggColor].egg.images[0]);

    spySaveHat.mockRestore();
  });
});

describe('incrementGold Branch Coverage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useStore.setState({
      gold: 0,
      creatureInventory: [],
      items: { hammers: [], totems: [], scrolls: {}, potions: [] },
    });
  });

  it('baseline incrementGold without totem/scroll yields +1 gold and persists', async () => {
    const dummyType = Object.keys(creatureData)[0];
    const creature = { type: dummyType, stage: 'adult' };

    const spySaveG = jest.spyOn(useStore.getState(), 'saveGold');
    // stub getScrollEffect and getTotemEffects
    jest.spyOn(useStore.getState(), 'getScrollEffect').mockReturnValue(0);
    jest.spyOn(useStore.getState(), 'getTotemEffects').mockReturnValue({ goldBonus: 0 });
    jest.spyOn(useStore.getState(), 'getScrollMultiplier').mockReturnValue(1);

    await useStore.getState().incrementGold(creature);
    expect(useStore.getState().gold).toBe(1);
    expect(spySaveG).toHaveBeenCalledWith(1);

    spySaveG.mockRestore();
    useStore.getState().getScrollEffect.mockRestore();
    useStore.getState().getTotemEffects.mockRestore();
    useStore.getState().getScrollMultiplier.mockRestore();
  });

  it('with a totem applied to an adult creature, incrementGold includes that goldBonus', async () => {
    const totemIds = Object.keys(itemData.totems);
    const totemId = totemIds[0];
    const goldBonusVal = itemData.totems[totemId].effects.goldBonus || 0;

    useStore.setState({
      items: { hammers: [], totems: [totemId], scrolls: {}, potions: [] },
      creatureInventory: [{ type: totemId, stage: 'adult' }],
      gold: 0,
    });

    const creature = { type: totemId, stage: 'adult' };
    const spySaveG = jest.spyOn(useStore.getState(), 'saveGold');
    jest.spyOn(useStore.getState(), 'getScrollEffect').mockReturnValue(0);
    jest.spyOn(useStore.getState(), 'getScrollMultiplier').mockReturnValue(1);

    await useStore.getState().incrementGold(creature);

    expect(useStore.getState().gold).toBe(1 + goldBonusVal);
    expect(spySaveG).toHaveBeenCalledWith(1 + goldBonusVal);

    spySaveG.mockRestore();
    useStore.getState().getScrollEffect.mockRestore();
    useStore.getState().getScrollMultiplier.mockRestore();
  });

  it('with a “gold” scroll equipped that has an effects.goldBonus, incrementGold includes scroll‐bonus', async () => {
    const goldScrollIds = Object.keys(itemData.scrolls.gold);
    const goldScrollId = goldScrollIds[0];
    const scrollEffect = itemData.scrolls.gold[goldScrollId].effects.goldBonus;

    useStore.setState({
      items: { hammers: [], totems: [], scrolls: { gold: [goldScrollId] }, potions: [] },
      creatureInventory: [{ type: Object.keys(creatureData)[0], stage: 'adult' }],
      gold: 0,
    });

    const creature = useStore.getState().creatureInventory[0];
    const spySaveG3 = jest.spyOn(useStore.getState(), 'saveGold');
    jest.spyOn(useStore.getState(), 'getTotemEffects').mockReturnValue({ goldBonus: 0 });
    jest.spyOn(useStore.getState(), 'getScrollMultiplier').mockReturnValue(1);

    await useStore.getState().incrementGold(creature);

    expect(useStore.getState().gold).toBe(1 + scrollEffect);
    expect(spySaveG3).toHaveBeenCalledWith(1 + scrollEffect);

    spySaveG3.mockRestore();
    useStore.getState().getTotemEffects.mockRestore();
    useStore.getState().getScrollMultiplier.mockRestore();
  });
});

describe('Inventory Persistence & Mutation Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useStore.setState({ creatureInventory: [] });
  });

  it('saveInventory writes array to AsyncStorage, loadInventory reads it, and addCreatureToInventory appends + persists', async () => {
    const sampleInv = [
      { id: 'A', name: 'Test1', type: 'dragon', image: 'img1', stage: 'adult', hatchedAt: Date.now() },
    ];

    await useStore.getState().saveInventory(sampleInv);
    useStore.setState({ creatureInventory: [] });
    expect(useStore.getState().creatureInventory).toEqual([]);

    await useStore.getState().loadInventory();
    expect(useStore.getState().creatureInventory).toEqual(sampleInv);

    const newCreature = { id: 'B', name: 'Test2', type: 'wyvern', image: 'img2', stage: 'baby', hatchedAt: Date.now() };
    await useStore.getState().addCreatureToInventory(newCreature);

    expect(useStore.getState().creatureInventory).toEqual([...sampleInv, newCreature]);
    const raw = await AsyncStorage.getItem('creatureInventory');
    expect(JSON.parse(raw)).toEqual([...sampleInv, newCreature]);
  });

  it('loadInventory default branch: with no key, creatureInventory becomes []', async () => {
    useStore.setState({ creatureInventory: [{ id: 'Z' }] });
    await AsyncStorage.removeItem('creatureInventory');
    await useStore.getState().loadInventory();
    expect(useStore.getState().creatureInventory).toEqual([]);
  });
});

describe('loadItems Default Branch', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useStore.setState({
      items: { hammers: [], totems: [], scrolls: {}, potions: [] },
    });
  });

  it('loadItems default branch when no "items" key exists → leaves items untouched', async () => {
    await AsyncStorage.removeItem('items');
    useStore.setState({
      items: { hammers: ['x'], totems: ['y'], scrolls: { egg: ['a'] }, potions: ['p'] },
    });

    await useStore.getState().loadItems();
    expect(useStore.getState().items).toEqual({
      hammers: ['x'],
      totems: ['y'],
      scrolls: { egg: ['a'] },
      potions: ['p'],
    });
  });

  it('loadItems loads saved items when key exists', async () => {
    const saved = {
      hammers: ['h1'],
      totems: ['t1'],
      scrolls: { gold: ['s1'] },
      potions: ['p1'],
    };
    await AsyncStorage.setItem('items', JSON.stringify(saved));

    useStore.setState({ items: { hammers: [], totems: [], scrolls: {}, potions: [] } });
    await useStore.getState().loadItems();
    expect(useStore.getState().items).toEqual(saved);
  });
});

describe('Utility Methods Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await useStore.getState().initializeStore();
  });

  it('startPotionOneAutoClicker sets potionOneAutoClicker interval ID', () => {
    jest.useFakeTimers();
    const state = useStore.getState();
    state.startPotionOneAutoClicker(100);
    expect(typeof state.potionOneAutoClicker).toBe('number');
    clearInterval(state.potionOneAutoClicker);
    jest.useRealTimers();
  });

  it('startPotionTwoAutoClicker sets potionTwoAutoClicker interval ID', () => {
    jest.useFakeTimers();
    const state = useStore.getState();
    state.startPotionTwoAutoClicker(100);
    expect(typeof state.potionTwoAutoClicker).toBe('number');
    clearInterval(state.potionTwoAutoClicker);
    jest.useRealTimers();
  });

  it('getEquippedHammer returns null when no hammers in state', () => {
    useStore.setState({ items: { hammers: [], totems: [], scrolls: {}, potions: [] } });
    expect(useStore.getState().getEquippedHammer()).toBeNull();
  });

  it('getEquippedHammer picks hammer with highest bonusClicks', () => {
    const hammerIds = Object.keys(itemData.hammers);
    const id1 = hammerIds[0];
    const id2 = hammerIds.length > 1 ? hammerIds[1] : id1;
    const bonus1 = itemData.hammers[id1].bonusClicks || 0;
    const bonus2 = itemData.hammers[id2].bonusClicks || 0;
    const expected = bonus1 >= bonus2 ? id1 : id2;

    useStore.setState({ items: { hammers: [id1, id2], totems: [], scrolls: {}, potions: [] } });
    expect(useStore.getState().getEquippedHammer()).toBe(expected);
  });

  it('getEquippedScrolls returns correct mapping for all types', () => {
    const dragonScrollId = Object.keys(itemData.scrolls.dragon)[0];
    const wyvernScrollId = Object.keys(itemData.scrolls.wyvern)[0];
    const drakeScrollId = Object.keys(itemData.scrolls.drake)[0];
    const eggScrollId = Object.keys(itemData.scrolls.egg)[0];
    const goldScrollId = Object.keys(itemData.scrolls.gold)[0];

    useStore.setState({
      items: {
        hammers: [],
        totems: [],
        scrolls: {
          dragon: [dragonScrollId],
          wyvern: [wyvernScrollId],
          drake: [drakeScrollId],
          egg: [eggScrollId],
          gold: [goldScrollId],
        },
        potions: [],
      },
    });

    const equipped = useStore.getState().getEquippedScrolls();
    expect(equipped).toEqual({
      dragon: dragonScrollId,
      wyvern: wyvernScrollId,
      drake: drakeScrollId,
      egg: eggScrollId,
      gold: goldScrollId,
    });
  });

  it('getHammerBonusClicks returns 0 when no hammer equipped', () => {
    useStore.setState({ items: { hammers: [], totems: [], scrolls: {}, potions: [] } });
    expect(useStore.getState().getHammerBonusClicks()).toBe(0);
  });

  it('getHammerBonusClicks returns correct bonusClicks when hammer equipped', () => {
    const hammerIds = Object.keys(itemData.hammers);
    const id = hammerIds[0];
    const bonus = itemData.hammers[id].bonusClicks || 0;
    useStore.setState({ items: { hammers: [id], totems: [], scrolls: {}, potions: [] } });
    expect(useStore.getState().getHammerBonusClicks()).toBe(bonus);
  });

  it('getTotemEffects returns default when no target or target.type missing', () => {
    expect(useStore.getState().getTotemEffects(null)).toEqual({
      clickBonus: 0,
      goldBonus: 0,
      growTimeMultiplier: 1,
    });
    expect(useStore.getState().getTotemEffects({})).toEqual({
      clickBonus: 0,
      goldBonus: 0,
      growTimeMultiplier: 1,
    });
  });

  it('getTotemEffects returns default when totem not in state', () => {
    const fakeCreature = { type: 'unknown', stage: 'adult' };
    useStore.setState({ items: { hammers: [], totems: [], scrolls: {}, potions: [] } });
    expect(useStore.getState().getTotemEffects(fakeCreature)).toEqual({
      clickBonus: 0,
      goldBonus: 0,
      growTimeMultiplier: 1,
    });
  });

  it('getTotemEffects returns actual totem effects when totem is owned', () => {
    const totemIds = Object.keys(itemData.totems);
    const totemId = totemIds[0];
    const expectedEffects = itemData.totems[totemId].effects;
    useStore.setState({
      items: { hammers: [], totems: [totemId], scrolls: {}, potions: [] },
    });
    const creature = { type: totemId, stage: 'adult' };
    expect(useStore.getState().getTotemEffects(creature)).toEqual(expectedEffects);
  });

  it('savedItems stores items object in AsyncStorage', async () => {
    const saved = { hammers: ['h1'], totems: ['t1'], scrolls: {}, potions: [] };
    await useStore.getState().savedItems(saved);
    const stored = await AsyncStorage.getItem('items');
    expect(stored).toBe(JSON.stringify(saved));
  });

  describe('purchaseItem Tests', () => {
    beforeEach(async () => {
      await AsyncStorage.clear();
      useStore.setState({
        gold: 1000,
        items: { hammers: [], totems: [], scrolls: {}, potions: [] },
      });
    });

    it('does nothing and warns if item already owned', async () => {
      const hammerIds = Object.keys(itemData.hammers);
      const id = hammerIds[0];
      useStore.setState({ items: { hammers: [id], totems: [], scrolls: {}, potions: [] } });

      const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      await useStore.getState().purchaseItem('hammers', id);

      expect(spyWarn).toHaveBeenCalledWith(`Already own item: hammers, ${id}, null`);
      spyWarn.mockRestore();
    });

    it('does nothing and warns if item not found', async () => {
      const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      await useStore.getState().purchaseItem('hammers', 'nonexistent');

      expect(spyWarn).toHaveBeenCalledWith(`Item not found: hammers, nonexistent, null`);
      spyWarn.mockRestore();
    });

    it('does nothing and warns if not enough money', async () => {
      // Pick an item that definitely costs more than our gold
      const hammerIds = Object.keys(itemData.hammers);
      const id = hammerIds[0];
      const cost = itemData.hammers[id].cost || 0;
      useStore.setState({ gold: cost - 1 });

      const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      await useStore.getState().purchaseItem('hammers', id);

      expect(spyWarn).toHaveBeenCalledWith('Not enough money');
      spyWarn.mockRestore();
    });

    it('subtracts cost and adds item when purchase is successful', async () => {
      const hammerIds = Object.keys(itemData.hammers);
      const id = hammerIds[0];
      const cost = itemData.hammers[id].cost || 0;

      useStore.setState({
        gold: cost + 10,
        items: { hammers: [], totems: [], scrolls: {}, potions: [] },
      });

      await useStore.getState().purchaseItem('hammers', id);
      expect(useStore.getState().gold).toBe(10); // 10 remains
      expect(useStore.getState().items.hammers).toContain(id);

      const storedItems = JSON.parse(await AsyncStorage.getItem('items'));
      expect(storedItems.hammers).toContain(id);
      const storedGold = JSON.parse(await AsyncStorage.getItem('gold'));
      expect(storedGold).toBe(10);
    });
  });

  describe('growBabiesToAdults Tests', () => {
    beforeEach(async () => {
      jest.spyOn(Date, 'now').mockReturnValue(1000000);
      await AsyncStorage.clear();
      await useStore.getState().initializeStore();
      useStore.setState({ items: { hammers: [], totems: [], scrolls: {}, potions: [] } });
    });

    afterEach(() => {
      Date.now.mockRestore();
      Toast.show.mockClear();
    });

    it('converts a baby creature to adult if enough time has passed', async () => {
      const creatureColor = Object.keys(creatureData)[0];
      const base = creatureData[creatureColor];
      const growthTime = base.growthTimeMs ?? 60000;

      const babyCreature = {
        id: 'baby1',
        name: creatureColor,
        type: base.type,
        image: base.babyImage,
        stage: 'baby',
        hatchedAt: Date.now() - growthTime - 1,
      };

      useStore.setState({ creatureInventory: [babyCreature] });
      await useStore.getState().growBabiesToAdults();

      const updated = useStore.getState().creatureInventory[0];
      expect(updated.stage).toBe('adult');
      expect(updated.image).toBe(base.adultImage);

      const stored = JSON.parse(await AsyncStorage.getItem('creatureInventory'));
      expect(stored[0].stage).toBe('adult');
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          text1: `Your ${base.type} has grown up!`,
        })
      );
    });

    it('does not convert to adult if not enough time has passed', async () => {
      const creatureColor = Object.keys(creatureData)[0];
      const base = creatureData[creatureColor];
      const growthTime = base.growthTimeMs ?? 60000;

      const babyCreature = {
        id: 'baby2',
        name: creatureColor,
        type: base.type,
        image: base.babyImage,
        stage: 'baby',
        hatchedAt: Date.now() - (growthTime - 1),
      };

      useStore.setState({ creatureInventory: [babyCreature] });
      await useStore.getState().growBabiesToAdults();

      const unchanged = useStore.getState().creatureInventory[0];
      expect(unchanged.stage).toBe('baby');
      expect(Toast.show).not.toHaveBeenCalled();
    });
  });
});

describe('resetProgress Resets Entire Store', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useStore.setState({
      currency: 999,
      gold: 999,
      egg: { color: 'strawberry', progress: 50, clicksNeeded: 10, img: 'bad' },
      hatchedEggs: ['foo'],
      creatureInventory: [{ id: 'Z' }],
      items: { hammers: ['h1'], totems: ['t1'], scrolls: { egg: ['s1'] }, potions: ['p1'] },
    });
  });

  it('resetProgress completely wipes + resets to initial defaults', async () => {
    const spySaveCurrency  = jest.spyOn(useStore.getState(), 'saveCurrency');
    const spySaveGold      = jest.spyOn(useStore.getState(), 'saveGold');
    const spySaveHatched   = jest.spyOn(useStore.getState(), 'saveHatchedEggs');
    const spySaveInventory = jest.spyOn(useStore.getState(), 'saveInventory');

    await useStore.getState().resetProgress();

    expect(useStore.getState().currency).toBe(0);
    expect(useStore.getState().gold).toBe(0);

    const firstEgg = createEgg([]);
    expect(useStore.getState().egg).toEqual(firstEgg);

    expect(useStore.getState().hatchedEggs).toEqual([]);
    expect(useStore.getState().creatureInventory).toEqual([]);
    expect(useStore.getState().items).toEqual({
      hammers: [],
      totems: [],
      scrolls: [],
      potions: [],
    });

    expect(spySaveCurrency).toHaveBeenCalledWith(0);
    expect(spySaveGold).toHaveBeenCalledWith(0);
    expect(spySaveHatched).toHaveBeenCalledWith([]);
    expect(spySaveInventory).toHaveBeenCalledWith([]);

    spySaveCurrency.mockRestore();
    spySaveGold.mockRestore();
    spySaveHatched.mockRestore();
    spySaveInventory.mockRestore();
  });
});

afterAll(() => {
  // In case we left fake intervals running, clear them now
  const state = useStore.getState();
  if (state.potionOneAutoClicker) {
    clearInterval(state.potionOneAutoClicker);
  }
  if (state.potionTwoAutoClicker) {
    clearInterval(state.potionTwoAutoClicker);
  }
});
