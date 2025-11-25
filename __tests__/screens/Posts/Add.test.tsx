import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Add } from '../../../src/screens/Posts/Add';

jest.mock('../../../src/contexts/Auth.tsx', () => ({
  useAuth: () => ({
    request: jest.fn().mockResolvedValue({
      resource: { ok: true },
      posts: [
        {
          post_id: 1,
          post_name: 'Post do LinkedIn top demais',
          status: 'published',
          template_name: 'templateC',
          int_profile_name: 'MyProfile',
          created_at: '2023-01-01'
        },
        {
          post_id: 1,
          post_name: 'Post do LinkedIn',
          status: 'draft',
          template_name: 'Insta',
          int_profile_name: 'ProfileX',
          created_at: '2023-01-01'
        },
      ]
    }),
    user: { id: 1, name: "Test User" },
    loggedIn: true
  })
}));

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

describe('screens/Add', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('should render the header elements correctly', async () => {
        render(
            <MemoryRouter>
                <Add />
            </MemoryRouter>
        );

        await waitFor(() => {
          expect(screen.getByRole('heading', { name: /nova publicação/i })).toBeInTheDocument();
          expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
          expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
        });
    });

    it('should render all form fields', async () => {
        render(
            <MemoryRouter>
                <Add />
            </MemoryRouter>
        );

        await waitFor(() => {
          expect(screen.getByLabelText(/apelido/i)).toBeInTheDocument();
          expect(screen.getByLabelText(/template/i)).toBeInTheDocument();
          expect(screen.getByLabelText(/perfil/i)).toBeInTheDocument();
          expect(screen.getByLabelText(/conteúdo/i)).toBeInTheDocument();
        });
    });

    it('should call navigate with -1 when back button is clicked', async () => {
        render(
            <MemoryRouter>
                <Add />
            </MemoryRouter>
        );

        const backButton = screen.getByRole('button', { name: /voltar/i });
        fireEvent.click(backButton);

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledTimes(1);
          expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
    });
});