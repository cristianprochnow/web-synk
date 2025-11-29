/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { NotFound } from '../../src/screens/NotFound';

describe('screens/NotFound', () => {
    it('should render the Not Found text', () => {
        render(<NotFound />);



        const message = screen.getByText(/not found/i);

        expect(message).toBeInTheDocument();
    });
});