import React from 'react';

// Modules
import { Card, Breadcrumb, Form, Input, Button, Divider, Tag, Modal, Upload } from 'antd';
import { Link } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';

// Style
import './TaskFormStyle.css';

const TaskFormView = (props) => {

    // MOCK sillables
    const sillables = [
        {
            sillable: 'bo',
            audio: 'bo.mp3'
        },
        {
            sillable: 'ca',
            audio: 'ca.mp3'
        }
    ];

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };


    return (

        <div
            style={{
                height: '80vh',
                position: 'relative'
            }}
        >
            <Modal
                visible={props.sillableModal}
                title='Adicionar uma sílaba'
                onOk={() => props.addSillable}
                okText='Adicionar'
                onCancel={() => props.openCloseSillableModal(false)}
                cancelText='Cancelar'
            >
                <Form
                    layout='vertical'
                >
                    
                    <Form.Item
                        label="Sílaba"
                        name="sillable"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="audio"
                        label="Áudio"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        // extra="longgggggggggggggggggggggggggggggggggg"
                    >
                        <Upload name="logo" action="/upload.do" listType="picture">
                            <Button icon={<UploadOutlined />}>Enviar áudio</Button>
                        </Upload>
                    </Form.Item>

                </Form>
            </Modal>

            <div
                style={{
                    maxHeight: '100%',
                    overflow: 'auto'
                }}
            >

                <Card
                    title='Tarefa'
                >

                    <Breadcrumb>

                        <Breadcrumb.Item>
                            <Link to='/home'>Início</Link>
                        </Breadcrumb.Item>
                        
                        <Breadcrumb.Item>
                            <Link to='/home/task'>Lista de Tarefas</Link>
                        </Breadcrumb.Item>
                        
                        <Breadcrumb.Item>
                            Tarefa
                        </Breadcrumb.Item>

                    </Breadcrumb>

                    <Form
                        style={{ marginTop: 40 }}
                        layout='vertical'
                    >
                        
                        <Form.Item
                            label="Nome"
                            name="name"
                            style={{
                                width: 500
                            }}
                            rules={
                                [
                                    { 
                                        required: true, 
                                        message: 'Campo nome é obrigatório' 
                                    }
                                ]
                            }
                        >
                            <Input />
                        </Form.Item>

                    </Form>

                    <div
                        style={{
                            marginBottom: 10
                        }}
                    >
                        Sílabas
                    </div>

                    {
                        sillables.map(el => {
                            
                            return(
                                <span>
                                    <Tag 
                                        color='green' 
                                        key={el}
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {el.sillable.toUpperCase()}
                                    </Tag>
                                </span>
                            )
                        })
                    }

                    <br />
                    
                    <Divider />
                    
                    <Button
                        style={{
                            marginRight: 10
                        }}
                        onClick={() => props.openCloseSillableModal(true)}
                    >
                        Inserir sílaba
                    </Button>

                    <Button
                        type='primary'
                    >
                        Salvar
                    </Button>

                </Card>

            </div>

        </div>

    )

}

export default TaskFormView;