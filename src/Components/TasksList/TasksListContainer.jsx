import React, { useEffect, useState } from 'react';

// Modules
import { message } from 'antd';
import env from '../../env.json';

// Components
import TasksListView from './TasksListView';

const TasksListContainer = (props) => {

    /**
     * Get tasks.
     */
    const [ tasks, setTasks ] = useState([]);
    const getTasks = async () => {
        
        // Call API
        let apiResponse = await fetch(`${env.api_url}/tasks`, 
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
        if(apiResponse.code === 200){
            
            setTasks([...apiResponse.data]);
            
        } else {
            
            message.error(apiResponse.message);
            
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
        
        // Call API
        let apiResponse = await fetch(`${env.api_url}/tasks/${id}`, 
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
        if(apiResponse.code === 200){
            
            getTasks()
            
        } else {
            
            message.error(apiResponse.message);
            
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

    return(

        <TasksListView

            tasks={tasks}
            removeTask={id => removeTask(id)}

            arrayBufferToBase64={buffer => arrayBufferToBase64(buffer)}

        />

    )

}

export default TasksListContainer