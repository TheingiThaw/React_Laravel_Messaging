<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\MessageAttachmentResource;

class MessageResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'message' => $this->message,
            'sender_id' => $this->sender_id,
            'receiver_id' => $this->receiver_id ?? null,
            'group_id' => $this->group_id ?? null,
            'sender' => new UserResource($this->sender),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'attachments' => MessageAttachmentResource::collection($this->attachments),
        ];
    }
}
