import { ArrowLeft, Save, Trash } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { listColors } from '../../api/colors';
import { hasCredentials, listCredentials, type FetchIntCredentialsListItemsResponse, type IntCredentialsItem } from '../../api/intCredentials';
import { deleteIntProfile, editIntProfile, hasProfiles, listProfiles, type FetchIntProfileListResponse, type IntProfileItem, type IntProfileResponse, type UpdateIntProfileData, type UpdateIntProfileResponse } from '../../api/intProfiles';
import { ActionButton } from '../../components/ActionButton';
import { Input, Select } from '../../components/FieldGroup';
import { OutlineButton } from '../../components/OutlineButton';
import { PageTitle } from '../../components/PageTitle';
import { useAuth } from '../../contexts/Auth';
import '../../styles/screens/integration_profiles/edit.css';

export function Edit() {
  const navigate = useNavigate();
  const auth = useAuth();

  const { int_profile_id } = useParams();

  const colors = useMemo(() => listColors(), []);
  const [credentials, setCredentials] = useState<IntCredentialsItem[]>([]);
  const [color, setColor] = useState<number>(0);
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadInfo();
  }, []);

  function goBack() {
    navigate(-1);
  }

  async function loadInfo() {
    setLoading(true);

    await loadIntCredentials();
    await loadProfiles();

    setLoading(false);
  }

  async function loadIntCredentials() {
    const data = await auth.request(async (token) => {
      return await listCredentials({
        credentialId: null,
        includeConfig: false
      }, token);
    }) as FetchIntCredentialsListItemsResponse;
    const hasData = hasCredentials(data);

    if (!hasData) {
      toast.error(`Credenciais não encontradas.`);

      return;
    }

    setCredentials(hasData ? data.int_credentials : []);
  }

  async function loadProfiles() {
    const data = await auth.request(async (token) => {
      return await listProfiles({
        int_profile_id: Number(int_profile_id)
      }, token);
    }) as FetchIntProfileListResponse<IntProfileItem>;
    const hasData = hasProfiles(data);

    if (!data.resource.ok) {
      toast.error(data.resource.error);
    }

    if (!hasData) {
      toast.error(`Perfil com id ${int_profile_id} não encontrada.`);

      return;
    }

    const profileInfo = data.int_profiles[0];

    if (nameRef.current) {
      nameRef.current.value = profileInfo.int_profile_name;
    }

    setColor(profileInfo.color_id);
    setSelectedCredentials(profileInfo.credentials.map(credential => String(credential.int_credential_id)));
  }

  function onChangeColor(event: ChangeEvent<HTMLSelectElement>) {
    setColor(Number(event.target.value));
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
    const payload: UpdateIntProfileData = {
      int_profile_id: Number(int_profile_id),
      int_profile_name: nameRef.current?.value || null,
      color_id: color,
      credentials: selectedCredentials.map(selected => Number(selected))
    };
    const data = await auth.request(async (token) => {
      return await editIntProfile(payload, token);
    }) as IntProfileResponse<UpdateIntProfileResponse>;

    if (!data.resource.ok) {
      toast.error('Erro durante a edição do perfil: ' + data.resource.error);

      return;
    }

    toast.success('Perfil atualizado com sucesso!');
    navigate('/configs');
  }

  async function handleOnDelete() {
    if (!confirm('Tem certeza que deseja excluir esse perfil?')) {
      return;
    }

    const data = await auth.request(async (token) => {
      return await deleteIntProfile(Number(int_profile_id), token);
    }) as IntProfileResponse<UpdateIntProfileResponse>;

    if (!data.resource.ok) {
      toast.error('Erro durante a exclusão do perfil: ' + data.resource.error);

      return;
    }

    toast.success('Perfil excluído com sucesso!');
    navigate('/configs');
  }

  return (
    <div id="screen-int-profiles-edit">
      <header>
        <OutlineButton label="Voltar" Icon={ArrowLeft} onClick={goBack}/>
        <PageTitle>Editar perfil</PageTitle>
      </header>

      <form className="form-edit-container" onSubmit={event => {
        event.preventDefault();
        handleOnSave();
      }}>
        <Input label="Apelido" alias="int_profile_name" ref={nameRef} />

        <Select label="Cor" alias="color_id" isLoading={false} value={color} onChange={onChangeColor}>
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
        <OutlineButton label="Excluir" Icon={Trash} onClick={handleOnDelete} />
        <ActionButton label="Salvar" Icon={Save} onClick={handleOnSave}/>
      </footer>
    </div>
  );
}