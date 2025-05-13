import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createEgg } from '../utils/createEgg';
import creatureData from '../utils/creatureData';


//Used to modify and store the state of a value
const useStore = create((set, get) => ({
 //Start currency at 0
 currency: 0,
 //start gold-balance at 0
 gold: 0, 
 //Default egg creation
 egg: createEgg([]),
 //Track previously hatched eggs
 hatchedEggs: [],

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
  incrementGold: async () => {
    set(state => {
      const newGold = state.gold + 1;
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
   const newProgress = egg.progress + 1; //Persist the new score
   const percent = newProgress / egg.clicksNeeded;

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
   if (newProgress >= egg.clicksNeeded) {
     const newHatched = [...hatchedEggs, egg.color];
     get().saveHatchedEggs(newHatched); //Save hatched eggs to AsyncStorage

    //  console.log("incrementEggProgress()> New Hatched: ", newHatched);
     const base = creatureData[egg.color]; //adding this line to make it easier to read so creatureData[egg.color] only has to be called once
     const creature = {
      id: Date.now().toString(),
      name: egg.color,
      type: base.type,
      image: (base.babyImage !== null ? base.babyImage : base.adultImage),
      stage: (base.babyImage !== null ? 'baby' : 'adult'),
     };
     get().addCreatureToInventory(creature);

     const newEgg = createEgg(newHatched); //Create new egg based on hatched eggs
     
    //  console.log("incrementEggProgress()> New Egg: ", newEgg);

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

 //Reset all game progress (currency, eggs, and hatched list) for later testing
 resetProgress: async () => {
   const firstEgg = createEgg([]);
   set({
     currency: 0,
     gold: 0,
     egg: firstEgg,
     hatchedEggs: [],
     creatureInventory: []
   });
   get().saveCurrency(0);
   get().saveGold(0);
   get().saveHatchedEggs([]);
   get().saveCurrentEgg(firstEgg); //Reset the egg to the first state
   get().saveInventory([])
 },

 //Load all saved values when the app starts
 initializeStore: async () => {
   await get().loadCurrency();
   await get().loadGold();      // new gold balance
   await get().loadHatchedEggs();
   await get().loadCurrentEgg();
   await get().loadInventory();
 },
}));

export default useStore;