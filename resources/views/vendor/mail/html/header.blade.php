<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Linkea' || trim($slot) === 'Laravel')
<img src="https://linkea.ar/assets/images/logo.png" width="140" height="38" class="logo2" alt="Linkea" style="height: 38px; width: auto;">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>
