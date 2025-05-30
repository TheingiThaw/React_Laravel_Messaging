<?php

namespace App\Models;

use App\Models\User;
use App\Models\Group;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\UserResource;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    //
    protected $fillable = [
        'user_id1',
        'user_id2',
        'last_message_id'];

    public function user1() {
        return $this->belongsTo(User::class, 'user_id1');
    }

    public function user2() {
        return $this->belongsTo(User::class, 'user_id2');
    }

    public function lastMessage() {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    public static function getConversationsForSidebar(User $user) {
        $users = User::getUserForUser($user);
        $groups = Group::getGroupsForUser($user);
        // Log::info('user', ['user' => new UserResource(request()->user())]);
        return $users->map(function ($user) {
            // Log::info('userdata', ['data' => $user->toConversationArray()]);
            return $user->toConversationArray();
        })->concat($groups->map(function ($group) {
            return $group->toConversationArray();
        }));
    }

    public static function updateConversationWithMessage($userId1, $userId2, $message){
        $conversation = Conversation::where( function ($query) use ($userId1, $userId2){
            $query->where('user_id1', $userId1)
            ->where('user_id2', $userId2)
            ->orWhere('user_id1', $userId2)
            ->where('user_id2', $userId1);
        })->first();

        if($conversation){
            $conversation->update([
                'last_message_id' => $message->id
            ]);
        }
        else{

            $conversation->create([
                'user_id1' => $userId1,
                'user_id2' => $userId2,
                'last_message_id' => $message->id
            ]);
            Log::info("create", ['create' => $userId1, $userId2, $message->id]);
        }
    }
}
