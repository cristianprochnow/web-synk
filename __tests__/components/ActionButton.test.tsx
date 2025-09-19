/**
 * @jest-environment jest-environment-jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { Plus } from 'lucide-react';
import { ActionButton } from '../../src/components/ActionButton';

describe('components/ActionButton', () => {
    it('should render with the correct label', () => {
        render(<ActionButton label="Adicionar Item" Icon={Plus} />);

        const buttonElement = screen.getByRole('button', { name: /adicionar item/i });
        
        expect(buttonElement).toBeInTheDocument();
    });

    it('should call onClick handler when clicked', () => {
        // Cria uma função "mock" para simular o clique
        const handleClick = jest.fn();

        render(<ActionButton label="Adicionar" Icon={Plus} onClick={handleClick} />);

        const buttonElement = screen.getByRole('button', { name: /adicionar/i });
        fireEvent.click(buttonElement);

        // Verifica se a função foi chamada exatamente uma vez
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when the disabled prop is true', () => {
        render(<ActionButton label="Adicionar" Icon={Plus} disabled />);

        const buttonElement = screen.getByRole('button', { name: /adicionar/i });
        
        expect(buttonElement).toBeDisabled();
    });
});