/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { toast } from 'react-toastify';
import * as IntCredentialsApi from '../../../src/api/intCredentials';
import { Edit } from '../../../src/screens/IntegrationCredentials/Edit';


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

describe('screens/integrations/Edit', () => {
    const user = userEvent.setup();
    const mockConfirm = jest.spyOn(window, 'confirm');

    beforeEach(() => {
        jest.clearAllMocks();
        mockConfirm.mockReturnValue(true);
    });

    const renderComponent = (id = '123') => {
        render(
            <MemoryRouter initialEntries={[`/integrations/edit/${id}`]}>
                <Routes>
                    <Route path="/integrations/edit/:int_credential_id" element={<Edit />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('should load credential info and fill inputs', async () => {
        const mockItem = {
            int_credential_id: 123,
            int_credential_name: 'Existing Bot Name',
            int_credential_type: 'telegram',
            int_credential_config: '{"token": "123"}'
        };

        (IntCredentialsApi.listCredentials as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            int_credentials: [mockItem]
        });
        (IntCredentialsApi.hasCredentials as jest.Mock).mockReturnValue(true);

        renderComponent('123');


        await waitFor(() => {
            expect(IntCredentialsApi.listCredentials).toHaveBeenCalledWith({
                credentialId: 123,
                includeConfig: true
            }, 'fake-token');
        });


        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Bot Name')).toBeInTheDocument();
            expect(screen.getByDisplayValue('{"token": "123"}')).toBeInTheDocument();
        });


        const select = screen.getByLabelText(/plataforma/i) as HTMLSelectElement;
        await waitFor(() => {
            expect(select.value).toBe('telegram');
        });
    });

    it('should update credential successfully', async () => {

        (IntCredentialsApi.listCredentials as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            int_credentials: [{
                int_credential_id: 123,
                int_credential_name: 'Old Name',
                int_credential_type: 'telegram',
                int_credential_config: 'Old Config'
            }]
        });
        (IntCredentialsApi.hasCredentials as jest.Mock).mockReturnValue(true);


        (IntCredentialsApi.editIntCredential as jest.Mock).mockResolvedValue({ resource: { ok: true } });

        renderComponent('123');


        await waitFor(() => {
            expect(screen.getByDisplayValue('Old Name')).toBeInTheDocument();
        });


        const nameInput = screen.getByLabelText(/nome/i);
        await user.clear(nameInput);
        await user.type(nameInput, 'Updated Name');


        await user.selectOptions(screen.getByLabelText(/plataforma/i), 'discord');


        await user.click(screen.getByRole('button', { name: /salvar/i }));

        await waitFor(() => {
            expect(IntCredentialsApi.editIntCredential).toHaveBeenCalledWith({
                int_credential_id: 123,
                int_credential_name: 'Updated Name',
                int_credential_type: 'discord',
                int_credential_config: 'Old Config'
            }, 'fake-token');
        });

        expect(toast.success).toHaveBeenCalledWith('Integração atualizada com sucesso!');
        expect(mockNavigate).toHaveBeenCalledWith('/integrations');
    });

    it('should delete credential after confirmation', async () => {

        (IntCredentialsApi.listCredentials as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            int_credentials: [{ int_credential_id: 123 }]
        });
        (IntCredentialsApi.hasCredentials as jest.Mock).mockReturnValue(true);


        (IntCredentialsApi.deleteIntCredential as jest.Mock).mockResolvedValue({ resource: { ok: true } });

        renderComponent('123');


        await waitFor(() => expect(IntCredentialsApi.listCredentials).toHaveBeenCalled());

        const deleteBtn = screen.getByRole('button', { name: /excluir/i });
        fireEvent.click(deleteBtn);

        expect(mockConfirm).toHaveBeenCalled();

        await waitFor(() => {
            expect(IntCredentialsApi.deleteIntCredential).toHaveBeenCalledWith(123, 'fake-token');
        });

        expect(toast.success).toHaveBeenCalledWith('Integração excluída com sucesso!');
        expect(mockNavigate).toHaveBeenCalledWith('/integrations');
    });
});