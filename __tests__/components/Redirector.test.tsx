/**
 * @jest-environment jest-environment-jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Redirector } from '../../src/components/Redirector';

const mockUseAuth = jest.fn();

jest.mock('../../src/contexts/Auth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('react-router', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="redirect">Redirecting to {to}</div>,
}));

describe('components/Redirector', () => {

    beforeEach(() => {
        mockUseAuth.mockClear();
    });

    describe('ToHome (Protected Route)', () => {
        it('should render children if user IS logged in', () => {
            mockUseAuth.mockReturnValue({ loggedIn: true });

            render(
                <Redirector.ToHome>
                    <h1>Protected Content</h1>
                </Redirector.ToHome>
            );

            expect(screen.getByText('Protected Content')).toBeInTheDocument();
            expect(screen.queryByTestId('redirect')).not.toBeInTheDocument();
        });

        it('should redirect to /login if user is NOT logged in', () => {
            mockUseAuth.mockReturnValue({ loggedIn: false });

            render(
                <Redirector.ToHome>
                    <h1>Protected Content</h1>
                </Redirector.ToHome>
            );

            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();

            const redirect = screen.getByTestId('redirect');
            expect(redirect).toBeInTheDocument();
            expect(redirect).toHaveTextContent('Redirecting to /login');
        });
    });

    describe('ToLogin (Guest Route)', () => {
        it('should render children if user is NOT logged in', () => {
            mockUseAuth.mockReturnValue({ loggedIn: false });

            render(
                <Redirector.ToLogin>
                    <h1>Login Page</h1>
                </Redirector.ToLogin>
            );

            expect(screen.getByText('Login Page')).toBeInTheDocument();
            expect(screen.queryByTestId('redirect')).not.toBeInTheDocument();
        });

        it('should redirect to / (Home) if user IS already logged in', () => {
            mockUseAuth.mockReturnValue({ loggedIn: true });

            render(
                <Redirector.ToLogin>
                    <h1>Login Page</h1>
                </Redirector.ToLogin>
            );

            expect(screen.queryByText('Login Page')).not.toBeInTheDocument();

            const redirect = screen.getByTestId('redirect');
            expect(redirect).toBeInTheDocument();
            expect(redirect).toHaveTextContent('Redirecting to /');
        });
    });
});