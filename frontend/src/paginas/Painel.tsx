import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { IChamado } from '../tipos/chamados';
import { listarChamados, buscarEstatisticas, type IEstatisticasChamados } from '../servicos/chamadosApi';
import BadgeStatus from '../componentes/BadgeStatus';



interface CardMetricaProps {
  titulo: string;
  valor: number | string;
  descricao: string;
  Icone: React.ElementType;
  corIcone: string;
  corFundo: string;
}

function CardMetrica({ titulo, valor, descricao, Icone, corIcone, corFundo }: CardMetricaProps) {
  return (
    <div className="cartao p-5 flex items-start gap-4">
      <div className={`w-11 h-11 ${corFundo} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icone className={`w-5 h-5 ${corIcone}`} strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {titulo}
        </p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{valor}</p>
        <p className="text-xs text-slate-500 mt-0.5">{descricao}</p>
      </div>
    </div>
  );
}

export default function Painel() {
  const [chamados, setChamados] = useState<IChamado[]>([]);
  const [estatisticas, setEstatisticas] = useState<IEstatisticasChamados | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        // Carrega dados em paralelo para melhor performance
        const [dados, stats] = await Promise.all([
          listarChamados(),
          buscarEstatisticas(),
        ]);
        setChamados(dados);
        setEstatisticas(stats);
      } catch (err) {
        console.error('Falha ao carregar dados do painel:', err);
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, []);

  // Usa as estatísticas do endpoint dedicado (mais preciso),
  // com fallback para cálculo local caso o endpoint falhe
  const total       = estatisticas?.total        ?? chamados.length;
  const abertos     = estatisticas?.aberto       ?? chamados.filter((c) => c.status === 'aberto').length;
  const emAndamento = estatisticas?.em_andamento ?? chamados.filter((c) => c.status === 'em_andamento').length;
  const resolvidos  = estatisticas?.resolvido    ?? chamados.filter((c) => c.status === 'resolvido').length;

  return (
    <div className="space-y-8">

      {/* Saudação e cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Bom dia, Equipe Horizon 👋
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Visão geral dos chamados técnicos abertos no sistema.
          </p>
        </div>

        <Link to="/novo" className="btn-primario self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Novo Chamado
        </Link>
      </div>

      {/* métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardMetrica
          titulo="Total de Chamados"
          valor={carregando ? '...' : total}
          descricao="Registrados no sistema"
          Icone={Ticket}
          corIcone="text-teal-600"
          corFundo="bg-teal-50"
        />
        <CardMetrica
          titulo="Abertos"
          valor={carregando ? '...' : abertos}
          descricao="Aguardando atendimento"
          Icone={AlertTriangle}
          corIcone="text-red-500"
          corFundo="bg-red-50"
        />
        <CardMetrica
          titulo="Em Andamento"
          valor={carregando ? '...' : emAndamento}
          descricao="Sendo tratados pela equipe"
          Icone={Clock}
          corIcone="text-orange-500"
          corFundo="bg-orange-50"
        />
        <CardMetrica
          titulo="Resolvidos"
          valor={carregando ? '...' : resolvidos}
          descricao="Finalizados com sucesso"
          Icone={CheckCircle2}
          corIcone="text-teal-600"
          corFundo="bg-teal-50"
        />
      </div>

      {/* Chamados Recentes */}
      <div className="cartao p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-teal-600" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Chamados Recentes</h3>
              <p className="text-xs text-slate-500">Últimos chamados abertos na plataforma</p>
            </div>
          </div>
          <Link
            to="/chamados"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            Ver todos
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {carregando ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Carregando chamados recentes...
          </div>
        ) : chamados.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Nenhum chamado cadastrado ainda.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {chamados.slice(0, 3).map((chamado) => (
              <div
                key={chamado.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 -mx-2 px-2 rounded-xl transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{chamado.id}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {chamado.titulo}
                    </p>
                  </div>
                  {chamado.resumo_ia && (
                    <p className="text-xs text-slate-400 mt-0.5 italic flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-teal-500 flex-shrink-0" />
                      {chamado.resumo_ia}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <BadgeStatus status={chamado.status} />
                  <Link
                    to={`/chamados/${chamado.id}`}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    Abrir
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
