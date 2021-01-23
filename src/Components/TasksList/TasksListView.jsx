import React from 'react';

// Modules
import { Card, Table, Tag, Space, Button, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

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
            render: syllables => (

                <span>

                    {syllables.map(el => {
                        return(
                            <Tag color='green' key={el}>
                                {el.toUpperCase()}
                            </Tag>
                        )
                    })}

                </span>

            )
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
                
                    <Link 
                        to={`/home/task?id=${record.key}`}
                    >Editar</Link>
                    
                    <span 
                        style={{ 
                            color: 'red',
                            cursor: 'pointer'
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
            _createdAt: new Date(el._createdAt).toLocaleString('pt-BR'),
            key: el._id
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
                    
                    <Table dataSource={dataSource} columns={columns} />
                </Card>

            </div>

        </div>

    )

}

export default TasksListView;