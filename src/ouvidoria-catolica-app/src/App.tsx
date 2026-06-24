import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login"; 
import User from "./pages/User/userPage";
import Ticket from "./pages/User/ticketDetail";
import AttendantPage from "./pages/Attendant/attendantPage";
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
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/attendant" element={<AttendantPage />} />
        
        <Route path="/ticketAdd" element={<TicketAdd />} />
        <Route path="/ticketDetail/:id" element={<TicketDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
