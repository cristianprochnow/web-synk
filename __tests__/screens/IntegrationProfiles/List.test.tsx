/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import * as IntProfilesApi from '../../../src/api/intProfiles'; // Adjust path
import { List } from '../../../src/screens/IntegrationProfiles/List'; // Adjust path

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
    toast: { info: jest.fn(), error: jest.fn() }
}));

jest.mock('../../../src/api/intProfiles');

describe('screens/integration_profiles/List', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render empty state when no profiles are returned', async () => {
        (IntProfilesApi.fetchIntProfiles as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            int_profiles: []
        });
        (IntProfilesApi.hasProfiles as jest.Mock).mockReturnValue(false);

        render(<MemoryRouter><List /></MemoryRouter>);

        expect(screen.getByRole('heading', { name: /perfis de integração/i })).toBeInTheDocument();

        await waitFor(() => {
            expect(IntProfilesApi.fetchIntProfiles).toHaveBeenCalled();
            expect(screen.getByText(/nenhum resultado encontrado/i)).toBeInTheDocument();
        });
    });

    it('should render profiles with correct info', async () => {
        const mockProfiles = [
            {
                int_profile_id: 1,
                int_profile_name: 'My Profile',
                color_id: 1,
                color_hex: 'FF0000',
                credentials: [
                    { int_credential_id: 10, int_credential_name: 'Bot 1', int_credential_type: 'discord' }
                ]
            }
        ];

        (IntProfilesApi.fetchIntProfiles as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            int_profiles: mockProfiles
        });
        (IntProfilesApi.hasProfiles as jest.Mock).mockReturnValue(true);

        render(<MemoryRouter><List /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText('My Profile')).toBeInTheDocument();
            expect(screen.getByText('Bot 1')).toBeInTheDocument();
        });
    });

    it('should navigate to add screen', async () => {
        (IntProfilesApi.fetchIntProfiles as jest.Mock).mockResolvedValue({ resource: { ok: true }, int_profiles: [] });
        (IntProfilesApi.hasProfiles as jest.Mock).mockReturnValue(false);

        render(<MemoryRouter><List /></MemoryRouter>);

        // Wait for load to finish
        await waitFor(() => expect(IntProfilesApi.fetchIntProfiles).toHaveBeenCalled());

        fireEvent.click(screen.getByRole('button', { name: /novo perfil/i }));

        expect(mockNavigate).toHaveBeenCalledWith('/configs/add');
    });
});