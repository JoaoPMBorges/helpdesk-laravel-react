

export type PapelUsuario = 'admin' | 'suporte' | 'cliente';

export interface IUsuario {
  id: number;
  name: string;   // 'name' mantém o padrão da tabela users do Laravel
  email: string;
  role: PapelUsuario;
  created_at: string;
  updated_at: string;
}

export type StatusChamado = 'aberto' | 'em_andamento' | 'resolvido';

export interface IChamado {
  id: number;
  user_id: number;
  titulo: string;
  descricao: string;
  status: StatusChamado;
  resumo_ia: string | null;   // Gerado pela API Gemini (pode ser nulo)
  created_at: string;
  updated_at: string;
  usuario?: Pick<IUsuario, 'id' | 'name' | 'email'>; // Relacionamento carregado com with()
}

export interface IRespostaApi<T> {
  mensagem: string;
  dados: T;
}

export interface IDadosCriarChamado {
  titulo: string;
  descricao: string;
}

export interface IDadosAtualizarChamado {
  titulo?: string;
  descricao?: string;
  status?: StatusChamado;
}
