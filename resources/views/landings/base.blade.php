<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Page Information -->
    <x-landing.head  :storageUrl="$storageUrl" :landing="$landing"></x-landing.head>  
    
    <!-- Styles -->
    <x-landing.styles></x-landing.styles>

    <!-- Special Styles -->
    <x-landing.styles-custom :templateConfig="$templateConfig"></x-landing.styles-custom>

    {{-- <x-landing.analytics :landing="$landing"></x-landing.analytics> --}}

</head>

<body>
  <div id="fixed-topbar">
      <div class="container">
          {{-- <div class="buttons-container fixed-buttons-container">
            <a class="btn-topbar" id="share-btn-topbar">
              <i class="fa fa-link"></i> <span class="text">Compatir</span>
            </a>
            <a class="btn-topbar" id="subscribe-btn-topbar">
              <i class="fa fa-bell"></i> <span class="text">Subscribirse</span>
            </a>
          </div> --}}
          <div class="column">
              <div class="container-topbar" id="container-topbar">
                  <img src="{{ (strpos($landing->logo["thumb"], "https://") === false  ? $storageUrl : '') . $landing->logo["thumb"] }}" 
                  id="paralax-profile"
                  style=""
                  class="avatar {{$templateConfig["image_rounded"]? "img-rounded" : ""}}"
                  srcset="{{ (strpos($landing->logo["image"], "https://") === false  ? $storageUrl : '') . $landing->logo["image"] }} 2x" 
                  alt="{{$landing->name}} - Logo">
                  <span class="domain-name">
                      <span>
                          {{'@'.$landing->domain_name}} 
                          @if($landing->verify)
                              <img src="images/icons/official.svg" class="official" alt="{{$landing->domain_name}} - Official" width="16" height="24"/>
                          @endif
                      </span>
                  </span>
                  <div class="topbar-container-buttons">
                    {{-- <a class="btn-topbar" id="share-btn-topbar">
                      <i class="fa fa-link"></i> <span class="text">Compatir</span>
                    </a>
                    <a class="btn-topbar" id="subscribe-btn-topbar">
                      <i class="fa fa-bell"></i> <span class="text">Subscribirse</span>
                    </a> --}}
                  </div>
              </div>
          </div>
      </div>
  </div>

  <div id="back-drop"></div>
  <!-- Primary Page Layout -->
  <div class="container links-container">
    <x-landing.section :landing="$landing" 
                        :storageUrl="$storageUrl" 
                        :templateConfig="$templateConfig" 
                        :socials="$socials" 
                        :links="$links"></x-landing.section>
    <x-landing.footer></x-landing.footer>
  </div>

  <!-- Script -->  
  <?php
    $isGoogleButton = false;
    $isSpotifyButton = false;
    foreach($links as $link){
      if($link->type === 'youtube')
        $isGoogleButton = true;
      if($link->type === 'spotify')
        $isSpotifyButton = true;
    }
  ?>
  
  @if($isGoogleButton)
    <script src="https://www.youtube.com/iframe_api"></script>
  @endif

  @if($isSpotifyButton)
  <script src="https://open.spotify.com/embed-podcast/iframe-api/v1" async></script>
  @endif

  <script type="application/javascript" src="{{ mix('js/script.js') }}"></script>
  <script type="application/javascript" src="{{ mix('js/manage-cookies.js') }}"></script>
  {{-- <script type="application/javascript" src="js/three.min.js"></script>
  <script type="application/javascript" src="js/panolens.min.js"></script>
  
  <script>
    const panorama = new PANOLENS.ImagePanorama( 'images/test_3d.jpg' );
    const container = document.getElementById( 'test3d' );
    const viewer = new PANOLENS.Viewer( {container, output: 'console' } );
    viewer.add( panorama );
  </script> --}}

  <script>
    manageCookies.start('en', { 
      style: 1,
      analytics: [
        'G-FH87DE17XF', @if(isset($landing->options["analytics"]["google_code"]) && $landing->options["analytics"]["google_code"] ) 
        '{{$landing->options["analytics"]["google_code"]}}' 
        @endif], 
      @if(isset($landing->options["analytics"]["facebook_pixel"]) && $landing->options["analytics"]["facebook_pixel"])
      facebookPixel: '{{$landing->options["analytics"]["facebook_pixel"]}}',
      @endif
      manageColor: '{{$templateConfig["textColor"]}}',
    });
  </script>
  <script>
    (function(w,d,t,u,n,a,m){w['MauticTrackingObject']=n;
        w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)},a=d.createElement(t),
        m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://mautic.linkea.ar/mtc.js','mt');

    mt('send', 'pageview');
  </script>
</body>

</html>
