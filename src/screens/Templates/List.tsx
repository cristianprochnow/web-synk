import '../../styles/screens/templates/list.css';
import { PageTitle } from '../../components/PageTitle.tsx';
import { ActionButton } from '../../components/ActionButton.tsx';
import { ExternalLink, Plus, Paperclip, NotepadText, Link as LinkIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';

type TemplateItem = {
  template_id: number;
  template_name: string;
  template_url_import: string|null;
  created_at: string;
};

export function List() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TemplateItem[]>([
    {
      template_id: 1,
      template_name: 'SHow demais',
      template_url_import: 'https://react.dev/reference/react/useMemo#my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined',
      created_at: '01/02/2015 12:23:14',
    },
    {
      template_id: 1,
      template_name: 'SHow demais',
      template_url_import: 'https://google.com',
      created_at: '01/02/2015 12:23:14',
    },
    {
      template_id: 1,
      template_name: 'SHow demais',
      template_url_import: 'https://google.com',
      created_at: '01/02/2015 12:23:14',
    },
    {
      template_id: 1,
      template_name: 'SHow demais',
      template_url_import: null,
      created_at: '01/02/2015 12:23:14',
    },
    {
      template_id: 1,
      template_name: 'SHow demais',
      template_url_import: 'https://google.com',
      created_at: '01/02/2015 12:23:14',
    }
  ]);

  function goToAdd() {
    navigate('/templates/add');
  }

  return (
    <div id="screen-template-list">
      <header>
        <PageTitle>Templates</PageTitle>

        <ActionButton label="Novo template" Icon={Plus} onClick={goToAdd}/>
      </header>

      <div className="template-list-container">
        {templates.map((template, index) => (
          <div className="template-item" key={index}>
            <aside className="template-item-icon">
              {template.template_url_import ? <LinkIcon /> : <NotepadText />}
            </aside>

            <div className="template-item-info">
              <Link to={`/templates/edit/${template.template_id}`} className="template-item-info-title">
                {template.template_name}
              </Link>

              {template.template_url_import ? (
                <a href={template.template_url_import} target="_blank" rel="nofollow noopener noreferrer" className="template-item-info-link">
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