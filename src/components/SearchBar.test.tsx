import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from './SearchBar';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));

describe('SearchBar', () => {
  it('submits search query', () => {
    render(<SearchBar />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Madonna' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(mockPush).toHaveBeenCalledWith('/search?q=Madonna');
  });
});
