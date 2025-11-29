/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import * as PostApi from '../../../src/api/post'; // Adjust path
import { List } from '../../../src/screens/Posts/List'; // Adjust path

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

jest.mock('../../../src/api/post');

describe('screens/posts/List', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render empty state when no posts are found', async () => {
        (PostApi.listPosts as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            posts: []
        });
        (PostApi.hasPosts as jest.Mock).mockReturnValue(false);

        render(<MemoryRouter><List /></MemoryRouter>);

        expect(screen.getByRole('heading', { name: /publicações/i })).toBeInTheDocument();

        await waitFor(() => {
            expect(PostApi.listPosts).toHaveBeenCalled();
            expect(screen.getByText(/nenhum resultado encontrado/i)).toBeInTheDocument();
        });
    });

    it('should render a list of posts', async () => {
        const mockPosts = [
            {
                post_id: 1,
                post_name: 'My First Post',
                status: 'draft',
                template_name: 'Instagram Template',
                int_profile_name: 'My Profile',
                created_at: '2023-10-10'
            }
        ];

        (PostApi.listPosts as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            posts: mockPosts
        });
        (PostApi.hasPosts as jest.Mock).mockReturnValue(true);

        render(<MemoryRouter><List /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText('My First Post')).toBeInTheDocument();
            expect(screen.getByText('draft')).toBeInTheDocument();
            expect(screen.getByText('Instagram Template')).toBeInTheDocument();
        });
    });

    it('should navigate to add screen', async () => {
        (PostApi.listPosts as jest.Mock).mockResolvedValue({ resource: { ok: true }, posts: [] });
        (PostApi.hasPosts as jest.Mock).mockReturnValue(false);

        render(<MemoryRouter><List /></MemoryRouter>);

        await waitFor(() => expect(PostApi.listPosts).toHaveBeenCalled());

        const addBtn = screen.getByRole('button', { name: /nova publicação/i });
        fireEvent.click(addBtn);

        expect(mockNavigate).toHaveBeenCalledWith('/posts/add');
    });
});