// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './login';

import User from './pages/User/userPage';
import TicketAdd from './pages/User/ticketAdd';
import TicketDetail from './pages/User/ticketDetail';

import AttendantPage from './pages/Attendant/attendantPage';

import AdminPage from './pages/Admin/AdminPage';
import ManageUser from './pages/Admin/ManageUser';

import PrivateRoute from './infra/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Pública */}
        <Route path="/" element={<Login />} />

        {/* Usuário */}
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

        {/* Atendente */}
        <Route
          path="/attendant"
          element={
            <PrivateRoute roles={['Attendant', 'Admin']}>
              <AttendantPage />
            </PrivateRoute>
          }
        />

        {/* Administrador */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={['Admin']}>
              <AdminPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/manageuser"
          element={
            <PrivateRoute roles={['Admin']}>
              <ManageUser />
            </PrivateRoute>
          }
        />

        {/* Rota inexistente */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}