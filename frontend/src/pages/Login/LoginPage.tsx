/*
 * ===========================================================================
 * Login Page - Página de Autenticação
 * ===========================================================================
 *
 * Página de login/registro da aplicação.
 *
 * Funcionalidades:
 * - Alternância entre modo Login e Registro
 * - Validação de formulário no frontend
 * - Feedback visual (loading, erros, toasts)
 * - Redirecionamento automático para dashboard após sucesso
 * - Design glassmorphism com animações suaves
 *
 * Fluxo:
 * 1. Usuário preenche email e senha
 * 2. Clica em Login ou Registrar
 * 3. Frontend envia credenciais para o backend
 * 4. Backend retorna token JWT
 * 5. AuthContext salva o token no localStorage
 * 6. Usuário é redirecionado para /dashboard
 * ===========================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  // Estado do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  /*
   * Valida o formulário antes de enviar.
   * Verifica email e senha mínima.
   */
  const validateForm = (): boolean => {
    if (!email.trim()) {
      toast.error('Email é obrigatório');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Email inválido');
      return false;
    }
    if (password.length < 6) {
      toast.error('Senha deve ter no mínimo 6 caracteres');
      return false;
    }
    return true;
  };

  /*
   * Submete o formulário de login ou registro.
   * Trata erros e exibe feedback visual.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isRegister) {
        await register(email, password);
        toast.success('Conta criada com sucesso! 🎉');
      } else {
        await login(email, password);
        toast.success('Login realizado com sucesso! 👋');
      }
      navigate('/dashboard', { replace: true });
    } catch (error: unknown) {
      // Extrai a mensagem de erro da resposta do backend
      const err = error as { response?: { data?: { message?: string | string[] } } };
      const message = err.response?.data?.message;
      const errorMsg = Array.isArray(message) ? message[0] : message || 'Erro ao realizar operação';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background decorativo com gradientes */}
      <div className="login-bg-decoration">
        <div className="login-bg-circle login-bg-circle-1"></div>
        <div className="login-bg-circle login-bg-circle-2"></div>
        <div className="login-bg-circle login-bg-circle-3"></div>
      </div>

      <div className="login-card glass-card animate-slide-up">
        {/* Header do card */}
        <div className="login-header">
          <div className="login-logo">⚖️</div>
          <h1 className="login-title">Tradeoff Manager</h1>
          <p className="login-subtitle">
            {isRegister
              ? 'Crie sua conta para começar'
              : 'Entre para gerenciar seus tradeoffs'}
          </p>
        </div>

        {/* Formulário */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Senha</label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Processando...
              </>
            ) : (
              isRegister ? '🚀 Criar Conta' : '🔐 Entrar'
            )}
          </button>
        </form>

        {/* Alternância Login / Registro */}
        <div className="login-toggle">
          <span className="login-toggle-text">
            {isRegister ? 'Já tem uma conta?' : 'Não tem conta?'}
          </span>
          <button
            type="button"
            className="login-toggle-btn"
            onClick={() => setIsRegister(!isRegister)}
            disabled={isLoading}
          >
            {isRegister ? 'Fazer login' : 'Criar conta'}
          </button>
        </div>

        {/* Info do projeto */}
        <div className="login-info">
          <p>💡 Teste com: admin@desafio.com / senha123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
