@props(['links', 'icons', 'template'])

@if (count($links) > 0)
    @foreach($links as $link)
        @if($link->state && $link->text)
            @if($link->type === 'heading')
                <span class="{{$link->options['size'] ?? ''}} mt-2 mb-2 d-block">{{$link->text}}</span>
            @elseif( $link->type === 'youtube' && isset($link->options) && $link->options['showInline'])
                <div class="button button-default button-youtube-player" 
                    aria-label="{{$link->text}}" 
                    data-yt-idx="{{$link->order}}">
                    <span class="button-container  icon-{{$icons["position"]}} button-yt-player"
                        data-yt-idx="{{$link->order}}"
                        data-yt-autoplay="{{$link->options['autoplay']}}"
                        data-yt-mute="{{$link->options['mute']}}"
                        data-yt-link="{{$link->link}}"
                        data-link="{{$link->id}}">
                        @if ($icons["show"] && $link['icon'] && isset($link->icon['name']) && isset($link->icon['type']))
                            <span class="link-icon {{$icons["position"]}}" 
                                data-svg-color="{{$template["buttons"]["textColor"]}}"
                                data-svg="assets/images/icons/{{$link->icon['type']}}/{{$link->icon['name']}}.svg">
                            </span>
                        @endif
                        <span>
                            {{ $link->text }}
                        </span>
                        <i class="fa __link_arrow"></i>
                    </span>
                    <div class="___video_player" data-yt-idx="{{$link->order}}" >
                        <div id="yt-player{{$link->order}}" data-yt-idx="{{$link->order}}"></div>
                        <div class="___video_player_closer" data-yt-idx="{{$link->order}}">x Cerrar</div>
                    </div>
                </div>
            @elseif( $link->type === 'spotify' && isset($link->options) && $link->options['showInline'])
                <div class="button button-default button-spotify-player" 
                    aria-label="{{$link->text}}" 
                    data-spotify-idx="{{$link->order}}">
                    <span class="button-container icon-{{$icons["position"]}} button-spoty-player"
                        data-spotify-idx="{{$link->order}}"
                        data-spotify-autoplay="{{$link->options['autoplay']}}"
                        data-spotify-link="{{$link->link}}"
                        data-link="{{$link->id}}">
                        @if ($icons["show"] && $link['icon'] && isset($link->icon['name']) && isset($link->icon['type']))
                            <span class="link-icon {{$icons["position"]}}" 
                                data-svg-color="{{$template["buttons"]["textColor"]}}"
                                data-svg="assets/images/icons/{{$link->icon['type']}}/{{$link->icon['name']}}.svg">
                            </span>
                        @endif
                        <span>
                            {{ $link->text }}
                        </span>
                        <i class="fa __link_arrow"></i>
                    </span>
                    <div class="___spotify_player {{'___'. ($link->options['size'] ?? 'normal')}}" data-spotify-idx="{{$link->order}}" >
                        <iframe id="embed-spotify{{$link->order}}" data-spotify-idx="{{$link->order}}"></iframe>
                        <div class="___spotify_player_closer" data-spotify-idx="{{$link->order}}">x Cerrar</div>
                    </div>
                </div>
            @elseif( ($link->type === 'youtube' && (!isset($link->options) || !$link->options['showInline'])) || 
                ($link->type === 'spotify' && (!isset($link->options) || !$link->options['showInline'])) || 
                ( filter_var($link->link, FILTER_VALIDATE_URL) || is_numeric($link->link) ))
                <a class="button button-default link" 
                    rel="{{$link->type === 'mastodon' ? 'me' : ''}}"
                    href="{{$link->type === 'youtube' && strpos($link->link, 'youtube.com') === false ? 'https://youtube.com/watch?v=' :
                    (is_numeric($link->link) ? 'https://wa.me/' : '')}}{{$link->link}}" 
                    aria-label="{{$link->text}}"
                    data-link="{{$link->id}}" target="_blank" rel="noopener">
                    <span class="button-container  icon-{{$icons["position"]}}">
                        @if ($icons["show"] && $link['icon'] && isset($link->icon['name']) && isset($link->icon['type']))
                            <span class="link-icon {{$icons["position"]}}" 
                                data-svg-color="{{$template["buttons"]["textColor"]}}"
                                data-svg="assets/images/icons/{{$link->icon['type']}}/{{$link->icon['name']}}.svg">
                            </span>
                        @endif
                        <span>
                            {{ $link->text }}
                        </span>
                    </span>
                </a>
            @endif
        @endif 
    @endforeach
@endif

  