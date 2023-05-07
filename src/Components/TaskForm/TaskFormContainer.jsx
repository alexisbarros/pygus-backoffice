import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { post, put } from '../../services/api';

import TaskFormView from './TaskFormView';

const TaskFormContainer = (props) => {

    props = props.parent_props;

    const [loading, setLoading] = useState(false);
    const [taskIdToUpdate, setTaskIdToUpdate] = useState();
    const [syllableModal, setSyllableModal] = useState(false);
    const [syllableToPush, setSyllableToPush] = useState({ syllable: '', isPhoneme: false, });
    const [audioToPush, setAudioToPush] = useState('');
    const [taskForm, setTaskForm] = useState({ name: '', image: '', syllables: [], audios: [], phoneme: '', completeWordAudio: '' });
    const [loadingSaveButton, setLoadingSaveButton] = useState(false);

    useEffect(() => {
        const getTask = async () => {

            if (props.location.pathname.includes('/home/task/edit/')) {
                setLoading(true);

                const id = props.location.pathname.split('/')[4];
                setTaskIdToUpdate(id);

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

                if (apiResponse.code === 200) {
                    setTaskForm({
                        name: apiResponse.data.name,
                        phoneme: apiResponse.data.phoneme,
                        image: `${process.env.REACT_APP_API_URL}/public/tasks_images/${removeAccents(apiResponse.data.name)}.png`,
                        syllables: apiResponse.data.syllables,
                        completeWordAudio: `${process.env.REACT_APP_API_URL}/public/tasks_complete_audios/${removeAccents(apiResponse.data.name)}.mp3`,
                    });
                    
                } else {

                    message.error(apiResponse.message);

                }

                setLoading(false);
            }
        };

        getTask();

    }, []);

    const openCloseSyllableModal = (boolean) => setSyllableModal(boolean);

    const save = async () => {
        setLoadingSaveButton(true);
        
        let ImgForm = new FormData();
        let CompleteAudioForm = new FormData();

        let image = taskForm.image;
        if (typeof image !== 'string') {
            const imageBlob = image.slice(0, image.size, image.type);
            const imageWithNewName = new File(
                [imageBlob], 
                `${removeAccents(taskForm.name).toUpperCase()}.png`, 
                { type: image.type }
            );
            ImgForm.append('image', imageWithNewName);
        }
        
        let audio = taskForm.completeWordAudio;
        if (typeof audio !== 'string') {
            const audioBlob = audio.slice(0, audio.size, audio.type);
            const audioWithNewName = new File(
                [audioBlob], 
                `${removeAccents(taskForm.name).toUpperCase()}.mp3`, 
                { type: audio.type }
            );
            CompleteAudioForm.append('completeAudio', audioWithNewName);
        }

        
        const body = {
            syllables: taskForm.syllables,
            name: taskForm.name,
            phoneme: taskForm.phoneme,
        };
        
        const baseRoute = `${process.env.REACT_APP_API_URL}/tasks`;
        const headers = {
            'access_token': sessionStorage.getItem('access_token') || localStorage.getItem('access_token'),
        };

        const apiResponse = taskIdToUpdate ?
            await put({
                route: `${baseRoute}/${taskIdToUpdate}`,
                body: JSON.stringify(body),
                headers: {
                    ...headers,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            :
            await post({
                route: baseRoute,
                body: JSON.stringify(body),
                headers: {
                    ...headers,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

        if (apiResponse.code === 200) {
            post({ route: `${baseRoute}/upload/image`, body: ImgForm, headers});
            post({ route: `${baseRoute}/upload/audio`, body: CompleteAudioForm, headers});
            
            if (!taskIdToUpdate) {
                
                let AudioForm = new FormData();
                let audios = taskForm.audios;
                audios.forEach((el_audio, index_audio) => {
                    let audioWithNewName = el_audio;
                    if (!el_audio.data) {
                        let audioBlob = el_audio.slice(0, el_audio.size, el_audio.type);
                        audioWithNewName = new File([audioBlob], `${removeAccents(taskForm.name).toUpperCase()}__${removeAccents(taskForm.syllables[index_audio].syllable).toUpperCase()}.mp3`, { type: el_audio.type });
                        AudioForm.append('audios', audioWithNewName);
                    }
                })
                
                await post({ route: `${baseRoute}/upload/audios`, body: AudioForm, headers});

                message.success(`Tarefa ${taskIdToUpdate ? 'atualizada' : 'criada'} com sucesso`);
                setLoadingSaveButton(false);
                props.history.push('/home/task');
                
            } else {
                
                message.success(`Tarefa ${taskIdToUpdate ? 'atualizada' : 'criada'} com sucesso`);
                setLoadingSaveButton(false);
                props.history.push('/home/task');

            }
        }

        setLoadingSaveButton(false);
    }

    /**
     * Remove accents
     * @param {String} term 
     * @returns Term without accents
     */
    const removeAccents = (term) => {
        return term.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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