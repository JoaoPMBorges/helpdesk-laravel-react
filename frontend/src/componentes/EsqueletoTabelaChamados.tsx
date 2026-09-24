


interface PropsEsqueletoTabela {
  linhas?: number; // Número de linhas falsas a exibir (padrão: 5)
}

export default function EsqueletoTabelaChamados({ linhas = 5 }: PropsEsqueletoTabela) {
  return (
    <tbody>
      {Array.from({ length: linhas }).map((_, indice) => (
        <tr
          key={indice}
          className="border-b border-slate-100 animate-pulse"
        >
          {/* Coluna: ID */}
          <td className="px-6 py-4">
            <div className="h-3.5 w-6 bg-slate-200 rounded-full" />
          </td>

          {/* Coluna: Título e Resumo IA */}
          <td className="px-6 py-4">
            <div className="space-y-2">
              <div className="h-3.5 bg-slate-200 rounded-full w-3/4" />
              <div className="h-2.5 bg-slate-100 rounded-full w-1/2" />
            </div>
          </td>

          {/* Coluna: Status (badge) */}
          <td className="px-6 py-4">
            <div className="h-6 w-24 bg-slate-200 rounded-full" />
          </td>

          {/* Coluna: Usuário */}
          <td className="px-6 py-4">
            <div className="h-3.5 bg-slate-200 rounded-full w-28" />
          </td>

          {/* Coluna: Data de abertura */}
          <td className="px-6 py-4">
            <div className="h-3.5 bg-slate-200 rounded-full w-20" />
          </td>

          {/* Coluna: Ações */}
          <td className="px-6 py-4">
            <div className="h-7 w-16 bg-slate-200 rounded-xl" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}
