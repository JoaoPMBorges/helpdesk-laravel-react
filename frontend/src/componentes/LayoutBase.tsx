import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Settings,
  HelpCircle,
  Zap,
} from 'lucide-react';



interface PropsLayoutBase {
  children: React.ReactNode;
}

// Definição dos itens de navegação da sidebar
interface ItemNavegacao {
  rotulo: string;
  caminho: string;
  Icone: React.ElementType;
}

const itensNavegacao: ItemNavegacao[] = [
  { rotulo: 'Painel',       caminho: '/',          Icone: LayoutDashboard },
  { rotulo: 'Chamados',     caminho: '/chamados',  Icone: Ticket          },
  { rotulo: 'Novo Chamado', caminho: '/novo',      Icone: PlusCircle      },
];

const itensNavegacaoRodape: ItemNavegacao[] = [
  { rotulo: 'Configurações', caminho: '/configuracoes', Icone: Settings   },
  { rotulo: 'Ajuda',         caminho: '/ajuda',         Icone: HelpCircle },
];

// Classe CSS para o estado ativo do link (NavLink do react-router-dom)
const classeAtivo =
  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ' +
  'bg-teal-50 text-teal-700 border border-teal-100';

const classeInativo =
  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ' +
  'text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors duration-150';

export default function LayoutBase({ children }: PropsLayoutBase) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col">

        {/* Logotipo e identidade Horizon */}
        <div className="px-5 py-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">
                Horizon
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Gestão de Chamados
              </p>
            </div>
          </div>
        </div>

        {/* Navegação principal */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Menu Principal
          </p>
          {itensNavegacao.map(({ rotulo, caminho, Icone }) => (
            <NavLink
              key={caminho}
              to={caminho}
              end={caminho === '/'}
              className={({ isActive }) => isActive ? classeAtivo : classeInativo}
            >
              <Icone className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
              {rotulo}
            </NavLink>
          ))}
        </nav>

        {/* Navegação do rodapé da sidebar */}
        <div className="px-3 py-4 border-t border-slate-100 space-y-1">
          {itensNavegacaoRodape.map(({ rotulo, caminho, Icone }) => (
            <NavLink
              key={caminho}
              to={caminho}
              className={({ isActive }) => isActive ? classeAtivo : classeInativo}
            >
              <Icone className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
              {rotulo}
            </NavLink>
          ))}

          {/* Avatar do usuário logado */}
          <div className="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl
                          bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center
                            justify-center text-white text-xs font-bold flex-shrink-0">
              HS
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                Horizon Suporte
              </p>
              <p className="text-xs text-slate-400 truncate">
                suporte@horizon.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
