/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { toast } from 'react-toastify';
import * as TemplatesApi from '../../../src/api/templates';
import { Add } from '../../../src/screens/Templates/Add';


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

jest.mock('../../../src/api/templates');

describe('screens/templates/Add', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render form fields', () => {
        render(<MemoryRouter><Add /></MemoryRouter>);

        expect(screen.getByLabelText(/apelido/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/conteúdo/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    });

    it('should call API and navigate on success', async () => {
        (TemplatesApi.addTemplate as jest.Mock).mockResolvedValue({
            resource: { ok: true }
        });

        render(<MemoryRouter><Add /></MemoryRouter>);


        await user.type(screen.getByLabelText(/apelido/i), 'My New Template');
        await user.type(screen.getByLabelText(/conteúdo/i), 'Hello World Content');


        await user.click(screen.getByRole('button', { name: /salvar/i }));


        await waitFor(() => {
            expect(TemplatesApi.addTemplate).toHaveBeenCalledWith({
                template_name: 'My New Template',
                template_content: 'Hello World Content',
                template_url_import: 'default'
            }, 'fake-token');
        });

        expect(toast.success).toHaveBeenCalledWith('Template criado com sucesso!');
        expect(mockNavigate).toHaveBeenCalledWith('/templates');
    });

    it('should show error toast on failure', async () => {
        (TemplatesApi.addTemplate as jest.Mock).mockResolvedValue({
            resource: { ok: false, error: 'Database error' }
        });

        render(<MemoryRouter><Add /></MemoryRouter>);


        await user.click(screen.getByRole('button', { name: /salvar/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Erro durante a criação do template: Database error');
        });

        expect(mockNavigate).not.toHaveBeenCalledWith('/templates');
    });

    it('should navigate back when clicking back button', async () => {
        render(<MemoryRouter><Add /></MemoryRouter>);

        const backBtn = screen.getByRole('button', { name: /voltar/i });
        await user.click(backBtn);

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});