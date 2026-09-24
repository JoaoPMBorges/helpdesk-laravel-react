import type { StatusChamado } from '../tipos/chamados';



interface PropsBadgeStatus {
  status: StatusChamado;
}

// Mapa de configuração visual por status
const configuracaoBadge: Record<
  StatusChamado,
  { rotulo: string; classes: string; pontoCor: string }
> = {
  aberto: {
    rotulo: 'Aberto',
    classes: 'bg-red-50 text-red-600 border border-red-100',
    pontoCor: 'bg-red-400',
  },
  em_andamento: {
    rotulo: 'Em Andamento',
    classes: 'bg-orange-50 text-orange-600 border border-orange-100',
    pontoCor: 'bg-orange-400',
  },
  resolvido: {
    rotulo: 'Resolvido',
    classes: 'bg-teal-50 text-teal-700 border border-teal-100',
    pontoCor: 'bg-teal-500',
  },
};

export default function BadgeStatus({ status }: PropsBadgeStatus) {
  const config = configuracaoBadge[status] ?? configuracaoBadge.aberto;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-xs font-semibold whitespace-nowrap
        ${config.classes}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.pontoCor}`} />
      {config.rotulo}
    </span>
  );
}
