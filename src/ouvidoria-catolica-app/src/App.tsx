import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login"; // Sua tela de login atual
import User from "./pages/User/userPage";
import Ticket from "./pages/User/ticketPage"

// --- CONFIGURAÇÃO DAS ROTAS ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Inicial / Padrão: Sempre carrega o Login */}
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/user" element={<User />} />
        <Route path="/ticket" element={<Ticket />} />
        
      </Routes>
    </BrowserRouter>
  );
}
