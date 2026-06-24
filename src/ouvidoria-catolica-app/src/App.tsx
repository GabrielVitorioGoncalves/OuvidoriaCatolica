import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login"; // Sua tela de login atual
import User from "./pages/User/userPage";
import TicketAdd from "./pages/User/ticketAdd"
import TicketDetail from "./pages/User/ticketDetail"

// --- CONFIGURAÇÃO DAS ROTAS ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Inicial / Padrão: Sempre carrega o Login */}
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/user" element={<User />} />
        <Route path="/ticketAdd" element={<TicketAdd />} />
        <Route path="/ticketDetail/:id" element={<TicketDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
