import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders Move the robot header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Move the robot/i);
  expect(linkElement).toBeInTheDocument();
});
