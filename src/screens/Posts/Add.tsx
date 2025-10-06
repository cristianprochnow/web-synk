import { ArrowLeft, Save } from 'lucide-react';
import { redirect, useNavigate } from 'react-router';
import { ActionButton } from '../../components/ActionButton';
import { OutlineButton } from '../../components/OutlineButton';
import { PageTitle } from '../../components/PageTitle';
import '../../styles/screens/posts/add.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

type TemplateOption = {
  template_id: number
  template_name: string
};

type FetchTemplateListResponse = {
  resource: {
    ok: boolean
    error: string
  }
  templates: TemplateOption[]
};

type CreatePostResponse = {
  resource: {
    ok: boolean
    error: string
  }
  post: CreatePostResponseInfo
};

type CreatePostResponseInfo = {
  post_id: number
};

type IntProfileOption = {
  int_profile_id: number
  int_profile_name: string
  color_hex: string
};

type FetchIntProfileListResponse = {
  resource: {
    ok: boolean
    error: string
  }
  int_profiles: IntProfileOption[]
};

type NewPostData = {
  post_name: string | null,
  post_content: string | null,
  template_id: number | null,
  int_profile_id: number | null
};

export function Add() {
  const navigate = useNavigate();
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [intProfileOptions, setIntProfileOptions] = useState<IntProfileOption[]>([]);
  const [isLoading, setLoading] = useState(false);
  const url = useMemo(() => import.meta.env.VITE_GATEWAY_ENDPOINT, []);

  const nameRef = useRef<HTMLInputElement>(null);
  const templateRef = useRef<HTMLSelectElement>(null);
  const intProfileRef = useRef<HTMLSelectElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadDropdowns()
  }, []);

  function goBack() {
    navigate(-1);
  }

  async function loadDropdowns() {
    setLoading(true);

    await loadTemplates();
    await loadIntProfiles();

    setLoading(false);
  }

  async function loadTemplates() {
    const response = await fetch(url + '/templates/basic');
    const data = await response.json() as FetchTemplateListResponse;

    const hasData = data.templates && data.templates.length > 1;

    if (!data.resource.ok) {
      toast.error('Erro durante a busca de templates: ' +data.resource.error);
    }

    if (!hasData) {
      toast.info('Nenhum template encontrado :(');
    }

    setTemplateOptions(hasData ? data.templates : []);
  }

  async function loadIntProfiles() {
    const response = await fetch(url + '/int_profiles/basic');
    const data = await response.json() as FetchIntProfileListResponse;

    const hasData = data.int_profiles && data.int_profiles.length > 1;

    if (!data.resource.ok) {
      toast.error('Erro durante a busca de perfis: ' + data.resource.error);
    }

    if (!hasData) {
      toast.info('Nenhum perfil de integração encontrado :(');
    }

    setIntProfileOptions(hasData ? data.int_profiles : []);
  }

  function handleOnSave() {
    const postData: NewPostData = {
      post_name: nameRef.current?.value || null,
      post_content: contentRef.current?.value || null,
      template_id: templateRef.current ? Number(templateRef.current.value) : null,
      int_profile_id: templateRef.current ? Number(templateRef.current.value) : null,
    };

    createPost(postData);
  }

  async function createPost(post: NewPostData) {
    const response = await fetch(url + '/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post)
    });
    const data = await response.json() as CreatePostResponse;

    if (!data.resource.ok) {
      toast.error('Erro durante a criação da publicação: ' + data.resource.error);

      return;
    }

    toast.success('Publicação criada com sucesso!');
    setTimeout(() => redirect('/posts'), 1000);
  }

  return (
    <div id="screen-post-add">
      <header>
        <OutlineButton label="Voltar" Icon={ArrowLeft} onClick={goBack}/>
        <PageTitle>Nova publicação</PageTitle>
      </header>

      <form className="form-add-container">
        <div className="field-group">
          <label htmlFor="post_name">Apelido</label>
          <input type="text" name="post_name" id="post_name" ref={nameRef}/>
        </div>

        <div className="col-2">
          <div className={`field-group ${isLoading ? 'disabled' : ''}`}>
            <div className={`loader ${!isLoading ? 'hidden' : ''}`}></div>

            <label htmlFor="template_id">Template</label>
            <select name="template_id" id="template_id" defaultValue="" disabled={isLoading} ref={templateRef}>
              <option value="" disabled>Selecione</option>
              {templateOptions.map(({ template_id, template_name }, templateIndex) => (
                <option value={template_id} key={templateIndex}>{template_name}</option>
              ))}
            </select>
          </div>

          <div className={`field-group ${isLoading ? 'disabled' : ''}`}>
            <div className={`loader ${!isLoading ? 'hidden' : ''}`}></div>
            <label htmlFor="int_profile_id">Perfil</label>
            <select name="int_profile_id" id="int_profile_id" defaultValue="" disabled={isLoading} ref={intProfileRef}>
              <option value="" disabled>Selecione</option>
              {intProfileOptions.map(({ int_profile_id, int_profile_name, color_hex }, intProfileIndex) => (
                <option style={{ color: `#${color_hex}` }} value={int_profile_id} key={intProfileIndex}>
                  {int_profile_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="post_content">Conteúdo</label>
          <textarea name="post_content" id="post_content" ref={contentRef}></textarea>
        </div>
      </form>

      <footer>
        <ActionButton label="Salvar" Icon={Save} onClick={handleOnSave}/>
      </footer>
    </div>
  );
}