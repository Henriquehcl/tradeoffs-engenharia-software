/*
 * ===========================================================================
 * Dashboard Page - Página Principal com CRUD
 * ===========================================================================
 *
 * Página do dashboard que exibe e gerencia tradeoffs.
 *
 * Funcionalidades:
 * - Lista tradeoffs em tabela com visual premium
 * - Criar novo tradeoff (modal)
 * - Editar tradeoff existente (modal)
 * - Deletar tradeoff (com confirmação)
 * - Paginação
 * - Busca por nome
 * - Visualização de scores com barras de progresso coloridas
 * - Loading states e feedback visual
 * - Logout
 * ===========================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { api, Tradeoff, TradeoffFormData } from '../../services/api';
import TradeoffModal from '../../components/TradeoffModal';
import './DashboardPage.css';

/* Nome da rota da entidade principal no backend */
const ENTITY_ROUTE = '/api/seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga';

const DashboardPage: React.FC = () => {
  // Estado dos dados
  const [tradeoffs, setTradeoffs] = useState<Tradeoff[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Estado de paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Estado do modal
  const [showModal, setShowModal] = useState(false);
  const [editingTradeoff, setEditingTradeoff] = useState<Tradeoff | null>(null);

  // Auth
  const { user, logout } = useAuth();

  /*
   * Busca os tradeoffs do backend com paginação e busca.
   */
  const fetchTradeoffs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search.trim()) {
        params.append('search', search.trim());
      }

      const response = await api.get(`${ENTITY_ROUTE}?${params}`);
      const { items, meta } = response.data.data;

      setTradeoffs(items);
      setTotalPages(meta.totalPages);
      setTotal(meta.total);
    } catch {
      toast.error('Erro ao carregar tradeoffs');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  // Carrega os dados ao montar e quando página/busca mudam
  useEffect(() => {
    fetchTradeoffs();
  }, [fetchTradeoffs]);

  // Debounce da busca: reseta a página ao buscar
  useEffect(() => {
    setPage(1);
  }, [search]);

  /*
   * Cria um novo tradeoff enviando para o backend.
   */
  const handleCreate = async (data: TradeoffFormData) => {
    try {
      await api.post(ENTITY_ROUTE, data);
      toast.success('Tradeoff criado com sucesso! ✨');
      setShowModal(false);
      fetchTradeoffs();
    } catch {
      toast.error('Erro ao criar tradeoff');
    }
  };

  /*
   * Atualiza um tradeoff existente.
   */
  const handleUpdate = async (data: TradeoffFormData) => {
    if (!editingTradeoff) return;
    try {
      await api.patch(`${ENTITY_ROUTE}/${editingTradeoff.id}`, data);
      toast.success('Tradeoff atualizado! ✅');
      setShowModal(false);
      setEditingTradeoff(null);
      fetchTradeoffs();
    } catch {
      toast.error('Erro ao atualizar tradeoff');
    }
  };

  /*
   * Deleta um tradeoff após confirmação.
   */
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este tradeoff?')) return;
    try {
      await api.delete(`${ENTITY_ROUTE}/${id}`);
      toast.success('Tradeoff excluído! 🗑️');
      fetchTradeoffs();
    } catch {
      toast.error('Erro ao excluir tradeoff');
    }
  };

  /*
   * Abre o modal para edição.
   */
  const openEditModal = (tradeoff: Tradeoff) => {
    setEditingTradeoff(tradeoff);
    setShowModal(true);
  };

  /*
   * Abre o modal para criação.
   */
  const openCreateModal = () => {
    setEditingTradeoff(null);
    setShowModal(true);
  };

  /*
   * Retorna a classe CSS baseada no valor do score.
   */
  const getScoreClass = (score: number): string => {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
  };

  /*
   * Retorna a cor da barra de progresso baseada no score.
   */
  const getBarColor = (score: number): string => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="dashboard-container">
      {/* ===== Header ===== */}
      <header className="dashboard-header glass-card">
        <div className="header-left">
          <span className="header-logo">⚖️</span>
          <div>
            <h1 className="header-title">Tradeoff Manager</h1>
            <p className="header-subtitle">Gerencie seus tradeoffs de engenharia</p>
          </div>
        </div>
        <div className="header-right">
          <span className="header-user">👤 {user?.email}</span>
          <button className="btn btn-secondary btn-sm" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      {/* ===== Stats Cards ===== */}
      <div className="stats-grid animate-slide-up">
        <div className="stat-card glass-card">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total de Tradeoffs</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-value">
            {tradeoffs.length > 0
              ? Math.round(tradeoffs.reduce((s, t) => s + t.qualityScore, 0) / tradeoffs.length)
              : 0}
          </div>
          <div className="stat-label">Média Qualidade</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-value">
            {tradeoffs.length > 0
              ? Math.round(tradeoffs.reduce((s, t) => s + t.lowPriceScore, 0) / tradeoffs.length)
              : 0}
          </div>
          <div className="stat-label">Média Preço Baixo</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-value">
            {tradeoffs.length > 0
              ? Math.round(tradeoffs.reduce((s, t) => s + t.speedScore, 0) / tradeoffs.length)
              : 0}
          </div>
          <div className="stat-label">Média Velocidade</div>
        </div>
      </div>

      {/* ===== Toolbar ===== */}
      <div className="dashboard-toolbar">
        <div className="toolbar-left">
          <input
            type="text"
            className="input-field search-input"
            placeholder="🔍 Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          ➕ Novo Tradeoff
        </button>
      </div>

      {/* ===== Tabela de Dados ===== */}
      <div className="table-container glass-card animate-fade-in">
        {loading ? (
          <div className="loading-overlay">
            <div className="spinner spinner-lg"></div>
            <span className="loading-text">Carregando tradeoffs...</span>
          </div>
        ) : tradeoffs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>Nenhum tradeoff encontrado</h3>
            <p>Crie o primeiro tradeoff para começar a análise.</p>
            <button className="btn btn-primary" onClick={openCreateModal}>
              ➕ Criar Tradeoff
            </button>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Qualidade</th>
                  <th>Preço Baixo</th>
                  <th>Velocidade</th>
                  <th>Total</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {tradeoffs.map((t) => (
                  <tr key={t.id} className="table-row">
                    <td className="td-name">{t.name}</td>
                    <td>
                      <div className="score-cell">
                        <div className="score-bar">
                          <div
                            className="score-bar-fill"
                            style={{
                              width: `${t.qualityScore}%`,
                              backgroundColor: getBarColor(t.qualityScore),
                            }}
                          ></div>
                        </div>
                        <span className={`score-badge ${getScoreClass(t.qualityScore)}`}>
                          {t.qualityScore}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="score-cell">
                        <div className="score-bar">
                          <div
                            className="score-bar-fill"
                            style={{
                              width: `${t.lowPriceScore}%`,
                              backgroundColor: getBarColor(t.lowPriceScore),
                            }}
                          ></div>
                        </div>
                        <span className={`score-badge ${getScoreClass(t.lowPriceScore)}`}>
                          {t.lowPriceScore}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="score-cell">
                        <div className="score-bar">
                          <div
                            className="score-bar-fill"
                            style={{
                              width: `${t.speedScore}%`,
                              backgroundColor: getBarColor(t.speedScore),
                            }}
                          ></div>
                        </div>
                        <span className={`score-badge ${getScoreClass(t.speedScore)}`}>
                          {t.speedScore}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`score-badge ${getScoreClass(Math.round((t.qualityScore + t.lowPriceScore + t.speedScore) / 3))}`}>
                        {t.qualityScore + t.lowPriceScore + t.speedScore}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(t)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(t.id)}
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Anterior
                </button>
                <span className="pagination-info">
                  Página {page} de {totalPages} ({total} itens)
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== Modal de Criação/Edição ===== */}
      {showModal && (
        <TradeoffModal
          tradeoff={editingTradeoff}
          onSave={editingTradeoff ? handleUpdate : handleCreate}
          onClose={() => {
            setShowModal(false);
            setEditingTradeoff(null);
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
