@extends('emails.layouts.default')

@section('content')
    <h1>¡Felicitaciones {{ $notifiable->first_name ?? 'Usuario' }}!</h1>
    
    <p>Tu cuenta de Linkea ha sido verificada oficialmente.</p>

    <div class="badge-box">
        <div style="font-size: 48px; margin-bottom: 12px; color: #f97316;">
            <!-- Simple Check Icon SVG or Character -->
            &#10004;
        </div>
        <h3 style="margin: 0 0 8px; color: #9a3412; font-size: 20px;">Cuenta Verificada</h3>
        <p style="margin: 0; color: #c2410c; font-size: 15px;">
            Tu Linkea ahora muestra la insignia de verificación
        </p>
    </div>

    <p>Esta insignia aparecerá junto a tu nombre en tu landing, mostrando a tus visitantes que tu cuenta es auténtica.</p>

    <div class="text-center" style="margin-top: 30px;">
        <a href="{{ $landingUrl }}" class="button">Ver mi Linkea verificado</a>
    </div>

    <p style="margin-top: 30px; font-size: 14px; text-align: center; color: #64748b;">
        ¿Querés compartirlo en tus redes y etiquetarnos?
    </p>

    <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        <p>Saludos,<br><strong>Equipo de Linkea</strong></p>
    </div>
@endsection
