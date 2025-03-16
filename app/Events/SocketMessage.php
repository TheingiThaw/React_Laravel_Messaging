<?php

namespace App\Events;


use App\Models\Message;
use Illuminate\Support\Facades\Log;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use App\Http\Resources\MessageResource;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class SocketMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Message $message)
    {
        //
    }

    public function broadcastWith(): array
    {
        Log::info("message", ['socket message' => $this->message->load('sender') ]);
        return [
            // 'message' => new MessageResource($this->message),
            'message' => $this->message->load('sender')
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        if($this->message->group_id){
            $groupId = intval($this->message->group_id);
            // Log::info('group_id', ['groupId' => $groupId]);
            return [new PrivateChannel('message.group.'. $groupId)];
        }
        else{
            $sortedUsers = collect([$this->message->sender_id, $this->message->receiver_id])->sort()->implode('_');
            return [new PrivateChannel('message.user.'. $sortedUsers)];
        }
    }
}
