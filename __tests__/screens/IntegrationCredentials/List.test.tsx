/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import * as IntCredentialsApi from '../../../src/api/intCredentials';
import { List } from '../../../src/screens/IntegrationCredentials/List';


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

jest.mock('../../../src/api/intCredentials');

describe('screens/integrations/List', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render empty state when no credentials are returned', async () => {

        (IntCredentialsApi.listCredentials as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            int_credentials: []
        });
        (IntCredentialsApi.hasCredentials as jest.Mock).mockReturnValue(false);

        render(<MemoryRouter><List /></MemoryRouter>);

        expect(screen.getByRole('heading', { name: /integrações/i })).toBeInTheDocument();


        await waitFor(() => {
            expect(IntCredentialsApi.listCredentials).toHaveBeenCalled();
            expect(screen.getByText(/nenhum resultado encontrado/i)).toBeInTheDocument();
        });
    });

    it('should render credentials grouped by type', async () => {
        const mockCredentials = [
            {
                int_credential_id: 1,
                int_credential_name: 'My Telegram Bot',
                int_credential_type: 'telegram',
                int_credential_config: '{}'
            },
            {
                int_credential_id: 2,
                int_credential_name: 'My Discord Webhook',
                int_credential_type: 'discord',
                int_credential_config: '{}'
            }
        ];

        (IntCredentialsApi.listCredentials as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            int_credentials: mockCredentials
        });
        (IntCredentialsApi.hasCredentials as jest.Mock).mockReturnValue(true);

        render(<MemoryRouter><List /></MemoryRouter>);

        await waitFor(() => {

            expect(screen.getByText('Telegram')).toBeInTheDocument();
            expect(screen.getByText('Discord')).toBeInTheDocument();


            expect(screen.getByText('My Telegram Bot')).toBeInTheDocument();
            expect(screen.getByText('My Discord Webhook')).toBeInTheDocument();
        });
    });

    it('should navigate to add screen when clicking new integration button', async () => {

        (IntCredentialsApi.listCredentials as jest.Mock).mockResolvedValue({ resource: { ok: true }, int_credentials: [] });
        (IntCredentialsApi.hasCredentials as jest.Mock).mockReturnValue(false);

        render(<MemoryRouter><List /></MemoryRouter>);


        await waitFor(() => {
             expect(IntCredentialsApi.listCredentials).toHaveBeenCalled();
        });

        const addButton = screen.getByRole('button', { name: /nova integração/i });
        fireEvent.click(addButton);

        expect(mockNavigate).toHaveBeenCalledWith('/integrations/add');
    });
});