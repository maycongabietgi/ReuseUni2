import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import SplashScreen from '../SplashScreen';

// Mock react-navigation
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native-stack', () => ({
  ...jest.requireActual('@react-navigation/native-stack'),
}));

// Mock LinearGradient (bắt buộc)
jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props: any) => <View {...props} />;
});

// Mock image require
jest.mock('../../../assets/ic_reuseuni.png', () => 1);

describe('SplashScreen', () => {
  it('renders correctly without crashing', () => {
    const { getByTestId } = render(
      <SplashScreen navigation={{ navigate: mockNavigate } as any} />,
    );

    expect(getByTestId('splash-root')).toBeTruthy();
  });

  it('renders logo image', () => {
    const { getByTestId } = render(
      <SplashScreen navigation={{ navigate: mockNavigate } as any} />,
    );

    expect(getByTestId('splash-logo')).toBeTruthy();
  });

  it('navigates to Waiting when pressed', () => {
    const { getByTestId } = render(
      <SplashScreen navigation={{ navigate: mockNavigate } as any} />,
    );

    fireEvent.press(getByTestId('splash-root'));

    expect(mockNavigate).toHaveBeenCalledWith('Waiting');
  });
});
