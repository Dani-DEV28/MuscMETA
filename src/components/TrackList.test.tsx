import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TrackList } from './TrackList';

describe('TrackList', () => {
  it('renders tracks', () => {
    const tracks = [{ id: 1, number: 1, name: 'Song A', duration: '03:45' }];
    render(<TrackList tracks={tracks} />);
    expect(screen.getByText(/Song A/)).toBeInTheDocument();
    expect(screen.getByText('03:45')).toBeInTheDocument();
  });
});
