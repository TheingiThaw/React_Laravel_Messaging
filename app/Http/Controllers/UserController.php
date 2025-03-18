<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //
    public function store(Request $request){
        $data = $request->validated([
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users.email'],
            'is_admin' => ['boolean'],
        ]);

        // $password = Str::random(8);
        $password = '12345678';
        $data['password'] = bcrypt($password);
        $data['email_verified_at'] = now();

        $user = User::create($data);

        return response()->json(['message' => `User {$user->name} was created successfully`]);
    }
}
