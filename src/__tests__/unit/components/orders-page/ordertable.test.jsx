import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrderTable from '../../../../components/orders-page/OrderTable';

describe('OrderTable Component (Entry Table)', () => {
  const renderComponent = (props = {}) =>
    render(
      <BrowserRouter>
        <OrderTable {...props} />
      </BrowserRouter>
    );

  it('renders the order entry table', () => {
    renderComponent();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders all expected column headers', () => {
    renderComponent();

    expect(screen.getByText('Product Code')).toBeInTheDocument();
    expect(screen.getByText('Product Name')).toBeInTheDocument();
    expect(screen.getByText('Qty')).toBeInTheDocument();
    expect(screen.getByText('Rate')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('GST %')).toBeInTheDocument();
    expect(screen.getByText('Act')).toBeInTheDocument();
  });

  it('renders an editable row by default', () => {
    renderComponent();

    // react-select input
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    // quantity input
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
  });

  it('renders Add Item button', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
  });
});
