/*
 * ===========================================================================
 * PrivateRoute Component - Proteção de Rotas
 * ===========================================================================
 *
 * Componente que protege rotas que requerem autenticação.
 *
 * Fluxo:
 * 1. Verifica se existe um token JWT no contexto
 * 2. Se autenticado → renderiza o componente filho
 * 3. Se não autenticado → redireciona para login
 * 4. Se carregando → mostra spinner de loading
 * ===========================================================================
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto verifica o token salvo, mostra loading
  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <div className="spinner spinner-lg"></div>
        <span className="loading-text">Verificando autenticação...</span>
      </div>
    );
  }

  // Se não autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se autenticado, renderiza o conteúdo protegido
  return <>{children}</>;
};
