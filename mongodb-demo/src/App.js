import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header/Header';
import Modal from './components/Modal/Modal';
import Backdrop from './components/Backdrop/Backdrop';
import ProductsPage from './pages/Product/Products';
import ProductPage from './pages/Product/Product';
import EditProductPage from './pages/Product/EditProduct';
import AuthPage from './pages/Auth/Auth';

const App = () => {
  const [isAuth, setIsAuth] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [error, setError] = useState(null);

  const logoutHandler = () => {
    setIsAuth(false);
  };

  const authHandler = (event, authData) => {
    event.preventDefault();
    if (authData.email.trim() === '' || authData.password.trim() === '') {
      return;
    }
    let request;
    if (authMode === 'login') {
      request = axios.post('http://localhost:3100/login', authData);
    } else {
      request = axios.post('http://localhost:3100/signup', authData);
    }
    request
      .then((authResponse) => {
        if (authResponse.status === 201 || authResponse.status === 200) {
          const token = authResponse.data.token;
          console.log(token);
          // Theoretically, you would now store the token in localstorage + app state
          // and use it for subsequent requests to protected backend resources
          setIsAuth(true);
        }
      })
      .catch((err) => {
        errorHandler(err.response.data.message);
        console.log(err);
        setIsAuth(false);
      });
  };

  const authModeChangedHandler = () => {
    setAuthMode((prevState) => (prevState === 'login' ? 'signup' : 'login'));
  };

  const errorHandler = (message) => {
    setError(message);
  };

  let routes = (
    <Routes>
      <Route path="/" element={<Navigate replace to="/products" />} exact />
      <Route path="/auth" element={<Navigate replace to="/products" />} exact />
      <Route
        path="/signup"
        element={<Navigate replace to="/products" />}
        exact
      />
      <Route
        path="/product/:mode"
        element={<EditProductPage onError={errorHandler} />}
      />
      <Route
        path="/products/:id/:mode"
        element={<EditProductPage onError={errorHandler} />}
      />
      <Route
        path="/products/:id"
        element={<ProductPage onError={errorHandler} />}
      />
      <Route
        path="/products"
        element={<ProductsPage onError={errorHandler} />}
      />
    </Routes>
  );

  if (!isAuth) {
    routes = (
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} exact />
        <Route path="/products" element={<Navigate to="/auth" />} />
        <Route path="/product" element={<Navigate to="/auth" />} />
        <Route
          path="/auth"
          element={
            <AuthPage
              mode={authMode}
              onAuth={authHandler}
              onAuthModeChange={authModeChangedHandler}
            />
          }
        />
      </Routes>
    );
  }

  return (
    <div className="App">
      <Modal
        open={!!error}
        title="An Error Occurred"
        onClose={() => errorHandler(null)}
      >
        <p>{error}</p>
      </Modal>
      <Backdrop show={!!error} />
      <Header authenticated={isAuth} onLogout={logoutHandler} />
      {routes}
    </div>
  );
};

export default App;
