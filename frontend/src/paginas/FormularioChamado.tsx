import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, AlertCircle, CheckCircle2, Loader2, FileText } from 'lucide-react';
import type { IDadosCriarChamado } from '../tipos/chamados';
import { criarChamado } from '../servicos/chamadosApi';


export default function FormularioChamado() {
  const navegar = useNavigate();

  // Estado do formulário controlado
  const [campos, setCampos] = useState<IDadosCriarChamado>({
    titulo: '',
    descricao: '',
  });

  // Estados de UI
  const [enviando, setEnviando] = useState<boolean>(false);
  const [sucesso, setSucesso] = useState<boolean>(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [errosCampo, setErrosCampo] = useState<Partial<IDadosCriarChamado>>({});

  // Atualiza um campo específico do formulário
  function atualizarCampo(
    evento: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = evento.target;
    setCampos((anterior) => ({ ...anterior, [name]: value }));
    // Limpa o erro do campo ao digitar
    if (errosCampo[name as keyof IDadosCriarChamado]) {
      setErrosCampo((anterior) => ({ ...anterior, [name]: undefined }));
    }
  }

  // Validação no lado do cliente (primeira camada)
  function validarFormulario(): boolean {
    const novosErros: Partial<IDadosCriarChamado> = {};

    if (!campos.titulo.trim() || campos.titulo.trim().length < 5) {
      novosErros.titulo = 'O título deve ter no mínimo 5 caracteres.';
    }
    if (!campos.descricao.trim() || campos.descricao.trim().length < 20) {
      novosErros.descricao = 'A descrição deve ter no mínimo 20 caracteres.';
    }

    setErrosCampo(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setErroEnvio(null);

    if (!validarFormulario()) return;

    try {
      setEnviando(true);
      await criarChamado(campos);
      setSucesso(true);

      // Aguarda 1.5s exibindo o sucesso antes de redirecionar
      setTimeout(() => navegar('/chamados'), 1500);
    } catch (falha: unknown) {
      console.error('Falha ao criar chamado:', falha);
      setErroEnvio(
        'Não foi possível abrir o chamado. Por favor, tente novamente.'
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-teal-600" strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Abrir Novo Chamado
          </h2>
          <p className="text-sm text-slate-500">
            Descreva o problema com detalhes para agilizar o atendimento.
          </p>
        </div>
      </div>

      {sucesso && (
        <div className="flex items-center gap-3 p-4 bg-teal-50 border border-teal-100 rounded-2xl">
          <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" strokeWidth={1.75} />
          <div>
            <p className="text-sm font-semibold text-teal-700">
              Chamado aberto com sucesso!
            </p>
            <p className="text-xs text-teal-600 mt-0.5">
              Redirecionando para a lista de chamados...
            </p>
          </div>
        </div>
      )}

      {erroEnvio && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
          <p className="text-sm text-red-600 font-medium">{erroEnvio}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="cartao p-6 space-y-5">

        {/* Campo: Título */}
        <div>
          <label htmlFor="titulo" className="campo-label">
            Título do Chamado
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            value={campos.titulo}
            onChange={atualizarCampo}
            placeholder="Ex: Impressora não conecta à rede Wi-Fi"
            className={`campo-input ${
              errosCampo.titulo
                ? 'border-red-300 focus:ring-red-400'
                : ''
            }`}
            maxLength={255}
            disabled={enviando || sucesso}
          />
          {errosCampo.titulo && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">
              {errosCampo.titulo}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            {campos.titulo.length}/255 caracteres
          </p>
        </div>

        {/* Campo: Descrição */}
        <div>
          <label htmlFor="descricao" className="campo-label">
            Descrição Detalhada do Problema
            <span className="text-red-400 ml-1">*</span>
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={campos.descricao}
            onChange={atualizarCampo}
            rows={6}
            placeholder="Descreva o problema com o máximo de detalhes possível: o que aconteceu, quando começou, mensagens de erro exibidas, etc."
            className={`campo-input resize-none ${
              errosCampo.descricao
                ? 'border-red-300 focus:ring-red-400'
                : ''
            }`}
            disabled={enviando || sucesso}
          />
          {errosCampo.descricao && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">
              {errosCampo.descricao}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            {campos.descricao.length} caracteres (mínimo: 20)
          </p>
        </div>

        {/* Resumo automático */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
          <p className="text-xs text-slate-500">
            <strong className="text-slate-600">IA integrada:</strong>{' '}
            um resumo automático será gerado a partir da sua descrição para agilizar a triagem.
          </p>
        </div>

        {/* Rodapé do formulário com ações */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navegar('/chamados')}
            className="btn-secundario"
            disabled={enviando || sucesso}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-primario"
            disabled={enviando || sucesso}
          >
            {enviando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                Enviando...
              </>
            ) : sucesso ? (
              <>
                <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                Enviado!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" strokeWidth={2} />
                Abrir Chamado
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
