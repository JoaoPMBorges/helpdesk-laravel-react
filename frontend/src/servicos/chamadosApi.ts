

import axios from 'axios';
import type {
  IChamado,
  IDadosCriarChamado,
  IDadosAtualizarChamado,
  IRespostaApi,
} from '../tipos/chamados';

// Instância do Axios para o backend
const clienteHttp = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 8000,
});

// Fallback local (dados de demonstração)
const CHAVE_STORAGE = 'horizon_chamados_dados';

const DADOS_INICIAIS: IChamado[] = [
  {
    id: 101,
    user_id: 1,
    titulo: 'Falha intermitente na autenticação via SSO corporativo',
    descricao:
      'Usuários do departamento financeiro estão recebendo erro HTTP 403 Forbidden ao tentar efetuar login através do provedor OAuth2 corporativo nas primeiras horas da manhã.',
    status: 'em_andamento',
    resumo_ia: 'Erro 403 login SSO financeiro',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    usuario: { id: 1, name: 'Carlos Eduardo Silva', email: 'carlos.silva@empresa.com.br' },
  },
  {
    id: 102,
    user_id: 2,
    titulo: 'Impressora de etiquetas térmicas desconectada da rede local',
    descricao:
      'O dispositivo de impressão de etiquetas de expedição na porta TCP 9100 parou de responder às requisições do sistema após a manutenção preventiva da rede ontem à noite.',
    status: 'aberto',
    resumo_ia: 'Impressora térmica sem resposta rede',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    usuario: { id: 2, name: 'Mariana Souza', email: 'mariana.souza@tech.com.br' },
  },
  {
    id: 103,
    user_id: 1,
    titulo: 'Lentidão crítica na geração do relatório de fechamento mensal',
    descricao:
      'Ao solicitar o fechamento contábil com período superior a 90 dias, a consulta ao banco de dados excede o limite de timeout de 60 segundos e aborta a emissão do PDF.',
    status: 'resolvido',
    resumo_ia: 'Timeout consulta relatório contábil 90d',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    usuario: { id: 1, name: 'Carlos Eduardo Silva', email: 'carlos.silva@empresa.com.br' },
  },
  {
    id: 104,
    user_id: 2,
    titulo: 'Incompatibilidade com certificado digital A1 no faturamento',
    descricao:
      'A emissão de notas fiscais eletrônicas está apresentando mensagem de certificado revogado ou expirado, embora a validade do arquivo .pfx vá até dezembro de 2026.',
    status: 'aberto',
    resumo_ia: 'Certificado A1 inválido faturamento NF-e',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    usuario: { id: 2, name: 'Mariana Souza', email: 'mariana.souza@tech.com.br' },
  },
];

function obterDadosLocais(): IChamado[] {
  try {
    const item = localStorage.getItem(CHAVE_STORAGE);
    if (!item) {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(DADOS_INICIAIS));
      return DADOS_INICIAIS;
    }
    return JSON.parse(item) as IChamado[];
  } catch {
    return DADOS_INICIAIS;
  }
}

function salvarDadosLocais(chamados: IChamado[]): void {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(chamados));
  } catch {
    // Ignora restrições de storage
  }
}

export interface IEstatisticasChamados {
  total: number;
  aberto: number;
  em_andamento: number;
  resolvido: number;
}

export async function buscarEstatisticas(): Promise<IEstatisticasChamados> {
  try {
    const resposta = await clienteHttp.get<IRespostaApi<IEstatisticasChamados>>('/chamados/estatisticas');
    return resposta.data.dados;
  } catch (erro) {
    console.warn('[Horizon API] Calculando estatísticas a partir dos dados locais.', erro);
    const locais = obterDadosLocais();
    return {
      total:        locais.length,
      aberto:       locais.filter((c) => c.status === 'aberto').length,
      em_andamento: locais.filter((c) => c.status === 'em_andamento').length,
      resolvido:    locais.filter((c) => c.status === 'resolvido').length,
    };
  }
}

export async function listarChamados(): Promise<IChamado[]> {
  try {
    const resposta = await clienteHttp.get<IRespostaApi<IChamado[]>>('/chamados');
    return resposta.data.dados;
  } catch (erro) {
    console.warn('[Horizon API] Backend offline ou indisponível. Usando armazenamento local de demonstração.', erro);
    return obterDadosLocais();
  }
}

export async function buscarChamadoPorId(id: number): Promise<IChamado> {
  try {
    const resposta = await clienteHttp.get<IRespostaApi<IChamado>>(`/chamados/${id}`);
    return resposta.data.dados;
  } catch (erro) {
    console.warn(`[Horizon API] Buscando chamado #${id} na base local:`, erro);
    const locais = obterDadosLocais();
    const encontrado = locais.find((c) => c.id === id);
    if (!encontrado) throw new Error('Chamado não encontrado.');
    return encontrado;
  }
}

export async function criarChamado(dados: IDadosCriarChamado): Promise<IChamado> {
  try {
    const resposta = await clienteHttp.post<IRespostaApi<IChamado>>('/chamados', dados);
    return resposta.data.dados;
  } catch (erro) {
    console.warn('[Horizon API] Backend offline. Salvando novo chamado localmente:', erro);
    const locais = obterDadosLocais();
    const novoId = locais.length > 0 ? Math.max(...locais.map((c) => c.id)) + 1 : 1;

    // Resumo com as primeiras 5 palavras da descrição
    const palavras = dados.descricao.trim().split(/\s+/).slice(0, 5).join(' ');
    const resumoSimulado = `${palavras}...`;

    const novoChamado: IChamado = {
      id: novoId,
      user_id: 1,
      titulo: dados.titulo,
      descricao: dados.descricao,
      status: 'aberto',
      resumo_ia: resumoSimulado,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      usuario: { id: 1, name: 'Horizon Suporte (Você)', email: 'suporte@horizon.com' },
    };

    const atualizados = [novoChamado, ...locais];
    salvarDadosLocais(atualizados);
    return novoChamado;
  }
}

export async function atualizarChamado(
  id: number,
  dados: IDadosAtualizarChamado
): Promise<IChamado> {
  try {
    const resposta = await clienteHttp.put<IRespostaApi<IChamado>>(
      `/chamados/${id}`,
      dados
    );
    return resposta.data.dados;
  } catch (erro) {
    console.warn(`[Horizon API] Atualizando chamado #${id} localmente:`, erro);
    const locais = obterDadosLocais();
    const index = locais.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Chamado não encontrado.');

    const atualizado: IChamado = {
      ...locais[index],
      ...dados,
      updated_at: new Date().toISOString(),
    };

    locais[index] = atualizado;
    salvarDadosLocais(locais);
    return atualizado;
  }
}

export async function deletarChamado(id: number): Promise<void> {
  try {
    await clienteHttp.delete(`/chamados/${id}`);
  } catch (erro) {
    console.warn(`[Horizon API] Removendo chamado #${id} localmente:`, erro);
    const locais = obterDadosLocais();
    const index = locais.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Chamado não encontrado para exclusão.');

    locais.splice(index, 1);
    salvarDadosLocais(locais);
  }
}
