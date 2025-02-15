<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageAttachment extends Model
{
    //
    protected $fillable = [
        'name',
        'message_id',
        'path',
        'size',
        'mime'
    ];
}
