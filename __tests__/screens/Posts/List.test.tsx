import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { List } from '../../../src/screens/Posts/List';

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

describe('screens/List', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('should render the page title and action button', async () => {
        render(
            <MemoryRouter>
                <List />
            </MemoryRouter>
        );

        await waitFor(() => {
          const pageTitle = screen.getByRole('heading', { name: /publicações/i });
          expect(pageTitle).toBeInTheDocument();

          const newPostButton = screen.getByRole('button', { name: /nova publicação/i });
          expect(newPostButton).toBeInTheDocument();
        });
    });

    it('should render the list of posts from initial state', async () => {
        render(
            <MemoryRouter>
                <List />
            </MemoryRouter>
        );

        await waitFor(() => {
          expect(screen.getByText('Post do LinkedIn top demais')).toBeInTheDocument();
          expect(screen.getByText('published')).toBeInTheDocument();
          expect(screen.getByText('templateC')).toBeInTheDocument();

          expect(screen.getByText('Post do LinkedIn')).toBeInTheDocument();
          expect(screen.getByText('draft')).toBeInTheDocument();
          expect(screen.getByText('ProfileX')).toBeInTheDocument();
        });
    });

    it('should call navigate to "/posts/add" when the action button is clicked', async () => {
        render(
            <MemoryRouter>
                <List />
            </MemoryRouter>
        );

        const newPostButton = screen.getByRole('button', { name: /nova publicação/i });
        fireEvent.click(newPostButton);

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledTimes(1);
          expect(mockNavigate).toHaveBeenCalledWith('/posts/add');
        });
    });
});