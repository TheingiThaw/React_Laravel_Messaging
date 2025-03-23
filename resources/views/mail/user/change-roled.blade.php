<x-mail::message>
    Hello {{ $user->name }},

    @if ($user->is_admin)
        Your account has been changed into Admin. You have access to edit and delete options.
    @else
        Your account has been changed into Regular User account. You have no longer access to Admin tools.
    @endif

    Thanks,<br>
    {{ config('app.name') }}

</x-mail::message>
