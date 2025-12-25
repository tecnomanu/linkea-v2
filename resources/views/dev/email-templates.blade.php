<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Email Templates - Dev</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        h1 {
            color: white;
            font-size: 2rem;
            margin-bottom: 8px;
            text-align: center;
        }
        .subtitle {
            color: rgba(255,255,255,0.8);
            text-align: center;
            margin-bottom: 40px;
        }
        .alert {
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .templates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }
        .template-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .template-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        .template-card h2 {
            font-size: 1.25rem;
            color: #333;
            margin-bottom: 8px;
        }
        .template-card p {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        .template-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }
        .btn-primary {
            background: #f97316;
            color: white;
        }
        .btn-primary:hover {
            background: #ea580c;
        }
        .btn-secondary {
            background: #e5e7eb;
            color: #374151;
        }
        .btn-secondary:hover {
            background: #d1d5db;
        }
        .send-form {
            display: none;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
        }
        .send-form.active {
            display: block;
        }
        .send-form input[type="email"] {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .send-form input[type="email"]:focus {
            outline: none;
            border-color: #f97316;
            box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: white;
            text-decoration: none;
            margin-bottom: 20px;
            font-size: 14px;
            opacity: 0.9;
        }
        .back-link:hover {
            opacity: 1;
        }
        .env-badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver al inicio
        </a>
        
        <h1>
            Email Templates
            <span class="env-badge">{{ app()->environment() }}</span>
        </h1>
        <p class="subtitle">Previsualiza y prueba los templates de email del sistema</p>

        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        @if(session('error'))
            <div class="alert alert-error">{{ session('error') }}</div>
        @endif

        <div class="templates-grid">
            @foreach($templates as $template)
                <div class="template-card">
                    <h2>{{ $template['name'] }}</h2>
                    <p>{{ $template['description'] }}</p>
                    
                    <div class="template-actions">
                        <a href="{{ url('/test/email-templates/' . $template['slug']) }}" 
                           class="btn btn-primary" 
                           target="_blank">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            Ver Preview
                        </a>
                        <button class="btn btn-secondary" onclick="toggleSendForm('{{ $template['slug'] }}')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                            </svg>
                            Enviar Test
                        </button>
                    </div>

                    <form id="form-{{ $template['slug'] }}" 
                          class="send-form" 
                          action="{{ url('/test/email-templates/' . $template['slug'] . '/send') }}" 
                          method="POST">
                        @csrf
                        <input type="email" 
                               name="email" 
                               placeholder="Email de destino (ej: test@example.com)" 
                               required>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            Enviar email de prueba
                        </button>
                    </form>
                </div>
            @endforeach
        </div>
    </div>

    <script>
        function toggleSendForm(slug) {
            const form = document.getElementById('form-' + slug);
            form.classList.toggle('active');
            if (form.classList.contains('active')) {
                form.querySelector('input').focus();
            }
        }
    </script>
</body>
</html>

