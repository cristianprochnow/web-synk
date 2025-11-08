import { Eye, EyeClosed, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { ActionButton } from '../components/ActionButton';
import { Input } from '../components/FieldGroup';
import '../styles/screens/register.css';

export function Register() {
  const [isPassVisible, setPassVisible] = useState(false);
  const [isConfirmPassVisible, setConfirmPassVisible] = useState(false);

  function onPassVisible() {
    setPassVisible(!isPassVisible);
  }

  function onConfirmPassVisible() {
    setConfirmPassVisible(!isConfirmPassVisible);
  }

  return (
    <div id="screen-register">
      <form>
        <header>
          <img src="../src/assets/synk.svg" alt="Synk's branding" />
        </header>

        <div className="fields">
          <Input label="Nome" alias="user_name" type="text" />
          <Input label="E-mail" alias="user_email" type="email" />

          <div className="field-login">
            <Input label="Senha" alias="user_pass" type={isPassVisible ? 'text' : 'password'} />
            <span onClick={onPassVisible}>
              {isPassVisible ? <Eye /> : <EyeClosed />}
            </span>
          </div>
          <div className="field-login">
            <Input label="Confirme a senha" alias="user_pass_confirm" type={isConfirmPassVisible ? 'text' : 'password'} />
            <span onClick={onConfirmPassVisible}>
              {isConfirmPassVisible ? <Eye /> : <EyeClosed />}
            </span>
          </div>

          <ActionButton label="Enviar" Icon={LogIn} />
        </div>

        <footer>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </footer>
      </form>
    </div>
  );
}