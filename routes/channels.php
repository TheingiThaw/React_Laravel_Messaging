<?php

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('online', function ($user) {
    return $user ? new UserResource($user) : null;
});

Broadcast::channel('message.user.{userId1_userId2}', function (User $user, int $userId1, int $userId2){
    return $user->user_id1 === $userId1 || $user->user_id2 === $userId2 ? $user : '';
});

Broadcast::channel('message.group.{groupId}', function (User $user, int $groupId){
    return $user->groups()->where('id', $groupId)->exists();
});
