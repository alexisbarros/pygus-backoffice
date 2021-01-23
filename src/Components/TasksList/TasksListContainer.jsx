import React, { useEffect, useState } from 'react';

// Modules
import { message } from 'antd';

// Components
import TasksListView from './TasksListView';

const TasksListContainer = (props) => {

    const [ tasks, setTasks ] = useState([]);

    useEffect(() => {

        const getTasks = async () => {
            
            // Call API
            let apiResponse = await fetch('/tasks', 
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

        getTasks();
    }, []);

    return(

        <TasksListView

            tasks={tasks}

        />

    )

}

export default TasksListContainer