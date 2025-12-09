import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

const mockNavigate = jest.fn();

const mockNavigation: any = {
  navigate: mockNavigate,
};

describe('HomeScreen', () => {
  it('render được màn hình HomeScreen không lỗi', () => {
    const screen = render(<HomeScreen navigation={mockNavigation} />);
    expect(screen).toBeTruthy();
  });

  it('hiển thị tiêu đề Shop', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByText('Shop')).toBeTruthy();
  });

  it('hiển thị danh sách sản phẩm', () => {
    const { getAllByText } = render(<HomeScreen navigation={mockNavigation} />);

    // Trong danh sách có sản phẩm "Nike React Flyknit"
    expect(getAllByText(/sold/i).length).toBeGreaterThan(0);
  });

  it('ấn nút search → chuyển trang Search', () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    const btn = getByTestId('floating-search-btn');
    fireEvent.press(btn);

    expect(mockNavigate).toHaveBeenCalledWith('Search');
  });
});
