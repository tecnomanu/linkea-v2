<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Linkea - Test de Fuentes para Logo</title>

        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Inter:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Lexend:wght@400;500;600;700&family=Sora:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Urbanist:wght@400;500;600;700&display=swap"
            rel="stylesheet"
        />

        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                background-color: #ffffff;
                min-height: 100vh;
                padding: 40px;
            }

            .header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 30px;
                border-bottom: 2px solid #f0f0f0;
            }

            .header h1 {
                font-family: "DM Sans", sans-serif;
                font-size: 28px;
                color: #333;
                margin-bottom: 10px;
            }

            .header p {
                font-family: "Inter", sans-serif;
                font-size: 14px;
                color: #666;
            }

            .legend {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 20px 30px;
                margin-bottom: 40px;
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                justify-content: center;
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: "Inter", sans-serif;
                font-size: 13px;
                color: #555;
            }

            .badge {
                padding: 4px 10px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
            }

            .badge-panel {
                background: #e0f2fe;
                color: #0369a1;
            }

            .badge-email {
                background: #fef3c7;
                color: #b45309;
            }

            .badge-new {
                background: #dcfce7;
                color: #15803d;
            }

            .badge-legacy {
                background: #f3e8ff;
                color: #7c3aed;
            }

            .font-grid {
                display: flex;
                flex-direction: column;
                gap: 30px;
            }

            .font-row {
                display: grid;
                grid-template-columns: 1fr 320px;
                gap: 40px;
                padding: 30px;
                background: #fff;
                border: 1px solid #e5e7eb;
                border-radius: 16px;
                transition: box-shadow 0.2s;
            }

            .font-row:hover {
                box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08);
            }

            .logo-section {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .logo-brand {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .logo-icon {
            width: 36px;
            height: 36px;
            object-fit: contain;
        }

            .logo-text {
                font-size: 36px;
                font-weight: 600;
                color: #1f2937;
            }

            .lorem-text {
                font-size: 15px;
                line-height: 1.6;
                color: #4b5563;
                max-width: 600px;
            }

            .font-info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 12px;
                padding-left: 30px;
                border-left: 2px solid #f0f0f0;
            }

            .font-name {
                font-family: "Inter", sans-serif;
                font-size: 20px;
                font-weight: 600;
                color: #111827;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .font-details {
                font-family: "Inter", sans-serif;
                font-size: 13px;
                color: #6b7280;
            }

            .font-category {
                font-family: "Inter", sans-serif;
                font-size: 12px;
                color: #9ca3af;
            }

            /* Individual font families */
            .font-dm-sans .logo-text,
            .font-dm-sans .lorem-text {
                font-family: "DM Sans", sans-serif;
            }

            .font-inter .logo-text,
            .font-inter .lorem-text {
                font-family: "Inter", sans-serif;
            }

            .font-nunito .logo-text,
            .font-nunito .lorem-text {
                font-family: "Nunito Sans", sans-serif;
            }

            .font-outfit .logo-text,
            .font-outfit .lorem-text {
                font-family: "Outfit", sans-serif;
            }

            .font-jakarta .logo-text,
            .font-jakarta .lorem-text {
                font-family: "Plus Jakarta Sans", sans-serif;
            }

            .font-poppins .logo-text,
            .font-poppins .lorem-text {
                font-family: "Poppins", sans-serif;
            }

            .font-lexend .logo-text,
            .font-lexend .lorem-text {
                font-family: "Lexend", sans-serif;
            }

            .font-sora .logo-text,
            .font-sora .lorem-text {
                font-family: "Sora", sans-serif;
            }

            .font-manrope .logo-text,
            .font-manrope .lorem-text {
                font-family: "Manrope", sans-serif;
            }

            .font-urbanist .logo-text,
            .font-urbanist .lorem-text {
                font-family: "Urbanist", sans-serif;
            }

            /* System fonts */
            .font-arial .logo-text,
            .font-arial .lorem-text {
                font-family: Arial, sans-serif;
            }

            .font-system .logo-text,
            .font-system .lorem-text {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                    Roboto, Helvetica, Arial, sans-serif;
            }

            @media (max-width: 900px) {
                .font-row {
                    grid-template-columns: 1fr;
                }

                .font-info {
                    border-left: none;
                    border-top: 2px solid #f0f0f0;
                    padding-left: 0;
                    padding-top: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🔤 Linkea - Test de Fuentes para Logo v2</h1>
            <p>
                Compara cómo se ve el logo con diferentes tipografías para
                elegir la mejor opción
            </p>
        </div>

        <div class="legend">
            <div class="legend-item">
                <span class="badge badge-panel">PANEL V2</span>
                <span>Fuente del Panel Inertia actual</span>
            </div>
            <div class="legend-item">
                <span class="badge badge-email">EMAIL</span>
                <span>Fuente usada en emails</span>
            </div>
            <div class="legend-item">
                <span class="badge badge-legacy">LEGACY</span>
                <span>Fuente del Panel Angular anterior</span>
            </div>
            <div class="legend-item">
                <span class="badge badge-new">NUEVA</span>
                <span>Opción nueva para considerar</span>
            </div>
        </div>

        <div class="font-grid">
            <!-- 1. DM Sans (Panel V2 - Fuente principal actual) -->
            <div class="font-row font-dm-sans">
                <div class="logo-section">
                    <div class="logo-brand">
                        <img
                            src="/images/logos/logo-icon.webp"
                            alt="Linkea Icon"
                            class="logo-icon"
                        />
                        <span class="logo-text">Linkea</span>
                    </div>
                    <p class="lorem-text">
                        Crea tu página de enlaces personalizada en minutos.
                        Comparte todos tus contenidos, redes sociales y
                        proyectos en un solo lugar. La forma más fácil de
                        conectar con tu audiencia.
                    </p>
                </div>
                <div class="font-info">
                    <div class="font-name">
                        DM Sans
                        <span class="badge badge-panel">PANEL V2</span>
                    </div>
                    <div class="font-details">
                        Google Fonts • Sans-serif geométrica
                    </div>
                    <div class="font-category">
                        Fuente principal del panel Inertia/React actual
                        (--font-sans)
                    </div>
                </div>
            </div>

            <!-- 2. Inter (Panel V2 - Body) -->
            <div class="font-row font-inter">
                <div class="logo-section">
                    <div class="logo-brand">
                        <img
                            src="/images/logos/logo-icon.webp"
                            alt="Linkea Icon"
                            class="logo-icon"
                        />
                        <span class="logo-text">Linkea</span>
                    </div>
                    <p class="lorem-text">
                        Crea tu página de enlaces personalizada en minutos.
                        Comparte todos tus contenidos, redes sociales y
                        proyectos en un solo lugar. La forma más fácil de
                        conectar con tu audiencia.
                    </p>
                </div>
                <div class="font-info">
                    <div class="font-name">
                        Inter
                        <span class="badge badge-panel">PANEL V2</span>
                    </div>
                    <div class="font-details">
                        Google Fonts • Sans-serif versátil
                    </div>
                    <div class="font-category">
                        Fuente de texto del panel Inertia/React actual
                        (--font-body)
                    </div>
                </div>
            </div>

            <!-- 3. Arial (Email) -->
            <div class="font-row font-arial">
                <div class="logo-section">
                    <div class="logo-brand">
                        <img
                            src="/images/logos/logo-icon.webp"
                            alt="Linkea Icon"
                            class="logo-icon"
                        />
                        <span class="logo-text">Linkea</span>
                    </div>
                    <p class="lorem-text">
                        Crea tu página de enlaces personalizada en minutos.
                        Comparte todos tus contenidos, redes sociales y
                        proyectos en un solo lugar. La forma más fácil de
                        conectar con tu audiencia.
                    </p>
                </div>
                <div class="font-info">
                    <div class="font-name">
                        Arial
                        <span class="badge badge-email">EMAIL</span>
                    </div>
                    <div class="font-details">Sistema • Sans-serif clásica</div>
                    <div class="font-category">
                        Fuente actual de los emails (web-safe)
                    </div>
                </div>
            </div>

            <!-- 4. Nunito Sans (Legacy) -->
            <div class="font-row font-nunito">
                <div class="logo-section">
                    <div class="logo-brand">
                        <img
                            src="/images/logos/logo-icon.webp"
                            alt="Linkea Icon"
                            class="logo-icon"
                        />
                        <span class="logo-text">Linkea</span>
                    </div>
                    <p class="lorem-text">
                        Crea tu página de enlaces personalizada en minutos.
                        Comparte todos tus contenidos, redes sociales y
                        proyectos en un solo lugar. La forma más fácil de
                        conectar con tu audiencia.
                    </p>
                </div>
                <div class="font-info">
                    <div class="font-name">
                        Nunito Sans
                        <span class="badge badge-legacy">LEGACY</span>
                    </div>
                    <div class="font-details">
                        Google Fonts • Sans-serif redondeada
                    </div>
                    <div class="font-category">
                        Fuente del panel Angular anterior (legacy admin)
                    </div>
                </div>
            </div>

            <!-- 5. Outfit (Nueva) -->
            <div class="font-row font-outfit">
                <div class="logo-section">
                    <div class="logo-brand">
                        <img
                            src="/images/logos/logo-icon.webp"
                            alt="Linkea Icon"
                            class="logo-icon"
                        />
                        <span class="logo-text">Linkea</span>
                    </div>
                    <p class="lorem-text">
                        Crea tu página de enlaces personalizada en minutos.
                        Comparte todos tus contenidos, redes sociales y
                        proyectos en un solo lugar. La forma más fácil de
                        conectar con tu audiencia.
                    </p>
                </div>
                <div class="font-info">
                    <div class="font-name">
                        Outfit
                        <span class="badge badge-new">NUEVA</span>
                    </div>
                    <div class="font-details">
                        Google Fonts • Sans-serif geométrica moderna
                    </div>
                    <div class="font-category">
                        Opción nueva - Excelente para branding tech
                    </div>
                </div>
            </div>

            <!-- 6. Plus Jakarta Sans (Nueva) -->
            <div class="font-row font-jakarta">
                <div class="logo-section">
                    <div class="logo-brand">
                        <img
                            src="/images/logos/logo-icon.webp"
                            alt="Linkea Icon"
                            class="logo-icon"
                        />
                        <span class="logo-text">Linkea</span>
                    </div>
                    <p class="lorem-text">
                        Crea tu página de enlaces personalizada en minutos.
                        Comparte todos tus contenidos, redes sociales y
                        proyectos en un solo lugar. La forma más fácil de
                        conectar con tu audiencia.
                    </p>
                </div>
                <div class="font-info">
                    <div class="font-name">
                        Plus Jakarta Sans
                        <span class="badge badge-new">NUEVA</span>
                    </div>
                    <div class="font-details">
                        Google Fonts • Sans-serif elegante
                    </div>
                    <div class="font-category">
                        Opción nueva - Popular en diseños premium
                    </div>
                </div>
            </div>

            <!-- 7. Poppins (Nueva) -->
            <div class="font-row font-poppins">
                <div class="logo-section">
                    <div class="logo-brand">
                        <img
                            src="/images/logos/logo-icon.webp"
                            alt="Linkea Icon"
                            class="logo-icon"
                        />
                        <span class="logo-text">Linkea</span>
                    </div>
                    <p class="lorem-text">
                        Crea tu página de enlaces personalizada en minutos.
                        Comparte todos tus contenidos, redes sociales y
                        proyectos en un solo lugar. La forma más fácil de
                        conectar con tu audiencia.
                    </p>
                </div>
                <div class="font-info">
                    <div class="font-name">
                        Poppins
                        <span class="badge badge-new">NUEVA</span>
                    </div>
                    <div class="font-details">
                        Google Fonts • Sans-serif geométrica
                    </div>
                    <div class="font-category">
                        Opción nueva - Muy popular en apps modernas
                    </div>
                </div>
            </div>

            <!-- 8. Lexend (Nueva) -->
            <div class="font-row font-lexend">
                <div class="logo-section">
                    <div class="logo-brand">
                        <img
                            src="/images/logos/logo-icon.webp"
                            alt="Linkea Icon"
                            class="logo-icon"
                        />
                        <span class="logo-text">Linkea</span>
                    </div>
                    <p class="lorem-text">
                        Crea tu página de enlaces personalizada en minutos.
                        Comparte todos tus contenidos, redes sociales y
                        proyectos en un solo lugar. La forma más fácil de
                        conectar con tu audiencia.
                    </p>
                </div>
                <div class="font-info">
                    <div class="font-name">
                        Lexend
                        <span class="badge badge-new">NUEVA</span>
                    </div>
                    <div class="font-details">
                        Google Fonts • Sans-serif optimizada
                    </div>
                    <div class="font-category">
                        Opción nueva - Diseñada para mejor legibilidad
                    </div>
                </div>
            </div>

            <!-- 9. Sora (Nueva) -->
            <div class="font-row font-sora">
                <div class="logo-section">
                    <div class="logo-brand">
                        <img
                            src="/images/logos/logo-icon.webp"
                            alt="Linkea Icon"
                            class="logo-icon"
                        />
                        <span class="logo-text">Linkea</span>
                    </div>
                    <p class="lorem-text">
                        Crea tu página de enlaces personalizada en minutos.
                        Comparte todos tus contenidos, redes sociales y
                        proyectos en un solo lugar. La forma más fácil de
                        conectar con tu audiencia.
                    </p>
                </div>
                <div class="font-info">
                    <div class="font-name">
                        Sora
                        <span class="badge badge-new">NUEVA</span>
                    </div>
                    <div class="font-details">
                        Google Fonts • Sans-serif única
                    </div>
                    <div class="font-category">
                        Opción nueva - Look fresco y tech
                    </div>
                </div>
            </div>

            <!-- 10. Manrope (Nueva) -->
            <div class="font-row font-manrope">
                <div class="logo-section">
                    <div class="logo-brand">
                        <img
                            src="/images/logos/logo-icon.webp"
                            alt="Linkea Icon"
                            class="logo-icon"
                        />
                        <span class="logo-text">Linkea</span>
                    </div>
                    <p class="lorem-text">
                        Crea tu página de enlaces personalizada en minutos.
                        Comparte todos tus contenidos, redes sociales y
                        proyectos en un solo lugar. La forma más fácil de
                        conectar con tu audiencia.
                    </p>
                </div>
                <div class="font-info">
                    <div class="font-name">
                        Manrope
                        <span class="badge badge-new">NUEVA</span>
                    </div>
                    <div class="font-details">
                        Google Fonts • Sans-serif semi-condensada
                    </div>
                    <div class="font-category">
                        Opción nueva - Profesional y moderna
                    </div>
                </div>
            </div>

            <!-- 11. Urbanist (Nueva - Bonus) -->
            <div class="font-row font-urbanist">
                <div class="logo-section">
                    <div class="logo-brand">
                        <img
                            src="/images/logos/logo-icon.webp"
                            alt="Linkea Icon"
                            class="logo-icon"
                        />
                        <span class="logo-text">Linkea</span>
                    </div>
                    <p class="lorem-text">
                        Crea tu página de enlaces personalizada en minutos.
                        Comparte todos tus contenidos, redes sociales y
                        proyectos en un solo lugar. La forma más fácil de
                        conectar con tu audiencia.
                    </p>
                </div>
                <div class="font-info">
                    <div class="font-name">
                        Urbanist
                        <span class="badge badge-new">NUEVA</span>
                    </div>
                    <div class="font-details">
                        Google Fonts • Sans-serif geométrica
                    </div>
                    <div class="font-category">
                        Opción nueva (bonus) - Elegante y abierta
                    </div>
                </div>
            </div>

            <!-- 12. System UI (Referencia) -->
            <div class="font-row font-system">
                <div class="logo-section">
                    <div class="logo-brand">
                        <img
                            src="/images/logos/logo-icon.webp"
                            alt="Linkea Icon"
                            class="logo-icon"
                        />
                        <span class="logo-text">Linkea</span>
                    </div>
                    <p class="lorem-text">
                        Crea tu página de enlaces personalizada en minutos.
                        Comparte todos tus contenidos, redes sociales y
                        proyectos en un solo lugar. La forma más fácil de
                        conectar con tu audiencia.
                    </p>
                </div>
                <div class="font-info">
                    <div class="font-name">
                        System UI
                        <span class="badge badge-email">EMAIL</span>
                    </div>
                    <div class="font-details">
                        Sistema operativo • Fallback stack
                    </div>
                    <div class="font-category">
                        Stack de sistema: San Francisco (macOS), Segoe UI
                        (Windows)
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
