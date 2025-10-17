import '../../styles/screens/templates/add.css';
import { OutlineButton } from '../../components/OutlineButton.tsx';
import { ArrowLeft } from 'lucide-react';
import { PageTitle } from '../../components/PageTitle.tsx';
import { useNavigate } from 'react-router';

export function Add() {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  return (
    <div id="screen-template-add">
      <header>
        <OutlineButton label="Voltar" Icon={ArrowLeft} onClick={goBack}/>
        <PageTitle>Novo template</PageTitle>
      </header>
    </div>
  );
}