/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { toast } from 'react-toastify';
import * as UserApi from '../../src/api/users';
import { Login } from '../../src/screens/Login';


const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

const mockLogIn = jest.fn();
jest.mock('../../src/contexts/Auth', () => ({
    useAuth: () => ({ logIn: mockLogIn }),
}));

jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('../../src/api/users');

describe('screens/Login', () => {
    const user = userEvent.setup({ delay: null });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it('should render email and password fields', () => {
        render(<MemoryRouter><Login /></MemoryRouter>);

        expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();

        expect(screen.getByRole('link', { name: /crie aqui/i })).toHaveAttribute('href', '/register');
    });

    it('should toggle password visibility', () => {
        const { container } = render(<MemoryRouter><Login /></MemoryRouter>);
        const passInput = screen.getByLabelText(/Senha/i);
        const toggleBtn = container.querySelector('.field-login span');

        expect(passInput).toHaveAttribute('type', 'password');

        fireEvent.click(toggleBtn!);
        expect(passInput).toHaveAttribute('type', 'text');

        fireEvent.click(toggleBtn!);
        expect(passInput).toHaveAttribute('type', 'password');
    });

    it('should show error toast on login failure', async () => {
        (UserApi.login as jest.Mock).mockResolvedValue({
            resource: { ok: false, error: 'Invalid credentials' }
        });

        render(<MemoryRouter><Login /></MemoryRouter>);

        await user.type(screen.getByLabelText(/E-mail/i), 'wrong@test.com');
        await user.type(screen.getByLabelText(/Senha/i), 'wrongpass');
        await user.click(screen.getByRole('button', { name: /enviar/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Erro no login: Invalid credentials');
            expect(mockLogIn).not.toHaveBeenCalled();
        });
    });

    it('should login successfully and redirect after timeout', async () => {
        jest.useFakeTimers();

        (UserApi.login as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            user: {
                user_id: 1,
                user_email: 'test@test.com',
                user_name: 'Test User',
                token: 'jwt-token'
            }
        });

        render(<MemoryRouter><Login /></MemoryRouter>);

        await user.type(screen.getByLabelText(/E-mail/i), 'test@test.com');
        await user.type(screen.getByLabelText(/Senha/i), 'correctpass');
        await user.click(screen.getByRole('button', { name: /enviar/i }));


        await waitFor(() => {
            expect(UserApi.login).toHaveBeenCalledWith({
                user_email: 'test@test.com',
                user_pass: 'correctpass'
            });
        });


        expect(mockLogIn).toHaveBeenCalledWith('jwt-token', {
            email: 'test@test.com',
            id: 1,
            name: 'Test User'
        });

        expect(toast.success).toHaveBeenCalledWith('Login realizado com sucesso! Redirecionando...');


        expect(mockNavigate).not.toHaveBeenCalled();
        jest.runAllTimers();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});