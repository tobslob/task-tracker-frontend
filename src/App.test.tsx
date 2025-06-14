import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart" />,
}));

test('renders Task Tracker heading', () => {
  render(<App />);
  const heading = screen.getByText(/Task Tracker/i);
  expect(heading).toBeInTheDocument();
});
