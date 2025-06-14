import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ApiClient } from '../lib/api-client';
import { TaskChart } from './TaskChart';

jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart" />,
}));

jest.mock('../lib/api-client');

test("shows message when there are no tasks", async () => {
  (ApiClient.getTasks as jest.Mock).mockResolvedValue({
    founds: [],
    search_options: {},
  });

  render(<TaskChart />);

  await waitFor(() => {
    expect(screen.getByText(/No tasks to display/i)).toBeInTheDocument();
  });
});
