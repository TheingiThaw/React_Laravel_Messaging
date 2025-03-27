<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageAttachmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'message_id' => $this->message_id,
            'size' => $this->size,
            'mime' => $this->mime,
            'name' => $this->name,
            'path' => Storage::url($this->path),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
