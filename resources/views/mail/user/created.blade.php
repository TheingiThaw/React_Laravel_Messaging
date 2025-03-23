<x-mail::message>
    Hello {{ $user->name }},

    Your account has been created!

    **Please sign in with the information below**:
    Email: {{ $user->email }}
    Password: {{ $password }}

    Please login through the link below:
    <x-mail::button :url="route('login')">
        Click here to Login
    </x-mail::button>

    Thanks,
    {{ config('app.name') }}
</x-mail::message>
