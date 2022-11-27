import React, { useState } from 'react';

import './Auth.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const AuthPage = ({ mode, onAuthModeChange, onAuth }) => {
  const [input, setInput] = useState({ email: '', password: '' });

  const inputChangeHandler = (event, input) => {
    setInput((preInput) => {
      return { ...preInput, [input]: event.target.value };
    });
  };

  let modeButtonText = 'Switch to Signup';
  let submitButtonText = 'Login';
  if (mode === 'signup') {
    modeButtonText = 'Switch to Login';
    submitButtonText = 'Signup';
  }

  return (
    <main>
      <section className="auth__mode-control">
        <Button type="button" onClick={onAuthModeChange}>
          {modeButtonText}
        </Button>
      </section>
      <form
        className="auth__form"
        onSubmit={(event) =>
          onAuth(event, {
            email: input.email,
            password: input.password,
          })
        }
      >
        <Input
          label="E-Mail"
          config={{ type: 'email' }}
          onChange={(event) => inputChangeHandler(event, 'email')}
        />
        <Input
          label="Password"
          config={{ type: 'password' }}
          onChange={(event) => inputChangeHandler(event, 'password')}
        />
        <Button type="submit">{submitButtonText}</Button>
      </form>
    </main>
  );
};
export default AuthPage;
