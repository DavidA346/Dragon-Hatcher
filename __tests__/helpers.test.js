import { hasItem, getItem, updateItems, hasEffect } from '../store/helpers';
import itemData from '../utils/itemData';

describe('helpers.js utilities', () => {
  // Testing hasItem utility function 
  describe('hasItem', () => {
    const mockState = {
      hammers: ['yur', 'tou'],
      totems: ['dragon'],
      scrolls: {
        egg: ['egg1'],
        gold: ['gold1']
      },
    };

    // Returns true when the hammer exists in state
    it('returns true if hammer exists', () => {
      expect(hasItem(mockState, 'hammers', 'yur')).toBe(true);
    });

    // Returns false when the hammer does not exist
    it('returns false if hammer does not exist', () => {
      expect(hasItem(mockState, 'hammers', 'missing')).toBe(false);
    });

    // Returns true when the scroll exists under the correct scroll type
    it('returns true if scroll exists in correct type', () => {
      expect(hasItem(mockState, 'scrolls', 'egg1', 'egg')).toBe(true);
    });

    // Returns false when the scroll exists but under the wrong scroll type
    it('returns false if scroll type is incorrect', () => {
      expect(hasItem(mockState, 'scrolls', 'egg1', 'gold')).toBe(false);
    });

    // Returns false when category or scroll type is missing in state
    it('returns false if scroll category or type missing', () => {
      expect(hasItem({}, 'scrolls', 'egg1', 'egg')).toBe(false);
    });

    // Returns false when the category itself is not present in state
    it('returns false if category is not found', () => {
      expect(hasItem({}, 'wands', 'magic')).toBe(false);
    });
  });

  // testing getItem utility function 
  describe('getItem', () => {
    // Returns a valid scroll object from itemData using correct type and id
    it('returns correct scroll item from itemData', () => {
      const someEggId = itemData.scrolls.egg[0].id;
      const item = getItem('scrolls', someEggId, 'egg');
      expect(item).toEqual(itemData.scrolls.egg[0]);
    });

    // Returns null if scroll type is invalid or doesn't exist
    it('returns null if scroll type not found', () => {
      expect(getItem('scrolls', 'some-id', 'invalidType')).toBe(null);
    });

    // Returns potion object from itemData by id
    it('returns potion item', () => {
      const somePotionId = itemData.potions[0].id;
      const item = getItem('potions', somePotionId);
      expect(item).toEqual(itemData.potions[0]);
    });

    // Returns hammer or totem object from itemData by id
    it('returns hammer or totem by id', () => {
      const hammerKey = Object.keys(itemData.hammers)[0];
      const item = getItem('hammers', hammerKey);
      expect(item).toEqual(itemData.hammers[hammerKey]);
    });

    //  valid scroll type, but ID not found = undefined 
    it('returns undefined if scroll ID not found but type is valid', () => {
      // We know itemData.scrolls.egg has at least one entry; pick a bad ID:
      expect(getItem('scrolls', 'not-in-list', 'egg')).toBe(undefined);
    });

    // valid category (hammer) but ID not found = undefined 
    it('returns undefined if hammer ID is invalid', () => {
      expect(getItem('hammers', 'invalidHammer')).toBe(undefined);
    });
  });

  // Testing updateItems utility function 
  describe('updateItems', () => {
    const baseState = {
      items: {
        hammers: ['yur'],
        scrolls: { egg: ['egg1'] },
        totems: ['drake'],
        potions: ['potion1']
      }
    };

    // Adds a new scroll to the correct scroll type
    it('adds a new scroll to the correct type', () => {
      const updated = updateItems(baseState, 'scrolls', 'egg2', 'egg');
      expect(updated.scrolls.egg).toContain('egg2');
      expect(updated.scrolls.egg).toContain('egg1');
    });

    // Adds a new hammer to the hammer list
    it('adds a new hammer to the list', () => {
      const updated = updateItems(baseState, 'hammers', 'tou');
      expect(updated.hammers).toEqual(['yur', 'tou']);
    });

    // Adds a totem item to the totems list
    it('adds a totem item correctly', () => {
      const updated = updateItems(baseState, 'totems', 'dragon');
      expect(updated.totems).toEqual(['drake', 'dragon']);
    });

    // potions (else‐branch) ⇒ initial array exists, then add 
    it('adds a potion to the potions array', () => {
      const updated = updateItems(baseState, 'potions', 'potionX');
      expect(updated.potions).toEqual(['potion1', 'potionX']);
    });
  });

  describe('hasEffect', () => {
    it('returns true when the effect key is present', () => {
      const effects = { boost: 2, speed: 5 };
      expect(hasEffect(effects, 'speed')).toBe(true);
    });

    it('returns false when the effect key is not present', () => {
      const effects = { freeze: 0 };
      expect(hasEffect(effects, 'ignite')).toBe(false);
    });
  });
});

