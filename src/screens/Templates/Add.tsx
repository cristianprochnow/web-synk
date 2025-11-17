import { ArrowLeft, Save } from 'lucide-react';
import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import type { CreatePostResponse } from '../../api/post.ts';
import { addTemplate, TEMPLATE_EMPTY_URL_VALUE, type NewTemplateData } from '../../api/templates.ts';
import { ActionButton } from '../../components/ActionButton.tsx';
import { Input, Textarea } from '../../components/FieldGroup.tsx';
import { OutlineButton } from '../../components/OutlineButton.tsx';
import { PageTitle } from '../../components/PageTitle.tsx';
import { useAuth } from '../../contexts/Auth.tsx';
import '../../styles/screens/templates/add.css';

export function Add() {
  const navigate = useNavigate();
  const auth = useAuth();

  const nameRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  function goBack() {
    navigate(-1);
  }

  async function handleOnSave() {
    const templateData: NewTemplateData = {
      template_name: nameRef.current?.value || null,
      template_content: contentRef.current?.value || null,
      template_url_import: TEMPLATE_EMPTY_URL_VALUE,
    };

    const data = await auth.request(async (token) => {
      return await addTemplate(templateData, token);
    }) as CreatePostResponse;

    if (!data.resource.ok) {
      toast.error('Erro durante a criação do template: ' + data.resource.error);

      return;
    }

    toast.success('Template criado com sucesso!');
    navigate('/templates');
  }

  return (
    <div id="screen-template-add">
      <header>
        <OutlineButton label="Voltar" Icon={ArrowLeft} onClick={goBack}/>
        <PageTitle>Novo template</PageTitle>
      </header>

      <form className="form-add-container">
        <Input label="Apelido" alias="template_name" ref={nameRef} />
        <Textarea label="Conteúdo" alias="template_content" ref={contentRef} />
      </form>

      <footer>
        <ActionButton label="Salvar" Icon={Save} onClick={handleOnSave}/>
      </footer>
    </div>
  );
}