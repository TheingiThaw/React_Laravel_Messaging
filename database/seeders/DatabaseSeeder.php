<?php

namespace Database\Seeders;

use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Joshua',
            'email' => 'joshua@example.com',
            'password' => bcrypt('password'),
            'is_admin' => false
        ]);

        User::factory()->create([
            'name' => 'Vernon',
            'email' => 'vernon@example.com',
            'password' => bcrypt('password'),
        ]);

        User::factory(10)->create();

        for($i = 0; $i < 5; $i++){
            $groups = Group::factory()->create([
                'owner_id' => 1,
            ]);
            $users = User::inRandomOrder()->limit(mt_rand(2,5))->pluck('id');
            $groups->users()->attach(array_unique([1, ...$users]));

        }

        Message::factory(1000)->create();
        $messages = Message::whereNull('group_id')->orderBy('created_at')->get();

        $conversations = $messages->groupBy(function ($message) {
            return collect([$message->sender_id, $message->receiver_id])->sort()->implode('_');
        })->map(function ($groupMessage) {
            return [
                'user_id1' => $groupMessage->first()->sender_id,
                'user_id2' => $groupMessage->first()->receiver_id,
                'last_message_id' => $groupMessage->last()->id,
                'created_at' => new Carbon(),
                'updated_at' => new Carbon(),
            ];
        })->values();

        Conversation::insertorIgnore($conversations->toArray());
    }
}
