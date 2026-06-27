// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import User from './pages/User/userPage';
import AttendantPage from './pages/Attendant/attendantPage';
import TicketAdd from './pages/User/ticketAdd';
import TicketDetail from './pages/User/ticketDetail';
import PrivateRoute from './infra/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública — qualquer um acessa */}
        <Route path="/" element={<Login />} />

        {/* Exclusiva do usuário comum (Perfil 1 ou 'Common') */}
        <Route
          path="/user"
          element={
            <PrivateRoute roles={['Common']}>
              <User />
            </PrivateRoute>
          }
        />
        <Route
          path="/ticketAdd"
          element={
            <PrivateRoute roles={['Common']}>
              <TicketAdd />
            </PrivateRoute>
          }
        />
        <Route
          path="/ticketDetail/:id"
          element={
            <PrivateRoute roles={['Common']}>
              <TicketDetail />
            </PrivateRoute>
          }
        />

        {/* Exclusiva do atendente e admin (Perfis 2 e 3) */}
        <Route
          path="/attendant"
          element={
            <PrivateRoute roles={['Attendant', 'Admin']}>
              <AttendantPage />
            </PrivateRoute>
          }
        />

        {/* Qualquer rota desconhecida volta para o login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}