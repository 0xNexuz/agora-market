import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Lab } from './Lab';
import { Store } from './Store';

const isLab = location.pathname.replace(/\/+$/, '') === '/lab';

createRoot(document.getElementById('root')!).render(<StrictMode>{isLab ? <Lab /> : <Store />}</StrictMode>);
