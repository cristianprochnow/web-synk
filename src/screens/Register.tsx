import { Eye, EyeClosed, LogIn } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { register, type RegisterRequestData } from '../api/users';
import { ActionButton } from '../components/ActionButton';
import { Input } from '../components/FieldGroup';
import { useAuth } from '../contexts/Auth';
import '../styles/screens/register.css';

export function Register() {
  const auth = useAuth();
  const navigate = useNavigate();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const confirmPassRef = useRef<HTMLInputElement>(null);

  const [isPassVisible, setPassVisible] = useState(false);
  const [isConfirmPassVisible, setConfirmPassVisible] = useState(false);

  function onPassVisible() {
    setPassVisible(!isPassVisible);
  }

  function onConfirmPassVisible() {
    setConfirmPassVisible(!isConfirmPassVisible);
  }

  async function onHandlerRegister() {
    const passValue = passRef.current?.value || null;
    const confirmPassValue = confirmPassRef.current?.value || null;

    if (passValue !== confirmPassValue) {
      toast.error('Senhas inseridas são diferentes');

      return;
    }

    const nameValue = nameRef.current?.value || null;
    const emailValue = emailRef.current?.value || null;

    const registerData: RegisterRequestData = {
      user_name: nameValue,
      user_email: emailValue,
      user_pass: passRef.current?.value || null,
    };

    const data = await register(registerData);

    if (!data.resource.ok) {
      toast.error('Erro na criação da conta: ' + data.resource.error);

      return;
    }

    auth.logIn(data.user.token, {
      email: String(emailValue),
      id: data.user.user_id,
      name: String(nameValue)
    });

    toast.success('Conta criada com sucesso! Redirecionando...');

    setTimeout(() => {
      navigate('/');
    }, 1000);
  }

  return (
    <div id="screen-register">
      <form onSubmit={event => {
        event.preventDefault();
        onHandlerRegister();
      }}>
        <header>
          <img src="../src/assets/synk.svg" alt="Synk's branding" />
        </header>

        <div className="fields">
          <Input label="Nome" alias="user_name" type="text" ref={nameRef} />
          <Input label="E-mail" alias="user_email" type="email" ref={emailRef} />

          <div className="field-login">
            <Input label="Senha" alias="user_pass" type={isPassVisible ? 'text' : 'password'} ref={passRef} />
            <span onClick={onPassVisible}>
              {isPassVisible ? <Eye /> : <EyeClosed />}
            </span>
          </div>
          <div className="field-login">
            <Input label="Confirme a senha" alias="user_pass_confirm" type={isConfirmPassVisible ? 'text' : 'password'} ref={confirmPassRef} />
            <span onClick={onConfirmPassVisible}>
              {isConfirmPassVisible ? <Eye /> : <EyeClosed />}
            </span>
          </div>

          <ActionButton label="Enviar" Icon={LogIn} onClick={onHandlerRegister} />
        </div>

        <footer>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </footer>
      </form>
    </div>
  );
}