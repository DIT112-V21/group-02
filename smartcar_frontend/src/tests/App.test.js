import { render, screen } from '@testing-library/react';
import App from '../App';

test('has homepage', () => {
  render(<App />);
  const smartcar = screen.getAllByText(/SmartCar Shield/i);
  const race = screen.getAllByText(/Race/i);
  const leaderboard = screen.getByText(/Leaderboard/i);
  const race_times = screen.getByText(/Race Times/i);
  expect(smartcar);
  expect(race);
  expect(leaderboard);
  expect(race_times);
});
