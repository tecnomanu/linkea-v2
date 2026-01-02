<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    <title>{{ $subject ?? 'Linkea Notification' }}</title>
    <!--[if mso]>
    <style>
        * { font-family: Arial, sans-serif !important; }
    </style>
    <![endif]-->
    <style type="text/css">
        body {
            font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            width: 100% !important;
        }
        table {
            border-spacing: 0;
            border-collapse: collapse;
        }
        td {
            padding: 0;
        }
        img {
            border: 0;
            -ms-interpolation-mode: bicubic;
        }
        .wrapper {
            width: 100%;
            background-color: #f3f4f6;
            padding: 40px 0 20px;
        }
        .container {
            max-width: 640px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .content {
            padding: 40px 30px;
            color: #334155;
            font-size: 16px;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            background-color: #F87435;
            color: #ffffff !important;
            padding: 14px 28px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
        }
        h1 {
            color: #1e293b;
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 20px;
        }
        p {
            margin: 0 0 16px;
        }
        .text-center { text-align: center; }
        .text-muted { color: #64748b; }
        .stats-grid {
            width: 100%;
            margin: 24px 0;
        }
        .stat-card {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            border: 1px solid #e2e8f0;
        }
        .stat-value {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 4px;
        }
        .stat-label {
            font-size: 13px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        .badge-box {
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
            border: 1px solid #fed7aa;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 24px 0;
        }
    </style>
</head>
<body>
    <center style="width: 100%; background-color: #f3f4f6;">
        <div class="wrapper">
            <table align="center" cellspacing="0" cellpadding="0" border="0" width="640" class="container" style="max-width: 640px; width: 640px; margin: 0 auto;">
                <tr>
                    <td>
                        @if($fullWidthHeaderBg ?? false)
                            @php
                                // Customizable parameters with defaults
                                $bgHeight = $headerHeight ?? '320px';
                                $bgPosition = $headerBgPosition ?? 'center center';
                                $textAlign = $headerTextAlign ?? 'top'; // 'top' or 'center'
                                $paddingTop = $textAlign === 'top' ? '30px' : '60px';
                                $paddingBottom = $textAlign === 'top' ? '40px' : '120px';
                            @endphp
                            <!-- Full Width Header with Background Image (Welcome style) -->
                            <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td background="{{ asset($fullWidthHeaderBg) }}" bgcolor="#F87435" style="background-color: #F87435; background-image: url('{{ asset($fullWidthHeaderBg) }}'); background-size: cover; background-position: {{ $bgPosition }}; background-repeat: no-repeat; height: {{ $bgHeight }};">
                                        <!--[if gte mso 9]>
                                        <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;height:{{ $bgHeight }};">
                                        <v:fill type="frame" src="{{ asset($fullWidthHeaderBg) }}" color="#F87435" />
                                        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                                        <![endif]-->
                                        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="height: {{ $bgHeight }};">
                                            <tr>
                                                <td style="padding: {{ $paddingTop }} 30px {{ $paddingBottom }}; text-align: center; vertical-align: top;">
                                                    <!-- Logo -->
                                                    <a href="{{ config('app.url') }}" style="text-decoration: none; display: inline-block;">
                                                        <img src="{{ asset('images/logos/logo-white.png') }}" alt="Linkea" height="40" style="display: block; margin: 0 auto;">
                                                    </a>
                                                    
                                                    <!-- Title -->
                                                    <p style="color: white; font-size: 42px; font-weight: bold; text-align: center; margin: 30px 0 0; line-height: 1.2;">
                                                        {{ $headerTitle ?? 'BIENVENIDO' }}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                        <!--[if gte mso 9]>
                                        </v:textbox>
                                        </v:rect>
                                        <![endif]-->
                                    </td>
                                </tr>
                            </table>
                        @elseif($headerImage ?? false)
                            <!-- Split Header with Background Image -->
                            <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td background="{{ asset('images/emails/email_bg_header.png') }}" bgcolor="#ea580c" style="background-color: #ea580c; background-image: url('{{ asset('images/emails/email_bg_header.png') }}'); background-size: cover; background-position: center center; background-repeat: no-repeat;">
                                        <!--[if gte mso 9]>
                                        <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
                                        <v:fill type="frame" src="{{ asset('images/emails/email_bg_header.png') }}" color="#ea580c" />
                                        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                                        <![endif]-->
                                        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="height: 220px;">
                                            <tr>
                                                <td style="padding: 30px 10px 30px 40px; vertical-align: top;" width="60%">
                                                    <!-- Nested table for space-between effect -->
                                                    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="height: 100%;">
                                                        <!-- Logo Row (top) -->
                                                        <tr>
                                                            <td style="vertical-align: top; padding-bottom: 15px;">
                                                                <a href="{{ config('app.url') }}" style="display: inline-block; text-decoration: none;">
                                                                    <img src="{{ asset('images/logos/logo-white.png') }}" alt="Linkea" height="30" style="display: block;">
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        <!-- Title Row (middle/expand) -->
                                                        <tr>
                                                            <td style="vertical-align: middle;">
                                                                <p style="color: white; font-size: 31px; font-weight: 700; margin: 0; line-height: 1.25;">{{ $headerTitle ?? 'Notificación' }}</p>
                                                            </td>
                                                        </tr>
                                                        <!-- Subtitle Row (bottom) -->
                                                        @if($headerSubtitle ?? false)
                                                        <tr>
                                                            <td style="vertical-align: bottom; padding-top: 10px;">
                                                                <p style="color: rgba(255,255,255,0.95); font-size: 17px; font-weight: 600; margin: 0; line-height: 1.4;">{{ $headerSubtitle }}</p>
                                                            </td>
                                                        </tr>
                                                        @endif
                                                    </table>
                                                </td>
                                                <td style="vertical-align: middle; text-align: center; padding: 15px 20px 15px 0;" width="40%">
                                                    <img src="{{ asset($headerImage) }}" alt="" style="max-width: 230px; max-height: 200px; height: auto; display: block; margin: 0;">
                                                </td>
                                            </tr>
                                        </table>
                                        <!--[if gte mso 9]>
                                        </v:textbox>
                                        </v:rect>
                                        <![endif]-->
                                    </td>
                                </tr>
                            </table>
                        @elseif(!($hideHeader ?? false))
                            <!-- Simple Header (Logo only, centered) with Background Image -->
                            <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td background="{{ asset('images/emails/email_bg_header.png') }}" bgcolor="#ea580c" style="background-color: #ea580c; background-image: url('{{ asset('images/emails/email_bg_header.png') }}'); background-size: cover; background-position: center center; background-repeat: no-repeat;">
                                        <!--[if gte mso 9]>
                                        <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
                                        <v:fill type="frame" src="{{ asset('images/emails/email_bg_header.png') }}" color="#ea580c" />
                                        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                                        <![endif]-->
                                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="padding: 40px 50px; text-align: center;">
                                                    <a href="{{ config('app.url') }}" style="text-decoration: none;">
                                                        <img src="{{ asset('images/logos/logo-white.png') }}" alt="Linkea" height="38" style="display: block; margin: 0 auto;">
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        <!--[if gte mso 9]>
                                        </v:textbox>
                                        </v:rect>
                                        <![endif]-->
                                    </td>
                                </tr>
                            </table>
                        @endif

                        <!-- Content -->
                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                                <td class="content" style="padding: 50px; color: #334155; font-size: 16px; line-height: 1.6;">
                                    @yield('content')
                                </td>
                            </tr>
                        </table>

                        <!-- Footer with Social Icons (Dark Blue) -->
                        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0f172a; border-radius: 0 0 16px 16px;">
                            <tr>
                                <td style="padding: 40px 30px; text-align: center;">
                                    <p style="color: #94a3b8; font-size: 13px; margin: 0 0 20px;">¿Necesitás ayuda? Escribinos a <a href="mailto:hola@linkea.ar" style="color: #F87435; text-decoration: none; font-weight: 500;">hola@linkea.ar</a></p>
                                    
                                    <!-- Social Icons -->
                                    <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 24px auto;">
                                        <tr>
                                            <td style="padding: 0 8px;">
                                                <a href="https://instagram.com/linkea.ar" style="display: inline-block; width: 40px; height: 40px; background-color: #1e293b; border-radius: 50%; line-height: 40px; text-align: center;">
                                                    <img src="{{ asset('images/emails/icons/instagram.png') }}" alt="Instagram" width="20" height="20" style="vertical-align: middle;">
                                                </a>
                                            </td>
                                            <td style="padding: 0 8px;">
                                                <a href="https://facebook.com/linkea.ar" style="display: inline-block; width: 40px; height: 40px; background-color: #1e293b; border-radius: 50%; line-height: 40px; text-align: center;">
                                                    <img src="{{ asset('images/emails/icons/facebook.png') }}" alt="Facebook" width="20" height="20" style="vertical-align: middle;">
                                                </a>
                                            </td>
                                            <td style="padding: 0 8px;">
                                                <a href="https://linkedin.com/company/linkea" style="display: inline-block; width: 40px; height: 40px; background-color: #1e293b; border-radius: 50%; line-height: 40px; text-align: center;">
                                                    <img src="{{ asset('images/emails/icons/linkedin.png') }}" alt="LinkedIn" width="20" height="20" style="vertical-align: middle;">
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Copyright in blue section -->
                                    <p style="margin: 24px 0 8px; color: #64748b; font-size: 12px;">&copy; {{ date('Y') }} Linkea. Todos los derechos reservados.</p>
                                    <p style="margin: 0; color: #64748b; font-size: 11px;">Tu landing de enlaces en un solo lugar.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            
            <!-- Unsubscribe outside the container -->
            <table align="center" cellspacing="0" cellpadding="0" border="0" width="640" style="max-width: 100%;">
                <tr>
                    <td style="padding: 20px 0; text-align: center;">
                        <a href="{$unsubscribe_link}" style="font-size: 12px; color: #94a3b8; text-decoration: underline;">Si no deseas recibir más correos, hacé clic aquí para desuscribirte.</a>
                    </td>
                </tr>
            </table>
        </div>
    </center>
</body>
</html>
