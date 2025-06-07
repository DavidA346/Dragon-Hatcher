// File: __tests__/index.test.js  (or wherever your test already lives)

// ─── MOCK itemData — point at the real utils/itemData.js ─────────────────────
jest.mock('../utils/itemData', () => ({
  totems: {
    dragon: {
      image: { uri: 'fake-totem.png' },
    },
  },
  hammers: {
    basic: {
      image: { uri: 'fake-hammer.png' },
    },
  },
  scrolls: {
    egg: [
      { id: 'fireScroll', image: { uri: 'fake-scroll.png' } },
    ],
  },
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// ─── MOCK useStore — point at the real store/useStore.js ─────────────────────
jest.mock('../store/useStore');
import useStore from '../store/useStore';

// ─── MOCK Toast + Haptics exactly as your component expects ─────────────────
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));
import Toast from 'react-native-toast-message';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'Medium' },
}));
import * as Haptics from 'expo-haptics';

// ─── IMPORT EggClicker from app/(tabs)/index.jsx ────────────────────────────
import EggClicker from '../app/(tabs)/index';

// ─── Helper: build a “default” mock store and allow overrides ─────────────────
function makeDefaultStore(overrides = {}) {
  return {
    currency: 3,
    egg: {
      img: { uri: 'egg.png' },
      clicksNeeded: 5,
      progress: 1,
      type: 'dragon',
    },
    initializeStore: jest.fn(),
    incrementEggProgress: jest.fn(),
    resetProgress: jest.fn(),
    purchaseItem: jest.fn(),

    getHammerBonusClicks: () => 0,
    getTotemEffects: () => ({ clickBonus: 0 }),
    getEquippedScrolls: () => ({ egg: null }),
    getEggBoost: () => 0,

    items: {
      hammers: ['basic'],
      totems: [],
      scrolls: { egg: [] },
      potions: [],
    },
    hatchedEggs: [],
    ...overrides,
  };
}

let storeMock;
beforeEach(() => {
  // clear any lingering calls
  Toast.show.mockClear();
  Haptics.impactAsync.mockClear();
  Haptics.selectionAsync.mockClear();

  storeMock = makeDefaultStore();
  useStore.mockReturnValue(storeMock);
  // ensure direct useStore.getState() also returns our mock:
  useStore.getState = () => storeMock;
});

