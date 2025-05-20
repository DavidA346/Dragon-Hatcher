import itemData from "../utils/itemData";

//look for item regardless of difference in data formats
export const hasItem = (stateItems, category, id, type = null) => {
  const cat = stateItems[category];
  if (!cat) return false;
  if (category === 'scrolls') {
    if (!type || !cat[type]) return false;
    return cat[type].includes(id);
  }
  return cat.includes(id);
}

//return item
export const getItem = (category, id, type = null) => {
  if (category === 'scrolls') {
    if (!type || !itemData[category][type]) return null;
    return itemData[category][type].find(item => item.id === id);
  }
  if (category === 'potions') {
    return itemData[category].find(item => item.id === id); // for potions
  }
  return itemData[category][id]; // for hammers, totems
};

//return updated list of items for async
export const updateItems = (state, category, id, type = null) => {
  let updatedItems;

  if (category === 'scrolls' && type) {
    updatedItems = {
      ...state.items,
      scrolls: {
        ...state.items.scrolls,
        [type]: [
          ...(state.items.scrolls[type] || []),
          id
        ]
      }
    };
  } else {
    updatedItems = {
      ...state.items,
      [category]: [
        ...(state.items[category] || []),
        id
      ]
    };
  }

  return updatedItems;
}

const hasEffect = (effects, effectKey) => {
  return effectKey in effects;
};