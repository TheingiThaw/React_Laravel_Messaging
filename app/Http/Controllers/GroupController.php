<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Jobs\DeleteGroupJob;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        // dd($request);
        $data = $request->validated();
        $user_ids = $data['user_ids'] ?? [];

        $group = Group::create($data);

        Log::info('group', ['group' => $group]);

        $group->users()->attach(array_unique([$group->owner_id, ...$user_ids]));

        Log::info('group stored');

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Group $group)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Group $group)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group)
    {
        $data = $request->validated();
        $user_ids = $data['user_ids'] ?? [];
        $group->update($data);

        $group->users()->detach();
        $group->users()->attach(array_unique([$group->owner_id, ...$user_ids]));

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        if($group->owner_id !== auth()->id()){
            return response()->json(['message' => 'You are not allowed to delete this group'], 403);
        }

        Log::info('group', ['group' => $group]);

        DeleteGroupJob::dispatch($group->id);


        return response()->json(['message' => 'Group was scheduled for deletion']);
    }
}
