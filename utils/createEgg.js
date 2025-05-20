import creatureData from './creatureData';


//Function to create a new egg based on the hatched eggs so far
export const createEgg = (hatchedEggs = []) => {
  // console.log("createEgg()> Hatched Eggs : ", hatchedEggs.length);
  if (hatchedEggs.length === 0) {
  //Ensure the red egg always comes first
  const defaultEgg = creatureData.Red.egg;
   return {
     color: defaultEgg.color,
     type: creatureData.Red.type,
     rarity: defaultEgg.rarity,
     clicksNeeded: defaultEgg.clicksNeeded,
     progress: 0,
     boosts: defaultEgg.boosts,
     img: defaultEgg.images[0],  //Start with the red egg at stage 0
   };
 }

//Filter out already hatched
  const availableEggs = Object.entries(creatureData)
    .filter(([color, data]) => {
      const notHatched = !hatchedEggs.includes(color);
      const hasWeight = (data.egg.weight ?? 1) > 0;
      return notHatched && hasWeight;
    })
    .flatMap(([color, data]) => {
      const count = data.egg.weight ?? 1;
      return Array.from({ length: count }, () => ({ color, data }));
    });

  // console.log("createEgg()> Available Eggs : ", availableEggs.map(e => e.color));

 // If all colors are hatched, return a finished egg (you can customize this)
  if (availableEggs.length === 0) {
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

  // Choose random egg from weighted options
  const chosen = availableEggs[Math.floor(Math.random() * availableEggs.length)];
  const { color, data } = chosen;

  return {
    color,
    type: data.type,
    rarity: data.egg.rarity,
    clicksNeeded: data.egg.clicksNeeded,
    progress: 0,
    boosts: data.egg.boosts ?? 0,
    img: data.egg.images[0],
  };
};