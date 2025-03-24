import '../css/components/Form.css';
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
            { email, password },
            { withCredentials: true }
        )
        .then((response) => {
            if( response.data.user) {
                window.location.href = "/todo";
            }
        })
        .catch((error) => {
            console.log(error.response.data);
        });
    }
    return (
        <div className='form-container'>
            <h1>Login</h1>
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