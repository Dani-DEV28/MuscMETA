import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AlbumCard } from './AlbumCard';

describe('AlbumCard', () => {
  it('renders album name and fallback image', () => {
    render(<AlbumCard album={{ id: 1, name: 'Test Album', image: null, imageMime: null }} />);
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/img/CD-Image.jpg');
  });
});
