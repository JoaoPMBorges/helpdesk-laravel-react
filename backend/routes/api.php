<?php

use App\Http\Controllers\ChamadoController;
use Illuminate\Support\Facades\Route;



Route::prefix('chamados')->group(function () {

    // /estatisticas precisa vir antes de /{id} para não ser interpretada como ID
    Route::get('/estatisticas', [ChamadoController::class, 'estatisticas'])
        ->name('chamados.estatisticas');

    Route::get('/', [ChamadoController::class, 'index'])
        ->name('chamados.index');

    Route::post('/', [ChamadoController::class, 'store'])
        ->name('chamados.store');

    Route::get('/{id}', [ChamadoController::class, 'show'])
        ->name('chamados.show')
        ->whereNumber('id');

    Route::put('/{id}', [ChamadoController::class, 'update'])
        ->name('chamados.update')
        ->whereNumber('id');

    Route::delete('/{id}', [ChamadoController::class, 'destroy'])
        ->name('chamados.destroy')
        ->whereNumber('id');
});
