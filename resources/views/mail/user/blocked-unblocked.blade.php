<x-mail::message>
    Hello {{ $user->name }},

    @if ($user->blocked_at)
        Your account has been blocked by Admin. You are no longer able to login.
    @else
        Your account has been activated by Admin. You can normally use the system.
    @endif

    Thanks,<br>
    {{ config('app.name') }}

</x-mail::message>
