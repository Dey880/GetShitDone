import '../css/components/Form.css';
import { useState } from 'react';
import api from '../utils/api';

export default function Register() {
    const [displayname, setDisplayname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        
        api.post(
            '/auth/register',
            { displayname, email, password, repeatPassword }
        )
        .then((response) => {
            window.location.href = "/login";
            if (response.data.user) {
                window.location.href = "/todo";
            }
        })
        .catch((error) => {
            console.log(error.response?.data || error);
            setError("Registration failed. Please check your information.");
        });
    }

    return (
        <div className='form-container'>
            <h1>Register</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Display Name"
                    onChange={(e) => setDisplayname(e.target.value)}
                />
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
                <input
                    type="password"
                    placeholder="Repeat Password"
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
                <div className='form-footer'>
                    <a href="/login">Already have an account?</a>
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    );
}