import axios from 'axios';
import { useState, useEffect } from 'react';
import '../css/components/Navbar.css';

export default function Navbar() {
    const [response, setResponse] = useState('');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/user`, {
            withCredentials: true
        })
        .then((response) => {
            setResponse(response.data.user._id);
        })
        .catch((error) => {
            console.error('Error fetching user:', error);
        });
    }, []);

    return (
        <nav>
            <ul className='nav-cluster'>
                <div className='nav-cluster-left'>
                    <li className='navli'><a href="/">GetShitDone</a></li>
                </div>
                <div className='nav-cluster-right'>
                    <li className='navli'><a href="/todo">Todo-list</a></li>
                    {response ? (
                        <li className='navli'><a href="/logout">Logout</a></li>
                    ) : (
                        <li className='navli'><a href="/login">Login</a></li>
                    )}
                </div>
            </ul>
        </nav>
    );
}