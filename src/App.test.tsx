import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Move the robot header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Move the robot/i);
  expect(linkElement).toBeInTheDocument();
});

test('render the room SVG', () => {
  render(<App />);
  const roomSvg = screen.getByRole('room');
  expect(roomSvg).toBeInTheDocument();
});