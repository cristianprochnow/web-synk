import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ActionButton } from '../../components/ActionButton';
import { PageTitle } from '../../components/PageTitle';
import '../../styles/screens/integration_profiles/list.css';

export function List() {
  const navigate = useNavigate();

  function goToAdd() {
    navigate('/integrations/add');
  }

  return (
    <div id="screen-int-profiles-list">
      <PageTitle>Perfis de integração</PageTitle>

      <ActionButton label="Novo perfil" Icon={Plus} onClick={goToAdd}/>
    </div>
  );
}