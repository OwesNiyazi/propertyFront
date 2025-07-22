import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AdminImages from './pages/AdminImages';
import AdminUsers from './pages/AdminUsers';

createRoot(document.getElementById("root")!).render(<App />);
