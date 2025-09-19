import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Add } from '../../../src/screens/Posts/Add';

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

describe('screens/Add', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('should render the header elements correctly', () => {
        render(
            <MemoryRouter>
                <Add />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: /nova publicação/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    });

    it('should render all form fields', () => {
        render(
            <MemoryRouter>
                <Add />
            </MemoryRouter>
        );

        expect(screen.getByLabelText(/apelido/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/template/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/perfil/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/conteúdo/i)).toBeInTheDocument();
    });

    it('should call navigate with -1 when back button is clicked', () => {
        render(
            <MemoryRouter>
                <Add />
            </MemoryRouter>
        );

        const backButton = screen.getByRole('button', { name: /voltar/i });
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});