<?php

namespace App\Http\Controllers;

use App\Http\Requests\AtualizarChamadoRequest;
use App\Http\Requests\CriarChamadoRequest;
use App\Models\Chamado;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;


class ChamadoController extends Controller
{

    public function estatisticas(): JsonResponse
    {
        $contagens = Chamado::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return response()->json([
            'mensagem' => 'Estatísticas calculadas com sucesso.',
            'dados'    => [
                'total'        => Chamado::count(),
                'aberto'       => (int) ($contagens['aberto']       ?? 0),
                'em_andamento' => (int) ($contagens['em_andamento'] ?? 0),
                'resolvido'    => (int) ($contagens['resolvido']    ?? 0),
            ],
        ], 200);
    }


    public function index(): JsonResponse
    {
        $chamados = Chamado::with('usuario:id,name,email')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'mensagem' => 'Chamados listados com sucesso.',
            'dados'    => $chamados,
        ], 200);
    }


    public function store(CriarChamadoRequest $request): JsonResponse
    {
        $userId = $request->user()?->id ?? User::value('id') ?? 1;

        // Cria o chamado com os dados validados
        $chamado = Chamado::create([
            'user_id'   => $userId,
            'titulo'    => $request->validated()['titulo'],
            'descricao' => $request->validated()['descricao'],
            'status'    => 'aberto',
        ]);

        // Tenta gerar resumo via Gemini — não bloqueia se falhar
        $resumoGerado = $this->gerarResumoComIA($chamado->descricao);
        $chamado->update(['resumo_ia' => $resumoGerado]);

        return response()->json([
            'mensagem' => 'Chamado criado com sucesso.',
            'dados'    => $chamado->fresh(['usuario']),
        ], 201);
    }


    public function show(int $id): JsonResponse
    {
        $chamado = Chamado::with('usuario:id,name,email')->find($id);

        if (! $chamado) {
            return response()->json([
                'mensagem' => 'Chamado não encontrado.',
            ], 404);
        }

        return response()->json([
            'mensagem' => 'Chamado encontrado.',
            'dados'    => $chamado,
        ], 200);
    }


    public function update(AtualizarChamadoRequest $request, int $id): JsonResponse
    {
        $chamado = Chamado::find($id);

        if (! $chamado) {
            return response()->json([
                'mensagem' => 'Chamado não encontrado para atualização.',
            ], 404);
        }

        $chamado->update($request->validated());

        return response()->json([
            'mensagem' => 'Chamado atualizado com sucesso.',
            'dados'    => $chamado->fresh(['usuario']),
        ], 200);
    }


    public function destroy(int $id): JsonResponse
    {
        $chamado = Chamado::find($id);

        if (! $chamado) {
            return response()->json([
                'mensagem' => 'Chamado não encontrado para exclusão.',
            ], 404);
        }

        $chamado->delete();

        return response()->json([
            'mensagem' => "Chamado #{$id} excluído com sucesso.",
        ], 200);
    }



    private function gerarResumoComIA(string $descricao): ?string
    {
        try {
            $chaveApi = config('services.gemini.key');

            // Se a chave não estiver configurada, retorna null imediatamente
            if (empty($chaveApi) || $chaveApi === 'sua_chave_gemini_aqui') {
                Log::info('[Horizon IA] GEMINI_API_KEY não configurada. Resumo automático desativado.');
                return null;
            }

            $urlApi = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
            $prompt = "Resuma este problema técnico em no máximo 5 palavras: {$descricao}";

            $resposta = Http::timeout(10)
                ->withQueryParameters(['key' => $chaveApi])
                ->post($urlApi, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'maxOutputTokens' => 20,
                        'temperature'     => 0.2,
                    ],
                ]);

            if ($resposta->failed()) {
                Log::error('[Horizon IA] Erro ao gerar resumo com IA', [
                    'status_http' => $resposta->status(),
                    'corpo'       => $resposta->body(),
                ]);
                return null;
            }

            // Extrai o texto da estrutura de resposta do Gemini
            $textoGerado = $resposta->json('candidates.0.content.parts.0.text');

            return is_string($textoGerado) ? trim($textoGerado) : null;

        } catch (\Throwable $excecao) {
            Log::error('[Horizon IA] Exceção ao gerar resumo com IA', [
                'mensagem' => $excecao->getMessage(),
                'arquivo'  => $excecao->getFile(),
                'linha'    => $excecao->getLine(),
            ]);

            return null;
        }
    }
}
