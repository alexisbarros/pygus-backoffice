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

    return(

        <TasksListView

            tasks={tasks}
            removeTask={id => removeTask(id)}

        />

    )

}

export default TasksListContainer