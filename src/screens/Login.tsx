import { Eye, EyeClosed, LogIn } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { login, type LoginRequestData } from '../api/users';
import { ActionButton } from '../components/ActionButton';
import { Input } from '../components/FieldGroup';
import { useAuth } from '../contexts/Auth';
import '../styles/screens/login.css';

export function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [isPassVisible, setPassVisible] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  function onPassVisible() {
    setPassVisible(!isPassVisible);
  }

  async function onHandlerLogin() {
    const loginData: LoginRequestData = {
      user_email: emailRef.current?.value || null,
      user_pass: passRef.current?.value || null,
    };

    const data = await login(loginData);

    if (!data.resource.ok) {
      toast.error('Erro no login: ' + data.resource.error);

      return;
    }

    auth.logIn(data.user.token, {
      email: data.user.user_email,
      id: data.user.user_id,
      name: data.user.user_name
    });

    toast.success('Login realizado com sucesso! Redirecionando...');

    setTimeout(() => {
      navigate('/');
    }, 1000);
  }

  return (
    <div id="screen-login">
      <form>
        <header>
          <img src="../src/assets/synk.svg" alt="Synk's branding" />
        </header>

        <div className="fields">
          <Input label="E-mail" alias="user_email" type="email" ref={emailRef} />

          <div className="field-login">
            <Input label="Senha" alias="user_pass" type={isPassVisible ? 'text' : 'password'} ref={passRef} />
            <span onClick={onPassVisible}>
              {isPassVisible ? <Eye /> : <EyeClosed />}
            </span>
          </div>

          <ActionButton label="Enviar" Icon={LogIn} onClick={onHandlerLogin} />
        </div>

        <footer>
          Ainda não possui uma conta? <Link to="/register">Crie aqui</Link>
        </footer>
      </form>
    </div>
  );
}