@props(['landing', 'socials', 'storageUrl', 'templateConfig', 'links'])

<section>
    <div class="column" id="section-content">    
        <!-- Username -->
        <h5 class="username" id="domain-name">
            <span>{{'@'.$landing->domain_name}} </span>
            @if($landing->verify)
                <img src="images/icons/official.svg" class="official" alt="{{$landing->domain_name}} - Official" width="16" height="24"/>
            @endif
        </h5>

        @if(isset($templateConfig["socials"]) && 
            $templateConfig["socials"]['show'] &&
            $templateConfig["socials"]['position'] == 'top' && 
            count($socials) > 0)
            <div class="buttons-container">
                {{-- <a class="btn-topbar small" id="share-btn-topbar">
                    <i class="fa fa-link"></i> <span class="text">Compatir</span>
                </a>
                <a class="btn-topbar small" id="subscribe-btn-topbar">
                    <i class="fa fa-bell"></i> <span class="text">Subscribirse</span>
                </a> --}}
                <x-landing.buttons-social :template="$templateConfig" :links="$socials"></x-landing.buttons-social>
            </div>
        @endif

        <!-- Title -->
        <h2 class="title">{{isset($templateConfig["title"]) ? $templateConfig["title"] : $landing->domain_name}}</h2>

        @if( isset($templateConfig["subtitle"]) )
            <!-- Subtitle -->
            <p style="color:{{$templateConfig["textColor"]}}">{{$templateConfig["subtitle"]}}</p>
        @endif

        {{-- <div id="test3d"></div> --}}

        <!-- Links -->
        <x-landing.buttons-link :icons="$templateConfig['icons']"
            :template="$templateConfig"
            :links="$links"></x-landing.buttons-link>

        @if( isset($templateConfig["socials"]['button']) && $templateConfig["socials"]['button'] && count($socials) > 0 )
        <div class="buttons-container">
            <x-landing.buttons-social :template="$templateConfig" :links="$socials"></x-landing.buttons-social>
        </div>
        @endif
    </div>
</section>