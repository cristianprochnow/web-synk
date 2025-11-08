import { Eye, EyeClosed, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { ActionButton } from '../components/ActionButton';
import { Input } from '../components/FieldGroup';
import '../styles/screens/login.css';

export function Login() {
  const [isPassVisible, setPassVisible] = useState(false);

  function onPassVisible() {
    setPassVisible(!isPassVisible);
  }

  return (
    <div id="screen-login">
      <form>
        <header>
          <img src="../src/assets/synk.svg" alt="Synk's branding" />
        </header>

        <div className="fields">
          <Input label="E-mail" alias="user_email" type="email" />

          <div className="field-login">
            <Input label="Senha" alias="user_pass" type={isPassVisible ? 'text' : 'password'} />
            <span onClick={onPassVisible}>
              {isPassVisible ? <Eye /> : <EyeClosed />}
            </span>
          </div>

          <ActionButton label="Enviar" Icon={LogIn} />
        </div>

        <footer>
          Ainda não possui uma conta? <Link to="/register">Crie aqui</Link>
        </footer>
      </form>
    </div>
  );
}