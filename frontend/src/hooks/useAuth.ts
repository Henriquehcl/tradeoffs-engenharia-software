/*
 * ===========================================================================
 * useAuth Hook - Hook de Autenticação
 * ===========================================================================
 *
 * Hook personalizado para acessar o contexto de autenticação.
 * Encapsula o useContext(AuthContext) com verificação de segurança.
 *
 * Uso:
 * const { user, login, logout, isAuthenticated } = useAuth();
 * ===========================================================================
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
