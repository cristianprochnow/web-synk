/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { toast } from 'react-toastify';
import * as ColorsApi from '../../../src/api/colors';
import * as IntCredentialsApi from '../../../src/api/intCredentials';
import * as IntProfilesApi from '../../../src/api/intProfiles';
import { Edit } from '../../../src/screens/IntegrationProfiles/Edit';

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

jest.mock('../../../src/api/intProfiles');
jest.mock('../../../src/api/intCredentials');
jest.mock('../../../src/api/colors');

describe('screens/integration_profiles/Edit', () => {
    const user = userEvent.setup();
    const mockConfirm = jest.spyOn(window, 'confirm');

    const mockColors = [
        { color_id: 1, color_name: 'Red', color_hex: 'FF0000' },
        { color_id: 2, color_name: 'Blue', color_hex: '0000FF' }
    ];
    const mockCredentials = [
        { int_credential_id: 101, int_credential_name: 'Bot A' },
        { int_credential_id: 102, int_credential_name: 'Bot B' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockConfirm.mockReturnValue(true);

        (ColorsApi.listColors as jest.Mock).mockReturnValue(mockColors);
        (IntCredentialsApi.listCredentials as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            int_credentials: mockCredentials
        });
        (IntCredentialsApi.hasCredentials as jest.Mock).mockReturnValue(true);
    });

    const renderComponent = (id = '99') => {
        render(
            <MemoryRouter initialEntries={[`/configs/edit/${id}`]}>
                <Routes>
                    <Route path="/configs/edit/:int_profile_id" element={<Edit />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('should update profile successfully', async () => {
        (IntProfilesApi.listProfiles as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            int_profiles: [{
                int_profile_id: 99,
                int_profile_name: 'Old',
                color_id: 1,
                credentials: []
            }]
        });
        (IntProfilesApi.hasProfiles as jest.Mock).mockReturnValue(true);
        (IntProfilesApi.editIntProfile as jest.Mock).mockResolvedValue({ resource: { ok: true } });

        renderComponent('99');

        // Wait for data load
        await waitFor(() => expect(screen.getByDisplayValue('Old')).toBeInTheDocument());

        // Update Fields
        await user.clear(screen.getByLabelText(/apelido/i));
        await user.type(screen.getByLabelText(/apelido/i), 'Updated Config');

        await user.selectOptions(screen.getByLabelText(/cor/i), '2');

        // Wait for credentials dropdown to populate
        await screen.findByText('Bot A');

        await user.selectOptions(screen.getByLabelText(/integrações/i), ['101', '102']);

        await user.click(screen.getByRole('button', { name: /salvar/i }));

        await waitFor(() => {
            expect(IntProfilesApi.editIntProfile).toHaveBeenCalledWith({
                int_profile_id: 99,
                int_profile_name: 'Updated Config',
                color_id: 2,
                credentials: [101, 102]
            }, 'fake-token');
        });

        expect(toast.success).toHaveBeenCalledWith('Perfil atualizado com sucesso!');
        expect(mockNavigate).toHaveBeenCalledWith('/configs');
    });

    it('should delete profile after confirmation', async () => {
         (IntProfilesApi.listProfiles as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            int_profiles: [{ int_profile_id: 99, int_profile_name: 'Delete Me', color_id: 1, credentials: [] }]
        });
        (IntProfilesApi.hasProfiles as jest.Mock).mockReturnValue(true);
        (IntProfilesApi.deleteIntProfile as jest.Mock).mockResolvedValue({ resource: { ok: true } });

        renderComponent('99');
        await waitFor(() => expect(IntProfilesApi.listProfiles).toHaveBeenCalled());

        const deleteBtn = screen.getByRole('button', { name: /excluir/i });
        fireEvent.click(deleteBtn);

        expect(mockConfirm).toHaveBeenCalled();

        await waitFor(() => {
            expect(IntProfilesApi.deleteIntProfile).toHaveBeenCalledWith(99, 'fake-token');
        });

        expect(toast.success).toHaveBeenCalledWith('Perfil excluído com sucesso!');
        expect(mockNavigate).toHaveBeenCalledWith('/configs');
    });
});