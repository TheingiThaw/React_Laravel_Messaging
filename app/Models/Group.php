<?php

namespace App\Models;

use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Group extends Model
{
    use HasFactory;
    //
    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'last_message_id'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'group_users');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function lastMessage(){
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    public static function getGroupsForUser(User $user)
    {
        $query = self::with(['lastMessage'])
            ->select('groups.*', 'messages.message as last_message', 'messages.created_at as last_message_date')
            ->join('group_users', 'group_users.group_id', 'groups.id')
            ->leftJoin('messages', 'messages.id', 'groups.last_message_id')
            ->where('groups.owner_id', $user->id)
            ->groupBy(
                'groups.id',
                'groups.name',
                'groups.description',
                'groups.owner_id',
                'groups.last_message_id',
                'groups.created_at',
                'groups.updated_at',
                'messages.message',
                'messages.created_at'
            )
            ->orderBy('messages.created_at', 'desc')
            ->get();

        // Log::info('getGroupsForUser', ['query' => $query]);

        return $query;
    }

    public function toConversationArray()
    {
        $last_message = $this->lastMessage;
        $last_message_date = $last_message ? $last_message->created_at->toDateTimeString() : null;

        // Log::info('users', ['users' => $this->users]);
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_group' => true,
            'is_user' => false,
            'owner_id' => $this->owner_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'last_message' => $last_message->message ?? null,
            'last_message_date' =>$last_message_date ? $last_message_date . ' UTC' : null,
            'users' => $this->users->map(function ($user){
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                ];
            }),
        ];
    }

    public static function updateGroupWithMessage($groupId, $message){
        // Log::info('message_id', ['message-id' => $message->id, 'group' => $group]);
        return self::updateOrCreate(
            ['id' => $groupId],
            [

                'last_message_id' => $message->id
            ]
        );
    }
}
