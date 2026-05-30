import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Button from '../components/common/Button';

describe('Button Component', () => {
  it('renders with children text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

describe('Constants', () => {
  it('should have valid route paths', async () => {
    const { ROUTES } = await import('../constants');
    expect(ROUTES.LOGIN).toBe('/auth/login');
    expect(ROUTES.DASHBOARD).toBe('/dashboard');
  });
});
