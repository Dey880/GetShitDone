import '../css/components/Form.css';
import { useState } from 'react';
import api from '../utils/api';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        setError("");
            
        api.post(
            '/auth/login',
            { email, password }
        )
        .then((response) => {
            if(response.data.user) {
                window.location.href = "/todo";
            }
        })
        .catch((error) => {
            console.log(error.response?.data || error);
            setError("Login failed. Please check your credentials.");
        });
    }
    
    return (
        <div className='form-container'>
            <h1>Login</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className='form-footer'>
                    <a href="/register">New Account?</a>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
}