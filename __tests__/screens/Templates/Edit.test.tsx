/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { toast } from 'react-toastify';
import * as TemplatesApi from '../../../src/api/templates';
import { Edit } from '../../../src/screens/Templates/Edit';


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

describe('screens/templates/Edit', () => {
    const user = userEvent.setup();
    const mockConfirm = jest.spyOn(window, 'confirm');

    beforeEach(() => {
        jest.clearAllMocks();

        mockConfirm.mockReturnValue(true);
    });


    const renderComponent = (id = '123') => {
        render(
            <MemoryRouter initialEntries={[`/templates/edit/${id}`]}>
                <Routes>
                    <Route path="/templates/edit/:template_id" element={<Edit />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('should load template info and fill inputs', async () => {
        const mockTemplate = {
            template_id: 123,
            template_name: 'Existing Template',
            template_content: 'Old Content',
            template_url_import: 'default'
        };

        (TemplatesApi.listTemplates as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            templates: [mockTemplate]
        });
        (TemplatesApi.hasTemplates as jest.Mock).mockReturnValue(true);

        renderComponent('123');


        await waitFor(() => {
            expect(TemplatesApi.listTemplates).toHaveBeenCalledWith({
                templateId: 123,
                includeContent: true
            }, 'fake-token');
        });



        expect(screen.getByDisplayValue('Existing Template')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Old Content')).toBeInTheDocument();
    });

    it('should show error if template not found during load', async () => {
        (TemplatesApi.listTemplates as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            templates: []
        });
        (TemplatesApi.hasTemplates as jest.Mock).mockReturnValue(false);

        renderComponent('999');

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Template com id 999 não encontrado.');
        });
    });

    it('should update template successfully', async () => {

        (TemplatesApi.listTemplates as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            templates: [{
                template_id: 123,
                template_name: 'Old Name',
                template_content: 'Old Content'
            }]
        });
        (TemplatesApi.hasTemplates as jest.Mock).mockReturnValue(true);


        (TemplatesApi.editTemplate as jest.Mock).mockResolvedValue({ resource: { ok: true } });

        renderComponent('123');


        await waitFor(() => {
            expect(screen.getByDisplayValue('Old Name')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Old Content')).toBeInTheDocument();
        });


        const nameInput = screen.getByLabelText(/apelido/i);
        const contentInput = screen.getByLabelText(/conteúdo/i);

        await user.clear(nameInput);
        await user.type(nameInput, 'Updated Name');
        await user.clear(contentInput);
        await user.type(contentInput, 'Updated Content');


        await user.click(screen.getByRole('button', { name: /salvar/i }));

        await waitFor(() => {
            expect(TemplatesApi.editTemplate).toHaveBeenCalledWith({
                template_id: 123,
                template_name: 'Updated Name',
                template_content: 'Updated Content',
                template_url_import: 'default'
            }, 'fake-token');
        });

        expect(toast.success).toHaveBeenCalledWith('Template atualizado com sucesso!');
        expect(mockNavigate).toHaveBeenCalledWith('/templates');
    });

    it('should delete template after confirmation', async () => {

        (TemplatesApi.listTemplates as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            templates: [{ template_id: 123 }]
        });
        (TemplatesApi.hasTemplates as jest.Mock).mockReturnValue(true);

        (TemplatesApi.deleteTemplate as jest.Mock).mockResolvedValue({ resource: { ok: true } });

        renderComponent('123');
        await waitFor(() => expect(TemplatesApi.listTemplates).toHaveBeenCalled());


        const deleteBtn = screen.getByRole('button', { name: /excluir/i });
        fireEvent.click(deleteBtn);


        expect(mockConfirm).toHaveBeenCalled();


        await waitFor(() => {
            expect(TemplatesApi.deleteTemplate).toHaveBeenCalledWith(123, 'fake-token');
        });

        expect(toast.success).toHaveBeenCalledWith('Template excluído com sucesso!');
        expect(mockNavigate).toHaveBeenCalledWith('/templates');
    });

    it('should NOT delete template if user cancels confirmation', async () => {
        mockConfirm.mockReturnValue(false);

        (TemplatesApi.listTemplates as jest.Mock).mockResolvedValue({
            resource: { ok: true },
            templates: [{ template_id: 123 }]
        });
        (TemplatesApi.hasTemplates as jest.Mock).mockReturnValue(true);

        renderComponent('123');
        await waitFor(() => expect(TemplatesApi.listTemplates).toHaveBeenCalled());

        fireEvent.click(screen.getByRole('button', { name: /excluir/i }));

        expect(mockConfirm).toHaveBeenCalled();
        expect(TemplatesApi.deleteTemplate).not.toHaveBeenCalled();
    });
});