<?php

namespace App\Observers;

use App\Models\Group;
use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Support\Facades\Storage;

class MessageObserver
{
    //
    public function deleting(Message $message) {
        $message->attachments->each(function ($attachment) {
            $dir = dirname($attachment->path);
            Storage::disk('public')->deleteDirectory($dir);

        });
        $message->attachments->delete();

        if($message->group_id){
            $group = Group::where('last_message_id', $message->id)->first();

            if($group){
                $prevMessage = $group->messages()->where('id', '!=', $message->id)->latest()->first();

                if($prevMessage){
                    $group->last_message_id = $prevMessage;
                    $group->save();
                }
            }
        }
        else{
            $conversation = Conversation::where('last_message_id', $message->id)->first();

            if($conversation){
                $prevMessage = $conversation->lastMessage()
                            ->where('id', '!=', $message->id)
                            ->latest()
                            ->first()
                            ?->id;
                if($prevMessage){
                    $conversation->last_message_id = $prevMessage;

                // $conversation->last_message_id = Conversation::where(function ($query) use ($message) {
                //     $query->where('user_id1', $message->sender_id)
                //     ->where('user_id2', $message->receiver_id)
                //     ->orWhere('user_id1', $message->receiver_id)
                //     ->where('user_id2', $message->sender_id);
                // })->where('id', '!=', $message->id)
                // ->latest()->limit(1)->id();


                $conversation->save();
                }
            }
        }
    }
}
