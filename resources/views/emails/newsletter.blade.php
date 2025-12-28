@extends('emails.layouts.default')

@section('content')
    <h1>Hola {{ $notifiable->first_name ?? 'Usuario' }}!</h1>

    <div class="newsletter-body">
        {!! $newsletter->message !!}
    </div>

    <!-- Tracking Pixel -->
    <img src="{{ route('newsletter.pixel', ['newsletter' => $newsletter->id, 'user' => $notifiable->id]) }}" alt="" width="1" height="1" style="display:none;" />
@endsection
