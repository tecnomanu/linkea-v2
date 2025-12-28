<tr>
<td>
<table class="hero-header" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td style="text-align: center;">
<a href="{{ config('app.url') }}" style="display: inline-block;">
<img src="{{ config('app.url') }}/images/logos/logo-white.webp" alt="Linkea" class="logo" style="height: 40px; width: auto;">
</a>
</td>
</tr>
@if(isset($slot) && trim($slot) !== '' && trim($slot) !== config('app.name'))
<tr>
<td style="text-align: center; padding-top: 24px;">
<h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; line-height: 1.3;">{{ $slot }}</h1>
</td>
</tr>
@endif
</table>
</td>
</tr>
