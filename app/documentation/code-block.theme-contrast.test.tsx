import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CodeBlock } from './code-block';

describe('CodeBlock theme contrast', () => {
  const sampleCode = 'npm install commitpulse';

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders copy button with light and dark theme contrast classes', () => {
    render(<CodeBlock code={sampleCode} />);

    const button = screen.getByRole('button', {
      name: /copy code snippet/i,
    });

    expect(button.className).toContain('border-black/10');
    expect(button.className).toContain('bg-gray-100');
    expect(button.className).toContain('text-gray-700');

    expect(button.className).toContain('dark:border-white/10');
    expect(button.className).toContain('dark:bg-black/70');
    expect(button.className).toContain('dark:text-white/65');
  });

  it('renders code container with light and dark theme contrast classes', () => {
    const { container } = render(<CodeBlock code={sampleCode} />);

    const pre = container.querySelector('pre');

    expect(pre).not.toBeNull();

    expect(pre?.className).toContain('border-black/10');
    expect(pre?.className).toContain('bg-gray-100');
    expect(pre?.className).toContain('text-emerald-700');

    expect(pre?.className).toContain('dark:border-white/8');
    expect(pre?.className).toContain('dark:bg-[#030303]');
    expect(pre?.className).toContain('dark:text-emerald-300');
  });

  it('includes theme-aware hover contrast styles on the copy button', () => {
    render(<CodeBlock code={sampleCode} />);

    const button = screen.getByRole('button', {
      name: /copy code snippet/i,
    });

    expect(button.className).toContain('hover:border-black/20');
    expect(button.className).toContain('hover:text-black');

    expect(button.className).toContain('dark:hover:border-white/20');
    expect(button.className).toContain('dark:hover:text-white');
  });

  it('updates to copied state with accessible label after copy action', async () => {
    render(<CodeBlock code={sampleCode} />);

    const button = screen.getByRole('button', {
      name: /copy code snippet/i,
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: /copied snippet/i,
        })
      ).toBeDefined();
    });

    expect(screen.getByText('Copied')).toBeDefined();
  });

  it('renders code content inside the themed code container', () => {
    const { container } = render(<CodeBlock code={sampleCode} />);

    const codeElement = screen.getByText(sampleCode);
    const pre = container.querySelector('pre');

    expect(codeElement).toBeDefined();
    expect(pre).not.toBeNull();
    expect(pre?.contains(codeElement)).toBe(true);
  });
});
