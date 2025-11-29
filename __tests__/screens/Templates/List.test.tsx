/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import * as TemplatesApi from '../../../src/api/templates';
import { List } from '../../../src/screens/Templates/List';


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

jest.mock('../../../src/api/templates');

describe('screens/templates/List', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render empty state when no templates are returned', async () => {
        (TemplatesApi.listTemplates as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            templates: []
        });
        (TemplatesApi.hasTemplates as jest.Mock).mockReturnValue(false);

        render(<MemoryRouter><List /></MemoryRouter>);

        expect(screen.getByRole('heading', { name: /templates/i })).toBeInTheDocument();


        await waitFor(() => {
            expect(TemplatesApi.listTemplates).toHaveBeenCalled();
            expect(screen.getByText(/nenhum resultado encontrado/i)).toBeInTheDocument();
        });
    });

    it('should render a list of templates', async () => {
        const mockTemplates = [
            {
                template_id: 1,
                template_name: 'Standard Template',
                template_content: 'Content',
                template_url_import: 'default',
                created_at: '2023-01-01'
            },
            {
                template_id: 2,
                template_name: 'Imported Template',
                template_content: 'Content',
                template_url_import: 'https://example.com',
                created_at: '2023-01-02'
            }
        ];

        (TemplatesApi.listTemplates as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            templates: mockTemplates
        });
        (TemplatesApi.hasTemplates as jest.Mock).mockReturnValue(true);

        render(<MemoryRouter><List /></MemoryRouter>);


        await waitFor(() => {
            expect(screen.getByText('Standard Template')).toBeInTheDocument();
        });

        expect(screen.getByText('Imported Template')).toBeInTheDocument();
    });



    it('should navigate to add screen when clicking new template button', async () => {
        (TemplatesApi.listTemplates as jest.Mock).mockResolvedValue({ resource: { ok: true }, templates: [] });
        (TemplatesApi.hasTemplates as jest.Mock).mockReturnValue(false);

        render(<MemoryRouter><List /></MemoryRouter>);



        await waitFor(() => {
             expect(TemplatesApi.listTemplates).toHaveBeenCalled();
        });

        const addButton = screen.getByRole('button', { name: /novo template/i });
        fireEvent.click(addButton);

        expect(mockNavigate).toHaveBeenCalledWith('/templates/add');
    });
});