import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import '@fontsource/inter';

createRoot(document.getElementById('root')!).render(
    <>
        <AuthProvider>
            <Router>
                <App />
            </Router>
        </AuthProvider>
    </>
);
