import axios from 'axios';
import { useState, useEffect } from 'react';
import '../css/components/Navbar.css';

export default function Navbar() {
    const [response, setResponse] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

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

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav>
            <div className="nav-container">
                <div className='nav-brand'>
                    <a href="/">GetShitDone</a>
                </div>
                
                <div className={`hamburger-menu ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                
                <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <li className='navli'><a href="/todo" onClick={() => setMenuOpen(false)}>Todo-list</a></li>
                    {response ? (
                        <li className='navli'><a href="/logout" onClick={() => setMenuOpen(false)}>Logout</a></li>
                    ) : (
                        <li className='navli'><a href="/login" onClick={() => setMenuOpen(false)}>Login</a></li>
                    )}
                </ul>
            </div>
        </nav>
    );
}