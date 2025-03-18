<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;

Route::middleware('auth')->group(function (){
    Route::get('/', [HomeController::class, 'home'])->name('dashboard');
    Route::get('chat/group/{group}', [MessageController::class,'byGroup'])->name('chat.group');
    Route::get('chat/user/{user}', [MessageController::class,'byUser'])->name('chat.user');
    Route::get('chat/older/{message}', [MessageController::class, 'loadOlder'])->name('chat.loadOlder');
    Route::post('message/store', [MessageController::class, 'store'])->name('chat.store');
    Route::delete('message/delete/{id}',[MessageController::class, 'destroy'])->name('chat.delete');

    Route::prefix('group')->group(function () {
        Route::post('store', [GroupController::class, 'store'])->name('group.store');
        Route::delete('delete/{group}', [GroupController::class, 'destroy'])->name('group.destroy');
        Route::patch('update/{group}', [GroupController::class, 'update'])->name('group.update');
    });

    Route::middleware('admin')->group(function (){
        Route::post('/user', [UserController::class,'store'])->name('user.store');
        Route::post('/user/change-role/{user}', [UserController::class,'changeRole'])->name('user.changeRole');
        Route::post('/user/block-unblock/{user}', [UserController::class,'blockUnblock'])->name('user.blockUnblock');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
