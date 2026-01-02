@extends('emails.layouts.default')

@section('content')
    <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <h1 style="margin: 0;">Tu resumen semanal</h1>
            {!! \App\Support\Helpers\EmailIconHelper::get('rocket', 28, '#f97316') !!}
        </div>
        <p class="text-muted">Semana del {{ $weekStart }} al {{ $weekEnd }}</p>
    </div>

    <p style="margin-bottom: 28px;">Hola <strong>{{ $userName ?? $notifiable->first_name ?? 'Usuario' }}</strong>, acá está el resumen de cómo le fue a tu Linkea esta semana.</p>

    <!-- Stats Grid with Sparklines -->
    <table class="stats-grid" width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <!-- Views Card -->
            <td width="48%" class="stat-card" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; text-align: center; vertical-align: top;">
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 36px; font-weight: 800; color: #0369a1; margin-bottom: 4px;">{{ number_format($totalViews) }}</div>
                    <div style="font-size: 13px; color: #0c4a6e; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 4px;">
                        {!! \App\Support\Helpers\EmailIconHelper::get('eye', 14, '#0c4a6e') !!}
                        <span>Visitas</span>
                    </div>
                </div>
                
                @if(isset($viewsSparkline) && !empty($viewsSparkline))
                    <div style="margin: 12px 0 10px;">
                        {!! \App\Support\Helpers\SparklineHelper::generateSVG($viewsSparkline, 120, 28, '#0369a1', '#bae6fd') !!}
                    </div>
                @endif

                @if($viewsChange != 0)
                    <div style="font-size: 12px; margin-top: 8px; color: {{ $viewsChange > 0 ? '#16a34a' : '#dc2626' }}; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 4px;">
                        {!! \App\Support\Helpers\EmailIconHelper::get($viewsChange > 0 ? 'trending-up' : 'trending-down', 14, $viewsChange > 0 ? '#16a34a' : '#dc2626') !!}
                        <span>{{ $viewsChange > 0 ? '+' : '' }}{{ $viewsChange }}% vs semana anterior</span>
                    </div>
                @else
                   <div style="font-size: 12px; margin-top: 8px; color: #94a3b8; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 4px;">
                        {!! \App\Support\Helpers\EmailIconHelper::get('minus', 14, '#94a3b8') !!}
                        <span>Sin cambios</span>
                   </div>
                @endif
            </td>
            <td width="4%"></td> <!-- Gap -->
            <!-- Clicks Card -->
            <td width="48%" class="stat-card" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #fcd34d; border-radius: 12px; padding: 20px; text-align: center; vertical-align: top;">
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 36px; font-weight: 800; color: #b45309; margin-bottom: 4px;">{{ number_format($totalClicks) }}</div>
                    <div style="font-size: 13px; color: #78350f; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 4px;">
                        {!! \App\Support\Helpers\EmailIconHelper::get('link', 14, '#78350f') !!}
                        <span>Clics</span>
                    </div>
                </div>

                @if(isset($clicksSparkline) && !empty($clicksSparkline))
                    <div style="margin: 12px 0 10px;">
                        {!! \App\Support\Helpers\SparklineHelper::generateSVG($clicksSparkline, 120, 28, '#d97706', '#fcd34d') !!}
                    </div>
                @endif

                @if($clicksChange != 0)
                    <div style="font-size: 12px; margin-top: 8px; color: {{ $clicksChange > 0 ? '#16a34a' : '#dc2626' }}; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 4px;">
                        {!! \App\Support\Helpers\EmailIconHelper::get($clicksChange > 0 ? 'trending-up' : 'trending-down', 14, $clicksChange > 0 ? '#16a34a' : '#dc2626') !!}
                        <span>{{ $clicksChange > 0 ? '+' : '' }}{{ $clicksChange }}% vs semana anterior</span>
                    </div>
                @else
                   <div style="font-size: 12px; margin-top: 8px; color: #94a3b8; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 4px;">
                        {!! \App\Support\Helpers\EmailIconHelper::get('minus', 14, '#94a3b8') !!}
                        <span>Sin cambios</span>
                   </div>
                @endif
            </td>
        </tr>
    </table>

    <!-- Top Links with Mini Sparklines -->
    @if(count($topLinks) > 0)
        <div style="margin-top: 32px;">
            <h3 style="font-size: 18px; margin-bottom: 16px; color: #1e293b; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                {!! \App\Support\Helpers\EmailIconHelper::get('fire', 20, '#f97316') !!}
                <span>Top enlaces de la semana</span>
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
                @foreach(array_slice($topLinks, 0, 5) as $index => $link)
                    <tr style="{{ $index < count($topLinks) - 1 ? 'border-bottom: 1px solid #f1f5f9;' : '' }}">
                        <td style="padding: 14px 18px; width: 60%;">
                            <div style="display: flex; align-items: center;">
                                @php
                                    $colors = ['#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
                                    $color = $colors[$index % 5];
                                @endphp
                                <span style="display: inline-block; width: 28px; height: 28px; background: {{ $color }}; color: white; border-radius: 50%; text-align: center; line-height: 28px; font-size: 13px; font-weight: 700; margin-right: 12px; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">{{ $index + 1 }}</span>
                                <div>
                                    <div style="color: #1e293b; font-weight: 600; font-size: 14px; line-height: 1.4;">{{ $link['title'] ?? 'Sin título' }}</div>
                                    @if(isset($link['sparkline']) && !empty($link['sparkline']))
                                        <div style="margin-top: 6px;">
                                            {!! \App\Support\Helpers\SparklineHelper::generateSVG($link['sparkline'], 80, 20, '#94a3b8', '#f1f5f9') !!}
                                        </div>
                                    @endif
                                </div>
                            </div>
                        </td>
                        <td style="padding: 14px 18px; text-align: right; white-space: nowrap; vertical-align: middle;">
                            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #86efac; border-radius: 20px; padding: 6px 14px; display: inline-block;">
                                <span style="color: #16a34a; font-weight: 700; font-size: 15px;">{{ number_format($link['clicks']) }}</span>
                                <span style="color: #15803d; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-left: 2px;">clics</span>
                            </div>
                        </td>
                    </tr>
                @endforeach
            </table>
        </div>
    @endif

    <!-- CTA Section -->
    <div style="text-align: center; margin: 36px 0 32px; padding: 24px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; border: 1px solid #fcd34d;">
        <p style="margin: 0 0 16px; color: #78350f; font-size: 15px; font-weight: 600;">¿Querés ver estadísticas más detalladas?</p>
        <a href="{{ config('app.url') }}/panel?tab=dashboard" class="button" style="background: linear-gradient(135deg, #F87435 0%, #ea580c 100%); box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3); display: inline-flex; align-items: center; gap: 8px;">
            {!! \App\Support\Helpers\EmailIconHelper::get('chart', 18, '#ffffff') !!}
            <span>Ver panel completo</span>
        </a>
    </div>

    <!-- Footer Message -->
    <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #e2e8f0;">
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 20px; background: #f8fafc; padding: 16px; border-radius: 12px; border-left: 4px solid #f97316;">
            <div style="flex-shrink: 0; margin-top: 2px;">
                {!! \App\Support\Helpers\EmailIconHelper::get('lightbulb', 20, '#f97316') !!}
            </div>
            <div>
                <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0;">
                    <strong style="color: #1e293b;">Tip:</strong> Compartí tu Linkea en redes sociales para aumentar tus visitas y clics.
                </p>
            </div>
        </div>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 4px;">Saludos,</p>
        <p style="color: #1e293b; font-weight: 700; font-size: 15px; margin: 0;">Equipo de Linkea</p>
    </div>
@endsection
