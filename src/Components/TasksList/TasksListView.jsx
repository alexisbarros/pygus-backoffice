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
            dataIndex: 'sillables',
            key: 'sillables',
            render: sillables => (

                <span>

                    {sillables.map(el => {
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
            dataIndex: 'createdAt',
            key: 'createdAt',
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

    // MOCK: datasource
    const dataSource = [
        {
            key: '1',
            name: 'Boca',
            sillables: ['bo', 'ca'],
            createdAt: '01/01/2021'
        },
        {
            key: '2',
            name: 'Casa',
            sillables: ['ca', 'sa'],
            createdAt: '01/01/2021'
        },
        {
            key: '3',
            name: 'Bonito',
            sillables: ['bo', 'ni', 'to'],
            createdAt: '01/01/2021'
        }
    ];

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