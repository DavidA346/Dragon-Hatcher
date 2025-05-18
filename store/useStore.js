import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createEgg } from '../utils/createEgg';
import creatureData from '../utils/creatureData';
import itemData from '../utils/itemData';
import { hasItem , getItem, addItemToState, updateItems} from './helpers';


//Used to modify and store the state of a value
const useStore = create((set, get) => ({
 /*STATE FIELDS*/

 //Default initializations
 //egg creations
 //inventoy initializations

 currency: 0,
 gold: 0, 
 egg: createEgg([]),
 hatchedEggs: [],
 items: {
  hammers: [],
  totems: [],
  scrolls: []
 },

 /*FUNCTIONS*/

 //item functionality
getEquippedHammer: () => {
  const hammers = get().items.hammers;
  if (!hammers || hammers.length === 0) return null;
  return hammers[hammers.length - 1]; // assume last one is active
},

getEquippedScroll: (type) => {
  const scrolls = get().items.scrolls?.[type];
  if (!scrolls || scrolls.length === 0) return null;
  return scrolls[scrolls.length - 1];
},

getEquippedScrolls: () => {
    const { getEquippedScroll } = get();
    return {
      dragon: getEquippedScroll('dragon'),
      wyvern: getEquippedScroll('wyvern'),
      drake: getEquippedScroll('drake'),
      egg: getEquippedScroll('egg'),
      gold: getEquippedScroll('gold'),
    };
},

loadItems: async () => {
    const savedItems = await AsyncStorage.getItem('items');
    if (savedItems !== null) {
      set({items: JSON.parse(savedItems)});
    } 
},

 //change to saveItems
 savedItems: async(items) => {
  await AsyncStorage.setItem('items', JSON.stringify(items));
 },

 purchaseItem: async (category, id, type = null) => {
  // Prevent buying already bought item
  const state = get();
  if (hasItem(state.items, category, id, type))  {
    console.warn(`Already own item: ${category}, ${id}, ${type}`);
    return;
  }
  const item = getItem(category, id, type);
  if (!item) {
    console.warn(`Item not found: ${category}, ${id}, ${type}`);
    return;
  }
  //check validity
  if (!item || state.gold < item.cost) {
    if(!item) console.warn("Item doesn't exist");
    else console.warn("Not enough money");
    return;
  }  // Deduct currency and add item to inventory
  const updatedCurrency = state.gold - item.cost;
  const updatedItems = updateItems(state, category, id, type);
  //update asyncStorage data
  console.info('bought item!');
  set({ gold: updatedCurrency, items: updatedItems });
  await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
  await AsyncStorage.setItem('gold', updatedCurrency.toString());
 },

 getHammerBonusClicks: () => {
  const items = get().items.hammers;
  return items.reduce((total, id) =>{
    const item = itemData.hammers[id];
    return total + (item ?.bonusClicks || 0);
  }, 0)
 },

 getTotemEffects: (target) => {
  const { items, creatureInventory } = get();

  if(!target || !target.type) return {};

  const species = target.type;
  const totemId = species?.toLowerCase();
  if (!items.totems.includes(totemId)) return {}; // Check if totem is owned

  const totem = itemData.totems[totemId];
  const requiredCount = totem?.requirements?.count || 0;

  const ownedCount = creatureInventory.filter(
    c => c.type === species
  ).length;

  if (ownedCount >= requiredCount) {
    return totem.effects;
  }

  const effects = {
    clickBonus: 0,
    goldBonus: 0,
    growTimeMultiplier: 1,
  };

  return effects;
},

getScrollEffect: () => {
  const scroll = get().getEquippedScroll('gold');
  if(!scroll) return 0;
  const item = getItem('scrolls', scroll, 'gold');
  return item?.effects?.goldBonus?? 0;
},

 //Add to egg.boost
 getEggBoost: () => {
  const scrollId = get().getEquippedScroll('egg');
  const item = getItem('scrolls', scrollId, 'egg');
  const boost = item?.effects?.clickReducer ?? 0;
  return boost;
 },

 getGoldMultiplier: (type = null, scrollIds = null) => {
  const totems = get().items.totems;
  
  return totems.length > 0 ? 2 : 1; // customize if each totem gives separate boost
},

getScrollMultiplier: () => {
  const scrollId = get().getEquippedScroll('gold');
  const item = getItem('scrolls', scrollId, 'gold');
  //console.log(item);
  const boost = item?.effects?.goldMultiplier ?? 1;
  return boost;
},

 // Creature Inventory Creation, Loading/Saving, and Adding
 creatureInventory: [],
  // Load inventory
  loadInventory: async () => {
    const savedInventory = await AsyncStorage.getItem('creatureInventory');
    if (savedInventory) {
      set({ creatureInventory: JSON.parse(savedInventory) });
    }

    else {
      set({ creatureInventory: [] });  // Set to an empty array if no inventory exists
    }
  },
  // Save inventory
  saveInventory: async (inventory) => {
    await AsyncStorage.setItem('creatureInventory', JSON.stringify(inventory));
  },
  addCreatureToInventory: async (creature) => {
    set((state) => {
      const updated = [...state.creatureInventory, creature];
      get().saveInventory(updated);
      return { creatureInventory: updated };
    });
  },


 //Loads the score from AsyncStorage when the app starts
 loadCurrency: async () => {
   //Retrieves the currency
   const savedCurrency = await AsyncStorage.getItem('currency');
   //If saved Currency is not 0 then set it to a number of base 10
   if (savedCurrency !== null && savedCurrency !== undefined) {
    set({ currency: parseInt(savedCurrency, 10) || 0 });
   } 
  
   else {
    set({ currency: 0 });  // Default to 0 if no saved currency
   }
 },

 //Loads the hatched eggs from AsyncStorage when the app starts
 loadHatchedEggs: async () => {
   const savedHatchedEggs = await AsyncStorage.getItem('hatchedEggs');
   if (savedHatchedEggs !== null && savedHatchedEggs !== undefined) {
     set({ hatchedEggs: JSON.parse(savedHatchedEggs) });
   }

   else {
     set({ hatchedEggs: [] });
   }
 },

 //Loads the current egg progress from AsyncStorage when the app starts
 loadCurrentEgg: async () => {
   const savedEgg = await AsyncStorage.getItem('egg');
   if (savedEgg !== null && savedEgg !== undefined) {
     set({ egg: JSON.parse(savedEgg) });
   }

   else {
    set({ egg: createEgg([]) });
   }
 },

 //Save currency to AsyncStorage
 saveCurrency: async (currency) => {
   await AsyncStorage.setItem('currency', currency.toString());
 },

 // Save hatched eggs to AsyncStorage
 saveHatchedEggs: async (hatchedEggs) => {
   await AsyncStorage.setItem('hatchedEggs', JSON.stringify(hatchedEggs));
 },

 //Save current egg to AsyncStorage
 saveCurrentEgg: async (egg) => {
   await AsyncStorage.setItem('egg', JSON.stringify(egg));
 },

 //Increment the currency and save it to AsyncStorage
 incrementCurrency: async () => {
   //Updates the state and returns it
   set((state) => {
     const newCurrency = state.currency + 1; // Persist the new score
     get().saveCurrency(newCurrency);
     return { currency: newCurrency };
   });
 },

 //Increment gold (only adult creatures) and persist it
  incrementGold: async (creature, id = null) => {
    set(state => {
      const totemEffects = get().getTotemEffects(creature);
      const scrollEffects = get().getScrollEffect();
      //console.log('dddd', scrollEffects);
      const scrollBonus = scrollEffects?? 0;
      //console.log('dddd', scrollBonus);
      const bonusGold = totemEffects?.goldBonus || 0;
      // const goldBonus = get().getGoldMultiplier();
      const goldMult = get().getScrollMultiplier();
      //console.log('fff',goldMult);
      //const newGold = state.gold + 1 + bonusGold;
      const newGold = state.gold + ((1+ bonusGold + scrollBonus) * goldMult);
      //console.log(state.gold);
      //console.log(newGold);
      get().saveGold(newGold);
      return { gold: newGold };
    });
  },

  // persistence for gold
  saveGold: async (n) => {
    await AsyncStorage.setItem('gold', JSON.stringify(n));
  },
  loadGold: async () => {
    const raw = await AsyncStorage.getItem('gold');
    if (raw != null) set({ gold: JSON.parse(raw) });
  },

 //Increment the egg progress and save it to AsyncStorage
 incrementEggProgress: async () => {
  const { egg, hatchedEggs } = get();

  const hammerClickBonus = get().getHammerBonusClicks();
  const totemEffects = get().getTotemEffects(egg); 
  const totemClickBonus = totemEffects.clickBonus || 0;
  const totalClickBonus = hammerClickBonus + totemClickBonus;
  const scrollEffects = get().getEggBoost();
  const newProgress = egg.progress + 1 + totalClickBonus; //Persist the new score
  const clicksNeeded = egg.clicksNeeded * (1-scrollEffects);
  const percent = newProgress / clicksNeeded;

  //Determine egg stage based on progress percentage
  const newStage =
    percent >= 0.66 ? 2 :
    percent >= 0.33 ? 1 : 0;

  //Create updated egg object with new progress and image
  const updatedEgg = {
    ...egg,
    progress: newProgress,
    img: creatureData[egg.color].egg.images[newStage],

  };

  //If egg is done hatching
  if (newProgress >= clicksNeeded) {
    const newHatched = [...hatchedEggs, egg.color];
    get().saveHatchedEggs(newHatched); //Save hatched eggs to AsyncStorage

    const base = creatureData[egg.color]; //adding this line to make it easier to read so creatureData[egg.color] only has to be called once
    const creature = {
      id: Date.now().toString(),
      name: egg.color,
      type: base.type,
      image: (base.babyImage !== null ? base.babyImage : base.adultImage),
      stage: (base.babyImage !== null ? 'baby' : 'adult'),
      hatchedAt: Date.now()
    };
    get().addCreatureToInventory(creature);

    const newEgg = createEgg(newHatched); //Create new egg based on hatched eggs
    
    get().saveCurrentEgg(newEgg); //Save new egg state
    // Update store state
    set({
      hatchedEggs: newHatched,
      egg: newEgg,
    });
  }
  else {
    get().saveCurrentEgg(updatedEgg); // Save current egg progress
    set({ egg: updatedEgg });
  }
 },
 growBabiesToAdults: () => {
  const { creatureInventory, items } = get();
  const now = Date.now();

  const updatedInventory = creatureInventory.map(creature => {
    if (creature.stage === 'baby') {
      const base = creatureData[creature.name];
      const growthTime = base.growthTimeMs ?? 60000;

      const totemKey = creature.type.toLowerCase();
      const hasTotem = items.totems.includes(totemKey);
      const multiplier = hasTotem ? (itemData.totems[totemKey]?.effects?.growTimeMultiplier ?? 1) : 1;

      const adjustedTime = growthTime * multiplier;

      console.log("Time: ", now - creature.hatchedAt);

      if (now - creature.hatchedAt >= adjustedTime) {
        return {
          ...creature,
          stage: 'adult',
          image: base.adultImage,
        };
      }
    }

    return creature;
  });

  set({ creatureInventory: updatedInventory });
  get().saveInventory(updatedInventory);
},

 //Reset all game progress (currency, eggs, and hatched list) for later testing
 resetProgress: async () => {
   const firstEgg = createEgg([]);
   set({
     currency: 0,
     gold: 0,
     egg: firstEgg,
     hatchedEggs: [],
     creatureInventory: [],
     items: {
      hammers: [],
      totems: [],
      scrolls: []
     }
   });
   get().saveCurrency(0);
   get().saveGold(0);
   get().saveHatchedEggs([]);
   get().saveCurrentEgg(firstEgg); //Reset the egg to the first state
   get().saveInventory([])
   get().saveItems({
    hammers: [],
    totems: [],
    scrolls: []
    });
 },

 //Load all saved values when the app starts
 initializeStore: async () => {
   await get().loadCurrency();
   await get().loadGold();      // new gold balance
   await get().loadHatchedEggs();
   await get().loadCurrentEgg();
   await get().loadInventory();
   await get().loadItems();
 },
}));

export default useStore;