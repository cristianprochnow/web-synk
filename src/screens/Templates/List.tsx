import '../../styles/screens/templates/list.css';
import { PageTitle } from '../../components/PageTitle.tsx';
import { ActionButton } from '../../components/ActionButton.tsx';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

export function List() {
  const navigate = useNavigate();

  function goToAdd() {
    navigate('/templates/add');
  }

  return (
    <div id="screen-template-list">
      <header>
        <PageTitle>Templates</PageTitle>

        <ActionButton label="Novo template" Icon={Plus} onClick={goToAdd}/>
      </header>
    </div>
  );
}