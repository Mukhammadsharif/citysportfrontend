import React from 'react';
import {useLoad} from "../hooks/request";
import {GET_NOTIFICATIONS} from "../tools/urls";

const Notifications = () => {
    const token = localStorage.getItem('token')
    const {response} = useLoad({
        url: GET_NOTIFICATIONS,
        headers: {
            Authorization: `Token ${token}`
        }
    })

    return (
        <div>
            <h2>Notifications</h2>
            {response?.length ? response.map((notification) => (
                <div key={notification.id}>
                    <p>{notification.text}</p>
                </div>
            )) : ''}
        </div>
    );
};

export default Notifications;
