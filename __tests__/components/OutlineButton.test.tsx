/**
 * @jest-environment jest-environment-jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { Edit } from 'lucide-react';
import { OutlineButton } from '../../src/components/OutlineButton';

describe('components/OutlineButton', () => {
    it('should render with the correct label', () => {
        render(<OutlineButton label="Editar Perfil" Icon={Edit} />);

        const buttonElement = screen.getByRole('button', { name: /editar perfil/i });
        
        expect(buttonElement).toBeInTheDocument();
    });

    it('should call onClick handler when clicked', () => {
        const handleClick = jest.fn();

        render(<OutlineButton label="Editar" Icon={Edit} onClick={handleClick} />);

        const buttonElement = screen.getByRole('button', { name: /editar/i });
        fireEvent.click(buttonElement);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when the disabled prop is true', () => {
        render(<OutlineButton label="Editar" Icon={Edit} disabled />);

        const buttonElement = screen.getByRole('button', { name: /editar/i });
        
        expect(buttonElement).toBeDisabled();
    });
});