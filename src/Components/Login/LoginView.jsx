import React from 'react';

// Modules
import { Card, Button, Input, Checkbox } from 'antd';

// Style
import './LoginStyle.css';

const LoginView = (props) => {

    return(

        <div>

            <Card
                style={{
                    width: 400,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-100px 0 0 -150px',
                }}
                title='Entrar'
            >

                <Input 
                    placeholder='E-mail' 
                    type='email' 
                    style={{
                        marginBottom: 10
                    }}
                    onChange={e => props.setLoginForm({ ...props.loginForm, email: e.target.value })}
                />
                
                <Input 
                    placeholder='Senha' 
                    type='password' 
                    style={{
                        marginBottom: 10
                    }}
                    onChange={e => props.setLoginForm({ ...props.loginForm, password: e.target.value })}
                />

                <Button 
                    type='primary'
                    style={{
                        width: '100%',
                        marginBottom: 10
                    }}
                    onClick={() => props.login()}
                    loading={props.loginButtonLoading}
                    disabled={!props.loginForm.email || !props.loginForm.password}
                >Entrar</Button>

                <Checkbox
                    checked={props.saveLoginInfo}
                    onChange={() => props.setSaveLoginInfo(!props.saveLoginInfo)}
                >
                    Mantenha conectado
                </Checkbox>

            </Card>

        </div>

    )

};

export default LoginView;