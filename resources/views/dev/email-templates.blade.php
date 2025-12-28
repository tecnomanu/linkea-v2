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
            background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            max-width: 1100px;
            margin: 0 auto;
        }
        h1 {
            color: white;
            font-size: 2rem;
            margin-bottom: 8px;
            text-align: center;
        }
        .subtitle {
            color: rgba(255,255,255,0.7);
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
            background: #065f46;
            color: #d1fae5;
            border: 1px solid #10b981;
        }
        .alert-error {
            background: #991b1b;
            color: #fee2e2;
            border: 1px solid #dc2626;
        }
        .category-section {
            margin-bottom: 40px;
        }
        .category-title {
            color: #f97316;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
            padding-left: 4px;
        }
        .templates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 16px;
        }
        .template-card {
            background: #2a2a3e;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #3d3d56;
            transition: transform 0.2s, border-color 0.2s;
        }
        .template-card:hover {
            transform: translateY(-2px);
            border-color: #f97316;
        }
        .template-card h2 {
            font-size: 1.1rem;
            color: #fff;
            margin-bottom: 6px;
        }
        .template-card p {
            color: #9ca3af;
            font-size: 0.85rem;
            margin-bottom: 16px;
            line-height: 1.5;
        }
        .template-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            border-radius: 6px;
            font-size: 13px;
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
            background: #3d3d56;
            color: #d1d5db;
        }
        .btn-secondary:hover {
            background: #4d4d66;
        }
        .send-form {
            display: none;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #3d3d56;
        }
        .send-form.active {
            display: block;
        }
        .send-form input[type="email"] {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #3d3d56;
            border-radius: 6px;
            font-size: 14px;
            margin-bottom: 10px;
            background: #1e1e2e;
            color: white;
        }
        .send-form input[type="email"]::placeholder {
            color: #6b7280;
        }
        .send-form input[type="email"]:focus {
            outline: none;
            border-color: #f97316;
            box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
        }
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: rgba(255,255,255,0.7);
            text-decoration: none;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .back-link:hover {
            color: white;
        }
        .env-badge {
            display: inline-block;
            background: rgba(249, 115, 22, 0.2);
            color: #f97316;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-left: 10px;
        }
        .stats-box {
            background: linear-gradient(135deg, #1e3a5f 0%, #1e2d3d 100%);
            border: 1px solid #2563eb;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 20px;
        }
        .stat-item {
            text-align: center;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #3b82f6;
        }
        .stat-label {
            font-size: 0.8rem;
            color: #93c5fd;
            margin-top: 4px;
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

        <div class="stats-box">
            <div class="stat-item">
                <div class="stat-value">{{ count($templates) }}</div>
                <div class="stat-label">Templates disponibles</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">{{ count(array_unique(array_column($templates, 'category'))) }}</div>
                <div class="stat-label">Categorias</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">100%</div>
                <div class="stat-label">Queue-ready</div>
            </div>
        </div>

        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        @if(session('error'))
            <div class="alert alert-error">{{ session('error') }}</div>
        @endif

        @php
            $groupedTemplates = collect($templates)->groupBy('category');
        @endphp

        @foreach($groupedTemplates as $category => $categoryTemplates)
            <div class="category-section">
                <h3 class="category-title">{{ $category }}</h3>
                <div class="templates-grid">
                    @foreach($categoryTemplates as $template)
                        <div class="template-card">
                            <h2>{{ $template['name'] }}</h2>
                            <p>{{ $template['description'] }}</p>
                            
                            <div class="template-actions">
                                <a href="{{ url('/test/email-templates/' . $template['slug']) }}" 
                                   class="btn btn-primary" 
                                   target="_blank">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                    Preview
                                </a>
                                <button class="btn btn-secondary" onclick="toggleSendForm('{{ $template['slug'] }}')">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                                       placeholder="Email de destino" 
                                       required>
                                <button type="submit" class="btn btn-primary" style="width: 100%;">
                                    Enviar email de prueba
                                </button>
                            </form>
                        </div>
                    @endforeach
                </div>
            </div>
        @endforeach
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
