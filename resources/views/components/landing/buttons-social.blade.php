@props(['links', 'template'])   

@if (count($links) > 0)
    @foreach($links as $link)
        @if( filter_var($link->link, FILTER_VALIDATE_URL) && $link->state )
            @if ($link['icon'] && isset($link->icon['name']) && isset($link->icon['type']))
                <a class="button-default btn-topbar small not-hover link" 
                    aria-label="{{$link->name}}"
                    data-link="{{$link->id}}" rel="noopener"
                    href="{{$link->link}}" target="_blank" id="subscribe-btn-topbar">
                    <span class="link-icon" 
                        data-svg-color="{{$template["buttons"]["textColor"]}}"
                        data-svg="assets/images/icons/{{$link->icon['type']}}/{{$link->icon['name']}}.svg">
                    </span>
                </a>
            @endif
        @endif
    @endforeach
@endif