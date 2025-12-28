<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<style>
/* Base Reset */
body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
img { -ms-interpolation-mode: bicubic; }

/* Base Styles */
body {
    margin: 0 !important;
    padding: 0 !important;
    background-color: #f4f4f7;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.wrapper {
    width: 100%;
    background-color: #f4f4f7;
    padding: 30px 0;
}

.content {
    max-width: 600px;
    margin: 0 auto;
}

/* Hero Header */
.hero-header {
    background: linear-gradient(135deg, #ef5844 0%, #dc3b26 100%);
    border-radius: 16px 16px 0 0;
    padding: 40px 40px 60px;
    text-align: center;
}

.hero-header img.logo {
    height: 40px;
    width: auto;
    margin-bottom: 30px;
}

.hero-header h1 {
    color: #ffffff;
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px;
    line-height: 1.3;
}

.hero-header p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    margin: 0;
}

/* Hero Image */
.hero-image {
    text-align: center;
    margin-top: -40px;
    margin-bottom: 20px;
}

.hero-image img {
    max-width: 280px;
    height: auto;
}

/* Body Content */
.body-content {
    background-color: #ffffff;
    border-radius: 0 0 16px 16px;
    padding: 40px;
    margin-top: -20px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.body-content p {
    color: #51545e;
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 16px;
}

.body-content h2, .body-content h3 {
    color: #1e293b;
    margin: 24px 0 12px;
}

/* Button */
.button-wrapper {
    text-align: center;
    margin: 32px 0;
}

.button {
    display: inline-block;
    background: linear-gradient(135deg, #ef5844 0%, #dc3b26 100%);
    color: #ffffff !important;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    padding: 14px 32px;
    border-radius: 8px;
    box-shadow: 0 4px 14px rgba(239, 88, 68, 0.4);
    transition: all 0.2s;
}

.button:hover {
    box-shadow: 0 6px 20px rgba(239, 88, 68, 0.5);
}

/* Footer */
.footer {
    text-align: center;
    padding: 30px 40px;
}

.footer p {
    color: #9ca3af;
    font-size: 13px;
    margin: 0 0 8px;
    line-height: 1.5;
}

.footer a {
    color: #ef5844;
    text-decoration: none;
}

.social-links {
    margin: 16px 0;
}

.social-links a {
    display: inline-block;
    margin: 0 8px;
    color: #9ca3af;
    text-decoration: none;
}

/* Divider */
.divider {
    height: 1px;
    background-color: #e5e7eb;
    margin: 24px 0;
}

/* Subcopy */
.subcopy {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
}

.subcopy p {
    font-size: 13px;
    color: #9ca3af;
    word-break: break-all;
}

/* Responsive */
@media only screen and (max-width: 600px) {
    .content { width: 100% !important; }
    .hero-header { padding: 30px 24px 50px; border-radius: 0; }
    .body-content { padding: 30px 24px; border-radius: 0; }
    .hero-header h1 { font-size: 24px; }
}

/* Quill Editor Styles for Newsletter content */
.ql-container { font-family: inherit; font-size: 16px; }
.ql-snow h1 { font-size: 1.8em; color: #1e293b; }
.ql-snow h2 { font-size: 1.4em; color: #1e293b; }
.ql-snow h3 { font-size: 1.2em; color: #1e293b; }
.ql-snow a { color: #ef5844; }
.ql-snow blockquote { border-left: 4px solid #ef5844; padding-left: 16px; margin: 16px 0; color: #64748b; }
.ql-snow img { max-width: 100%; border-radius: 8px; }
.ql-snow ul, .ql-snow ol { padding-left: 24px; margin: 16px 0; }
.ql-snow li { margin: 8px 0; }
</style>
</head>
<body>

<table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="center">
<table class="content" width="600" cellpadding="0" cellspacing="0" role="presentation">

{{ $header ?? '' }}

<!-- Email Body -->
<tr>
<td>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td class="body-content">
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
