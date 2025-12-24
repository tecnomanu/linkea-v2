# Manejo de Errores CSRF (419)

## Problema

Los tokens CSRF expiran después de cierto tiempo, causando errores 419 cuando los usuarios dejan la página abierta por mucho tiempo y luego intentan enviar un formulario.

## Solución Implementada

### 1. Extensión del Lifetime de Sesiones

**Archivo**: `config/session.php`

Se extendió el tiempo de vida de las sesiones de **120 minutos** (2 horas) a **10,080 minutos** (7 días):

```php
'lifetime' => (int) env('SESSION_LIFETIME', 10080), // 7 days
```

Esto permite que los usuarios mantengan su sesión activa por más tiempo sin necesidad de volver a autenticarse.

### 2. Interceptor Global de Errores 419

**Archivo**: `resources/js/app.tsx`

Se agregó un event listener global que detecta automáticamente errores 419 y recarga la página para obtener un nuevo token CSRF:

```typescript
// Global error handler for CSRF token expiration (419)
document.addEventListener("inertia:error", (event: any) => {
    // Check if the error is a 419 (CSRF token mismatch/expiration)
    if (event.detail?.response?.status === 419) {
        console.warn(
            "CSRF token expired (419). Reloading page to refresh session..."
        );
        // Reload the page to get a fresh CSRF token
        window.location.reload();
    }
});
```

## Beneficios

1. **Experiencia de Usuario Mejorada**: Los usuarios no ven el error 419, la página se recarga automáticamente.
2. **Solución Centralizada**: No es necesario manejar el error 419 en cada formulario individualmente.
3. **Sesiones más Duraderas**: Los usuarios pueden dejar la página abierta por días sin perder su sesión.

## Variables de Entorno

Si deseas ajustar el tiempo de vida de la sesión, puedes configurarlo en tu archivo `.env`:

```env
SESSION_LIFETIME=10080  # En minutos (7 días)
```

## Testing

Para probar que funciona correctamente:

1. Abre la aplicación y espera a que expire el token CSRF (puedes simular esto limpiando las cookies manualmente)
2. Intenta enviar un formulario
3. Verifica que la página se recarga automáticamente en lugar de mostrar el error 419
