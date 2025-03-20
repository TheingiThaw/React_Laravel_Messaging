<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'is_admin',
        'blocked_at',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function groups(){
        return $this->belongsToMany(Group::class, 'group_users');
    }

    public static function getUserForUser(User $user) {
        $except_user = $user->id;
        $query = User::select('users.*', 'messages.message as last_message', 'messages.created_at as last_message_date')
                ->where('users.id', '!=', $except_user)
                ->when(!$user->is_admin, function($query) {
                    return $query->whereNull('users.blocked_at');
                })
                ->leftJoin('conversations', function ($join) use ($except_user) {
                    $join->on('conversations.user_id1', '=', 'users.id')
                        ->where('conversations.user_id2', '=', $except_user)
                        ->orWhere(function ($query) use ($except_user) {
                            $query->on('conversations.user_id2', '=', 'users.id')
                                ->where('conversations.user_id1', '=', $except_user);
                        });
                })
                ->leftJoin('messages', 'messages.id', '=', 'conversations.last_message_id')
                ->orderBy('last_message_date', 'desc')
                ->orderBy('users.name', 'asc')
                ->orderByRaw('IFNULL(users.blocked_at, 1)');

        $data = $query->get();
        return $data;
    }

    public function toConversationArray() {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar
            ? (Str::startsWith($this->avatar, 'storage/') ? $this->avatar : Storage::url($this->avatar))
            : $this->avatar,
            'is_admin' => $this->is_admin,
            'is_user' => true,
            'is_group' => false,
            'is_blocked' => $this->blocked_at !== null,
            'blocked_at' => $this->blocked_at,
            'last_message' => $this->last_message,
            'last_message_date' => $this->last_message_date ? $this->last_message_date . ' UTC' : null,
        ];
    }
}
