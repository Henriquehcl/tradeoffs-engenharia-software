/*
 * ===========================================================================
 * Auth Context - Contexto de Autenticação
 * ===========================================================================
 *
 * Gerencia o estado de autenticação global da aplicação.
 *
 * Responsabilidades:
 * - Armazenar e recuperar o token JWT do localStorage
 * - Fornecer funções de login, registro e logout
 * - Verificar se o usuário está autenticado
 * - Manter os dados do usuário logado
 * - Interceptar respostas 401 para logout automático
 *
 * Persistência de sessão:
 * - O token JWT é salvo no localStorage ao fazer login/registro
 * - Ao carregar a página, o contexto verifica se há um token salvo
 * - Se o token existir, o usuário permanece logado após refresh
 * - Se o token expirar (401 do backend), o logout é executado
 * ===========================================================================
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

/*
 * Interface que define os dados do usuário autenticado.
 */
interface User {
  id: string;
  email: string;
}

/*
 * Interface do contexto de autenticação.
 * Define o contrato que os componentes consumidores podem utilizar.
 */
interface AuthContextData {
  /* Usuário logado (null se não autenticado) */
  user: User | null;
  /* Token JWT atual (null se não autenticado) */
  token: string | null;
  /* Indica se o usuário está autenticado */
  isAuthenticated: boolean;
  /* Indica se o contexto está carregando (verificando token salvo) */
  loading: boolean;
  /* Função para realizar login */
  login: (email: string, password: string) => Promise<void>;
  /* Função para registrar novo usuário */
  register: (email: string, password: string) => Promise<void>;
  /* Função para fazer logout */
  logout: () => void;
}

// Cria o contexto com valor padrão undefined
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Chave utilizada para salvar o token no localStorage
const TOKEN_KEY = '@desafio-tecnico:token';
const USER_KEY = '@desafio-tecnico:user';

/*
 * Provider do contexto de autenticação.
 * Deve envolver toda a árvore de componentes que precisam de autenticação.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /*
   * Efeito executado ao montar o componente.
   * Verifica se existe um token salvo no localStorage para
   * restaurar a sessão do usuário após refresh da página.
   */
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      // Configura o header de Authorization para todas as requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }

    setLoading(false);
  }, []);

  /*
   * Função de logout: remove token e dados do usuário.
   * Limpa localStorage e headers de autenticação.
   */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  /*
   * Configura interceptor do Axios para detectar respostas 401.
   * Se o backend retornar 401 (token expirado/inválido),
   * executa logout automático.
   */
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      },
    );

    // Limpa o interceptor ao desmontar
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  /*
   * Salva os dados de autenticação após login/registro bem-sucedido.
   * Armazena no state e no localStorage para persistência.
   */
  const saveAuthData = (accessToken: string, userData: User) => {
    setToken(accessToken);
    setUser(userData);

    // Persiste no localStorage para sobreviver ao refresh da página
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    // Configura o header Authorization para requisições futuras
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  };

  /*
   * Realiza login do usuário.
   *
   * Fluxo:
   * 1. Envia email e senha para POST /api/auth/login
   * 2. Recebe token JWT e dados do usuário
   * 3. Salva no estado e localStorage
   * 4. Configura header Authorization
   *
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @throws Error se as credenciais forem inválidas
   */
  const login = async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    const { access_token, user: userData } = response.data.data;
    saveAuthData(access_token, userData);
  };

  /*
   * Registra um novo usuário.
   *
   * Fluxo:
   * 1. Envia email e senha para POST /api/auth/register
   * 2. Backend cria o usuário e gera token
   * 3. Salva no estado e localStorage
   * 4. Usuário é logado automaticamente após registro
   *
   * @param email - Email do novo usuário
   * @param password - Senha do novo usuário
   * @throws Error se o email já estiver cadastrado
   */
  const register = async (email: string, password: string) => {
    const response = await api.post('/api/auth/register', { email, password });
    const { access_token, user: userData } = response.data.data;
    saveAuthData(access_token, userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
