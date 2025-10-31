import { ArrowLeft, Save, Trash } from 'lucide-react';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { deleteIntCredential, editIntCredential, hasCredentials, INT_CREDENTIAL_TYPE_INSTAGRAM, INT_CREDENTIAL_TYPE_LINKEDIN, INT_CREDENTIAL_TYPE_TWITTER, listCredentials, type UpdateIntCredentialData } from '../../api/intCredentials';
import { ActionButton } from '../../components/ActionButton';
import { Input, Select, Textarea } from '../../components/FieldGroup';
import { OutlineButton } from '../../components/OutlineButton';
import { PageTitle } from '../../components/PageTitle';
import '../../styles/screens/integration_credentials/edit.css';

export function Edit() {
  const navigate = useNavigate();

  const { int_credential_id } = useParams();

  const nameRef = useRef<HTMLInputElement>(null);
  const configRef = useRef<HTMLTextAreaElement>(null);
  const [type, setType] = useState('');

  useEffect(() => {
    loadIntCredentialInfo()
  }, []);

  function goBack() {
    navigate(-1);
  }

  function onChangeType(event: ChangeEvent<HTMLSelectElement>) {
    setType(event.target.value);
  }

  async function loadIntCredentialInfo() {
    if (!int_credential_id) {
      toast.error('ID da integração não encontrado.');

      return;
    }

    const data = await listCredentials({
      credentialId: Number(int_credential_id),
      includeConfig: true
    });
    const hasData = hasCredentials(data);

    if (!hasData) {
      toast.error(`Integração com id ${int_credential_id} não encontrada.`);

      return;
    }

    const credentialInfo = data.int_credentials[0];

    if (nameRef.current) {
      nameRef.current.value = credentialInfo.int_credential_name;
    }
    if (configRef.current) {
      configRef.current.value = credentialInfo.int_credential_name;
    }

    setType(credentialInfo.int_credential_type);
  }

  async function handleOnSave() {
    const payload: UpdateIntCredentialData = {
      int_credential_id: Number(int_credential_id),
      int_credential_name: nameRef.current?.value || null,
      int_credential_config: configRef.current?.value || null,
      int_credential_type: type,
    };
    const data = await editIntCredential(payload);

    if (!data.resource.ok) {
      toast.error('Erro durante a atualização da integração: ' + data.resource.error);

      return;
    }

    toast.success('Integração atualizada com sucesso!');
    navigate('/integrations');
  }

  async function handleOnDelete() {
    if (!confirm('Tem certeza que deseja excluir essa integração?')) {
      return;
    }

    const data = await deleteIntCredential(Number(int_credential_id));

    if (!data.resource.ok) {
      toast.error('Erro durante a exclusão da integração: ' + data.resource.error);

      return;
    }

    toast.success('Integração excluída com sucesso!');
    navigate('/integrations');
  }

  return (
    <div id="screen-int-credentials-edit">
      <header>
        <OutlineButton label="Voltar" Icon={ArrowLeft} onClick={goBack}/>
        <PageTitle>Editar integração</PageTitle>
      </header>

      <form className="form-edit-container">
        <Input label="Nome" alias="int_credential_name" ref={nameRef} />
        <Select label="Plataforma" alias="int_credential_type" isLoading={false} value={type} onChange={onChangeType}>
          <option className={INT_CREDENTIAL_TYPE_INSTAGRAM} value={INT_CREDENTIAL_TYPE_INSTAGRAM}>Instagram</option>
          <option className={INT_CREDENTIAL_TYPE_LINKEDIN} value={INT_CREDENTIAL_TYPE_LINKEDIN}>LinkedIn</option>
          <option className={INT_CREDENTIAL_TYPE_TWITTER} value={INT_CREDENTIAL_TYPE_TWITTER}>X</option>
        </Select>
        <Textarea label="Configuração" alias="int_credential_config" ref={configRef} />
      </form>

      <footer>
        <OutlineButton label="Excluir" Icon={Trash} onClick={handleOnDelete} />
        <ActionButton label="Salvar" Icon={Save} onClick={handleOnSave} />
      </footer>
    </div>
  );
}