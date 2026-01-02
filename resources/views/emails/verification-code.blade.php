@extends('emails.layouts.default')

@section('content')
    <p style="font-size: 16px; margin-bottom: 16px;">Hola <strong>{{ $firstName ?? 'Usuario' }}</strong>!</p>

    <p>Gracias por registrarte en <strong>Linkea</strong>. Estamos emocionados de tenerte con nosotros.</p>
    <p>Para completar tu registro, ingresa el siguiente código de verificación:</p>
    
    <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px solid #fed7aa; border-radius: 12px; padding: 20px 24px; text-align: center; margin: 24px auto; max-width: 320px;">
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #9a3412; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Tu código de verificación</p>
        <p style="margin: 0; font-family: monospace; font-size: 36px; font-weight: 700; color: #c2410c; letter-spacing: 6px;">{{ implode(' ', str_split($code)) }}</p>
    </div>

    <p style="font-size: 14px; color: #64748b;">Este código es válido por <strong>24 horas</strong>. Si no solicitaste esta cuenta, podés ignorar este email.</p>

    <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
        Saludos,<br><strong>Equipo de Linkea</strong>
    </p>
@endsection
