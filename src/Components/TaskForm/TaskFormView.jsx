import React from 'react';

// Modules
import { Card, Breadcrumb, Form, Input, Button, Divider, Tag, Modal, Upload } from 'antd';
import { Link } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';

// Style
import './TaskFormStyle.css';

const TaskFormView = (props) => {

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
                visible={props.syllableModal}
                title='Adicionar uma sílaba'
                onOk={() => {
                    let syllablesArray = props.taskForm.syllables;
                    syllablesArray.push(props.syllableToPush);
                    
                    props.setTaskForm({ ...props.taskForm, syllables: syllablesArray });
                    props.setSyllableToPush('');
                    props.openCloseSyllableModal(false);
                }}
                okText='Adicionar'
                onCancel={() => props.openCloseSyllableModal(false)}
                cancelText='Cancelar'
            >
                <Form
                    layout='vertical'
                >
                    
                    <Form.Item
                        label="Sílaba"
                        // name="syllable"
                    >
                        <Input 
                            value={props.syllableToPush}
                            onChange={e => props.setSyllableToPush(e.target.value) }
                        />
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
                            // name="name"
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
                            <Input
                                value={props.taskForm.name}
                                onChange={e => props.setTaskForm({ ...props.taskForm, name: e.target.value })}
                            />
                        </Form.Item>

                        <Form.Item
                            // name="image"
                            label="Imagem"
                        >
                            
                            <Button 
                                icon={<UploadOutlined />}
                                onClick={() => document.getElementById('task-img-file').click()}
                                style={{ marginBottom: '10px' }}
                            >Enviar imagem</Button><br />

                            <span style={{ color: '#6495ED', fontSize: 12 }}>
                                {
                                    props.taskForm.image && props.taskForm.image.name
                                }
                            </span>
                            
                            <input 
                                type='file' 
                                id='task-img-file' 
                                style={{ display: 'none' }}
                                onChange={e => {
                                    let filesArray = e.target.files;
                                    let file = filesArray[filesArray.length - 1];
                                    props.setTaskForm({ ...props.taskForm, image: file });
                                }} 
                            />

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
                        props.taskForm.syllables.map(el => {
                            
                            return(
                                <span>
                                    <Tag 
                                        color='green' 
                                        key={el}
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {el.toUpperCase()}
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
                        onClick={() => props.openCloseSyllableModal(true)}
                    >
                        Inserir sílaba
                    </Button>

                    <Button
                        type='primary'
                        onClick={() => props.save()}
                    >
                        Salvar
                    </Button>

                </Card>

            </div>

        </div>

    )

}

export default TaskFormView;