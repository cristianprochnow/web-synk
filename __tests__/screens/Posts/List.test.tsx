import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { List } from '../../../src/screens/Posts/List';

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

describe('screens/List', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('should render the page title and action button', () => {
        render(
            <MemoryRouter>
                <List />
            </MemoryRouter>
        );

        const pageTitle = screen.getByRole('heading', { name: /publicações/i });
        expect(pageTitle).toBeInTheDocument();

        const newPostButton = screen.getByRole('button', { name: /nova publicação/i });
        expect(newPostButton).toBeInTheDocument();
    });

    it('should render the list of posts from initial state', () => {
        render(
            <MemoryRouter>
                <List />
            </MemoryRouter>
        );

        expect(screen.getByText('Post do LinkedIn top demais')).toBeInTheDocument();
        expect(screen.getByText('published')).toBeInTheDocument();
        expect(screen.getByText('templateC')).toBeInTheDocument();

        expect(screen.getByText('Post do LinkedIn')).toBeInTheDocument();
        expect(screen.getByText('draft')).toBeInTheDocument();
        expect(screen.getByText('ProfileX')).toBeInTheDocument();
    });

    it('should call navigate to "/posts/add" when the action button is clicked', () => {
        render(
            <MemoryRouter>
                <List />
            </MemoryRouter>
        );

        const newPostButton = screen.getByRole('button', { name: /nova publicação/i });
        fireEvent.click(newPostButton);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/posts/add');
    });
});