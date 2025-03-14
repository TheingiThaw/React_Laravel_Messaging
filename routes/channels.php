<?php

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Broadcast;

// Broadcast::channel('online', function ($user) {
//     return $user ? new UserResource($user) : null;
// });
Broadcast::routes(['middleware' => ['web'] ]);

Broadcast::channel('online', function ($user) {
    return $user ? $user : null;
});

Broadcast::channel("message.user.{userId1}_{userId2}", function ($user, $userId1, $userId2) {
    return $user && ($user->id === (int) $userId1 || $user->id === (int) $userId2);
});

Broadcast::channel('message.group.{groupId}', function ($user, int $groupId){
    return $user->groups()->where('id', $groupId)->exists();
});

Broadcast::channel('group.deleted.{groupId}', function ($user, int $groupId) {
    \Log::info("User {$user->id} tried to join group {$groupId}");
    // return $user->groups()->where('id', $groupId)->exists();
    return $user->id !== null;
});

