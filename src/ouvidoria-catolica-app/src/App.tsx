import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login'; // Sua tela de login atual

// --- CONFIGURAÇÃO DAS ROTAS ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Inicial / Padrão: Sempre carrega o Login */}
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}