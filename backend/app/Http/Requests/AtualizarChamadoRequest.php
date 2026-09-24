<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class AtualizarChamadoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Título é opcional, mas se enviado deve ser texto válido
            'titulo' => ['sometimes', 'string', 'min:5', 'max:255'],

            // Descrição é opcional, mas se enviada deve ter clareza mínima
            'descricao' => ['sometimes', 'string', 'min:20'],

            // Status deve ser um dos valores aceitos pelo enum da tabela
            'status' => ['sometimes', 'string', 'in:aberto,em_andamento,resolvido'],
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.string'      => 'O título deve ser um texto válido.',
            'titulo.min'         => 'O título deve ter no mínimo :min caracteres.',
            'titulo.max'         => 'O título não pode exceder :max caracteres.',

            'descricao.string'   => 'A descrição deve ser um texto válido.',
            'descricao.min'      => 'A descrição deve ter no mínimo :min caracteres.',

            'status.string'      => 'O status deve ser um texto válido.',
            'status.in'          => 'O status deve ser: aberto, em_andamento ou resolvido.',
        ];
    }

    public function attributes(): array
    {
        return [
            'titulo'    => 'título',
            'descricao' => 'descrição',
            'status'    => 'status',
        ];
    }
}
