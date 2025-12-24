<p align="center">
  <img src="public/assets/images/welcome-linkea-banner.jpg" alt="Linkea Banner" width="100%">
</p>

<p align="center">
  <strong>Tu link en bio, potenciado.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel" alt="Laravel 12">
  <img src="https://img.shields.io/badge/Inertia.js-1.x-9553E9?style=flat-square&logo=inertia" alt="Inertia.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS">
</p>

---

## Sobre Linkea

**Linkea** es una plataforma "link in bio" (similar a Linktree) que permite a usuarios crear landing pages personalizadas con todos sus enlaces importantes en un solo lugar.

## Stack Tecnologico

| Capa | Tecnologia |
|------|------------|
| Backend | Laravel 12 |
| Frontend | React 19 + TypeScript |
| Bridge | Inertia.js |
| Estilos | Tailwind CSS 4 |
| Base de datos | SQLite / MySQL |
| Autenticacion | Laravel Sanctum + Sessions |

## Instalacion

```bash
# Clonar repositorio
git clone https://github.com/tecnomanu/linkea-v2.git
cd linkea-v2

# Instalar dependencias
composer install
npm install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Migrar base de datos
php artisan migrate --seed

# Iniciar desarrollo
php artisan serve
npm run dev
```

## Estructura del Proyecto

```
app/
├── Http/Controllers/
│   ├── Panel/          # Vistas Inertia del panel
│   ├── Api/Panel/      # API endpoints (auto-save)
│   └── Auth/           # Autenticacion
├── Models/             # Landing, Link, User, Company
└── Services/           # Logica de negocio

resources/js/
├── Pages/              # Paginas Inertia
│   ├── Panel/          # Dashboard del usuario
│   ├── Auth/           # Login, Register
│   └── Web/            # Home publica
├── Components/         # Componentes React
│   ├── ui/             # Primitivos (Button, Dialog, etc.)
│   ├── Shared/         # Compartidos entre modulos
│   └── Panel/          # Especificos del panel
└── Layouts/            # Wrappers de layout
```

## Licencia

Proyecto privado - Todos los derechos reservados.
