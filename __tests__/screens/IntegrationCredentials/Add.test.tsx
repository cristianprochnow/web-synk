/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { toast } from 'react-toastify';
import * as IntCredentialsApi from '../../../src/api/intCredentials';
import { Add } from '../../../src/screens/IntegrationCredentials/Add';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../src/contexts/Auth', () => ({
    useAuth: () => ({
        request: (callback: (token: string) => Promise<any>) => callback('fake-token'),
    }),
}));

jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() }
}));

jest.mock('../../../src/api/intCredentials');

describe('screens/integrations/Add', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render form fields', () => {
        render(<MemoryRouter><Add /></MemoryRouter>);

        expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/plataforma/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/configuração/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    });

    it('should call API and navigate on success', async () => {
        (IntCredentialsApi.addIntCredential as jest.Mock).mockResolvedValue({
            resource: { ok: true }
        });

        render(<MemoryRouter><Add /></MemoryRouter>);


        await user.type(screen.getByLabelText(/nome/i), 'New Bot');


        await user.selectOptions(screen.getByLabelText(/plataforma/i), 'discord');



        await user.type(screen.getByLabelText(/configuração/i), '{{"key": "value"}');


        await user.click(screen.getByRole('button', { name: /salvar/i }));


        await waitFor(() => {
            expect(IntCredentialsApi.addIntCredential).toHaveBeenCalledWith({
                int_credential_name: 'New Bot',
                int_credential_type: 'discord',
                int_credential_config: '{"key": "value"}'
            }, 'fake-token');
        });

        expect(toast.success).toHaveBeenCalledWith('Integração criada com sucesso!');
        expect(mockNavigate).toHaveBeenCalledWith('/integrations');
    });

    it('should show error toast on failure', async () => {
        (IntCredentialsApi.addIntCredential as jest.Mock).mockResolvedValue({
            resource: { ok: false, error: 'API Error' }
        });

        render(<MemoryRouter><Add /></MemoryRouter>);

        await user.click(screen.getByRole('button', { name: /salvar/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Erro durante a criação da integração: API Error');
        });

        expect(mockNavigate).not.toHaveBeenCalledWith('/integrations');
    });
});