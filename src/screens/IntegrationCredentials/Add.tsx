import { ArrowLeft, Save } from 'lucide-react';
import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { addIntCredential, INT_CREDENTIAL_TYPE_DISCORD, INT_CREDENTIAL_TYPE_TELEGRAM, type NewIntCredentialData, type NewIntCredentialResponse } from '../../api/intCredentials';
import { ActionButton } from '../../components/ActionButton';
import { Input, Select, Textarea } from '../../components/FieldGroup';
import { OutlineButton } from '../../components/OutlineButton';
import { PageTitle } from '../../components/PageTitle';
import { useAuth } from '../../contexts/Auth';
import '../../styles/screens/integration_credentials/add.css';

export function Add() {
  const navigate = useNavigate();
  const auth = useAuth();

  const nameRef = useRef<HTMLInputElement>(null);
  const configRef = useRef<HTMLTextAreaElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);

  function goBack() {
    navigate(-1);
  }

  async function handleOnSave() {
      const payload: NewIntCredentialData = {
        int_credential_name: nameRef.current?.value || null,
        int_credential_type: typeRef.current?.value || null,
        int_credential_config: configRef.current?.value || null,
      };
      const data = await auth.request(async (token) => {
        return await addIntCredential(payload, token);
      }) as NewIntCredentialResponse;

      if (!data.resource.ok) {
        toast.error('Erro durante a criação da integração: ' + data.resource.error);

        return;
      }

      toast.success('Integração criada com sucesso!');
      navigate('/integrations');
    }

  return (
    <div id="screen-int-credentials-add">
      <header>
        <OutlineButton label="Voltar" Icon={ArrowLeft} onClick={goBack}/>
        <PageTitle>Nova integração</PageTitle>
      </header>

      <form className="form-add-container" onSubmit={event => {
        event.preventDefault();
        handleOnSave();
      }}>
        <Input label="Nome" alias="int_credential_name" ref={nameRef} />
        <Select label="Plataforma" alias="int_credential_type" isLoading={false} ref={typeRef}>
          <option className={INT_CREDENTIAL_TYPE_TELEGRAM} value={INT_CREDENTIAL_TYPE_TELEGRAM}>Telegram</option>
          <option className={INT_CREDENTIAL_TYPE_DISCORD} value={INT_CREDENTIAL_TYPE_DISCORD}>Discord</option>
        </Select>
        <Textarea label="Configuração" alias="int_credential_config" ref={configRef} />
      </form>

      <footer>
        <ActionButton label="Salvar" Icon={Save} onClick={handleOnSave}/>
      </footer>
    </div>
  );
}