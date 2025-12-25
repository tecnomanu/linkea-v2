<x-mail::message>
    # Hola {{ $user->first_name }}! 👋

    Gracias por registrarte en **Linkea**. Para completar tu registro, ingresa el siguiente codigo de verificacion:

    <x-mail::panel>
        <div
            style="text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">
            {{ $code }}
        </div>
    </x-mail::panel>

    Este codigo expira en 24 horas.

    Si no creaste una cuenta en Linkea, podes ignorar este email.

    Gracias,<br>
    El equipo de **{{ config('app.name') }}**
</x-mail::message>
