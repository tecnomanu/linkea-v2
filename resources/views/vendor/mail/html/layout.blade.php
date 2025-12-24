<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<style>
@media only screen and (max-width: 600px) {
.inner-body {
width: 100% !important;
}

.footer {
width: 100% !important;
}
}

@media only screen and (max-width: 500px) {
.button {
width: 100% !important;
}
}
</style>
<style>
    .ql-container {
        box-sizing: border-box;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 13px;
        height: 100%;
        margin: 0;
        position: relative;
    }
    .ql-snow .ql-video {
        display: block;
        max-width: 100%;
    }
    .ql-snow .ql-video.ql-align-center {
    margin: 0 auto;
    }
    .ql-snow .ql-video.ql-align-right {
    margin: 0 0 0 auto;
    }
    .ql-snow .ql-bg-black {
    background-color: #000;
    }
    .ql-snow .ql-bg-red {
    background-color: #e60000;
    }
    .ql-snow .ql-bg-orange {
    background-color: #f90;
    }
    .ql-snow .ql-bg-yellow {
    background-color: #ff0;
    }
    .ql-snow .ql-bg-green {
    background-color: #008a00;
    }
    .ql-snow .ql-bg-blue {
    background-color: #06c;
    }
    .ql-snow .ql-bg-purple {
    background-color: #93f;
    }
    .ql-snow .ql-color-white {
    color: #fff;
    }
    .ql-snow .ql-color-red {
    color: #e60000;
    }
    .ql-snow .ql-color-orange {
    color: #f90;
    }
    .ql-snow .ql-color-yellow {
    color: #ff0;
    }
    .ql-snow .ql-color-green {
    color: #008a00;
    }
    .ql-snow .ql-color-blue {
    color: #06c;
    }
    .ql-snow .ql-color-purple {
    color: #93f;
    }
  
    .ql-snow .ql-align-center {
        text-align: center;
    }
    .ql-snow .ql-align-justify {
        text-align: justify;
    }
    .ql-snow .ql-align-right {
        text-align: right;
    }
    .ql-snow .ql-formats {
        display: inline-block;
        vertical-align: middle;
    }
    .ql-snow .ql-formats:after {
        clear: both;
        content: "";
        display: table;
    }
    .ql-snow .ql-stroke {
        fill: none;
        stroke: #444;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
    }
    .ql-snow .ql-stroke-miter {
        fill: none;
        stroke: #444;
        stroke-miterlimit: 10;
        stroke-width: 2;
    }
    .ql-snow .ql-fill,
    .ql-snow .ql-stroke.ql-fill {
        fill: #444;
    }
    .ql-snow .ql-empty {
        fill: none;
    }
    .ql-snow .ql-even {
        fill-rule: evenodd;
    }
    .ql-snow .ql-thin,
    .ql-snow .ql-stroke.ql-thin {
        stroke-width: 1;
    }
    .ql-snow .ql-transparent {
        opacity: 0.4;
    }
    .ql-snow .ql-direction svg:last-child {
        display: none;
    }
    .ql-snow .ql-direction.ql-active svg:last-child {
        display: inline;
    }
    .ql-snow .ql-direction.ql-active svg:first-child {
        display: none;
    }
    .ql-snow h1 {
        font-size: 2em;
    }
    .ql-snow h2 {
        font-size: 1.5em;
    }
    .ql-snow h3 {
        font-size: 1.17em;
    }
    .ql-snow h4 {
        font-size: 1em;
    }
    .ql-snow h5 {
        font-size: 0.83em;
    }
    .ql-snow h6 {
        font-size: 0.67em;
    }
    .ql-snow a {
        text-decoration: underline;
    }
    .ql-snow blockquote {
        border-left: 4px solid #ccc;
        margin-bottom: 5px;
        margin-top: 5px;
        padding-left: 16px;
    }
    .ql-snow code,
    .ql-snow pre {
        background-color: #f0f0f0;
        border-radius: 3px;
    }
    .ql-snow pre {
        white-space: pre-wrap;
        margin-bottom: 5px;
        margin-top: 5px;
        padding: 5px 10px;
    }
    .ql-snow code {
        font-size: 85%;
        padding: 2px 4px;
    }
    .ql-snow pre.ql-syntax {
        background-color: #23241f;
        color: #f8f8f2;
        overflow: visible;
    }
    .ql-snow img {
        max-width: 100%;
    }
    .ql-snow a {
        color: #06c;
    }

    .ql-container hr{ border: none; height: 3px; background-color: rgb(238 238 238); margin-bottom: 10px}
</style>
</head>
<body>

<table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="center">
<table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
{{ $header ?? '' }}

<!-- Email Body -->
<tr>
<td class="body" width="100%" cellpadding="0" cellspacing="0">
<table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
<!-- Body content -->
<tr>
<td class="content-cell">
{{ Illuminate\Mail\Markdown::parse($slot) }}

{{ $subcopy ?? '' }}
</td>
</tr>
</table>
</td>
</tr>

{{ $footer ?? '' }}
</table>
</td>
</tr>
</table>
</body>
</html>
