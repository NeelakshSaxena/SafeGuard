import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('SafeGuard Dashboard', () => {
  it('renders the main heading', () => {
    render(<App />);
    expect(screen.getByText('SafeGuard Dashboard')).toBeDefined();
  });

  it('renders the system status', () => {
    render(<App />);
    expect(screen.getByText('WebSocket Status:')).toBeDefined();
  });
});
