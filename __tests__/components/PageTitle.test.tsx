/**
 * @jest-environment jest-environment-jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PageTitle } from '../../src/components/PageTitle';

describe('components/PageTitle', () => {
    it('should render the children content correctly', () => {
        render(<PageTitle>Meu Painel</PageTitle>);

        const titleElement = screen.getByText(/meu painel/i);
        
        expect(titleElement).toBeInTheDocument();
    });

    it('should render as a level 1 heading', () => {
        render(<PageTitle>Configurações</PageTitle>);

        const headingElement = screen.getByRole('heading', { level: 1, name: /configurações/i });
        
        expect(headingElement).toBeInTheDocument();
        expect(headingElement.tagName).toBe('H1');
    });
});