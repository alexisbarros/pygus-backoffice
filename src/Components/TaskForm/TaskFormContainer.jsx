import React, { useEffect, useState } from 'react';

// Modules
import { message } from 'antd';

// Components
import TaskFormView from './TaskFormView';

const TaskFormContainer = (props) => {

    props = props.parent_props;

    const [loading, setLoading] = useState(false);
    const [taskIdToUpdate, setTaskIdToUpdate] = useState();

    useEffect(() => {
        const getTask = async () => {

            if (props.location.pathname.includes('/home/task/edit/')) {
                setLoading(true);

                const id = props.location.pathname.split('/')[4];
                setTaskIdToUpdate(id);

                // Call API
                let apiResponse = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`,
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
                    setTaskForm({
                        name: apiResponse.data.name,
                        phoneme: apiResponse.data.phoneme,
                        image: apiResponse.data.image,
                        syllables: apiResponse.data.syllables,
                        audios: apiResponse.data.audios,
                        completeWordAudio: apiResponse.data.completeWordAudio,
                    })
                    document.getElementById("task-img-file-thumb").src = apiResponse.data.image
                    if (apiResponse.data.completeWordAudio.data) document.getElementById("task-complete-audio-file").src = `data:audio/mpeg3;base64,${arrayBufferToBase64(apiResponse.data.completeWordAudio.data.data)}`
                    
                } else {

                    message.error(apiResponse.message);

                }

                setLoading(false);
            }
        };

        getTask();

    }, []);

    /**
     * Transform buffer to base64 to render a audio from mongodb
     * @param {*} buffer 
     */
    const arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    }

    /**
     * Open and close syllable modal
     * @param {Boolean} boolean
     */
    const [syllableModal, setSyllableModal] = useState(false);
    const openCloseSyllableModal = (boolean) => {
        setSyllableModal(boolean);
    };

    /**
     * Set syllable and audio to push in array
     */
    const [syllableToPush, setSyllableToPush] = useState({ syllable: '', isPhoneme: false, });
    const [audioToPush, setAudioToPush] = useState('');

    /**
     * Set form.
     */
    const [taskForm, setTaskForm] = useState({ name: '', image: '', syllables: [], audios: [], phoneme: '', completeWordAudio: '' });

    /**
     * Save task.
     */
    const [loadingSaveButton, setLoadingSaveButton] = useState(false);
    const save = async () => {
        setLoadingSaveButton(true);

        // Changing the name of the image
        let image = taskForm.image;
        let imageWithNewName = image;
        // if (!image.data && (image.data && typeof image.data !== 'string')) {
        if (typeof taskForm.data !== 'string') {
            let blob = image.slice(0, image.size, image.type);
            imageWithNewName = new File([blob], `${taskForm.name.toUpperCase()}.png`, { type: image.type });
        }

        // Create form to save.
        let Form = new FormData();
        // Form.append('name', taskForm.name);
        // Form.append('phoneme', taskForm.phoneme);
        if (typeof taskForm.data !== 'string') Form.append('image', imageWithNewName);
        
        Form.append('syllables', JSON.stringify(taskForm.syllables));
        Form.append('name', taskForm.name);
        Form.append('phoneme', taskForm.phoneme);
        Form.append('syllables', JSON.stringify(taskForm.syllables));
        // Call API.
        let endpoint = `${process.env.REACT_APP_API_URL}/tasks`;
        let method = 'POST';
        let methodDescription = 'criada'
        if (props.location.pathname.includes('/home/task/edit/')) {
            let id = props.location.pathname.split('/')[4];
            endpoint = `${process.env.REACT_APP_API_URL}/tasks/${id}`;
            method = 'PUT';
            methodDescription = 'atualizada';
        }
        let apiResponse = await fetch(endpoint,
            {
                headers: {
                    'access_token': sessionStorage.getItem('access_token') || localStorage.getItem('access_token'),
                },
                method: method,
                body: Form
            });
        apiResponse = await apiResponse.json();

        // Check if response was successfuly
        if (apiResponse.code === 200 && typeof taskForm.audios !== 'object') {

            // Changing the name of the audios
            let AudioForm = new FormData();
            let audios = taskForm.audios;
            audios.forEach((el_audio, index_audio) => {
                let audioWithNewName = el_audio;
                if (!el_audio.data) {
                    let audioBlob = el_audio.slice(0, el_audio.size, el_audio.type);
                    audioWithNewName = new File([audioBlob], `${taskForm.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()}_${taskForm.syllables[index_audio].syllable.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()}.mp3`, { type: el_audio.type });
                    AudioForm.append('audios', audioWithNewName);
                }
            })

            // Call API to put audios in server.
            let audioApiResponse = await fetch(`${process.env.REACT_APP_API_URL}/tasks/audios/${apiResponse.data._id}`,
                {
                    headers: {
                        'access_token': sessionStorage.getItem('access_token') || localStorage.getItem('access_token')
                    },
                    method: 'PUT',
                    body: AudioForm
                });
            audioApiResponse = await audioApiResponse.json();

            if (audioApiResponse.code === 200 && typeof taskForm.audios !== 'object') {

                // Changing the name of the complete audio
                let CompleteAudioForm = new FormData();
                let audio = taskForm.completeWordAudio;
                let completeAudioWithNewName = audio;
                if (!audio.data) {
                    let completeAudioBlob = audio.slice(0, audio.size, audio.type);
                    completeAudioWithNewName = new File([completeAudioBlob], `${taskForm.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()}.mp3`, { type: audio.type });
                    CompleteAudioForm.append('completeAudio', completeAudioWithNewName);

                    // Call API to put complete audio in server.
                    let completeAudioApiResponse = await fetch(`${process.env.REACT_APP_API_URL}/tasks/complete_word_audio/${apiResponse.data._id}`,
                        {
                            headers: {
                                'access_token': sessionStorage.getItem('access_token') || localStorage.getItem('access_token')
                            },
                            method: 'PUT',
                            body: CompleteAudioForm
                        });
                    completeAudioApiResponse = await completeAudioApiResponse.json();

                    if (completeAudioApiResponse.code === 200) {

                        message.success(`Tarefa ${methodDescription} com sucesso`);
                        setLoadingSaveButton(false);
                        props.history.push('/home/task');

                    } else {

                        setLoadingSaveButton(false);
                        message.error(audioApiResponse.message);

                    }
                } else {
                    message.success(`Tarefa ${methodDescription} com sucesso`);
                    setLoadingSaveButton(false);
                    props.history.push('/home/task');
                }


            } else {

                setLoadingSaveButton(false);
                message.error(audioApiResponse.message);

            }


        } else {

            setLoadingSaveButton(false);
            message.error(apiResponse.message);
        
        }
        setLoadingSaveButton(false);
    }

    return (

        <TaskFormView
            loading={loading}

            syllableModal={syllableModal}
            openCloseSyllableModal={e => openCloseSyllableModal(e)}

            taskForm={taskForm}
            setTaskForm={form => setTaskForm({ ...form })}

            syllableToPush={syllableToPush}
            setSyllableToPush={e => setSyllableToPush(e)}
            audioToPush={audioToPush}
            setAudioToPush={e => setAudioToPush(e)}
            
            taskIdToUpdate={taskIdToUpdate}
            save={() => save()}
            loadingSaveButton={loadingSaveButton}
        />

    )

}

export default TaskFormContainer;