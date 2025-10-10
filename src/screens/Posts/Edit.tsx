import { ArrowLeft, Save, Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { ActionButton } from '../../components/ActionButton';
import { OutlineButton } from '../../components/OutlineButton';
import { PageTitle } from '../../components/PageTitle';
import '../../styles/screens/posts/edit.css';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
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
  deletePost,
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
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [templateValue, setTemplateValue] = useState('');
  const [intProfileValue, setIntProfileValue] = useState('');

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

    setTemplateValue(postInfo.template_id.toString());
    setIntProfileValue(postInfo.int_profile_id.toString());
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
      template_id: Number(templateValue),
      int_profile_id: Number(intProfileValue),
    };

    const data = await editPost(postData);

    if (!data.resource.ok) {
      toast.error('Erro durante a atualização da publicação: ' + data.resource.error);

      return;
    }

    toast.success('Publicação atualizada com sucesso!');
    navigate('/posts');
  }

  async function handleOnDelete() {
    if (!confirm('Tem certeza que deseja excluir essa publicação?')) {
      return;
    }

    const data = await deletePost(Number(post_id));

    if (!data.resource.ok) {
      toast.error('Erro durante a exclusão da publicação: ' + data.resource.error);

      return;
    }

    toast.success('Publicação excluída com sucesso!');
    navigate('/posts');
  }

  function onChangeTemplate(event: ChangeEvent<HTMLSelectElement>) {
    setTemplateValue(event.target.value);
  }

  function onChangeIntProfile(event: ChangeEvent<HTMLSelectElement>) {
    setIntProfileValue(event.target.value);
  }

  return (
    <div id="screen-post-edit">
      <header>
        <OutlineButton label="Voltar" Icon={ArrowLeft} onClick={goBack}/>
        <PageTitle>Editar publicação</PageTitle>
      </header>

      <form className="form-edit-container">
        <div className="field-group">
          <label htmlFor="post_name">Apelido</label>
          <input type="text" name="post_name" id="post_name" ref={nameRef}/>
        </div>

        <div className="col-2">
          <div className={`field-group ${isLoading ? 'disabled' : ''}`}>
            <div className={`loader ${!isLoading ? 'hidden' : ''}`}></div>

            <label htmlFor="template_id">Template</label>
            <select name="template_id" id="template_id" disabled={isLoading} value={templateValue} onChange={onChangeTemplate}>
              <option value="" disabled>Selecione</option>
              {templateOptions.map(({ template_id, template_name }, templateIndex) => (
                <option value={String(template_id)} key={templateIndex}>{template_name}</option>
              ))}
            </select>
          </div>

          <div className={`field-group ${isLoading ? 'disabled' : ''}`}>
            <div className={`loader ${!isLoading ? 'hidden' : ''}`}></div>
            <label htmlFor="int_profile_id">Perfil</label>
            <select name="int_profile_id" id="int_profile_id" disabled={isLoading} value={intProfileValue} onChange={onChangeIntProfile}>
              <option value="" disabled>Selecione</option>
              {intProfileOptions.map(({ int_profile_id, int_profile_name, color_hex }, intProfileIndex) => (
                <option style={{ color: `#${color_hex}` }} value={String(int_profile_id)} key={intProfileIndex}>
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