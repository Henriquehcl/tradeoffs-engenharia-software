/*
 * ===========================================================================
 * App Component - Componente Raiz
 * ===========================================================================
 *
 * Configura o roteamento e providers globais.
 *
 * Estrutura:
 * - BrowserRouter: Navegação SPA
 * - AuthProvider: Contexto de autenticação (token JWT)
 * - Toaster: Notificações toast (react-hot-toast)
 * - Routes: Definição das rotas
 *
 * Rotas:
 * - / → Login page
 * - /dashboard → Dashboard (protegida por PrivateRoute)
 * ===========================================================================
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toaster para notificações visuais (sucesso, erro, etc.) */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#f1f5f9' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' },
            },
          }}
        />

        <Routes>
          {/* Rota pública - Login */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rota protegida - Dashboard (requer autenticação) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          {/* Redireciona rotas desconhecidas para login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
