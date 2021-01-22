import React, { useState } from 'react';

// Modules
import { message } from 'antd';

// Components
import LoginView from './LoginView';

const LoginContainer = (props) => {

    /**
     * Login method.
     */
    const [ loginForm, setLoginForm ] = useState({ email: null, password: null });
    const [ loginButtonLoading, setLoginButtonLoading ] = useState(false);
    const [ saveLoginInfo, setSaveLoginInfo ] = useState(false);
    const login = async () => {

        setLoginButtonLoading(true);

        // Call API
        let apiResponse = await fetch('/auth/login-admin', 
        { 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST', 
            body: JSON.stringify(loginForm)
        });
        apiResponse = await apiResponse.json();

        // Check if response was successfuly
        if(apiResponse.code === 200){

            // Save JWT in storage
            if(saveLoginInfo){
                await localStorage.setItem('access_token', apiResponse.data['token']);
            } else {
                await sessionStorage.setItem('access_token', apiResponse.data['token']);
            }
            props.history.push('/home');
            
        } else {
            
            message.error(apiResponse.message);
            
        }
        
        setLoginButtonLoading(false);
    }

    return(

        <LoginView

            loginForm={loginForm}
            setLoginForm={form => setLoginForm({...form})}
            
            login={() => login()}
            loginButtonLoading={loginButtonLoading}
            
            saveLoginInfo={saveLoginInfo}
            setSaveLoginInfo={e => setSaveLoginInfo(e)}

        />

    )

};

export default LoginContainer;