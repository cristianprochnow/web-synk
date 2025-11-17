import { ArrowLeft, Save } from 'lucide-react';
import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { addIntCredential, INT_CREDENTIAL_TYPE_INSTAGRAM, INT_CREDENTIAL_TYPE_LINKEDIN, INT_CREDENTIAL_TYPE_TWITTER, type NewIntCredentialData, type NewIntCredentialResponse } from '../../api/intCredentials';
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

      <form className="form-add-container">
        <Input label="Nome" alias="int_credential_name" ref={nameRef} />
        <Select label="Plataforma" alias="int_credential_type" isLoading={false} ref={typeRef}>
          <option className={INT_CREDENTIAL_TYPE_INSTAGRAM} value={INT_CREDENTIAL_TYPE_INSTAGRAM}>Instagram</option>
          <option className={INT_CREDENTIAL_TYPE_LINKEDIN} value={INT_CREDENTIAL_TYPE_LINKEDIN}>LinkedIn</option>
          <option className={INT_CREDENTIAL_TYPE_TWITTER} value={INT_CREDENTIAL_TYPE_TWITTER}>X</option>
        </Select>
        <Textarea label="Configuração" alias="int_credential_config" ref={configRef} />
      </form>

      <footer>
        <ActionButton label="Salvar" Icon={Save} onClick={handleOnSave}/>
      </footer>
    </div>
  );
}