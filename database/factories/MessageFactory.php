<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Group;
use App\Models\Conversation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sender_id = $this->faker->randomElement([1, 0]);
        if($sender_id === 0){
            $sender_id = $this->faker->randomElement(User::where('id', '!=', 1)->pluck('id')->toArray());
            $receiver_id = 1;
        }
        else{
            $receiver_id = $this->faker->randomElement(User::where('id', '!=', 1)->pluck('id')->toArray());
        }

        $group_id = null;
        $conversation_id = null;

        if($this->faker->boolean(50)){
            $group_id = $this->faker->randomElement(Group::pluck('id')->toArray());
            $group = Group::find($group_id);
            $sender_id = $this->faker->randomElement($group->users->pluck('id')->toArray());
            $receiver_id = null;

        }
        else{
            $conversation_id = $this->faker->randomElement(Conversation::pluck('id')->toArray());
        }

        return [
            'sender_id' => $sender_id,
            'receiver_id' => $receiver_id,
            'group_id' => $group_id,
            'message' => $this->faker->realText(200),
            'conversation_id' => $conversation_id,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
