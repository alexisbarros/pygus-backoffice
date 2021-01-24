import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import env from './env.json';

// Components
import Login from './Components/Login/LoginContainer';
import Home from './Components/Home/HomeContainer';
import Cadastro from './Components/Cadastro/CadastroContainer';

window.auth = (Component, props) => {
  let token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token') || '';
  try {
    jwt.verify(token, env.jwt_secret);
    return <Component {...props} />
  } catch(err){
    return <Login {...props} />
  }
}

ReactDOM.render(
  
  <React.StrictMode>
    
    <BrowserRouter>
    
      <Switch>

        <Route path='/' exact render={(props) => window.auth(Home, props)} />
        <Route path='/home' render={(props) => window.auth(Home, props)} />
        <Route path='/cadastro' component={(props) => window.auth(Cadastro, props)} />


      </Switch>
    
    </BrowserRouter>  

  </React.StrictMode>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