describe('<EggClicker />', () => {
  it('calls initializeStore once on mount', () => {
    render(<EggClicker />);
    expect(storeMock.initializeStore).toHaveBeenCalledTimes(1);
  });

  it('renders title and egg images', () => {
    const { getByTestId } = render(<EggClicker />);
    expect(getByTestId('title-image')).toBeTruthy();
    expect(getByTestId('egg-image')).toBeTruthy();
  });

  it('renders currency text when currency > 0, hides it when currency = 0', () => {
    // ── Case A: currency > 0
    storeMock.currency = 7;
    useStore.mockReturnValue(storeMock);
    const { getByTestId, queryByTestId, rerender } = render(<EggClicker />);
    expect(getByTestId('currency-text').props.children.join('')).toBe('Currency: 7');

    // ── Case B: currency = 0
    storeMock.currency = 0;
    useStore.mockReturnValue(storeMock);
    rerender(<EggClicker />);
    expect(queryByTestId('currency-text')).toBeNull();
  });

  it('renders progress-bar-text correctly when getEggBoost > 0', () => {
    // clicksNeeded=5, progress=1, boost=0.5 → visible = Math.round(5*(1-0.5)) = 3 → "1 / 3"
    storeMock.getEggBoost = () => 0.5;
    useStore.mockReturnValue(storeMock);
    const { getByTestId } = render(<EggClicker />);
    const progressText = getByTestId('progress-bar-text').props.children.join('');
    expect(progressText).toBe('1 / 3');
  });

  it('hides progress-bar container if clicksNeeded === 0', () => {
    storeMock.egg = {
      img: { uri: 'egg.png' },
      clicksNeeded: 0,
      progress: 0,
      type: 'dragon',
    };
    useStore.mockReturnValue(storeMock);
    const { queryByTestId } = render(<EggClicker />);
    expect(queryByTestId('progress-bar-container')).toBeNull();
  });

  it('renders hammer icon when you own a hammer and no totem', () => {
    // Default: items.hammers = ['basic'], items.totems = []
    useStore.mockReturnValue(storeMock);
    const { getByTestId } = render(<EggClicker />);
    expect(getByTestId('hammer-icon-basic')).toBeTruthy();
  });

  it('renders totem icon when you own a “dragon” totem', () => {
    storeMock.items.totems = ['dragon'];
    useStore.mockReturnValue(storeMock);
    const { getByTestId } = render(<EggClicker />);
    expect(getByTestId('totem-icon')).toBeTruthy();
  });

  it('renders scroll icon when getEquippedScrolls().egg is valid', () => {
    storeMock.getEquippedScrolls = () => ({ egg: 'fireScroll' });
    useStore.mockReturnValue(storeMock);
    const { getByTestId } = render(<EggClicker />);
    expect(getByTestId('scroll-icon')).toBeTruthy();
  });

  it('reset-button calls resetProgress()', () => {
    const { getByTestId } = render(<EggClicker />);
    fireEvent.press(getByTestId('reset-button'));
    expect(storeMock.resetProgress).toHaveBeenCalledTimes(1);
  });

  it('handles empty or undefined items.hammers without crashing', () => {
    // ── Case A: items.hammers = []
    storeMock.items.hammers = [];
    useStore.mockReturnValue(storeMock);
    let query = render(<EggClicker />).queryByTestId('hammer-icon-basic');
    expect(query).toBeNull();

    // ── Case B: items.hammers is undefined
    storeMock.items = { totems: [], scrolls: { egg: [] }, potions: [] };
    useStore.mockReturnValue(storeMock);
    query = render(<EggClicker />).queryByTestId(/^hammer-icon-/);
    expect(query).toBeNull();
  });

  it('pressing egg when egg is null does nothing', () => {
    storeMock.egg = null;
    useStore.mockReturnValue(storeMock);
    const { getByTestId } = render(<EggClicker />);
    fireEvent.press(getByTestId('egg-button'));

    expect(storeMock.incrementEggProgress).not.toHaveBeenCalled();
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('does not call anything if clicksNeeded is undefined', () => {
    storeMock.egg = {
      img: { uri: 'egg.png' },
      // clicksNeeded is completely omitted
      progress: 1,
      type: 'dragon',
    };
    useStore.mockReturnValue(storeMock);
    const { getByTestId } = render(<EggClicker />);
    fireEvent.press(getByTestId('egg-button'));

    expect(storeMock.incrementEggProgress).not.toHaveBeenCalled();
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('clicking with no hammer/totem/scroll still shows “+1”', () => {
    storeMock.egg = {
      img: { uri: 'egg.png' },
      clicksNeeded: 3,
      progress: 0,
      type: 'dragon',
    };
    storeMock.getHammerBonusClicks = () => 0;
    storeMock.getTotemEffects = () => ({ clickBonus: 0 });
    storeMock.getEquippedScrolls = () => ({ egg: null });
    useStore.mockReturnValue(storeMock);

    const { getByTestId } = render(<EggClicker />);
    fireEvent.press(getByTestId('egg-button'));
    const plusChildren = getByTestId('plus-one-text').props.children;
    expect(plusChildren.join('')).toBe('+1');

    expect(storeMock.incrementEggProgress).toHaveBeenCalled();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('Medium');
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });

  it('applies a totem click bonus and shows “+3” when base=1 + totem=2', () => {
    storeMock.items.totems = ['dragon'];
    storeMock.getTotemEffects = () => ({ clickBonus: 2 });
    useStore.mockReturnValue(storeMock);

    const { getByTestId } = render(<EggClicker />);
    expect(getByTestId('plus-one-text').props.children.join('')).toBe('+1');

    fireEvent.press(getByTestId('egg-button'));
    const updated = getByTestId('plus-one-text').props.children.join('');
    expect(updated).toBe('+3');

    expect(storeMock.incrementEggProgress).toHaveBeenCalled();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('Medium');
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });

  it('shows a hatch toast when progress + total ≥ clicksNeeded', () => {
    storeMock.egg = {
      img: { uri: 'egg.png' },
      clicksNeeded: 3,
      progress: 1,
      type: 'dragon',
    };
    storeMock.getHammerBonusClicks = () => 0;
    storeMock.getTotemEffects = () => ({ clickBonus: 1 });
    useStore.mockReturnValue(storeMock);

    const { getByTestId } = render(<EggClicker />);
    fireEvent.press(getByTestId('egg-button'));

    expect(Toast.show).toHaveBeenCalledTimes(1);
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        text1: 'Egg Hatched!',
        text2: expect.stringContaining('dragon'),
      })
    );
    expect(storeMock.incrementEggProgress).toHaveBeenCalled();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('Medium');
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });

  it('does NOT show a toast when progress + total < clicksNeeded', () => {
    storeMock.egg = {
      img: { uri: 'egg.png' },
      clicksNeeded: 5,
      progress: 1,
      type: 'dragon',
    };
    storeMock.getHammerBonusClicks = () => 0;
    storeMock.getTotemEffects = () => ({ clickBonus: 0 });
    storeMock.getEquippedScrolls = () => ({ egg: null });
    useStore.mockReturnValue(storeMock);

    const { getByTestId } = render(<EggClicker />);
    fireEvent.press(getByTestId('egg-button'));

    expect(Toast.show).not.toHaveBeenCalled();
    expect(storeMock.incrementEggProgress).toHaveBeenCalled();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('Medium');
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });
});
describe('Additional edge‐case branches in <EggClicker />', () => {
  it('does nothing (no progress/Toast/Haptics) when clicksNeeded === 0 and egg exists', () => {
    // Arrange: egg exists but its clicksNeeded is explicitly 0
    storeMock.egg = {
      img: { uri: 'egg.png' },
      clicksNeeded: 0,
      progress: 2,
      type: 'dragon',
    };
    useStore.mockReturnValue(storeMock);
    useStore.getState = () => storeMock;

    const { getByTestId } = render(<EggClicker />);
    fireEvent.press(getByTestId('egg-button'));

    // Because clicksNeeded===0, handlePress returns immediately
    expect(storeMock.incrementEggProgress).not.toHaveBeenCalled();
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('renders the progress‐bar when clicksNeeded > 0 and boost is zero (default)', () => {
    // Default storeMock has clicksNeeded = 5, progress = 1, boost = 0
    // So <View testID="progress-bar-container"> should be in the tree,
    // and <Text testID="progress-bar-text"> should read "1 / 5".
    storeMock.egg = {
      img: { uri: 'egg.png' },
      clicksNeeded: 5,
      progress: 1,
      type: 'dragon',
    };
    // getEggBoost() is still ()=>0 by default
    useStore.mockReturnValue(storeMock);
    useStore.getState = () => storeMock;

    const { getByTestId } = render(<EggClicker />);
    // The container should exist
    expect(getByTestId('progress-bar-container')).toBeTruthy();
    // Since boost = 0, Math.round(5 * (1 - 0)) = 5 ⇒ text is "1 / 5"
    expect(getByTestId('progress-bar-text').props.children.join('')).toBe('1 / 5');
  });

  it('does not render a <Image testID="scroll-icon"> when no scroll is equipped', () => {
    // By default, getEquippedScrolls() => { egg: null } ⇒ scrollImage = null
    // So no scroll icon should appear.
    storeMock.getEquippedScrolls = () => ({ egg: null });
    useStore.mockReturnValue(storeMock);
    useStore.getState = () => storeMock;

    const { queryByTestId } = render(<EggClicker />);
    expect(queryByTestId('scroll-icon')).toBeNull();
  });

  it('skips rendering a hammer if ownedHammerIds contains an invalid key', () => {
    // Pretend the store thinks we own a hammer called "xyz" that doesn't exist in itemData.hammers
    storeMock.items.hammers = ['xyz'];
    useStore.mockReturnValue(storeMock);
    useStore.getState = () => storeMock;

    const { queryByTestId } = render(<EggClicker />);
    // itemData.hammers["xyz"] is undefined, so the map returns null → no hammer icon
    expect(queryByTestId('hammer-icon-xyz')).toBeNull();
  });
});
// ──────────────────────────────────────────────────────────────────────────────
// Append these to the bottom of your existing `index.test.js`:
// ──────────────────────────────────────────────────────────────────────────────

describe('Edge‐case branches for totem/scroll rendering', () => {
  it('does NOT render a totem icon when items.totems contains an invalid ID', () => {
    // Arrange: pretend the store thinks we own a totem called "xyz" that doesn't exist in itemData.totems
    storeMock.items.totems = ['xyz']; 
    useStore.mockReturnValue(storeMock);
    useStore.getState = () => storeMock;

    const { queryByTestId } = render(<EggClicker />);
    // Since itemData.totems["xyz"] is undefined, the component should return null and not render a <Image testID="totem-icon">.
    expect(queryByTestId('totem-icon')).toBeNull();
  });

  it('does NOT render a totem icon when items.totems is completely undefined', () => {
    // Arrange: remove the "totems" key from items
    delete storeMock.items.totems;
    useStore.mockReturnValue(storeMock);
    useStore.getState = () => storeMock;

    const { queryByTestId } = render(<EggClicker />);
    // Because items.totems → undefined, `const ownedTotemIds = items.totems || []` → [],
    // so totemImage becomes null, and no totem icon is rendered.
    expect(queryByTestId('totem-icon')).toBeNull();
  });

  it('does NOT render a scroll icon when getEquippedScrolls().egg returns an invalid ID', () => {
    // Arrange: pretend we “equipped” a scroll with ID "badScroll" not found in itemData.scrolls.egg
    storeMock.getEquippedScrolls = () => ({ egg: 'badScroll' });
    useStore.mockReturnValue(storeMock);
    useStore.getState = () => storeMock;

    const { queryByTestId } = render(<EggClicker />);
    // `const scrollImage = itemData.scrolls['egg'].find(...)?.image`: 
    // since no one has id="badScroll", scrollImage becomes undefined,
    // so <Image testID="scroll-icon" .../> is not rendered.
    expect(queryByTestId('scroll-icon')).toBeNull();
  });
});
// ──────────────────────────────────────────────────────────────────────────────
// Append these to the very end of __tests__/index.test.js:
// ──────────────────────────────────────────────────────────────────────────────

describe('Remaining edge‐case branches in <EggClicker />', () => {
  it('applies a hammer bonus (no totem) and shows “+3” when base=1 + hammerBonus=2', () => {
    // Arrange: no totem owned, but getHammerBonusClicks() returns 2
    storeMock.items.totems = [];                        // ensures ownsTotem === false
    storeMock.getHammerBonusClicks = () => 2;            // hammer‐only bonus of +2
    storeMock.getTotemEffects = () => ({ clickBonus: 0 });
    useStore.mockReturnValue(storeMock);
    useStore.getState = () => storeMock;

    const { getByTestId } = render(<EggClicker />);
    // Before pressing, the Animated.Text should say "+1"
    expect(getByTestId('plus-one-text').props.children.join('')).toBe('+1');

    // Act: press the egg once
    fireEvent.press(getByTestId('egg-button'));

    // After pressing, clickBonus becomes 1 (base) + 2 (hammer) = 3
    expect(getByTestId('plus-one-text').props.children.join('')).toBe('+3');

    // And of course the side‐effects still fire:
    expect(storeMock.incrementEggProgress).toHaveBeenCalled();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('Medium');
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });

  it('renders a totem icon instead of hammer icons when ownsTotem is true AND totemImage exists', () => {
    // Arrange: We own both a hammer “basic” (default) and a totem “dragon”
    // In that case, ownedHammerIds.map(...) should enter the branch 
    //   if (ownsTotem && totemImage) { …render totem-icon… }
    storeMock.items.hammers  = ['basic'];
    storeMock.items.totems   = ['dragon'];   // totemId = "dragon"
    // Since itemData.totems['dragon'].image is defined by our mock, totemImage !== undefined.
    useStore.mockReturnValue(storeMock);
    useStore.getState = () => storeMock;

    const { getByTestId, queryByTestId } = render(<EggClicker />);

    // We expect to see exactly ONE <Image testID="totem-icon" …/>
    expect(getByTestId('totem-icon')).toBeTruthy();

    // And because we returned early inside that same branch, no hammer‐icon‐basic should exist
    expect(queryByTestId('hammer-icon-basic')).toBeNull();
  });
});



