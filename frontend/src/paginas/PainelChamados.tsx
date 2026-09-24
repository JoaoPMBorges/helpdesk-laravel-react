import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, AlertCircle, Plus, Sparkles } from 'lucide-react';
import type { IChamado } from '../tipos/chamados';
import { listarChamados } from '../servicos/chamadosApi';
import BadgeStatus from '../componentes/BadgeStatus';
import EsqueletoTabelaChamados from '../componentes/EsqueletoTabelaChamados';


export default function PainelChamados() {
  const [chamados, setChamados] = useState<IChamado[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Busca os chamados ao montar o componente
  useEffect(() => {
    async function carregarChamados() {
      try {
        setCarregando(true);
        setErro(null);
        const dados = await listarChamados();
        setChamados(dados);
      } catch (falha) {
        console.error('Falha ao carregar chamados:', falha);
        setErro('Não foi possível carregar os chamados. Verifique a conexão com o servidor.');
      } finally {
        setCarregando(false);
      }
    }

    carregarChamados();
  }, []);

  // Formata a data de criação para o padrão brasileiro
  function formatarData(dataIso: string): string {
    return new Date(dataIso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
            <Ticket className="w-5 h-5 text-teal-600" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Chamados Técnicos
            </h2>
            <p className="text-sm text-slate-500">
              {carregando
                ? 'Carregando chamados...'
                : `${chamados.length} chamado${chamados.length !== 1 ? 's' : ''} encontrado${chamados.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <Link to="/novo" className="btn-primario">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Novo Chamado
        </Link>
      </div>

      {erro && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
          <p className="text-sm text-red-600 font-medium">{erro}</p>
        </div>
      )}

      <div className="cartao overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Cabeçalho da tabela */}
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 w-12">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Título / Resumo IA
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Solicitante
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Abertura
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ações
                </th>
              </tr>
            </thead>

            {/* Corpo da tabela: Skeleton ou dados reais */}
            {carregando ? (
              <EsqueletoTabelaChamados linhas={6} />
            ) : (
              <tbody>
                {chamados.length === 0 && !erro ? (
                  // Estado vazio
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                          <Ticket className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-semibold text-slate-500">
                          Nenhum chamado encontrado
                        </p>
                        <p className="text-xs text-slate-400">
                          Clique em "Novo Chamado" para abrir o primeiro chamado.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  chamados.map((chamado) => (
                    <tr
                      key={chamado.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-100 group"
                    >
                      {/* ID */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-semibold text-slate-400">
                          #{chamado.id}
                        </span>
                      </td>

                      {/* Título + Resumo IA */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {chamado.titulo}
                        </p>
        {/* Resumo */}
                        {chamado.resumo_ia && (
                          <span className="inline-flex items-center gap-1 mt-1">
                            <Sparkles className="w-3 h-3 text-teal-500 flex-shrink-0" strokeWidth={1.75} />
                            <span className="text-xs text-slate-400 font-medium italic truncate">
                              {chamado.resumo_ia}
                            </span>
                          </span>
                        )}
                      </td>

                      {/* Badge de Status */}
                      <td className="px-6 py-4">
                        <BadgeStatus status={chamado.status} />
                      </td>

                      {/* Nome do solicitante */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 font-medium">
                          {chamado.usuario?.name ?? '—'}
                        </span>
                      </td>

                      {/* Data de abertura */}
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-400">
                          {formatarData(chamado.created_at)}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="px-6 py-4">
                        <Link
                          to={`/chamados/${chamado.id}`}
                          className="text-xs font-semibold text-teal-600 hover:text-teal-700
                                     bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg
                                     transition-colors duration-150 opacity-0 group-hover:opacity-100"
                        >
                          Ver detalhes
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
