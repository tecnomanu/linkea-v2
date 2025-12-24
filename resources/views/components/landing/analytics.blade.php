<!-- Global site tag (gtag.js) - Google Analytics Linkea -->
@props(['landing'])

{{-- <script async src="https://www.googletagmanager.com/gtag/js?id=G-PVN62HZNPH"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag("js", new Date());

    gtag("config", "G-PVN62HZNPH");
</script>

<!-- Global site tag (gtag.js) - Google Analytics {{$landing->slug}} -->
@if( isset($landing->options["analytics"]["google_code"]) && $landing->options["analytics"]["google_code"] )
    <script async src="https://www.googletagmanager.com/gtag/js?id={{$landing->options["analytics"]["google_code"]}}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag("js", new Date());

        gtag("config", "{{$landing->options["analytics"]["google_code"]}}");
    </script>
@endif --}}

<!-- Facebook Pixel Code {{$landing->slug}} -->
{{-- @if( isset($landing->options["analytics"]["facebook_pixel"]) && $landing->options["analytics"]["facebook_pixel"] )
    <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,"script",
        "https://connect.facebook.net/en_US/fbevents.js");
        fbq("init", "{{$landing->options['analytics']['facebook_pixel']}}");
        fbq("track", "PageView");
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id={{$landing->options['analytics']['facebook_pixel']}}&ev=PageView&noscript=1"
    /></noscript>
@endif
<!-- End Facebook Pixel Code --> --}}