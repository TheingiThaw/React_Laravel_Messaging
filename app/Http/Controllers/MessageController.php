<?php

namespace App\Http\Controllers;

use Exception;
use Throwable;
use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use Illuminate\Support\Str;
use App\Models\Conversation;
use Illuminate\Http\Request;
use App\Events\SocketMessage;
use App\Models\MessageAttachment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\MessageResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreMessageRequest;

class MessageController extends Controller
{
    //
    public function byUser(User $user)
    {
        if (!$user || !($user instanceof User)) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Ensure valid query result
        $messages = Message::where(function ($query) use ($user) {
                $query->where('sender_id', auth()->id())
                      ->where('receiver_id', $user->id);
            })
            ->orWhere(function ($query) use ($user) {
                $query->where('sender_id', $user->id)
                      ->where('receiver_id', auth()->id());
            })
            ->with('attachments')
            ->latest()
            ->paginate(10);


        if (!$messages || $messages->isEmpty()) {
            Log::warning('No messages found for user:', ['user_id' => $user->id]);
            return response()->json(['error' => 'No messages found'], 404);
        }

        // Check if pagination returns a valid object
        if (!($messages instanceof \Illuminate\Contracts\Pagination\LengthAwarePaginator)) {
            Log::error('Messages pagination failed.');
            return response()->json(['error' => 'Pagination failed'], 500);
        }

        // Ensure first message exists before calling `first()`
        $firstMessage = $messages->first();
        if (!$firstMessage) {
            Log::warning('First message is null.', ['user_id' => $user->id]);
            return response()->json(['error' => 'No messages found'], 404);
        }

        // Log::info('user_message', ['user_message', $messages]);
        return inertia('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => $messages->items(),
        ]);

    }

    public function byGroup(Group $group){
        // Log::info("group", ['group' => $group]);
        $messages = Message::where('group_id', $group->id)
                    ->with('attachments')
                    ->latest()
                    ->paginate(10);

        // Log::info("groupMessages", ['message' => $messages]);

        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => $messages->items()
        ]);
    }

    public function loadOlder(Message $message){
        try {
            // Log::info("input", ['input' => $message ]);

            if ($message->group_id) {
                $messages = Message::where('created_at', '<', $message->created_at)
                                    ->where('group_id', $message->group_id)
                                    ->latest()
                                    ->paginate(10);
            } else {
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

            // Log::info("messages", ['messages'=> $messages]);
            return $messages;
        } catch (\Exception $e) {
            Log::error("Error loading older messages: " . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function store(StoreMessageRequest $request) {
        // \Log::info($request->all());
        try {
            $data = $request->validated();
            $files = $data['attachments'] ?? [];
            $data['sender_id'] = auth()->id();
            $receiver_id = $data['receiver_id'] ?? null;
            $groupId = $data['group_id'] ?? null;

            $message = Message::create($data);

            $attachments = [];
            if ($files) {
                foreach ($files as $file) {
                    $directory = '/attachments' . Str::random(32);
                    Storage::makeDirectory($directory);
                    $model = [
                        'message_id' => $message->id,
                        'name' => $file->getClientOriginalName(),
                        'mime' => $file->getClientMimeType(),
                        'size' => $file->getSize(),
                        'path' => $file->store($directory, 'public')
                    ];

                    $attachment = MessageAttachment::create($model);
                    $attachments[] = $attachment;
                }
                $message->attachments = $attachments;
            }
            if ($receiver_id) {
                Conversation::updateConversationWithMessage($receiver_id, $data['sender_id'], $message);
            } else {
                // Log::info('group', ['groupId' => $groupId, 'message' => $message]);
                Group::updateGroupWithMessage($groupId, $message);
            }

            $message->load('sender');

            \Log::info('message', ['message' => $message]);
            SocketMessage::dispatch($message);
            return $message;
        } catch (Throwable $e) {
            \Log::error('Error in store method: ', ['exception' => $e]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }


    public function destroy($id){

        $message = Message::find($id);
        // Log::info("message", ['message' => $message]);

        if($message->sender_id !== auth()->id()){
            return response()->json(['message' => 'Cannot Delete', 403]);
        }

        $group = null;
        $conversation = null;
        $lastMessage = null;

        if($message->group_id){
            $group = Group::where('last_message_id', $message->id)->first();
            Log::info("group", ['group' => $group]);
        }
        else{
            $conversation = Conversation::where('last_message_id', $message->id)->first();
            Log::info("conversation", ['conversation' => $conversation]);
        }
        MessageAttachment::where('message_id', $message->id)->delete();

        $message->delete();

        if ($group) {
            $lastMessage = Message::where('group_id', $group->id)->latest()->first();
            if ($lastMessage) {
                $group->update(['last_message_id' => $lastMessage->id]);
            }
            Log::info("last message", ['lastMessage' => $lastMessage]);

        } elseif ($conversation) {
            $lastMessage = Message::where(function ($query) use ($conversation) {
                $query->where('sender_id', $conversation->user_id1)
                    ->where('receiver_id', $conversation->user_id2)
                    ->orWhere(function ($q) use ($conversation) {
                        $q->where('sender_id', $conversation->user_id2)
                            ->where('receiver_id', $conversation->user_id1);
                    });
            })->latest()->first();

            if ($lastMessage) {
                $conversation->update(['last_message_id' => $lastMessage->id]);
            }
            Log::info("last message", ['lastMessage' => $lastMessage]);
        }

        return response()->json([
            'last_message' => $lastMessage ? new MessageResource($lastMessage) : null
        ], 200);
    }
}

