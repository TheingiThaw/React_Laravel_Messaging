<?php

namespace App\Jobs;
use App\Models\Group;


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
    public function __construct(public int $groupId)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $group = Group::with('messages', 'users')->find($this->groupId);

        if (!$group) {
            Log::info("Group not found, maybe already deleted.");
            return;
        }

        Log::info("job start", ['group data' => $group]);

        $name = $this->group->name;

        //remove last message
        $this->group->last_message_id = null;
        $this->group->save();

        //remove messages
        $this->group->load('messages');
        $this->group->messages->each(function ($message) {
            $message->delete();
        });

        //remove all users
        $this->group->users()->detach();

        //remove group
        $this->group->delete();

        Log::info("job done");

        DeleteGroup::dispatch($groupId, $name);
    }
}
