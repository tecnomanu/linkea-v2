<?php

namespace App\Constants;

/**
 * Standardized API response messages.
 * User-facing messages in Spanish (es-AR).
 */
final class ResponseMessages
{
    // Success messages
    public const SUCCESS = 'Operacion exitosa';
    public const CREATED = 'Creado exitosamente';
    public const UPDATED = 'Actualizado exitosamente';
    public const DELETED = 'Eliminado exitosamente';

    // Auth messages
    public const LOGIN_SUCCESS = 'Sesion iniciada';
    public const LOGOUT_SUCCESS = 'Sesion cerrada';
    public const USER_REGISTERED = 'Usuario registrado exitosamente';
    public const INVALID_CREDENTIALS = 'Credenciales invalidas';
    public const UNAUTHORIZED = 'No autorizado';
    public const EMAIL_VERIFIED = 'Email verificado exitosamente';
    public const INVALID_VERIFICATION_CODE = 'Codigo de verificacion invalido';
    public const PASSWORD_RESET_SENT = 'Se envio el email de recuperacion';
    public const PASSWORD_RESET_SUCCESS = 'Contrasena actualizada exitosamente';
    public const PASSWORD_RESET_TOKEN_EXPIRED = 'El token ha caducado';
    public const PASSWORD_RESET_TOKEN_INVALID = 'Token invalido';

    // Validation messages
    public const VALIDATION_ERROR = 'Error de validacion';
    public const REQUIRED_FIELD = 'Campo requerido';
    public const INVALID_EMAIL = 'Email invalido';
    public const EMAIL_TAKEN = 'Este email ya esta registrado';
    public const USERNAME_TAKEN = 'Este nombre de usuario ya esta en uso';
    public const USERNAME_MIN_LENGTH = 'El nombre de usuario debe tener al menos 5 caracteres';
    public const PASSWORD_MIN_LENGTH = 'La contrasena debe tener al menos 8 caracteres';
    public const PASSWORDS_DONT_MATCH = 'Las contrasenas no coinciden';

    // Resource messages
    public const NOT_FOUND = 'Recurso no encontrado';
    public const LANDING_NOT_FOUND = 'Landing no encontrada';
    public const LINK_NOT_FOUND = 'Link no encontrado';
    public const USER_NOT_FOUND = 'Usuario no encontrado';

    // Landing/Links messages
    public const LINKS_SAVED = 'Links guardados exitosamente';
    public const SOCIAL_LINKS_SAVED = 'Redes sociales guardadas exitosamente';
    public const DESIGN_SAVED = 'Diseno guardado exitosamente';
    public const SETTINGS_SAVED = 'Configuracion guardada exitosamente';
    public const HANDLE_AVAILABLE = 'Nombre de usuario disponible';
    public const HANDLE_TAKEN = 'Este nombre de usuario ya esta en uso';
    public const HANDLE_REQUIRED = 'El nombre de usuario es requerido';

    // Generic errors
    public const SERVER_ERROR = 'Error interno del servidor';
    public const FORBIDDEN = 'Acceso denegado';
}

