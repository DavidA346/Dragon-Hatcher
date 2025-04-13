import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Used to modify and store the state of a value
const useStore = create((set) => ({
  //Start currency at 0
  currency: 0,

  //Loads the score from AsyncStorage when the app starts
  loadCurrency: async () => {
    //Retrieves the currency
    const savedCurrency = await AsyncStorage.getItem('currency');
    //If saved Currency is not 0 then set it to a number of base 10
    if (savedCurrency !== null) {
      set({ currency: parseInt(savedCurrency, 10) });
    }
  },

  //Increment the currency and save it to AsyncStorage
  incrementCurrency: async () => {
    //Updates the state and returns it
    set((state) => {
      const newCurrency = state.currency + 1;
      AsyncStorage.setItem('currency', newCurrency.toString()); // Persist the new score
      return { currency: newCurrency };
    });
  },
}));

export default useStore;
