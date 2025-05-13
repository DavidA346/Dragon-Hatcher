import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EggClicker from '../app/(tabs)/index';
import useStore from '../store/useStore';

//Mocking Zustand store
jest.mock('../store/useStore', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    currency: 0,
    egg: { img: 'egg.png', clicksNeeded: 5, progress: 3 },
    incrementCurrency: jest.fn(),
    incrementEggProgress: jest.fn(),
    initializeStore: jest.fn(),
    resetProgress: jest.fn(),
  }),
}));

//Test Cases
describe('<EggClicker />', () => {
  //Renders the egg image test
  it('renders egg image', () => {
    const { getByTestId } = render(<EggClicker />);
    expect(getByTestId('egg-image')).toBeTruthy();
  });

  //Makes sure the progress is reset when the button is pressed
  it('calls resetProgress when reset button is pressed', () => {
    const { getByTestId } = render(<EggClicker />);
    //Press the reset button
    fireEvent.press(getByTestId('reset-button'));
    //Check that the resetProgress function is called
    expect(useStore().resetProgress).toHaveBeenCalled();
  });

  //Calls incrementCurrency when egg is pressed
  it('calls incrementCurrency when egg is pressed', () => {
    const { getByTestId } = render(<EggClicker />);
    fireEvent.press(getByTestId('egg-button'));
    expect(useStore().incrementCurrency).toHaveBeenCalled();
  });

  //Calls incrementEggProgress when egg is pressed
  it('calls incrementEggProgress when egg is pressed', () => {
    const { getByTestId } = render(<EggClicker />);
    fireEvent.press(getByTestId('egg-button'));
    expect(useStore().incrementEggProgress).toHaveBeenCalled();
  });

  //Displays progress text based on egg data
  it('displays progress text based on egg data', () => {
    const { getByText } = render(<EggClicker />);
    expect(getByText('3 / 5')).toBeTruthy();
  });

  //Calls initializeStore on mount
  it('calls initializeStore on mount', () => {
    render(<EggClicker />);
    expect(useStore().initializeStore).toHaveBeenCalled();
  });

  //Displays currency text when currency is greater than 0
  it('displays currency text when currency is greater than 0', () => {
    //Mock the Zustand store to simulate a currency value of 3
    useStore.mockReturnValue({
      currency: 3,
      egg: { img: 'egg.png', clicksNeeded: 5, progress: 3 },
      incrementCurrency: jest.fn(),
      incrementEggProgress: jest.fn(),
      initializeStore: jest.fn(),
      resetProgress: jest.fn(),
    });

    const { getByText } = render(<EggClicker />);
    //Check that the currency text is displayed
    expect(getByText('Currency: 3')).toBeTruthy();
  });

  //Does not display currency text when currency is 0
  it('does not display currency text when currency is 0', () => {
    //Mock the Zustand store to simulate a currency value of 0
    useStore.mockReturnValue({
      currency: 0,
      egg: { img: 'egg.png', clicksNeeded: 5, progress: 3 },
      incrementCurrency: jest.fn(),
      incrementEggProgress: jest.fn(),
      initializeStore: jest.fn(),
      resetProgress: jest.fn(),
    });

    const { queryByText } = render(<EggClicker />);
    //Check that the currency text is not displayed
    expect(queryByText('Currency: 0')).toBeNull();
  });
});
