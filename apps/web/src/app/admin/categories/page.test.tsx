import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CategoriesPage from './page';
import { api } from '../../lib/api';

vi.stubGlobal('React', React);

vi.mock('../../lib/api', () => ({
  api: { getCategories: vi.fn(), updateCategory: vi.fn() },
}));

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('category editing', () => {
  it('keeps an active category visible when its details are saved', async () => {
    vi.mocked(api.getCategories).mockResolvedValue([{ id: '1', name: 'کتاب', slug: 'books', parentId: null, status: 'active' }]);
    vi.mocked(api.updateCategory).mockResolvedValue({});

    render(<CategoriesPage />);
    fireEvent.click(await screen.findByText('ویرایش'));
    fireEvent.click(screen.getByText('ذخیره'));

    await waitFor(() => expect(api.updateCategory).toHaveBeenCalledWith('1', expect.objectContaining({ status: 'active', parentId: null })));
  });
});
