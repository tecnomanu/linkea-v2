@extends('emails.layouts.default')

@section('content')
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin-bottom: 8px;">Tu resumen semanal 🚀</h1>
        <p class="text-muted">Semana del {{ $weekStart }} al {{ $weekEnd }}</p>
    </div>

    <p style="margin-bottom: 24px;">Hola <strong>{{ $notifiable->first_name ?? 'Usuario' }}</strong>, acá está el resumen de cómo le fue a tu Linkea esta semana.</p>

    <!-- Stats Grid -->
    <table class="stats-grid" width="100%">
        <tr>
            <td width="48%" class="stat-card">
                <div class="stat-value">{{ number_format($totalViews) }}</div>
                <div class="stat-label">Visitas</div>
                
                @if($viewsChange != 0)
                    <div style="font-size: 12px; margin-top: 6px; color: {{ $viewsChange > 0 ? '#16a34a' : '#dc2626' }}; font-weight: 500;">
                        {{ $viewsChange > 0 ? '↑' : '↓' }} {{ abs($viewsChange) }}% vs anterior
                    </div>
                @else
                   <div style="font-size: 12px; margin-top: 6px; color: #94a3b8;">Sin cambios</div>
                @endif
            </td>
            <td width="4%"></td> <!-- Gap -->
            <td width="48%" class="stat-card">
                <div class="stat-value">{{ number_format($totalClicks) }}</div>
                <div class="stat-label">Clics</div>

                @if($clicksChange != 0)
                    <div style="font-size: 12px; margin-top: 6px; color: {{ $clicksChange > 0 ? '#16a34a' : '#dc2626' }}; font-weight: 500;">
                        {{ $clicksChange > 0 ? '↑' : '↓' }} {{ abs($clicksChange) }}% vs anterior
                    </div>
                @else
                   <div style="font-size: 12px; margin-top: 6px; color: #94a3b8;">Sin cambios</div>
                @endif
            </td>
        </tr>
    </table>

    <!-- Top Links -->
    @if(count($topLinks) > 0)
        <div style="margin-top: 30px;">
            <h3 style="font-size: 16px; margin-bottom: 16px;">🔥 Top enlaces de la semana</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                @foreach(array_slice($topLinks, 0, 5) as $index => $link)
                    <tr>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
                            <div style="display: flex; align-items: center;">
                                <span style="display: inline-block; width: 24px; height: 24px; background: #fb923c; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; margin-right: 12px; flex-shrink: 0;">{{ $index + 1 }}</span>
                                <span style="color: #334155; font-weight: 500; font-size: 14px;">{{ $link['title'] ?? 'Sin título' }}</span>
                            </div>
                        </td>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: right; white-space: nowrap;">
                            <span style="color: #0f172a; font-weight: 700;">{{ $link['clicks'] }}</span>
                            <span style="color: #64748b; font-size: 12px;"> clics</span>
                        </td>
                    </tr>
                @endforeach
            </table>
        </div>
    @endif

    <div class="text-center" style="margin-top: 30px;">
        <a href="{{ config('app.url') }}/panel" class="button">Ver estadísticas completas</a>
    </div>

    <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        <p>Seguí compartiendo tu Linkea para aumentar tus visitas.</p>
        <p>Saludos,<br><strong>Equipo de Linkea</strong></p>
    </div>
@endsection
