import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UploadForm } from './UploadForm';

describe('UploadForm', () => {
  it('renders file input and submit button', () => {
    render(<UploadForm />);
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByText('Upload & Extract Metadata')).toBeInTheDocument();
  });
});
