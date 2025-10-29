import { ExternalLink, Link as LinkIcon, NotepadText, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import {
  hasTemplates,
  listTemplates,
  TEMPLATE_EMPTY_URL_VALUE,
  type TemplateItem
} from '../../api/templates.ts';
import emptyAvatar from '../../assets/empty.svg';
import { ActionButton } from '../../components/ActionButton.tsx';
import { PageTitle } from '../../components/PageTitle.tsx';
import '../../styles/screens/templates/list.css';

export function List() {
  const navigate = useNavigate();
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    setLoading(true);

    const data = await listTemplates();
    const hasData = hasTemplates(data);

    if (!data.resource.ok) {
      toast.error(data.resource.error);
    }

    if (!hasData) {
      toast.info('Nenhum template encontrado :(');
    }

    setTemplates(hasData ? data.templates : []);
    setIsEmpty(!hasData);
    setLoading(false);
  }

  function goToAdd() {
    navigate('/templates/add');
  }

  return (
    <div id="screen-template-list">
      <header>
        <PageTitle>Templates</PageTitle>

        <ActionButton label="Novo template" Icon={Plus} onClick={goToAdd}/>
      </header>

      <div className={`loader ${!isLoading ? 'hidden' : ''}`}></div>
      <div className={`empty ${isLoading || !isEmpty ? 'hidden' : ''}`}>
        <div className="empty-avatar">
          <img src={emptyAvatar} alt="Nenhum resultado encontrado!"/>
        </div>

        <p>
          Ooops... Nenhum resultado encontrado. Que tal começar <Link to="/posts/add">criando um novo?</Link>
        </p>
      </div>

      <div className="template-list-container">
        {templates.map((template, index) => (
          <div className="template-item" key={index}>
            <aside className="template-item-icon">
              {template.template_url_import && template.template_url_import !== TEMPLATE_EMPTY_URL_VALUE
                ? <LinkIcon />
                : <NotepadText />}
            </aside>

            <div className="template-item-info">
              <Link to={`/templates/edit/${template.template_id}`} className="template-item-info-title">
                {template.template_name}
              </Link>

              {template.template_url_import && template.template_url_import !== TEMPLATE_EMPTY_URL_VALUE ? (
                <a href={template.template_url_import}
                  target="_blank" rel="nofollow noopener noreferrer"
                  className="template-item-info-link">
                  <span>Conteúdo importado de <span className="url">{template.template_url_import}</span></span>
                  <ExternalLink />
                </a>
              ) : null}

              <span className="template-item-info-date">
                Criado em {template.created_at}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}