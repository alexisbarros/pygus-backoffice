import React, { Fragment } from "react";

// Modules
import { Card, Table, Tag, Space, Button, Breadcrumb, Modal, Form, Select, Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

// Styles
import "./TasksListStyle.css";

const TasksListView = (props) => {
    // Columns of the tasks table list
    const columns = [
        {
            title: "Nome",
            dataIndex: "name",
            key: "name",
            render: (originalName) => {
                const name = originalName
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                return (
                    <Fragment>
                        <audio id={`audio-${name}`}>
                            <source
                                src={`${process.env.REACT_APP_API_URL}/public/tasks_complete_audios/${name}.mp3`}
                                type="audio/mpeg"
                            />
                        </audio>
                        <Tag
                            key={originalName}
                            style={{ cursor: "pointer" }}
                            onClick={() => document.getElementById(`audio-${name}`).play()}
                        >
                            {originalName}
                        </Tag>
                    </Fragment>
                );
            },
        },
        {
            title: "Imagem",
            dataIndex: "image",
            key: "image",
            render: (image, row) => {
                const name = row.originalName
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                return (
                    <a
                        href={`${process.env.REACT_APP_API_URL}/public/tasks_images/${name}.png`}
                        target="_blank"
                    >
                        <img
                            src={`${process.env.REACT_APP_API_URL}/public/tasks_images/${name}.png`}
                            alt="Imagem da tarefa"
                            height="100"
                        />
                    </a>
                );
            },
        },
        {
            title: "Sílabas",
            dataIndex: "syllables",
            key: "syllables",
            render: (syllables, row) => (
                <span>
                    {syllables.map((el, index) => {
                        const name = row.originalName
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "");
                        const syllable = el.syllable
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "");
                        return (
                            <Fragment>
                                <audio id={`audio-syllable-${name}-${syllable}`}>
                                    <source
                                        src={`${process.env.REACT_APP_API_URL}/public/tasks_audios/${name}/${syllable}.mp3`}
                                        type="audio/mpeg"
                                    />
                                </audio>
                                <Tag
                                    color={el.isPhoneme ? "green" : "default"}
                                    key={el}
                                    style={{
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        document
                                            .getElementById(`audio-syllable-${name}-${syllable}`)
                                            .play();
                                    }}
                                >
                                    {el.syllable.toUpperCase()}
                                </Tag>
                            </Fragment>
                        );
                    })}
                </span>
            ),
        },
        {
            title: "Fonema",
            dataIndex: "phoneme",
            key: "phoneme",
            sorter: (a, b) =>
                a.phoneme > b.phoneme ? 1 : b.phoneme > a.phoneme ? -1 : 0,
            filters: [...new Set(props.tasks.map((el) => el["phoneme"]))].map(
                (el) => {
                    return {
                        text: el,
                        value: el,
                    };
                }
            ),
            onFilter: (value, record) => record.phoneme.indexOf(value) === 0,
        },
        {
            title: "Criado em",
            dataIndex: "_createdAt",
            key: "_createdAt",
        },
        {
            title: "Ações",
            key: "actions",
            width: 100,
            render: (text, record) => (
                <Space size="middle">
                    <span
                        style={{
                            color: "rgb(64, 169, 255)",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            props.setPhonemeModal(true);
                            props.setTaskToCopy(record);
                        }}
                    >
                        Copiar
                    </span>

                    <Link to={`/home/task/edit/${record.key}`}>Editar</Link>

                    <span
                        style={{
                            color: "red",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            Modal.confirm({
                                title: "Tem certeza que deseja excluir essa tarefa?",
                                icon: <ExclamationCircleOutlined />,
                                content: "Essa ação não poderá ser desfeita",
                                okText: "Sim",
                                okType: "danger",
                                cancelText: "Não",
                                onOk() {
                                    props.removeTask(record.key);
                                },
                            });
                        }}
                    >
                        Deletar
                    </span>
                </Space>
            ),
        },
    ];

    const dataSource = props.tasks.map((el) => {
        return {
            ...el,
            name: el.name.toUpperCase(),
            originalName: el.name,
            phoneme: el.phoneme,
            _createdAt: new Date(el._createdAt).toLocaleString("pt-BR"),
            key: el._id,
        };
    });

    return (
        <div
            style={{
                height: "80vh",
                position: "relative",
            }}
        >
            <div
                style={{
                    maxHeight: "100%",
                    overflow: "auto",
                }}
            >
                <Card title="Lista de tarefas">
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/home">Início</Link>
                        </Breadcrumb.Item>

                        <Breadcrumb.Item>Lista de Tarefas</Breadcrumb.Item>
                    </Breadcrumb>

                    <Link to="/home/task/new">
                        <Button
                            type="primary"
                            style={{
                                marginBottom: 20,
                                marginTop: 20,
                            }}
                        >
                            Adicionar tarefa
                        </Button>
                    </Link>

                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        loading={props.loading}
                        locale={{
                            emptyText: "Sem tarefas cadastradas",
                        }}
                    />
                </Card>
            </div>

            <Modal
                visible={props.phonemeModal}
                title="Copiar para pasta"
                onOk={async () => await props.copyTask()}
                okText="Copiar"
                onCancel={() => {
                    props.setPhonemeModal(false);
                    props.setTaskToCopy();
                }}
                cancelText="Cancelar"
            >
                <Spin spinning={props.copingTask} tip={props.copingTask && "Copiando"}>
                    <Form layout="vertical">
                        <Form.Item label="Pasta">
                            <Select
                                style={{ width: "100%" }}
                                placeholder="Escolha as pastas"
                                value={props.taskToCopy?.phoneme}
                                onChange={(e) => {
                                    props.setTaskToCopy({
                                        ...props.taskToCopy,
                                        phoneme: e,
                                    });
                                }}
                            >
                                {props.phonemes.map((phoneme, i) => {
                                    return (
                                        <Select.Option key={i.toString()} value={phoneme}>
                                            {phoneme}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Escolha o fonema">
                            <span>
                                {props.taskToCopy?.syllables.map((element, syllableIndexToUpdate) => {
                                    const syllable = element.syllable
                                        .normalize("NFD")
                                        .replace(/[\u0300-\u036f]/g, "");
                                    return (
                                        <Fragment>
                                            <Tag
                                                color={element.isPhoneme ? "green" : "default"}
                                                key={syllable}
                                                style={{ cursor: "pointer", }}
                                                onClick={() => {
                                                    props.setTaskToCopy({
                                                        ...props.taskToCopy,
                                                        syllables: props.taskToCopy.syllables
                                                            .map((el, syllableIndex) => {
                                                                el.isPhoneme = syllableIndexToUpdate === syllableIndex;
                                                                return el;
                                                            }),
                                                    });
                                                }}
                                            >
                                                {syllable.toUpperCase()}
                                            </Tag>
                                        </Fragment>
                                    );
                                })}
                            </span>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
};

export default TasksListView;
