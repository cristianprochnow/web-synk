import { Plus, Radio } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { hasCredentials, INT_CREDENTIAL_TYPE_LINKEDIN, INT_CREDENTIAL_TYPE_TWITTER, listCredentials, type FetchIntCredentialsListItemsResponse, type IntCredentialsByType } from '../../api/intCredentials';
import emptyAvatar from '../../assets/empty.svg';
import { ActionButton } from '../../components/ActionButton';
import { PageTitle } from '../../components/PageTitle';
import { useAuth } from '../../contexts/Auth';
import '../../styles/screens/integration_credentials/list.css';

export function List() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<IntCredentialsByType>({});

  useEffect(() => {
    loadCredentials();
  }, []);

  function goToAdd() {
    navigate('/integrations/add');
  }

  async function loadCredentials() {
    setLoading(true);

    const data = await auth.request(async (token) => {
      return await listCredentials(null, token);
    }) as FetchIntCredentialsListItemsResponse;
    const hasData = hasCredentials(data);

    if (!data.resource.ok) {
      toast.error(data.resource.error);
    }

    if (!hasData) {
      toast.info('Nenhuma integração encontrada :(');
    }

    const credentialsByType: IntCredentialsByType = {
      [INT_CREDENTIAL_TYPE_TWITTER]: [],
      [INT_CREDENTIAL_TYPE_LINKEDIN]: [],
    };

    if (hasData) {
      data.int_credentials.forEach(value => {
        credentialsByType[value.int_credential_type].push(value);
      });
    }

    setCredentials(hasData ? credentialsByType : {});
    setIsEmpty(!hasData);
    setLoading(false);
  }

  return (
    <div id="screen-int-credentials-list">
      <header>
        <PageTitle>Integrações</PageTitle>

        <ActionButton label="Nova integração" Icon={Plus} onClick={goToAdd}/>
      </header>

      <div className={`loader ${!isLoading ? 'hidden' : ''}`}></div>
      <div className={`empty ${isLoading || !isEmpty ? 'hidden' : ''}`}>
        <div className="empty-avatar">
          <img src={emptyAvatar} alt="Nenhum resultado encontrado!"/>
        </div>

        <p>
          Ooops... Nenhum resultado encontrado. Que tal começar <Link to="/int_credentials/add">criando um novo?</Link>
        </p>
      </div>

      <div className="credentials-groups-container">
        {
          credentials[INT_CREDENTIAL_TYPE_LINKEDIN] ? (
            <div className="credentials-group">
              <div className="credential-header">
                <div className="heading">
                  <Radio />
                  <span className="title">LinkedIn</span>
                </div>
                <div className="separator linkedin"></div>
              </div>

              <div className="credential-list">
                {credentials[INT_CREDENTIAL_TYPE_LINKEDIN].map(credential => (
                  <div className="credential-item" key={credential.int_credential_id}>
                    <Link to={`/integrations/edit/${credential.int_credential_id}`}>{credential.int_credential_name}</Link>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        }

        {
          credentials[INT_CREDENTIAL_TYPE_TWITTER] ? (
            <div className="credentials-group">
              <div className="credential-header">
                <div className="heading">
                  <Radio />
                  <span className="title">X</span>
                </div>
                <div className="separator X"></div>
              </div>

              <div className="credential-list">
                {credentials[INT_CREDENTIAL_TYPE_TWITTER].map(credential => (
                  <div className="credential-item" key={credential.int_credential_id}>
                    <Link to={`/integrations/edit/${credential.int_credential_id}`}>{credential.int_credential_name}</Link>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        }
      </div>
    </div>
  );
}