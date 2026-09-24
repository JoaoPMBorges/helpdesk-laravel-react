<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class CriarChamadoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Título é obrigatório, texto puro, entre 5 e 255 caracteres
            'titulo' => ['required', 'string', 'min:5', 'max:255'],

            // Descrição é obrigatória e deve ter pelo menos 20 caracteres
            // para garantir que o problema seja descrito com clareza
            'descricao' => ['required', 'string', 'min:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.required'    => 'O título do chamado é obrigatório.',
            'titulo.string'      => 'O título deve ser um texto válido.',
            'titulo.min'         => 'O título deve ter no mínimo :min caracteres.',
            'titulo.max'         => 'O título não pode exceder :max caracteres.',

            'descricao.required' => 'A descrição do problema é obrigatória.',
            'descricao.string'   => 'A descrição deve ser um texto válido.',
            'descricao.min'      => 'A descrição deve ter no mínimo :min caracteres para ser processada corretamente.',
        ];
    }

    public function attributes(): array
    {
        return [
            'titulo'    => 'título',
            'descricao' => 'descrição',
        ];
    }
}
