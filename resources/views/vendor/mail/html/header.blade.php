<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Linkea')
<img src="{{ $url }}/assets/images/logo.png" width="150" height="32" class="logo2" alt="Linkea Logo">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>
