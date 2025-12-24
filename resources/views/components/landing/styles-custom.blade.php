@props(['templateConfig'])
@if(isset($templateConfig["background"]))
    <style>
        body{
            @if(isset($templateConfig["background"]["background"]))
                background:{{$templateConfig["background"]["background"]}};
            @endif
            @if(isset($templateConfig["background"]["backgroundColor"]))
                background-color:{{$templateConfig["background"]["backgroundColor"]}};
            @endif
            @if(isset($templateConfig["background"]["backgroundImage"]))
                @if(isset($templateConfig["background"]["backgroundImage"]["image"]))
                    background-image: url('{{env('AWS_URL')}}{{$templateConfig["background"]["backgroundImage"]["image"]}}');
                @else
                    background-image:{!! htmlspecialchars_decode($templateConfig["background"]["backgroundImage"]) !!};
                @endif
            @endif
            @if(isset($templateConfig["background"]["backgroundPosition"]))
                background-position:{{$templateConfig["background"]["backgroundPosition"]}};
            @endif
            @if(isset($templateConfig["background"]["backgroundSize"]))
                background-size:{{$templateConfig["background"]["backgroundSize"]}};
            @endif
            @if(isset($templateConfig["background"]["backgroundAttachment"]))
                background-attachment:{{$templateConfig["background"]["backgroundAttachment"]}};
            @endif
            @if(isset($templateConfig["background"]["backgroundRepeat"]))
                background-repeat:{{$templateConfig["background"]["backgroundRepeat"]}};
            @endif
            color: {{$templateConfig["textColor"]}};
        }
        @if(isset($templateConfig["background"]["backDropColor"]) &&
            isset($templateConfig["background"]["backDropState"]) && 
            $templateConfig["background"]["backDropState"])
            #back-drop{
                background-color:{{$templateConfig["background"]["backDropColor"] ?? 'none'}};
            }
        @endif
    </style>
@endif

@if(isset($templateConfig["textColor"]))
    <style>
        .title, .subtitle{
            color: {{$templateConfig["textColor"]}}
        }
    </style>
@endif

@if(isset($templateConfig["buttons"]))
    <style>
        .button-default .button-container, a.btn-topbar{
            background-color: {{$templateConfig["buttons"]["backgroundColor"]}};
            color: {{$templateConfig["buttons"]["textColor"]}};
        }
        .button-default .button-container:hover, a.btn-topbar:hover{
            background-color: {{$templateConfig["buttons"]["backgroundHoverColor"]}};
            color: {{$templateConfig["buttons"]["textHoverColor"]}};
        }
    </style>

    @if(isset($templateConfig["buttons"]['borderShow']) && 
        isset($templateConfig["buttons"]['borderColor']) &&
        $templateConfig["buttons"]['borderShow'])
    <style>
        .button .button-container{
            border-color: {{$templateConfig["buttons"]["borderColor"]}};
        }
    </style>
    @elseif(isset($templateConfig["buttons"]['borderShow']) && !$templateConfig["buttons"]['borderShow'])
    <style>
        .button .button-container{
            border-width: 0;
        }
    </style>
    @endif
@endif

@if(isset($templateConfig["backgroundColor"]) && 
    (
        $templateConfig["backgroundColor"] === "#ffffff" ||
        $templateConfig["backgroundColor"] === "white" ||
        $templateConfig["backgroundColor"] === "#fff"
    )
)
    <style>
        a, footer {
            color: #111213;
        }
        a:hover {
            color: #111213;
        }
    </style>

@else
    <style>
        a, footer {
            color: {{$templateConfig["textColor"]}}
        }
        a:hover {
            color: {{$templateConfig["textColor"]}}
        }
    </style>
@endif