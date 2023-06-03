import React, { useEffect, useState } from 'react';

// Modules
import { message } from 'antd';
import { post } from '../../services/api';

// Components
import TasksListView from './TasksListView';

const TasksListContainer = (props) => {

    const [phonemes, setPhonemes] = useState([]);
    const [phonemeModal, setPhonemeModal] = useState(false);
    const [taskToCopy, setTaskToCopy] = useState();
    const [copingTask, setCopingTask] = useState(false);
    /**
     * Get tasks.
     */
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const getTasks = async () => {

        setLoading(true);
        // Call API
        let apiResponse = await fetch(`${process.env.REACT_APP_API_URL}/tasks/backoffice`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'access_token': sessionStorage.getItem('access_token') || localStorage.getItem('access_token')
                },
                method: 'GET',
            });
        apiResponse = await apiResponse.json();

        // Check if response was successfuly
        if (apiResponse.code === 200) {

            setTasks([...apiResponse.data]);
            setPhonemes([...getPhonemes(apiResponse.data)]);
            setLoading(false);

        } else {

            message.error(apiResponse.message);
            setLoading(false);

        }

    };

    useEffect(() => {

        getTasks();

    }, []);

    /**
     * Method to remove a task.
     * @param {String} id
     */
    const removeTask = async (id) => {
        setLoading(true);

        // Call API
        let apiResponse = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'access_token': sessionStorage.getItem('access_token') || localStorage.getItem('access_token')
                },
                method: 'DELETE',
            });
        apiResponse = await apiResponse.json();

        // Check if response was successfuly
        if (apiResponse.code === 200) {

            getTasks();
            setLoading(false);

        } else {

            message.error(apiResponse.message);
            setLoading(false);

        }

    }

    /**
     * Transform buffer to base64 to render a image from mongodb
     * @param {*} buffer 
     */
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    }

    const getPhonemes = (tasks) => {
        const phonemes = tasks.map(el => el.phoneme);
        return [...new Set(phonemes)];
    }

    const copyTask = async () => {
        setCopingTask(true);

        const body = {
            syllables: taskToCopy.syllables,
            name: taskToCopy.name,
            phoneme: taskToCopy.phoneme,
        };
        
        const baseRoute = `${process.env.REACT_APP_API_URL}/tasks`;
        const headers = { 'access_token': sessionStorage.getItem('access_token') || localStorage.getItem('access_token') };

        const apiResponse = await post({
            route: baseRoute,
            body: JSON.stringify(body),
            headers: {
                ...headers,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        if (apiResponse.code !== 200){
            message.error('Erro ao copiar a tarefa');
            return setCopingTask(false);
        }
        
        message.success('Tarefa copiada com sucesso');
        setCopingTask(false);
        setPhonemeModal(false);
        return getTasks();
    }

    return (

        <TasksListView

            loading={loading}
            tasks={tasks}
            removeTask={id => removeTask(id)}
            
            phonemes={phonemes}
            phonemeModal={phonemeModal}
            setPhonemeModal={e => setPhonemeModal(e)}
            taskToCopy={taskToCopy}
            setTaskToCopy={e => setTaskToCopy(e)}
            copingTask={copingTask}
            copyTask={() => copyTask()}

            arrayBufferToBase64={buffer => arrayBufferToBase64(buffer)}

        />

    )

}

export default TasksListContainer