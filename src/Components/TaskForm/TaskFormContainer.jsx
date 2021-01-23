import React, { useEffect, useState } from 'react';

// Modules
import { message } from 'antd';

// Components
import TaskFormView from './TaskFormView';

const TaskFormContainer = (props) => {
    
    props = props.parent_props;

    useEffect(() => {

        const getTask = async (id) => {

        };

        getTask();

    }, []);

    /**
     * Open and close syllable modal
     * @param {Boolean} boolean
     */
    const [ syllableModal, setSyllableModal ] = useState(false);
    const openCloseSyllableModal = (boolean) => {
        setSyllableModal(boolean);
    };

    /**
     * Set syllable to push in array
     */
    const [ syllableToPush, setSyllableToPush ] = useState('');

    /**
     * Set form.
     */
    const [ taskForm, setTaskForm ] = useState({ name: '', image: '', syllables: [], audios: [] });

    /**
     * Save task.
     */
    const save = async () => {

        // Changing the name of the image
        let image = taskForm.image;
        let extensionString = image.type.split('/')[1];
        let blob = image.slice(0, image.size, image.type); 
        let imageWithNewName = new File([blob], `${taskForm.name}.${extensionString}`, { type: image.type });

        let Form = new FormData();
        Form.append('name', taskForm.name);
        Form.append('image', imageWithNewName);
        Form.append('syllables', JSON.stringify(taskForm.syllables));
        
        let apiResponse = await fetch('/tasks', 
        { 
            headers: {
                'access_token': sessionStorage.getItem('access_token') || localStorage.getItem('access_token')
            },
            method: 'POST',
            body: Form
        });
        apiResponse = await apiResponse.json();

        // Check if response was successfuly
        if(apiResponse.code === 200){
            
            message.success('Tarefa criada com sucesso');
            props.history.push('/home/task');
            
        } else {
            
            message.error(apiResponse.message);
            
        }
    }

    return(

        <TaskFormView
            syllableModal={syllableModal}
            openCloseSyllableModal={e => openCloseSyllableModal(e)}

            taskForm={taskForm}
            setTaskForm={form => setTaskForm({ ...form })}

            syllableToPush={syllableToPush}
            setSyllableToPush={e => setSyllableToPush(e)}

            save={() => save()}
        />

    )

}

export default TaskFormContainer;