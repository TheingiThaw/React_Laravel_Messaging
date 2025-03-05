<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;

Route::middleware('auth')->group(function (){
    Route::get('/', [HomeController::class, 'home'])->name('dashboard');
    Route::get('chat/group/{user}', [MessageController::class,'byGroup'])->name('chat.group');
    Route::get('chat/user/{user}', [MessageController::class,'byUser'])->name('chat.user');
    Route::get('chat/older/{message}', [MessageController::class, 'loadOlder'])->name('chat.loadOlder');
    Route::post('message/store', [MessageController::class, 'store'])->name('chat.store');
    Route::delete('message/delete/{id}',[MessageController::class, 'delete'])->name('chat.delete');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
