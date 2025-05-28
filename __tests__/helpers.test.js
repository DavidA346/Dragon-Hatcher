import { hasItem, getItem, updateItems } from '../store/helpers';
import itemData from '../utils/itemData';

describe('helpers.js utilities', () => {

  describe('hasItem', () => {
    const mockState = {
      hammers: ['yur', 'tou'],
      totems: ['dragon'],
      scrolls: {
        egg: ['egg1'],
        gold: ['gold1']
      },
    };

    it('returns true if hammer exists', () => {
      expect(hasItem(mockState, 'hammers', 'yur')).toBe(true);
    });

    it('returns false if hammer does not exist', () => {
      expect(hasItem(mockState, 'hammers', 'missing')).toBe(false);
    });

    it('returns true if scroll exists in correct type', () => {
      expect(hasItem(mockState, 'scrolls', 'egg1', 'egg')).toBe(true);
    });

    it('returns false if scroll type is incorrect', () => {
      expect(hasItem(mockState, 'scrolls', 'egg1', 'gold')).toBe(false);
    });

    it('returns false if scroll category or type missing', () => {
      expect(hasItem({}, 'scrolls', 'egg1', 'egg')).toBe(false);
    });

    it('returns false if category is not found', () => {
      expect(hasItem({}, 'wands', 'magic')).toBe(false);
    });
  });

  describe('getItem', () => {
    it('returns correct scroll item from itemData', () => {
      const id = itemData.scrolls.egg[0].id;
      const item = getItem('scrolls', id, 'egg');
      expect(item).toEqual(itemData.scrolls.egg[0]);
    });

    it('returns null if scroll type not found', () => {
      expect(getItem('scrolls', 'some-id', 'invalidType')).toBe(null);
    });

    it('returns potion item', () => {
      const id = itemData.potions[0].id;
      const item = getItem('potions', id);
      expect(item).toEqual(itemData.potions[0]);
    });

    it('returns hammer or totem by id', () => {
      const hammerKey = Object.keys(itemData.hammers)[0];
      const item = getItem('hammers', hammerKey);
      expect(item).toEqual(itemData.hammers[hammerKey]);
    });
  });

  describe('updateItems', () => {
    const baseState = {
      items: {
        hammers: ['yur'],
        scrolls: { egg: ['egg1'] },
        totems: [],
        potions: []
      }
    };

    it('adds a new scroll to the correct type', () => {
      const updated = updateItems(baseState, 'scrolls', 'egg2', 'egg');
      expect(updated.scrolls.egg).toContain('egg2');
      expect(updated.scrolls.egg).toContain('egg1');
    });

    it('adds a new hammer to the list', () => {
      const updated = updateItems(baseState, 'hammers', 'tou');
      expect(updated.hammers).toEqual(['yur', 'tou']);
    });

    it('adds a totem item correctly', () => {
      const updated = updateItems(baseState, 'totems', 'dragon');
      expect(updated.totems).toEqual(['dragon']);
    });
  });

});
