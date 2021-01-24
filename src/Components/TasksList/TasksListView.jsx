import React, { Fragment } from 'react';

// Modules
import { Card, Table, Tag, Space, Button, Breadcrumb, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import env from '../../env.json';

// Styles
import './TasksListStyle.css';

const TasksListView = (props) => {

    // Columns of the tasks table list
    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Sílabas',
            dataIndex: 'syllables',
            key: 'syllables',
            render: (syllables, row) => (
                <span>

                    {syllables.map(el => {
                        return(
                            <Fragment>
                                <Tag 
                                    color='green' 
                                    key={el}
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        document.getElementById(`audio-syllable-${row.originalName}-${el}`).play();
                                    }}
                                >
                                    {el.toUpperCase()}
                                </Tag>

                                <audio controls style={{ display: 'none' }} id={`audio-syllable-${row.originalName}-${el}`}>
                                    <source
                                        src={`${env.server_public}/tasks_audios/${row.originalName}_${el}.mp3`}
                                        type="audio/mpeg" 
                                    />
                                    Your browser does not support the audio element.
                                </audio>
                            </Fragment>
                        )
                    })}

                </span>
            )
        },
        {
            title: 'Imagem',
            dataIndex: 'image',
            key: 'image',
            align: 'center',
            render: image => {
                return <img src={image} width={40} height={40} alt='task' style={{ objectFit: 'contain' }} />
            }
        },
        {
            title: 'Criado em',
            dataIndex: '_createdAt',
            key: '_createdAt',
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 100,
            render: (text, record) => (
                
                <Space size="middle">
                    
                    <span 
                        style={{ 
                            color: 'red',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            
                            Modal.confirm({
                                title: 'Tem certeza que deseja excluir essa tarefa?',
                                icon: <ExclamationCircleOutlined />,
                                content: 'Essa ação não poderá ser desfeita',
                                okText: 'Sim',
                                okType: 'danger',
                                cancelText: 'Não',
                                onOk() {
                                    props.removeTask(record.key)
                                },
                            });

                        }}
                    >Deletar</span>
                </Space>
            
            ),
          },
    ];

    const dataSource = props.tasks.map(el => {
        return {
            ...el,
            name: el.name.toUpperCase(),
            originalName: el.name,
            _createdAt: new Date(el._createdAt).toLocaleString('pt-BR'),
            key: el._id,
            image: `${env.server_public}/tasks_images/${el.name}`
        }
    });

    return(

        <div
            style={{
                height: '80vh',
                position: 'relative'
            }}
        >

            <div
                style={{
                    maxHeight: '100%',
                    overflow: 'auto'
                }}
            >

                <Card
                    title='Lista de tarefas'
                >

                    <Breadcrumb>

                        <Breadcrumb.Item>
                            <Link to='/home'>Início</Link>
                        </Breadcrumb.Item>

                        <Breadcrumb.Item>
                            Lista de Tarefas
                        </Breadcrumb.Item>

                    </Breadcrumb>

                    <Link
                        to='/home/task/new'
                    >
                        <Button
                            type='primary'
                            style={{
                                marginBottom: 20,
                                marginTop: 20
                            }}
                        >
                            Adicionar tarefa
                        </Button>
                    </Link>
                    
                    <Table 
                        dataSource={dataSource} 
                        columns={columns} 
                        locale={{
                            emptyText: 'Sem tarefas cadastradas'
                        }}
                    />
                </Card>

            </div>

        </div>

    )

}

export default TasksListView;