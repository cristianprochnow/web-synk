/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { toast } from 'react-toastify';
import * as ColorsApi from '../../../src/api/colors';
import * as IntCredentialsApi from '../../../src/api/intCredentials';
import * as IntProfilesApi from '../../../src/api/intProfiles';
import { Add } from '../../../src/screens/IntegrationProfiles/Add'; // Adjust path

// --- Mocks ---
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

// Mock all 3 APIs used
jest.mock('../../../src/api/intProfiles');
jest.mock('../../../src/api/intCredentials');
jest.mock('../../../src/api/colors');

describe('screens/integration_profiles/Add', () => {
    const user = userEvent.setup();

    const mockColors = [
        { color_id: 1, color_name: 'Red', color_hex: 'FF0000' },
        { color_id: 2, color_name: 'Blue', color_hex: '0000FF' }
    ];

    const mockCredentials = [
        { int_credential_id: 101, int_credential_name: 'Telegram Bot' },
        { int_credential_id: 102, int_credential_name: 'Discord Webhook' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default returns
        (ColorsApi.listColors as jest.Mock).mockReturnValue(mockColors);
        (IntCredentialsApi.listCredentials as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            int_credentials: mockCredentials
        });
        (IntCredentialsApi.hasCredentials as jest.Mock).mockReturnValue(true);
    });

    it('should save new profile successfully', async () => {
        (IntProfilesApi.addIntProfile as jest.Mock).mockResolvedValue({ resource: { ok: true } });

        render(<MemoryRouter><Add /></MemoryRouter>);

        // Wait for dropdowns to populate
        await waitFor(() => expect(screen.getByText('Red')).toBeInTheDocument());

        // 1. Fill Name
        await user.type(screen.getByLabelText(/apelido/i), 'New Config');

        // 2. Select Color (Red - ID 1)
        await user.selectOptions(screen.getByLabelText(/cor/i), '1');

        // 3. Select Credentials (Multiple)
        // We select both available credentials
        await user.selectOptions(screen.getByLabelText(/integrações/i), ['101', '102']);

        // 4. Save
        await user.click(screen.getByRole('button', { name: /salvar/i }));

        await waitFor(() => {
            expect(IntProfilesApi.addIntProfile).toHaveBeenCalledWith({
                int_profile_name: 'New Config',
                color_id: 1,
                // The component converts strings to numbers, so we expect numbers [101, 102]
                credentials: [101, 102]
            }, 'fake-token');
        });

        expect(toast.success).toHaveBeenCalledWith('Perfil atualizado com sucesso!');
        expect(mockNavigate).toHaveBeenCalledWith('/configs');
    });

    it('should handle save error', async () => {
        (IntProfilesApi.addIntProfile as jest.Mock).mockResolvedValue({
            resource: { ok: false, error: 'Fail' }
        });

        render(<MemoryRouter><Add /></MemoryRouter>);
        await waitFor(() => expect(screen.getByText('Red')).toBeInTheDocument());

        await user.click(screen.getByRole('button', { name: /salvar/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Fail'));
        });
    });
});