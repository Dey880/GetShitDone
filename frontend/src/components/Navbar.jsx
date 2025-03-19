import '../css/components/Navbar.css';

export default function Navbar() {
    return (
        <nav>
            <ul>
                <div className='nav-cluster-left'>
                    <li><a href="/">GetShitDone</a></li>
                </div>
                <div className='nav-cluster-right'>
                    <li><a href="/todo">Todo-list</a></li>
                    <li><a href="/login">Login</a></li>
                </div>
            </ul>
        </nav>
    );
}