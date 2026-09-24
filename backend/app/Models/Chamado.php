<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Chamado extends Model
{
    use HasFactory;

    protected $table = 'chamados';

    protected $fillable = [
        'user_id',
        'titulo',
        'descricao',
        'status',
        'resumo_ia',
    ];

    protected $attributes = [
        'status' => 'aberto',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function estaAberto(): bool
    {
        return $this->status === 'aberto';
    }

    public function estaResolvido(): bool
    {
        return $this->status === 'resolvido';
    }
}
