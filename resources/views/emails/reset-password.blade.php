@extends('emails.layouts.default')

@section('content')
    <p style="font-size: 16px; margin-bottom: 16px;">Hola <strong>{{ $notifiable->first_name ?? 'Usuario' }}</strong>!</p>
    
    <p>Recibiste este email porque solicitaste restablecer tu contraseña en Linkea.</p>

    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ $url }}" style="display: inline-block; background-color: #F87435; color: #ffffff; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 16px;">Restablecer Contraseña</a>
    </div>

    <p style="font-size: 14px; color: #64748b;">
        Este enlace expirará en <strong>{{ $count }} minutos</strong>.
    </p>

    <p style="font-size: 14px; color: #64748b;">
        Si no solicitaste un cambio de contraseña, no es necesario que hagas nada.
    </p>

    <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
        Saludos,<br><strong>Equipo de Linkea</strong>
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; word-break: break-all;">
        Si tenés problemas haciendo clic en el botón, copiá y pegá la siguiente URL en tu navegador: <br>
        <a href="{{ $url }}" style="color: #64748b;">{{ $url }}</a>
    </div>
@endsection
