/*
 * ===========================================================================
 * Tradeoff Modal - Modal de Criação/Edição
 * ===========================================================================
 *
 * Componente modal reutilizável para criar ou editar tradeoffs.
 *
 * Funcionalidades:
 * - Formulário com validação
 * - Sliders para scores (0-100) com preview visual
 * - Modo criação e edição (preenche campos automaticamente)
 * - Indicador visual da "saúde" do tradeoff
 * - Feedback visual com cores por range de score
 * - Fechar com ESC ou clicando no overlay
 * ===========================================================================
 */

import React, { useState, useEffect } from 'react';
import { Tradeoff, TradeoffFormData } from '../services/api';
import './TradeoffModal.css';

interface TradeoffModalProps {
  tradeoff: Tradeoff | null; // null = modo criação
  onSave: (data: TradeoffFormData) => Promise<void>;
  onClose: () => void;
}

const TradeoffModal: React.FC<TradeoffModalProps> = ({ tradeoff, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [qualityScore, setQualityScore] = useState(50);
  const [lowPriceScore, setLowPriceScore] = useState(50);
  const [speedScore, setSpeedScore] = useState(50);
  const [saving, setSaving] = useState(false);

  const isEditing = !!tradeoff;

  // Preenche os campos com dados do tradeoff se estiver editando
  useEffect(() => {
    if (tradeoff) {
      setName(tradeoff.name);
      setQualityScore(tradeoff.qualityScore);
      setLowPriceScore(tradeoff.lowPriceScore);
      setSpeedScore(tradeoff.speedScore);
    }
  }, [tradeoff]);

  // Fecha o modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const totalScore = qualityScore + lowPriceScore + speedScore;

  /*
   * Retorna um diagnóstico textual baseado no total de scores.
   * Valores acima de 200 são "impossíveis" na prática (mesa capenga).
   */
  const getDiagnosis = () => {
    if (totalScore > 240) return { text: '🪑 Mesa muito capenga! Impossível na prática.', color: '#ef4444' };
    if (totalScore > 200) return { text: '⚠️ Cuidado! Tradeoffs muito otimistas.', color: '#f59e0b' };
    if (totalScore > 150) return { text: '⚖️ Equilíbrio saudável de tradeoffs.', color: '#10b981' };
    return { text: '📉 Scores muito conservadores.', color: '#3b82f6' };
  };

  const diagnosis = getDiagnosis();

  /*
   * Submete o formulário.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await onSave({ name: name.trim(), qualityScore, lowPriceScore, speedScore });
    } finally {
      setSaving(false);
    }
  };

  /*
   * Retorna a cor baseada no score.
   */
  const getColor = (score: number) => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? '✏️ Editar Tradeoff' : '➕ Novo Tradeoff'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Nome */}
          <div className="form-group">
            <label className="form-label">Nome do Cenário</label>
            <input
              type="text"
              className="input-field"
              placeholder="Ex: MVP Startup, Produto Enterprise..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Quality Score */}
          <div className="slider-group">
            <div className="slider-header">
              <label className="form-label">🏆 Qualidade</label>
              <span className="slider-value" style={{ color: getColor(qualityScore) }}>
                {qualityScore}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={qualityScore}
              onChange={(e) => setQualityScore(Number(e.target.value))}
              className="score-slider"
              style={{ '--slider-color': getColor(qualityScore) } as React.CSSProperties}
            />
            <div className="slider-labels">
              <span>Mínima</span>
              <span>Máxima</span>
            </div>
          </div>

          {/* Low Price Score */}
          <div className="slider-group">
            <div className="slider-header">
              <label className="form-label">💰 Preço Baixo</label>
              <span className="slider-value" style={{ color: getColor(lowPriceScore) }}>
                {lowPriceScore}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={lowPriceScore}
              onChange={(e) => setLowPriceScore(Number(e.target.value))}
              className="score-slider"
              style={{ '--slider-color': getColor(lowPriceScore) } as React.CSSProperties}
            />
            <div className="slider-labels">
              <span>Caro</span>
              <span>Barato</span>
            </div>
          </div>

          {/* Speed Score */}
          <div className="slider-group">
            <div className="slider-header">
              <label className="form-label">⚡ Velocidade</label>
              <span className="slider-value" style={{ color: getColor(speedScore) }}>
                {speedScore}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={speedScore}
              onChange={(e) => setSpeedScore(Number(e.target.value))}
              className="score-slider"
              style={{ '--slider-color': getColor(speedScore) } as React.CSSProperties}
            />
            <div className="slider-labels">
              <span>Lento</span>
              <span>Rápido</span>
            </div>
          </div>

          {/* Diagnóstico */}
          <div className="diagnosis-bar" style={{ borderColor: diagnosis.color }}>
            <span className="diagnosis-total">Total: {totalScore}/300</span>
            <span className="diagnosis-text">{diagnosis.text}</span>
          </div>

          {/* Botões */}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || !name.trim()}>
              {saving ? (
                <>
                  <div className="spinner"></div>
                  Salvando...
                </>
              ) : (
                isEditing ? '💾 Salvar Alterações' : '🚀 Criar Tradeoff'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeoffModal;
