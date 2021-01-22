import React from 'react';

// Modules
import { Card, Button, Input, Checkbox } from 'antd';

//Style

import './CadastroStyle.css';

const CadastroView = (props) => {

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
                title='Cadastrar'

            >

                <Input
                    placeholder='E-mail'
                    type='email'
                    style={{
                        marginBottom: 10
                    }}
                    />

                <Input

                    placeholder='Digite sua Senha!'
                    type='password'
                    style={{
                        marginBottom: 10
                    }}

                />

                <Input

                    placeholder='Digite novamente sua Senha'
                    type='password'
                    style={{
                        marginBottom: 10
                    }}

                />

                <Button
                    type='primary'
                    style={{
                        width:'100%',
                        marginBottom: 10
                    }}
                >Finalizar Cadastro</Button>

                <Checkbox>
                    Mostrar Senha
                </Checkbox>



            </Card>

        </div>

    )

};

export default CadastroView;