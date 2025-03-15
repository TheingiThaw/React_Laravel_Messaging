<?php

namespace App\Jobs;
use App\Models\Group;
// use App\Jobs\Log;

use App\Events\DeleteGroup;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

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
        // Log::info("job start");
        $id = $this->group->id;
        $name = $this->group->name;

        //remove last message
        $this->group->last_message_id = null;
        $this->group->save();

        //remove messages
        $this->group->messages()->each()->delete();

        //remove all users
        $this->group->users()->detach();

        //remove group
        $this->group->delete();

        // Log::info("job done");

        DeleteGroup::dispatch($id, $name);
    }
}
