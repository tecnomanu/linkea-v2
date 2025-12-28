@extends('emails.layouts.default')

@section('content')
    <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
        Hola <strong>{{ $firstName }}</strong>, estamos muy contentos de tenerte con nosotros 🚀
    </p>
    
    <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-bottom: 30px;">
        Tu cuenta ha sido creada exitosamente. Ahora estás listo para despegar y llevar tus enlaces al siguiente nivel.
    </p>

    <!-- Steps -->
    <p style="font-size: 16px; color: #1e293b; font-weight: bold; margin-bottom: 20px;">
        Continúa con tu Linkea en dos simples pasos:
    </p>

    <table width="100%" cellspacing="0" cellpadding="0" border="0">
        <!-- Step 1 - Completed -->
        <tr>
            <td style="padding: 10px 0; vertical-align: top;" width="50">
                <div style="width: 36px; height: 36px; background: #dcfce7; border-radius: 50%; text-align: center; line-height: 36px; font-size: 18px; color: #16a34a; font-weight: 700;">✓</div>
            </td>
            <td style="padding: 10px 0; vertical-align: middle;">
                <p style="margin: 0 0 4px; font-size: 16px; color: #16a34a; font-weight: 600; text-decoration: line-through;">Email verificado</p>
                <p style="margin: 0; font-size: 14px; color: #86efac;">¡Tu dirección de correo ha sido confirmada exitosamente!</p>
            </td>
        </tr>
        <!-- Step 2 -->
        <tr>
            <td style="padding: 10px 0; vertical-align: top;" width="50">
                <div style="width: 36px; height: 36px; background: #fff7ed; border-radius: 50%; text-align: center; line-height: 36px; font-size: 16px; color: #F87435; font-weight: 700;">1</div>
            </td>
            <td style="padding: 10px 0; vertical-align: middle;">
                <p style="margin: 0 0 4px; font-size: 16px; color: #1e293b; font-weight: 600;">Crea tu primer enlace</p>
                <p style="margin: 0; font-size: 14px; color: #64748b;">Agrega tus redes sociales, sitio web o WhatsApp a tu landing.</p>
            </td>
        </tr>
        <!-- Step 3 -->
        <tr>
            <td style="padding: 10px 0; vertical-align: top;" width="50">
                <div style="width: 36px; height: 36px; background: #fff7ed; border-radius: 50%; text-align: center; line-height: 36px; font-size: 16px; color: #F87435; font-weight: 700;">2</div>
            </td>
            <td style="padding: 10px 0; vertical-align: middle;">
                <p style="margin: 0 0 4px; font-size: 16px; color: #1e293b; font-weight: 600;">Comparte tu Linkea</p>
                <p style="margin: 0; font-size: 14px; color: #64748b;">Pega tu URL única en tu bio de Instagram, TikTok y más.</p>
            </td>
        </tr>
    </table>

    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ $actionUrl }}" class="button" style="display: inline-block; background-color: #F87435; color: #ffffff; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 16px;">Comenzar Ahora</a>
    </div>

    <p style="font-size: 15px; color: #475569; margin-top: 30px;">
        Si tenés alguna pregunta o necesitás ayuda, no dudes en escribirnos. Estamos acá para ayudarte a crear la mejor landing de enlaces.
    </p>

    <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
        ¡Éxitos! 🚀<br>
        <strong>Equipo de Linkea</strong>
    </p>
@endsection
