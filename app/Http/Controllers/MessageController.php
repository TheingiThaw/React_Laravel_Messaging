<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\MessageResource;

class MessageController extends Controller
{
    //

    public function byUser(User $user){

        if (!$user || !($user instanceof User)) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Query for messages
        $messages = Message::where(function ($query) use ($user) {
            $query->where('sender_id', auth()->id())
                  ->where('receiver_id', $user->id);
        })
        ->orWhere(function ($query) use ($user) {
            $query->where('sender_id', $user->id)
                  ->where('receiver_id', auth()->id());
        })
        ->latest()
        ->paginate(10);

        Log::info('Messages Pagination:', ['messages' => $messages]);
        Log::info('Selected Conversation:', ['selectedConversation' => $user->toConversationArray()]);

        // Debugging: Check if messages exist
        if ($messages->isEmpty()) {
            Log::warning('No messages found for user:', ['user_id' => $user->id]);
            return response()->json(['error' => 'No messages found'], 404);
        }

        return inertia('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages)
        ]);
    }

    public function byGroup(Group $group){
        $messages = Message::where('group_id', $group->id)
                    ->latest()
                    ->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages->getCollection())
        ]);
    }

    public function loadOlder(Message $message){
        if($message->group_id){
            $messages = Message::where('created_at', '<', $message->created_at)
                        ->where('group_id', $message->group_id)
                    ->latest()
                    ->paginate(10);
        } else{
            $messages = Message::where('created_at', '<', $message->created_at)
                        ->where(function ($query) use ($message) {
                            $query->where('sender_id', $message->sender_id)
                            ->where('receiver_id', $message->receiver_id)
                            ->orWhere('sender_id', $message->receiver_id)
                            ->where('receiver_id', $message->sender_id);
                        })
                        ->latest()
                        ->paginate(10);
        }

        return new MessageResource($messages);
    }

    public function store(StoreMessageRequest $request) {
        $data = $message->validated();
        $files = $data['attachments'] ?? [];
        $data['sender_id'] = auth()->id();
        $receiver_id = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;

        $message = Message::create($data);

        $attachments = [];
        if($files){
            foreach($files as $file){
                $directory = '/attachments' . Str::random(32);
                Storage::makeDirectory($directory);
                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory,'public')
                ];

                $attachment = MessageAttachment::create($model);
                $attachments[] = $attachment;
            }
            $message->attachments = $attachments;
        }

        if($receiver_id){
            Conversation::updateConversationWithMessage($receiverId, $senderId,$message);
        }
        else{
            Group::updateGroupWithMessage($groupId, $message);
        }

        SocketMessage::dispatch($message);
        return new MessageResource($message);
    }

    public function destroy(Message $message){
        if($message->sender_id !== auth()->id()){
            return response()->json(['message' => 'Cannot Delete', 403]);
        }

        $message->delete();

        return response('', 204);
    }
}

