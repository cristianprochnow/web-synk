import { ArrowLeft, Save, Trash } from 'lucide-react';
import { redirect, useNavigate, useParams } from 'react-router';
import { ActionButton } from '../../components/ActionButton';
import { OutlineButton } from '../../components/OutlineButton';
import { PageTitle } from '../../components/PageTitle';
import '../../styles/screens/posts/edit.css';
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
import {
  editPost,
  type EditPostData,
  hasPosts,
  listPosts
} from '../../api/post.ts';

export function Edit() {
  const navigate = useNavigate();

  const { post_id } = useParams();

  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [intProfileOptions, setIntProfileOptions] = useState<IntProfileOption[]>([]);
  const [isLoading, setLoading] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const templateRef = useRef<HTMLSelectElement>(null);
  const intProfileRef = useRef<HTMLSelectElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadData()
  }, []);

  function goBack() {
    navigate(-1);
  }

  async function loadData() {
    await loadPostInfo();
    await loadDropdowns();
  }

  async function loadPostInfo() {
    if (!post_id) {
      toast.error('ID da publicação não encontrado.');

      return;
    }

    const data = await listPosts({
      postId: Number(post_id),
      includeContent: true
    });
    const hasData = hasPosts(data);

    if (!hasData) {
      toast.error(`Publicação com id ${post_id} não encontrada.`);

      return;
    }

    const postInfo = data.posts[0];

    if (nameRef.current) {
      nameRef.current.value = postInfo.post_name;
    }
    if (contentRef.current) {
      contentRef.current.value = postInfo.post_content;
    }
    if (templateRef.current) {
      templateRef.current.value = postInfo.template_id.toString();
    }
    if (intProfileRef.current) {
      intProfileRef.current.value = postInfo.int_profile_id.toString();
    }
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
    const postData: EditPostData = {
      post_id: Number(post_id),
      post_name: nameRef.current?.value || null,
      post_content: contentRef.current?.value || null,
      template_id: templateRef.current ? Number(templateRef.current.value) : null,
      int_profile_id: intProfileRef.current ? Number(intProfileRef.current.value) : null,
    };

    const data = await editPost(postData);

    if (!data.resource.ok) {
      toast.error('Erro durante a atualização da publicação: ' + data.resource.error);

      return;
    }

    toast.success('Publicação atualizada com sucesso!');
    setTimeout(() => redirect('/posts'), 1000);
  }

  function handleOnDelete() {

  }

  return (
    <div id="screen-post-edit">
      <header>
        <OutlineButton label="Voltar" Icon={ArrowLeft} onClick={goBack}/>
        <PageTitle>Editar publicação</PageTitle>
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
        <OutlineButton label="Excluir" Icon={Trash} onClick={handleOnDelete} />
        <ActionButton label="Salvar" Icon={Save} onClick={handleOnSave} />
      </footer>
    </div>
  );
}