/**
 * @jest-environment jest-environment-jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { toast } from 'react-toastify';


import { Register } from '../../src/screens/Register';

import * as UserApi from '../../src/api/users';




const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));


const mockLogIn = jest.fn();
jest.mock('../../src/contexts/Auth', () => ({
  useAuth: () => ({
    logIn: mockLogIn,
  }),
}));


jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));


jest.mock('../../src/api/users');

describe('screens/Register', () => {
  const user = userEvent.setup({ delay: null });

  beforeEach(() => {
    jest.clearAllMocks();

    jest.useRealTimers();
  });



  it('should render all form fields and buttons', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );


    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirme a senha/i)).toBeInTheDocument();


    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /faça login/i })).toBeInTheDocument();
  });

  it('should toggle password visibility', async () => {
    const { container } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const passInput = screen.getByLabelText(/^Senha/i);


    const togglePassBtn = container.querySelectorAll('.field-login span')[0];


    expect(passInput).toHaveAttribute('type', 'password');


    fireEvent.click(togglePassBtn);
    expect(passInput).toHaveAttribute('type', 'text');


    fireEvent.click(togglePassBtn);
    expect(passInput).toHaveAttribute('type', 'password');
  });



  it('should show error toast when passwords do not match (Client-side validation)', async () => {
    render(
        <MemoryRouter><Register /></MemoryRouter>
    );


    await user.type(screen.getByLabelText(/Nome/i), 'Test User');
    await user.type(screen.getByLabelText(/^Senha/i), '123');
    await user.type(screen.getByLabelText(/Confirme a senha/i), '456');


    await user.click(screen.getByRole('button', { name: /enviar/i }));


    expect(toast.error).toHaveBeenCalledWith('Senhas inseridas são diferentes');

    expect(UserApi.register).not.toHaveBeenCalled();
  });

  it('should handle API failure (Server-side validation)', async () => {

    const mockErrorResponse = {
      resource: {
        ok: false,
        error: 'Email already registered'
      },
      user: null
    };


    (UserApi.register as jest.Mock).mockResolvedValue(mockErrorResponse);

    render(<MemoryRouter><Register /></MemoryRouter>);


    await user.type(screen.getByLabelText(/Nome/i), 'Test User');
    await user.type(screen.getByLabelText(/^E-mail/i), 'test@test.com');
    await user.type(screen.getByLabelText(/^Senha/i), 'password123');
    await user.type(screen.getByLabelText(/Confirme a senha/i), 'password123');


    await user.click(screen.getByRole('button', { name: /enviar/i }));


    await waitFor(() => {
        expect(UserApi.register).toHaveBeenCalled();
    });


    expect(toast.error).toHaveBeenCalledWith('Erro na criação da conta: Email already registered');

    expect(mockLogIn).not.toHaveBeenCalled();
  });

  it('should handle API success: Login, Toast, and Redirect', async () => {

    jest.useFakeTimers();


    const mockSuccessResponse = {
      resource: { ok: true, error: '' },
      user: {
        user_id: 99,
        token: 'fake-jwt-token-123'
      }
    };
    (UserApi.register as jest.Mock).mockResolvedValue(mockSuccessResponse);

    render(<MemoryRouter><Register /></MemoryRouter>);


    await user.type(screen.getByLabelText(/Nome/i), 'New User');
    await user.type(screen.getByLabelText(/^E-mail/i), 'new@user.com');
    await user.type(screen.getByLabelText(/^Senha/i), 'secret');
    await user.type(screen.getByLabelText(/Confirme a senha/i), 'secret');


    await user.click(screen.getByRole('button', { name: /enviar/i }));


    await waitFor(() => {
        expect(UserApi.register).toHaveBeenCalledWith({
            user_name: 'New User',
            user_email: 'new@user.com',
            user_pass: 'secret'
        });
    });



    expect(mockLogIn).toHaveBeenCalledWith('fake-jwt-token-123', {
        email: 'new@user.com',
        id: 99,
        name: 'New User'
    });


    expect(toast.success).toHaveBeenCalledWith('Conta criada com sucesso! Redirecionando...');



    expect(mockNavigate).not.toHaveBeenCalled();


    jest.runAllTimers();


    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});