import { useEffect } from 'react';
import api from '../utils/api';

export default function Logout() {
    useEffect(() => {
        api.get('/auth/logout')
        .then(() => {
            window.location.href = "/";
        })
        .catch((error) => {
            console.error('Error logging out:', error);
        });
    }, []);

    return null;
}