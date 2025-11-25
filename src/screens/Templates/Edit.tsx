import { ArrowLeft, Save, Trash } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import type { EditPostResponse } from '../../api/post';
import { deleteTemplate, editTemplate, hasTemplates, listTemplates, TEMPLATE_EMPTY_URL_VALUE, type EditTemplateData, type FetchTemplateListItemsResponse } from '../../api/templates';
import { ActionButton } from '../../components/ActionButton';
import { Input, Textarea } from '../../components/FieldGroup';
import { OutlineButton } from '../../components/OutlineButton';
import { PageTitle } from '../../components/PageTitle';
import { useAuth } from '../../contexts/Auth';
import '../../styles/screens/templates/edit.css';

export function Edit() {
  const navigate = useNavigate();
  const auth = useAuth();

  const { template_id } = useParams();

  const nameRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadTemplateInfo();
  }, []);

  function goBack() {
    navigate(-1);
  }

  async function loadTemplateInfo() {
    if (!template_id) {
      toast.error('ID da publicação não encontrado.');

      return;
    }

    const data = await auth.request(async (token) => {
      return await listTemplates({
        templateId: Number(template_id),
        includeContent: true
      }, token);
    }) as FetchTemplateListItemsResponse;
    const hasData = hasTemplates(data);

    if (!hasData) {
      toast.error(`Template com id ${template_id} não encontrado.`);

      return;
    }

    const templateInfo = data.templates[0];

    if (nameRef.current) {
      nameRef.current.value = templateInfo.template_name;
    }
    if (contentRef.current) {
      contentRef.current.value = templateInfo.template_content;
    }
  }

  async function handleOnSave() {
      const templateData: EditTemplateData = {
        template_id: Number(template_id),
        template_name: nameRef.current?.value || null,
        template_content: contentRef.current?.value || null,
        template_url_import: TEMPLATE_EMPTY_URL_VALUE
      };

      const data = await auth.request(async (token) => {
        return await editTemplate(templateData, token);
      }) as EditPostResponse;

      if (!data.resource.ok) {
        toast.error('Erro durante a atualização do template: ' + data.resource.error);

        return;
      }

      toast.success('Template atualizado com sucesso!');
      navigate('/templates');
    }

    async function handleOnDelete() {
      if (!confirm('Tem certeza que deseja excluir esse template?')) {
        return;
      }

      const data = await auth.request(async (token) => {
        return await deleteTemplate(Number(template_id), token);
      }) as EditPostResponse;

      if (!data.resource.ok) {
        toast.error('Erro durante a exclusão do template: ' + data.resource.error);

        return;
      }

      toast.success('Template excluído com sucesso!');
      navigate('/templates');
    }

  return (
    <div id="screen-template-edit">
      <header>
        <OutlineButton label="Voltar" Icon={ArrowLeft} onClick={goBack}/>
        <PageTitle>Editar template</PageTitle>
      </header>

      <form className="form-edit-container" onSubmit={event => {
        event.preventDefault();
        handleOnSave();
      }}>
        <Input label="Apelido" alias="template_name" ref={nameRef} />
        <Textarea label="Conteúdo" alias="template_content" ref={contentRef} />
      </form>

      <footer>
        <OutlineButton label="Excluir" Icon={Trash} onClick={handleOnDelete} />
        <ActionButton label="Salvar" Icon={Save} onClick={handleOnSave} />
      </footer>
    </div>
  );
}