<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    //
    public function store(Request $request){
        $data = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'is_admin' => ['boolean'],
        ]);

        // $password = Str::random(8);
        $password = '12345678';
        $data['password'] = bcrypt($password);
        $data['email_verified_at'] = Carbon::now();

        $user = User::create($data);

        return back();

   }

   public function changeRole(User $user){
        Log::info('user', ['user' => $user]);
        $user->update(['is_admin' => !(bool)$user->is_admin]);

        $message = 'User '. $user->name .' has been '. ($user->is_admin ? 'Admin' : 'User');

        Log::info('after user', ['afterUser' => $user]);
        return response()->json(['message', $message]);
   }


    public function blockUnblock(User $user){
        Log::info('block user', ['blockuser' => $user]);
        if ($user->blocked_at) {
            $user->update(['blocked_at' => null]);
        } else {
            $user->update(['blocked_at'=> Carbon::now()]);
        }

        $message = 'Account '. $user->name .' has been '. ($user->blocked_at ? 'blocked' : 'Activated');
        Log::info('user_blocked');

        return response()->json(['message' => $message]);

    }
}
