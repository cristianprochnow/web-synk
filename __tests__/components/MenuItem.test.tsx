/**
 * @jest-environment jest-environment-jsdom
 */

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { LayoutTemplate } from 'lucide-react'
import { MemoryRouter } from 'react-router'
import { MenuItem } from '../../src/components/MenuItem'

describe('components/MenuItem', () => {
    it('should render', () => {
        render(
            <MemoryRouter>
                <MenuItem 
                    label="Templates"
                    Icon={LayoutTemplate}
                    isActive={false}
                    to="/templates" 
                />
            </MemoryRouter>
        );

        const linkElement = screen.getByRole('link', { name: /templates/i });
        
        expect(linkElement).toBeInTheDocument();
    })

    it('should have href', () => {
        render(
            <MemoryRouter>
                <MenuItem 
                    label="Templates"
                    Icon={LayoutTemplate}
                    isActive={false}
                    to="/templates" 
                />
            </MemoryRouter>
        );

        const linkElement = screen.getByRole('link', { name: /templates/i });
        
        expect(linkElement).toHaveAttribute('href', '/templates');
    })

    it('should be active', () => {
        render(
            <MemoryRouter>
                <MenuItem 
                    label="Templates"
                    Icon={LayoutTemplate}
                    isActive={true}
                    to="/templates" 
                />
            </MemoryRouter>
        );

        const linkElement = screen.getByRole('link', { name: /templates/i });
        
        expect(linkElement).toHaveClass('menu-item', 'active');
    })

    it('should not be active', () => {
        render(
            <MemoryRouter>
                <MenuItem 
                    label="Templates"
                    Icon={LayoutTemplate}
                    isActive={false}
                    to="/templates" 
                />
            </MemoryRouter>
        );

        const linkElement = screen.getByRole('link', { name: /templates/i });
        
        expect(linkElement).not.toHaveClass('menu-item', 'active');
    })
})