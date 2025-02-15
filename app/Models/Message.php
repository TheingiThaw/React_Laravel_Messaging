<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;
    //
    protected $fillable = [
        'message',
        'sender_id',
        'receiver_id',
        'group_id',
        'conversation_id',
        'last_message_id'
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(){
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function group(){
        return $this->belongsTo(Group::class, 'group_id');
    }

    public function conversation(){
        return $this->belongsTo(Conversation::class, 'conversation_id');
    }

    public function lastMessage(){
        return $this->belongsTo(Message::class, 'last_message_id');
    }
}
