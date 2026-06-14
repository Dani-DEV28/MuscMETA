import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetadataDisplay } from './MetadataDisplay';

describe('MetadataDisplay', () => {
  it('renders all fields when full track data provided', () => {
    render(
      <MetadataDisplay
        track={{ number: 1, name: 'Song', duration: '03:45', genre: 'Rock', bitrate: 320, codec: 'mp3', year: 2020 }}
      />
    );
    expect(screen.getByText('Track')).toBeInTheDocument();
    expect(screen.getByText('1. Song')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('03:45')).toBeInTheDocument();
    expect(screen.getByText('Genre')).toBeInTheDocument();
    expect(screen.getByText('Rock')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('Bitrate')).toBeInTheDocument();
    expect(screen.getByText('320 kbps')).toBeInTheDocument();
    expect(screen.getByText('Codec')).toBeInTheDocument();
    expect(screen.getByText('mp3')).toBeInTheDocument();
  });

  it('hides null fields — only renders Track, Genre, Year, Codec', () => {
    render(
      <MetadataDisplay
        track={{ number: 1, name: 'Song', duration: null, genre: 'Rock', bitrate: null, codec: 'mp3', year: 2020 }}
      />
    );
    expect(screen.getByText('Track')).toBeInTheDocument();
    expect(screen.getByText('Genre')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Codec')).toBeInTheDocument();
    expect(screen.queryByText('Duration')).not.toBeInTheDocument();
    expect(screen.queryByText('Bitrate')).not.toBeInTheDocument();
  });

  it('formats bitrate as 320 kbps', () => {
    render(
      <MetadataDisplay
        track={{ number: 1, name: 'Song', duration: null, genre: null, bitrate: 320, codec: null, year: null }}
      />
    );
    expect(screen.getByText('320 kbps')).toBeInTheDocument();
  });

  it('renders track number + name as "2. Song"', () => {
    render(
      <MetadataDisplay
        track={{ number: 2, name: 'Song', duration: null, genre: null, bitrate: null, codec: null, year: null }}
      />
    );
    expect(screen.getByText('2. Song')).toBeInTheDocument();
  });

  it('when all nullable fields null, only renders Track line', () => {
    render(
      <MetadataDisplay
        track={{ number: 1, name: 'Song', duration: null, genre: null, bitrate: null, codec: null, year: null }}
      />
    );
    const terms = screen.getAllByRole('term');
    expect(terms).toHaveLength(1);
    expect(terms[0]).toHaveTextContent('Track');
  });
});
