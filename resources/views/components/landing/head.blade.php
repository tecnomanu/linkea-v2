@props(['landing', 'storageUrl'])

<!-- Mobile Specific Metas -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta charset="utf-8">
<title>{{isset($landing->options["title"]) ? $landing->options["title"] : $landing->name}} | {{env("APP_NAME", "Landing")}}</title>

<meta name="title" content="Landing {{$landing->name}} multienlace - Linkea.ar">
<meta name="description" content="Entra a mi landing multienlace y conecta con todos mis redes sociales y mis actividades online">
<meta name="author" content="Linkea.ar">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="profile">
<meta property="og:site_name" content="Linkea">
<meta property="og:url" content="{{env("APP_URL", "linkea.ar")}}/{{$landing->slug}}">
<meta property="og:title" content="Landing {{$landing->name}} multienlace - Linkea.ar">
<meta property="og:description" content="Entra a mi landing multienlace y conecta con todos mis redes sociales y mis actividades online">
<meta property="og:image" content="{{strpos($landing->logo['image'], 'https://') === false ? $storageUrl . $landing->logo['image'] : env('APP_URL', 'linkea.ar'). '/assets/images/logo_only.png' }}">
<meta property="og:image:width" content="110">
<meta property="og:image:height" content="110">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="Linkea">
<meta property="twitter:url" content="{{env("APP_URL", "linkea.ar")}}/{{$landing->slug}}">
<meta property="twitter:title" content="Landing {{$landing->name}} multienlace - Linkea.ar">
<meta property="twitter:description" content="Entra a mi landing multienlace y conecta con todos mis redes sociales y mis actividades online">
<meta property="twitter:image" content="{{strpos($landing->logo['image'], 'https://') === false ? $storageUrl . $landing->logo['image'] : env('APP_URL', 'linkea.ar'). '/assets/images/logo_only.png' }}">

<link rel="canonical" href="{{env("APP_URL", "linkea.ar")}}/{{$landing->slug}}">
