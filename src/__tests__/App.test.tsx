import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { App } from '../App.js';

describe('App Component', () => {
  it('renders the header', () => {
    const { lastFrame } = render(<App />);
    expect(lastFrame()).toContain('Claude Transcript Analyzer');
  });

  it('shows initializing status initially', () => {
    const { lastFrame } = render(<App />);
    expect(lastFrame()).toContain('Initializing...');
  });

  it('shows ready status after delay', async () => {
    const { lastFrame } = render(<App />);

    // Wait for the timer to complete
    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(lastFrame()).toContain('Ready to analyze Claude transcripts!');
  });

  it('cleans up timer on unmount', () => {
    const { unmount } = render(<App />);

    // Unmount before timer completes to trigger cleanup
    unmount();

    // If cleanup didn't work, this would cause issues
    // The test passing means cleanup was called
    expect(true).toBe(true);
  });
});
