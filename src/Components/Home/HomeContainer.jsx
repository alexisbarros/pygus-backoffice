import React from 'react';

// Components
import HomeView from './HomeView';

const HomeContainer = (props) => {

    /**
     * Logout method.
     */
    const logout = () => {
        
        // Remove token
        sessionStorage.removeItem('access_token');
        localStorage.removeItem('access_token');

        // Go to login page
        props.history.push('/');

    }

    return(

        <HomeView
            parent_props={props}

            logout={() => logout()}
        />

    )

}

export default HomeContainer;