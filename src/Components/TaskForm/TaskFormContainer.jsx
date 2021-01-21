import React, { useState } from 'react';

// Components
import TaskFormView from './TaskFormView';

const TaskFormContainer = (props) => {

    /**
     * Open and close sillable modal
     * @param {Boolean} boolean
     */
    const [ sillableModal, setSillableModal ] = useState(false);
    const openCloseSillableModal = (boolean) => {
        setSillableModal(boolean);
    }

    return(

        <TaskFormView
            sillableModal={sillableModal}
            openCloseSillableModal={e => openCloseSillableModal(e)}
        />

    )

}

export default TaskFormContainer;