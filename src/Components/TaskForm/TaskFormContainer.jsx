import React, { useEffect, useState } from 'react';

// Modules
import { message } from 'antd';
import env from '../../env.json';

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
     * Set syllable and audio to push in array
     */
    const [ syllableToPush, setSyllableToPush ] = useState('');
    const [ audioToPush, setAudioToPush ] = useState('');

    /**
     * Set form.
     */
    const [ taskForm, setTaskForm ] = useState({ name: '', image: '', syllables: [], audios: [] });

    /**
     * Save task.
     */
    const [ loadingSaveButton, setLoadingSaveButton ] = useState(false);
    const save = async () => {

        setLoadingSaveButton(true);

        // Changing the name of the image
        let image = taskForm.image;
        // let extensionString = image.type.split('/')[1];
        let blob = image.slice(0, image.size, image.type); 
        // let imageWithNewName = new File([blob], `${taskForm.name}.${extensionString}`, { type: image.type });
        let imageWithNewName = new File([blob], `${taskForm.name}`, { type: image.type });
        
        // Create form to save.
        let Form = new FormData();
        Form.append('name', taskForm.name);
        Form.append('image', imageWithNewName);
        Form.append('syllables', JSON.stringify(taskForm.syllables));
        
        // Call API.
        let apiResponse = await fetch(`${env.api_url}/tasks`, 
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

            // Changing the name of the audios
            let AudioForm = new FormData();
            let audios = taskForm.audios;
            audios.forEach((el_audio, index_audio) => {
                // let audioExtensionString = el_audio.type.split('/')[1];
                let audioBlob = el_audio.slice(0, el_audio.size, el_audio.type); 
                let audioWithNewName = new File([audioBlob], `${taskForm.name}_${taskForm.syllables[index_audio]}.mp3`, { type: el_audio.type });
                AudioForm.append('audios', audioWithNewName);
            })

            // Call API to put audios in server.
            let audioApiResponse = await fetch(`${env.api_url}/tasks/audios/${apiResponse.data._id}`, 
            { 
                headers: {
                    'access_token': sessionStorage.getItem('access_token') || localStorage.getItem('access_token')
                },
                method: 'PUT',
                body: AudioForm
            });
            audioApiResponse = await audioApiResponse.json();

            if(audioApiResponse.code === 200){

                message.success('Tarefa criada com sucesso');
                setLoadingSaveButton(false);
                props.history.push('/home/task');
                
            } else {
                
                setLoadingSaveButton(false);
                message.error(audioApiResponse.message);
                
            }
            
            
        } else {
            
            setLoadingSaveButton(false);
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
            audioToPush={audioToPush}
            setAudioToPush={e => setAudioToPush(e)}

            save={() => save()}
            loadingSaveButton={loadingSaveButton}
        />

    )

}

export default TaskFormContainer;