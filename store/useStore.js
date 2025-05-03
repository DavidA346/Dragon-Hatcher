import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createEgg } from '../utils/createEgg';
import eggImages from '../utils/eggImages';

//Used to modify and store the state of a value
const useStore = create((set, get) => ({
 //Start currency at 0
 currency: 0,
 //Default egg creation
 egg: createEgg([]),
 //Track previously hatched eggs
 hatchedEggs: [],

 //Loads the score from AsyncStorage when the app starts
 loadCurrency: async () => {
   //Retrieves the currency
   const savedCurrency = await AsyncStorage.getItem('currency');
   //If saved Currency is not 0 then set it to a number of base 10
   if (savedCurrency !== null) {
     set({ currency: parseInt(savedCurrency, 10) || 0 });
   }
 },

 //Loads the hatched eggs from AsyncStorage when the app starts
 loadHatchedEggs: async () => {
   const savedHatchedEggs = await AsyncStorage.getItem('hatchedEggs');
   if (savedHatchedEggs !== null) {
     set({ hatchedEggs: JSON.parse(savedHatchedEggs) });
   }
 },

 //Loads the current egg progress from AsyncStorage when the app starts
 loadCurrentEgg: async () => {
   const savedEgg = await AsyncStorage.getItem('egg');
   if (savedEgg !== null) {
     set({ egg: JSON.parse(savedEgg) });
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
     img: eggImages[egg.color][newStage],
   };

   //If egg is done hatching
   if (newProgress >= egg.clicksNeeded) {
     const newHatched = [...hatchedEggs, egg.color];
     get().saveHatchedEggs(newHatched); //Save hatched eggs to AsyncStorage
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

 //Reset all game progress (currency, eggs, and hatched list) for later testing
 resetProgress: async () => {
   const firstEgg = createEgg([]);
   set({
     currency: 0,
     egg: firstEgg,
     hatchedEggs: [],
   });
   get().saveCurrency(0);
   get().saveHatchedEggs([]);
   get().saveCurrentEgg(firstEgg); //Reset the egg to the first state
 },

 //Load all saved values when the app starts
 initializeStore: async () => {
   await get().loadCurrency();
   await get().loadHatchedEggs();
   await get().loadCurrentEgg();
 },
}));

export default useStore;