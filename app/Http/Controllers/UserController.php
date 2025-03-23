<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Mail\ChangeRoled;
use App\Mail\UserCreated;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Mail\BlockedUnblocked;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    //
    public function store(Request $request){
        $data = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'is_admin' => ['boolean'],
        ]);

        $password = Str::random(8);
        // $password = '12345678';
        $data['password'] = bcrypt($password);
        $data['email_verified_at'] = Carbon::now();

        $user = User::create($data);

        Mail::to($user)->send(new UserCreated($user, $password));

        return back();

   }

   public function changeRole(User $user){
        // Log::info('user', ['user' => $user]);
        $user->update(['is_admin' => !(bool)$user->is_admin]);

        $message = 'User "'. $user->name .'" has been '. ($user->is_admin ? 'Admin' : 'User');

        // Log::info('after user', ['afterUser' => $user]);
        // Log::info('message', ['message' => $message]);

        Mail::to($user)->send(new ChangeRoled($user));

        return response()->json(['message' => $message]);
   }


    public function blockUnblock(User $user){
        // Log::info('block user', ['blockuser' => $user]);
        if ($user->blocked_at) {
            $user->update(['blocked_at' => null]);
        } else {
            $user->update(['blocked_at'=> Carbon::now()]);
        }

        $message = 'Account "'. $user->name .'" has been '. ($user->blocked_at ? 'blocked' : 'Activated');
        // Log::info('user_blocked');

        Mail::to($user)->send(new BlockedUnblocked($user));

        return response()->json(['message' => $message]);

    }
}
