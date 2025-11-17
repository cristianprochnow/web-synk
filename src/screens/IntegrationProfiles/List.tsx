import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { fetchIntProfiles, hasProfiles, type FetchIntProfileListResponse, type IntProfileItem } from '../../api/intProfiles';
import emptyAvatar from '../../assets/empty.svg';
import { ActionButton } from '../../components/ActionButton';
import { PageTitle } from '../../components/PageTitle';
import { useAuth } from '../../contexts/Auth';
import '../../styles/screens/integration_profiles/list.css';

export function List() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<IntProfileItem[]>([]);

  useEffect(() => {
    loadProfiles();
  }, []);

  function goToAdd() {
    navigate('/configs/add');
  }

  async function loadProfiles() {
    setLoading(true);

    const data = await auth.request(async (token) => {
      return await fetchIntProfiles(token);
    }) as FetchIntProfileListResponse<IntProfileItem>;
    const hasData = hasProfiles(data);

    if (!data.resource.ok) {
      toast.error(data.resource.error);
    }

    if (!hasData) {
      toast.info('Nenhuma integração encontrada :(');
    }

    setProfiles(hasData ? data.int_profiles : []);
    setIsEmpty(!hasData);
    setLoading(false);
  }

  return (
    <div id="screen-int-profiles-list">
      <header>
        <PageTitle>Perfis de integração</PageTitle>

        <ActionButton label="Novo perfil" Icon={Plus} onClick={goToAdd}/>
      </header>

      <div className={`loader ${!isLoading ? 'hidden' : ''}`}></div>
      <div className={`empty ${isLoading || !isEmpty ? 'hidden' : ''}`}>
        <div className="empty-avatar">
          <img src={emptyAvatar} alt="Nenhum resultado encontrado!"/>
        </div>

        <p>
          Ooops... Nenhum resultado encontrado. Que tal começar <Link to="/configs/add">criando um novo?</Link>
        </p>
      </div>

      <div className="profiles-list-container">
        {profiles.map(profile => (
          <div className="profile-item" key={`profile-${profile.int_profile_id}`} style={{
            borderLeftColor: `#${profile.color_hex}`
          }}>
            <Link to={`/configs/edit/${profile.int_profile_id}`}>
              {profile.int_profile_name}
            </Link>

            <div className="profile-credentials">
              {profile.credentials.map(credential => (
                <div className={`profile-credential-item ${credential.int_credential_type}`}
                  key={`profile-credential-${credential.int_credential_id}`}>
                    <span>{credential.int_credential_name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}