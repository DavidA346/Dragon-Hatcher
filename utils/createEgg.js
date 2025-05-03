import eggImages from './eggImages';


//Function to create a new egg based on the hatched eggs so far
export const createEgg = (hatchedEggs = []) => {
 //Ensure the red egg always comes first
 if (hatchedEggs.length === 0) {
   return {
     color: 'Red',
     type: 'Creature',
     rarity: 1.0,
     clicksNeeded: 10,
     progress: 0,
     boosts: null,
     img: eggImages['Red'][0],  //Start with the red egg at stage 0
   };
 }


 const availableColors = ['Blue', 'Green', 'Gold', 'Orange', 'White'];


 // If all colors are hatched, return a finished egg (you can customize this)
 if (hatchedEggs.length === 6) {
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


 // Select a random color from the remaining ones
 const remainingColors = availableColors.filter(c => !hatchedEggs.includes(c));
 const color = remainingColors[Math.floor(Math.random() * remainingColors.length)];


 const type = 'Creature';
 const rarity = 1.0;
 const clicksNeeded = 10;
 const progress = 0;


 const stage = 0;
 const img = eggImages[color][stage]; // Start with stage 0 image


 return {
   color,
   type,
   rarity,
   clicksNeeded,
   progress,
   boosts: null,
   img,
 };
};