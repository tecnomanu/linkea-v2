@extends('emails.layouts.default')

@section('content')
    <p style="font-size: 16px; margin-bottom: 16px;">Hola <strong>{{ $notifiable->first_name ?? 'Usuario' }}</strong>!</p>
    
    <p>Tu contraseña fue cambiada correctamente. Ya podés ingresar con tu nueva contraseña a la plataforma.</p>

    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0; color: #991b1b; font-size: 14px;">
            <strong>IMPORTANTE:</strong> Si no fuiste vos quien cambió la contraseña, contactanos inmediatamente a 
            <a href="mailto:soporte@linkea.ar" style="color: #dc2626; font-weight: 600;">soporte@linkea.ar</a>
        </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ config('app.url') }}" style="display: inline-block; background-color: #F87435; color: #ffffff; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 16px;">Ir a Linkea</a>
    </div>

    <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
        Saludos,<br><strong>Equipo de Linkea</strong>
    </p>
@endsection
