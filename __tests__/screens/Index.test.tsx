/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { toast } from 'react-toastify';
import * as UserApi from '../../src/api/users';
import { Index } from '../../src/screens/Index';


const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

const mockLogOut = jest.fn();
jest.mock('../../src/contexts/Auth', () => ({
    useAuth: () => ({
        user: { name: 'Admin User' },
        logOut: mockLogOut
    }),
}));

jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('../../src/api/users');


const mockConfirm = jest.spyOn(window, 'confirm');

describe('screens/Index (Layout)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();

        mockConfirm.mockReturnValue(true);
    });

    it('should render user name and child routes (Outlet)', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/" element={<Index />}>
                        <Route path="dashboard" element={<div>Dashboard Content</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );


        expect(screen.getByText('Olá, Admin User! 👋')).toBeInTheDocument();


        expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    });

    it('should mark menu items as active based on current route', () => {

        render(
            <MemoryRouter initialEntries={['/posts']}>
                <Index />
            </MemoryRouter>
        );






        const postsLink = screen.getByRole('link', { name: /publicações/i });
        const templatesLink = screen.getByRole('link', { name: /templates/i });






        expect(postsLink).toHaveAttribute('href', '/posts');
        expect(templatesLink).toHaveAttribute('href', '/templates');
    });

    describe('Logout Flow', () => {
        it('should cancel logout if user declines confirmation', async () => {
            mockConfirm.mockReturnValue(false);

            const { container } = render(
                <MemoryRouter><Index /></MemoryRouter>
            );


            const avatar = container.querySelector('.avatar');
            fireEvent.click(avatar!);

            expect(mockConfirm).toHaveBeenCalled();
            expect(UserApi.logout).not.toHaveBeenCalled();
        });

        it('should handle logout API failure', async () => {
            mockConfirm.mockReturnValue(true);
            (UserApi.logout as jest.Mock).mockResolvedValue({
                resource: { ok: false, error: 'Network Error' }
            });

            const { container } = render(
                <MemoryRouter><Index /></MemoryRouter>
            );

            const avatar = container.querySelector('.avatar');
            fireEvent.click(avatar!);

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith('Erro no logout: Network Error');
                expect(mockLogOut).not.toHaveBeenCalled();
            });
        });

        it('should logout successfully and redirect', async () => {
            jest.useFakeTimers();
            mockConfirm.mockReturnValue(true);
            (UserApi.logout as jest.Mock).mockResolvedValue({
                resource: { ok: true }
            });

            const { container } = render(
                <MemoryRouter><Index /></MemoryRouter>
            );

            const avatar = container.querySelector('.avatar');
            fireEvent.click(avatar!);

            await waitFor(() => {
                expect(UserApi.logout).toHaveBeenCalled();
            });


            expect(mockLogOut).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Logout realizado com sucesso! Redirecionando...');


            expect(mockNavigate).not.toHaveBeenCalled();
            jest.runAllTimers();
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});