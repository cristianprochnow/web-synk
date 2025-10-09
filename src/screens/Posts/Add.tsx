import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ActionButton } from '../../components/ActionButton';
import { OutlineButton } from '../../components/OutlineButton';
import { PageTitle } from '../../components/PageTitle';
import '../../styles/screens/posts/add.css';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  fetchBasicTemplates, hasBasicTemplates,
  type TemplateOption
} from '../../api/templates.ts';
import {
  fetchBasicIntProfiles,
  hasBasicIntProfiles, type IntProfileOption
} from '../../api/intProfiles.ts';
import { addPost, type NewPostData } from '../../api/post.ts';

export function Add() {
  const navigate = useNavigate();

  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [intProfileOptions, setIntProfileOptions] = useState<IntProfileOption[]>([]);
  const [isLoading, setLoading] = useState(false);

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
    const data = await fetchBasicTemplates();
    const hasData = hasBasicTemplates(data);

    if (!data.resource.ok) {
      toast.error('Erro durante a busca de templates: ' +data.resource.error);
    }

    if (!hasData) {
      toast.info('Nenhum template encontrado :(');
    }

    setTemplateOptions(hasData ? data.templates : []);
  }

  async function loadIntProfiles() {
    const data = await fetchBasicIntProfiles();
    const hasData = hasBasicIntProfiles(data);

    if (!data.resource.ok) {
      toast.error('Erro durante a busca de perfis: ' + data.resource.error);
    }

    if (!hasData) {
      toast.info('Nenhum perfil de integração encontrado :(');
    }

    setIntProfileOptions(hasData ? data.int_profiles : []);
  }

  async function handleOnSave() {
    const postData: NewPostData = {
      post_name: nameRef.current?.value || null,
      post_content: contentRef.current?.value || null,
      template_id: templateRef.current ? Number(templateRef.current.value) : null,
      int_profile_id: templateRef.current ? Number(templateRef.current.value) : null,
    };

    const data = await addPost(postData);

    if (!data.resource.ok) {
      toast.error('Erro durante a criação da publicação: ' + data.resource.error);

      return;
    }

    toast.success('Publicação criada com sucesso!');
    navigate('/posts');
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