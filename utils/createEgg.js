import eggImages from './eggImages';

//Function to create a new egg based on the hatched eggs so far
export const createEgg = (hatchedEggs = []) => {
 //Ensure the red egg always comes first
 if (hatchedEggs.length === 0) {
   return {
     color: 'Red',
     type: 'Dragon',
     rarity: 1.0,
     clicksNeeded: 10,
     progress: 0,
     boosts: null,
     img: eggImages['Red'][0],  //Start with the red egg at stage 0
   };
 }

 //Base pool with type and color as well as percentage of spawning
 const eggPool = [
  { color: 'Blue', type: 'Dragon', weight: 3 },
  { color: 'Green', type: 'Dragon', weight: 3 },
  { color: 'Gold', type: 'Dragon', weight: 3 },
  { color: 'Orange', type: 'Dragon', weight: 3 },
  { color: 'White', type: 'Dragon', weight: 3 },

  { color: 'Black-Violet', type: 'Drake', weight: 2 },
  { color: 'Green-Red', type: 'Drake', weight: 2 },

  { color: 'Blue-Green', type: 'Wyvern', weight: 1 },
  { color: 'Brown-Green', type: 'Wyvern', weight: 1 },
];

//Filter out already hatched
const remaining = eggPool.filter(e => !hatchedEggs.includes(e.color));

 // If all colors are hatched, return a finished egg (you can customize this)
 if (remaining.length === 0) {
   return {
     color: 'none',
     type: 'Finished',
     rarity: 0,
     clicksNeeded: 0,
     progress: 0,
     boosts: null,
     img: null,
   };
 }

   // Weighted selection logic
   const weightedList = remaining.flatMap(egg => Array(egg.weight).fill(egg));
   const chosen = weightedList[Math.floor(Math.random() * weightedList.length)];
 
   return {
     color: chosen.color,
     type: chosen.type,
     rarity: 1.0,
     clicksNeeded: 10,
     progress: 0,
     boosts: null,
     img: eggImages[chosen.color][0],
   }; 
};