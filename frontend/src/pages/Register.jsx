import '../css/components/Form.css';
import { useState } from 'react';
import axios from 'axios';

export default function Register() {
    const [displayname, setDisplayname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        console.log("Environment Variables:", process.env);
        console.error(`REACT_APP_BACKEND_URL ${process.env.REACT_APP_BACKEND_URL}`);
        if (process.env.REACT_APP_BACKEND_URL === undefined) {
            console.error("REACT_APP_BACKEND_URL environment variable is not set");
            return;
        } else {
            axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
                { displayname, email, password, repeatPassword },
                { withCredentials: true }
            )
            .then((response) => {
                window.location.href = "/login";
                console.log(response.data);
                if (response.data.user) {
                    window.location.href = "/todo";
                }
            })
            .catch((error) => {
                console.log(error.response.data);
            });
        }
    }

    return (
        <div className='form-container'>
            <h1>Register</h1>
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