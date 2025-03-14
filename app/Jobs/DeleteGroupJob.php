<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class DeleteGroupJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Group $group)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->group->last_message_id = null;
        $this->group->save();

        //remove messages
        $this->group->messages()->each()->delete();

        //remove all users
        $this->group->users()->detach();

        //remove last message
        $this->group->last_message_id->delete();

        //remove group
        $this->group->delete();
    }
}
