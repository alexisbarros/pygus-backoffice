import React from 'react';

// Modules
import { Card, Breadcrumb, Form, Input, Button, Divider, Tag, Modal, message, Checkbox, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { UploadOutlined, DeleteOutlined, SoundOutlined } from '@ant-design/icons';

// Style
import './TaskFormStyle.css';

const TaskFormView = (props) => {


    return (

        <div
            style={{
                height: '80vh',
                position: 'relative'
            }}
        >
            <Spin spinning={props.loading}>
                <Modal
                    visible={props.syllableModal}
                    title='Adicionar uma sílaba'
                    onOk={() => {
                        if (props.syllableToPush && props.audioToPush) {

                            let syllablesArray = props.taskForm.syllables;
                            syllablesArray.push(props.syllableToPush);

                            let audiosArray = props.taskForm.audios;
                            audiosArray.push(props.audioToPush);

                            props.setTaskForm({ ...props.taskForm, syllables: syllablesArray, audios: audiosArray });
                            props.setSyllableToPush({ syllable: '', isPhoneme: false, });
                            props.setAudioToPush('');
                            props.openCloseSyllableModal(false);

                        } else {
                            message.error('Para adicionar é necessário informar a sílaba e o áudio');
                        }
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
                        >
                            <Input
                                value={props.syllableToPush.syllable}
                                onChange={e => {
                                    props.setSyllableToPush({
                                        ...props.syllableToPush,
                                        syllable: e.target.value
                                    })
                                }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Checkbox
                                checked={props.syllableToPush.isPhoneme}
                                onChange={e => {
                                    props.setSyllableToPush({
                                        ...props.syllableToPush,
                                        isPhoneme: e.target.checked,
                                    })
                                }}
                            >Fonema</Checkbox>
                        </Form.Item>

                        <Form.Item
                            label="Áudio"
                        >

                            <Button
                                icon={<UploadOutlined />}
                                onClick={() => document.getElementById('task-audio-file').click()}
                                style={{ marginBottom: '10px' }}
                            >
                                Adicionar áudio
                            </Button><br />

                            {
                                props.audioToPush ?
                                    <Card
                                        style={{
                                            color: '#6495ED',
                                            fontSize: 12,
                                        }}
                                    >
                                        <SoundOutlined
                                            style={{
                                                fontSize: 20,
                                                marginRight: 20,
                                                color: 'black'
                                            }}
                                        />

                                        {props.audioToPush.name}

                                        <div
                                            style={{
                                                float: 'right',
                                            }}
                                        >
                                            <DeleteOutlined
                                                style={{
                                                    color: 'red',
                                                    cursor: 'pointer',
                                                    fontSize: 14,
                                                }}
                                                onClick={() => props.setAudioToPush('')}
                                            />
                                        </div>
                                    </Card> : null
                            }

                            <input
                                type='file'
                                id='task-audio-file'
                                style={{ display: 'none' }}
                                accept="audio/mpeg3"
                                onChange={e => {
                                    let filesArray = e.target.files;
                                    let file = filesArray[filesArray.length - 1];

                                    // Set audio to push
                                    props.setAudioToPush(file);
                                }}
                            />
                        </Form.Item>

                    </Form>
                </Modal>

                <div
                    style={{
                        maxHeight: '100%',
                        height: '85vh',
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
                                style={{ width: 500 }}
                            >
                                <Input
                                    value={props.taskForm.name}
                                    disabled={props.taskIdToUpdate}
                                    onChange={e => props.setTaskForm({ ...props.taskForm, name: e.target.value })}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Imagem"
                            >

                                {
                                    !props.taskForm.image && 
                                    <Button
                                        icon={<UploadOutlined />}
                                        onClick={() => document.getElementById('task-img-file').click()}
                                        style={{ marginBottom: '10px' }}
                                    >
                                        Adicionar imagem
                                    </Button>
                                }

                                {
                                    props.taskForm.image &&
                                    <Card
                                        style={{
                                            color: '#6495ED',
                                            fontSize: 12
                                        }}
                                    >
                                        <img
                                            alt='imagem da tarefa'
                                            src={props.taskForm.image}
                                            id='task-img-file-thumb'
                                            style={{
                                                height: 50,
                                                marginRight: 10
                                            }}
                                        />
                                        {props.taskForm.image.name}

                                        <div
                                            style={{
                                                float: 'right',
                                                lineHeight: 5
                                            }}
                                        >
                                            <DeleteOutlined
                                                style={{
                                                    color: 'red',
                                                    cursor: 'pointer',
                                                    fontSize: 14,
                                                }}
                                                onClick={() => props.setTaskForm({ ...props.taskForm, image: '' })}
                                            />
                                        </div>
                                    </Card>
                                }

                                <input
                                    type='file'
                                    id='task-img-file'
                                    style={{ display: 'none' }}
                                    accept="image/png"
                                    onChange={e => {
                                        let filesArray = e.target.files;
                                        let file = filesArray[filesArray.length - 1];

                                        // Set image in form
                                        props.setTaskForm({ ...props.taskForm, image: file });

                                        // Set thumbnail
                                        var fileReader = new FileReader();
                                        fileReader.readAsDataURL(file);
                                        fileReader.onload = function (oFREvent) {
                                            document.getElementById("task-img-file-thumb").src = oFREvent.target.result;
                                        };
                                    }}
                                />

                            </Form.Item>

                            <Form.Item
                                label="Fonema"
                                style={{ width: 100 }}
                            >
                                <Input
                                    value={props.taskForm.phoneme}
                                    onChange={e => props.setTaskForm({ ...props.taskForm, phoneme: e.target.value })}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Áudio da palavra (completa)"
                            >

                                {
                                    !props.taskForm.completeWordAudio &&
                                    <Button
                                        icon={<UploadOutlined />}
                                        onClick={() => document.getElementById('task-complete-audio-file').click()}
                                        style={{ marginBottom: '10px' }}
                                    >
                                        Adicionar áudio
                                    </Button>
                                }

                                {
                                    props.taskForm.completeWordAudio &&
                                    <Card
                                        style={{
                                            color: '#6495ED',
                                            fontSize: 12,
                                        }}
                                    >
                                        <SoundOutlined
                                            style={{
                                                fontSize: 20,
                                                marginRight: 20,
                                                color: 'black',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => document.getElementById(`audio-task`).play()}
                                        />

                                        <audio id={`audio-task`}>
                                            <source src={props.taskForm.completeWordAudio} type="audio/mpeg" />
                                        </audio>

                                        {props.taskForm.completeWordAudio.name}

                                        <div
                                            style={{
                                                float: 'right',
                                            }}
                                        >
                                            <DeleteOutlined
                                                style={{
                                                    color: 'red',
                                                    cursor: 'pointer',
                                                    fontSize: 14,
                                                }}
                                                onClick={() => props.setTaskForm({ ...props.taskForm, completeWordAudio: '' })}
                                            />
                                        </div>
                                    </Card>
                                }

                                <input
                                    type='file'
                                    id='task-complete-audio-file'
                                    style={{ display: 'none' }}
                                    accept="audio/mpeg3"
                                    onChange={e => {// Set complete audio in form
                                        let filesArray = e.target.files;
                                        let file = filesArray[filesArray.length - 1];
                                        props.setTaskForm({ ...props.taskForm, completeWordAudio: file });
                                    }}
                                />
                            </Form.Item>

                        </Form>
                        
                        {
                            !props.taskIdToUpdate &&
                            <div>

                                <div
                                    style={{
                                        marginBottom: 10
                                    }}
                                >
                                    Sílabas
                                </div>

                                {
                                    props.taskForm.syllables.map((el, i) => {

                                        return (
                                            <span>
                                                <Tag
                                                    color={el.isPhoneme ? 'green' : 'default'}
                                                    key={el}
                                                    style={{
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => {
                                                        Modal.confirm({
                                                            title: 'Deseja excluir essa silaba?',
                                                            icon: <ExclamationCircleOutlined />,
                                                            content: 'Essa ação não poderá ser desfeita',
                                                            okText: 'Sim',
                                                            okType: 'danger',
                                                            cancelText: 'Não',
                                                            onOk() {
                                                                let syllablesArray = props.taskForm.syllables;
                                                                syllablesArray.splice(i, 1);
                                                                console.log(props.taskForm);
                                                                let audiosArray = props.taskForm.audios;
                                                                audiosArray.splice(i, 1);

                                                                props.setTaskForm({ ...props.taskForm, syllables: syllablesArray, audios: audiosArray });
                                                            },
                                                        });
                                                    }}
                                                >
                                                    {el.syllable.toUpperCase()}
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
                            </div>
                        }

                        <Button
                            type='primary'
                            disabled={
                                !props.taskForm.name || (props.taskForm.syllables.length === 0)
                            }
                            onClick={() => props.save()}
                            loading={props.loadingSaveButton}
                            style={{ marginTop: 30, float: 'right', width: '200px' }}
                        >
                            Salvar
                        </Button>

                    </Card>

                </div>
            </Spin>

        </div>

    )

}

export default TaskFormView;