import axios from 'axios';
import { useEffect } from 'react';

export default function Logout() {
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {
            withCredentials: true
        })
        .then(() => {
            window.location.href = "/";
        })
        .catch((error) => {
            console.error('Error logging out:', error);
        });
    }, []);

    return null;
}