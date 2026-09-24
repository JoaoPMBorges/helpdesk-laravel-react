import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  User,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import type { IChamado, StatusChamado } from '../tipos/chamados';
import { buscarChamadoPorId, atualizarChamado, deletarChamado } from '../servicos/chamadosApi';
import BadgeStatus from '../componentes/BadgeStatus';


export default function DetalhesChamado() {
  const { id } = useParams<{ id: string }>();
  const navegar = useNavigate();

  const [chamado, setChamado] = useState<IChamado | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [atualizando, setAtualizando] = useState<boolean>(false);
  const [excluindo, setExcluindo] = useState<boolean>(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState<boolean>(false);

  const idChamado = Number(id);

  useEffect(() => {
    async function carregar() {
      if (!idChamado || isNaN(idChamado)) {
        setErro('Identificador de chamado inválido.');
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro(null);
        const dados = await buscarChamadoPorId(idChamado);
        setChamado(dados);
      } catch (falha) {
        console.error('Falha ao carregar detalhes do chamado:', falha);
        setErro('Não foi possível carregar as informações do chamado.');
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [idChamado]);

  async function handleMudarStatus(novoStatus: StatusChamado) {
    if (!chamado || chamado.status === novoStatus) return;

    try {
      setAtualizando(true);
      setMensagemSucesso(null);
      const atualizado = await atualizarChamado(chamado.id, { status: novoStatus });
      setChamado(atualizado);
      setMensagemSucesso(`Status atualizado para "${novoStatus.replace('_', ' ')}".`);
      setTimeout(() => setMensagemSucesso(null), 3000);
    } catch (falha) {
      console.error('Falha ao atualizar status:', falha);
      setErro('Erro ao atualizar o status do chamado.');
    } finally {
      setAtualizando(false);
    }
  }

  async function handleExcluir() {
    if (!chamado) return;

    try {
      setExcluindo(true);
      await deletarChamado(chamado.id);
      navegar('/chamados', { replace: true });
    } catch (falha) {
      console.error('Falha ao excluir chamado:', falha);
      setErro('Não foi possível excluir o chamado. Tente novamente.');
      setConfirmarExclusao(false);
    } finally {
      setExcluindo(false);
    }
  }

  function formatarDataHora(dataIso: string): string {
    return new Date(dataIso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Carregando informações do chamado...
        </p>
      </div>
    );
  }

  if (erro || !chamado) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-800">Erro</h3>
            <p className="text-sm text-red-600 mt-1">{erro ?? 'Chamado não encontrado.'}</p>
          </div>
        </div>
        <Link to="/chamados" className="btn-secundario">
          <ArrowLeft className="w-4 h-4" />
          Voltar para lista
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Navegação de retorno */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navegar('/chamados')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos Chamados
        </button>

        <span className="text-xs font-mono font-bold text-slate-400">
          Chamado #{chamado.id}
        </span>
      </div>

      {/* Alerta de Sucesso */}
      {mensagemSucesso && (
        <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-center gap-2 text-sm text-teal-700 font-semibold animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          {mensagemSucesso}
        </div>
      )}

      {/* Card Principal */}
      <div className="cartao p-8 space-y-6">

        {/* Topo do chamado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <BadgeStatus status={chamado.status} />
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatarDataHora(chamado.created_at)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-3">
              {chamado.titulo}
            </h1>
          </div>

          {/* Seletor rápido de Status */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Alterar Status
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMudarStatus('aberto')}
                disabled={atualizando || chamado.status === 'aberto'}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  chamado.status === 'aberto'
                    ? 'bg-red-100 text-red-700 ring-2 ring-red-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                Aberto
              </button>
              <button
                type="button"
                onClick={() => handleMudarStatus('em_andamento')}
                disabled={atualizando || chamado.status === 'em_andamento'}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  chamado.status === 'em_andamento'
                    ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                Em Andamento
              </button>
              <button
                type="button"
                onClick={() => handleMudarStatus('resolvido')}
                disabled={atualizando || chamado.status === 'resolvido'}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  chamado.status === 'resolvido'
                    ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                Resolvido
              </button>
            </div>
          </div>
        </div>

        {/* Resumo da IA */}
        {chamado.resumo_ia && (
          <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Resumo automático (Gemini)
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                "{chamado.resumo_ia}"
              </p>
            </div>
          </div>
        )}

        {/* Descrição do Problema */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Descrição do Problema
          </h2>
          <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {chamado.descricao}
            </p>
          </div>
        </div>

        {/* Dados do Solicitante e Metadados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Solicitante
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {chamado.usuario?.name ?? 'Não identificado'}
              </p>
              <p className="text-xs text-slate-500">
                {chamado.usuario?.email ?? 'Sem e-mail'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Última Atualização
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {formatarDataHora(chamado.updated_at)}
              </p>
              <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Registro Horizon
              </span>
            </div>
          </div>
        </div>

        {/* Zona de Exclusão */}
        <div className="pt-4 border-t border-slate-100">
          {!confirmarExclusao ? (
            <button
              type="button"
              onClick={() => setConfirmarExclusao(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-500
                         hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Chamado
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3
                            p-4 bg-red-50 border border-red-100 rounded-2xl">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium flex-1">
                Tem certeza? Esta ação é <strong>irreversível</strong> e removerá o chamado permanentemente.
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setConfirmarExclusao(false)}
                  disabled={excluindo}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white
                             border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExcluir}
                  disabled={excluindo}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold
                             text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors
                             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {excluindo ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  {excluindo ? 'Excluindo...' : 'Confirmar Exclusão'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
