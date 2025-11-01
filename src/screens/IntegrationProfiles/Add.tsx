import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { listColors } from '../../api/colors';
import { hasCredentials, listCredentials, type IntCredentialsItem } from '../../api/intCredentials';
import { addIntProfile, type NewIntProfileData } from '../../api/intProfiles';
import { ActionButton } from '../../components/ActionButton';
import { Input, Select } from '../../components/FieldGroup';
import { OutlineButton } from '../../components/OutlineButton';
import { PageTitle } from '../../components/PageTitle';
import '../../styles/screens/integration_profiles/add.css';

export function Add() {
  const navigate = useNavigate();

  const colors = useMemo(() => listColors(), []);
  const [credentials, setCredentials] = useState<IntCredentialsItem[]>([]);
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    loadIntCredentials();
  }, []);

  function goBack() {
    navigate(-1);
  }

  async function loadIntCredentials() {
    setLoading(true);

    const data = await listCredentials({
      credentialId: null,
      includeConfig: false
    });
    const hasData = hasCredentials(data);

    setLoading(false);

    if (!hasData) {
      toast.error(`Credenciais não encontradas.`);

      return;
    }

    setCredentials(hasData ? data.int_credentials : []);
  }

  function onChangeCredential(event: ChangeEvent<HTMLSelectElement>) {
    const selected = [];

    for (let i = 0; i < event.target.options.length; i++) {
      if (event.target.options[i].selected) {
        selected.push(event.target.options[i].value);
      }
    }

    setSelectedCredentials(selected);
  }

  async function handleOnSave() {
    const payload: NewIntProfileData = {
      int_profile_name: nameRef.current?.value || null,
      color_id: colorRef.current ? Number(colorRef.current.value) : null,
      credentials: selectedCredentials.map(selected => Number(selected))
    };
    const data = await addIntProfile(payload);

    if (!data.resource.ok) {
      toast.error('Erro durante a criação do perfil: ' + data.resource.error);

      return;
    }

    toast.success('Perfil atualizado com sucesso!');
    navigate('/configs');
  }

  return (
    <div id="screen-int-profiles-add">
      <header>
        <OutlineButton label="Voltar" Icon={ArrowLeft} onClick={goBack}/>
        <PageTitle>Novo perfil</PageTitle>
      </header>

      <form className="form-add-container">
        <Input label="Apelido" alias="int_profile_name" ref={nameRef} />

        <Select label="Cor" alias="color_id" isLoading={false} ref={colorRef} defaultValue="">
          {colors.map((color, colorIndex) => (
            <option value={color.color_id} key={`color-${colorIndex}`} style={{
              color: `#${color.color_hex}`
            }}>
              {color.color_name}
            </option>
          ))}
        </Select>

        <Select label="Integrações" alias="credentials" isLoading={isLoading} value={selectedCredentials} onChange={onChangeCredential} multiple>
          {credentials.map((credential, credentialIndex) => (
            <option value={credential.int_credential_id} key={`color-${credentialIndex}`}>
              {credential.int_credential_name}
            </option>
          ))}
        </Select>
      </form>

      <footer>
        <ActionButton label="Salvar" Icon={Save} onClick={handleOnSave}/>
      </footer>
    </div>
  );
}