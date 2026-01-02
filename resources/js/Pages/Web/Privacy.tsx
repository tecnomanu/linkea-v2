import SEOHead from "@/Components/Shared/SEOHead";
import WebLayout from "@/Layouts/WebLayout";

export default function Privacy() {
    return (
        <WebLayout>
            {/* SEO for client-side navigation (server-side handled by withViewData in SystemRouterController) */}
            <SEOHead
                title="Politica de Privacidad - Linkea"
                description="Conoce nuestra politica de privacidad y como protegemos tus datos en Linkea."
                canonical="/privacy"
            />
            <div className="bg-neutral-50 py-12 px-6">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <div className="prose prose-neutral max-w-none space-y-6 text-neutral-700">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
                            POLÍTICA DE PRIVACIDAD — LINKEA
                        </h1>
                        <p>
                            <strong>Última actualización:</strong> 01/01/2026
                        </p>
                        <p>
                            En Linkea (en adelante, "Linkea", "nosotros" o la
                            "Plataforma") nos tomamos en serio la privacidad.
                            Esta Política explica qué datos personales
                            recopilamos, cómo los usamos, con quién los
                            compartimos y qué derechos tenés.
                        </p>
                        <ul>
                            <li>
                                <strong>Sitio:</strong>{" "}
                                <a
                                    href="https://www.linkea.ar"
                                    className="text-brand-500 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    www.linkea.ar
                                </a>
                            </li>
                            <li>
                                <strong>Contacto de privacidad:</strong>{" "}
                                <a
                                    href="mailto:hola@linkea.ar"
                                    className="text-brand-500 hover:underline"
                                >
                                    hola@linkea.ar
                                </a>
                            </li>
                            {/* <li>
                                <strong>Responsable del tratamiento:</strong>{" "}
                                <em>No disponible</em>
                            </li> */}
                        </ul>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            1) ALCANCE
                        </h2>
                        <p>
                            Esta Política aplica al uso de Linkea, incluyendo el
                            sitio web, tus páginas públicas de enlaces y
                            cualquier funcionalidad asociada (por ejemplo,
                            registro, edición de perfil, analíticas, soporte y
                            comunicaciones).
                        </p>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            2) DATOS PERSONALES QUE RECOPILAMOS
                        </h2>
                        <p>Según cómo uses Linkea, podemos recopilar:</p>
                        <h3 className="text-lg font-semibold mt-6 mb-2">
                            2.1. Datos que nos brindás
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>Cuenta y perfil:</strong> correo
                                electrónico, nombre/alias, foto de perfil,
                                biografía, enlaces que cargás, identificadores
                                públicos (por ejemplo, tu URL en Linkea), y
                                configuraciones que elijas.
                            </li>
                            <li>
                                <strong>Comunicaciones:</strong> consultas al
                                soporte, mensajes o reportes que nos envíes y el
                                contenido que incluyan.
                            </li>
                            <li>
                                <strong>Pagos</strong> (si hubiera funciones
                                pagas): datos necesarios para facturación. Los
                                datos de tarjeta suelen ser procesados por el
                                proveedor de pagos y no los almacenamos
                                completos.
                            </li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-6 mb-2">
                            2.2. Datos que se recopilan automáticamente
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>Datos técnicos:</strong> dirección IP,
                                tipo y versión de navegador, sistema operativo,
                                identificadores del dispositivo, configuración
                                de idioma y zona horaria aproximada.
                            </li>
                            <li>
                                <strong>Datos de uso:</strong> páginas
                                visitadas, clics, eventos de navegación,
                                fecha/hora de acceso, URLs de referencia, y
                                acciones dentro de la Plataforma.
                            </li>
                            <li>
                                <strong>
                                    Cookies y tecnologías similares:
                                </strong>{" "}
                                para funcionamiento, preferencias, medición y
                                mejora (ver sección 6).
                            </li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-6 mb-2">
                            2.3. Datos de terceros (si los conectás)
                        </h3>
                        <p>
                            Si vinculás servicios externos (por ejemplo,
                            analíticas, integraciones o plataformas de
                            terceros), podemos recibir ciertos datos según tu
                            configuración y las políticas de esos terceros.
                        </p>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            3) INFORMACIÓN PÚBLICA EN TU PÁGINA
                        </h2>
                        <p>
                            Linkea está pensada para compartir. La información
                            que publiques en tu página (por ejemplo, enlaces,
                            nombre visible, foto, bio u otros elementos que
                            configures como visibles) puede ser pública y
                            accesible para cualquiera con el enlace, y también
                            podría ser indexada por buscadores, salvo que Linkea
                            ofrezca y actives opciones de privacidad
                            específicas.
                        </p>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            4) PARA QUÉ USAMOS TUS DATOS (FINALIDADES)
                        </h2>
                        <p>Usamos los datos personales para:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>a)</strong> Prestar el servicio: crear y
                                administrar tu cuenta, permitirte
                                publicar/editar tu página y operar las funciones
                                de Linkea.
                            </li>
                            <li>
                                <strong>b)</strong> Seguridad y prevención de
                                abuso: detectar fraude, abuso, accesos no
                                autorizados, spam y proteger la integridad de la
                                Plataforma.
                            </li>
                            <li>
                                <strong>c)</strong> Soporte: responder
                                consultas, gestionar reclamos y brindarte
                                asistencia.
                            </li>
                            <li>
                                <strong>d)</strong> Mejora y desarrollo:
                                analizar uso agregado para mejorar rendimiento,
                                funcionalidades y experiencia (por ejemplo,
                                métricas y analíticas).
                            </li>
                            <li>
                                <strong>e)</strong> Comunicaciones operativas:
                                enviarte avisos importantes sobre tu cuenta,
                                cambios relevantes, seguridad o funcionamiento.
                            </li>
                            <li>
                                <strong>f)</strong> Marketing (opcional):
                                enviarte novedades o contenido promocional si te
                                suscribís o lo consentís. Podés darte de baja
                                cuando quieras.
                            </li>
                        </ul>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            5) BASES LEGALES PARA EL TRATAMIENTO
                        </h2>
                        <p>Tratamos datos personales cuando:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Es necesario para ejecutar la relación contigo
                                (por ejemplo, brindarte el servicio).
                            </li>
                            <li>
                                Tenemos un interés legítimo (por ejemplo,
                                seguridad, prevención de fraude, mejoras),
                                siempre respetando tus derechos.
                            </li>
                            <li>
                                Nos diste tu consentimiento (por ejemplo,
                                newsletter o cookies no esenciales donde
                                aplique).
                            </li>
                            <li>
                                Debemos cumplir obligaciones legales o responder
                                requerimientos de autoridad competente.
                            </li>
                        </ul>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            6) COOKIES Y TECNOLOGÍAS SIMILARES
                        </h2>
                        <p>Podemos usar cookies/tecnologías similares para:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>Esenciales:</strong> necesarias para que
                                el sitio funcione.
                            </li>
                            <li>
                                <strong>Preferencias:</strong> recordar
                                configuraciones.
                            </li>
                            <li>
                                <strong>Medición/analítica:</strong> entender
                                uso y rendimiento.
                            </li>
                            <li>
                                <strong>Marketing</strong> (si aplica): medir
                                campañas o personalizar comunicaciones.
                            </li>
                        </ul>
                        <p>
                            Podés gestionar cookies desde tu navegador y, cuando
                            corresponda, desde el mecanismo de consentimiento
                            que ofrezca el sitio.
                        </p>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            7) CON QUIÉN COMPARTIMOS TUS DATOS
                        </h2>
                        <p>
                            No vendemos tus datos personales. Podemos
                            compartirlos:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>a) Proveedores ("encargados"):</strong>{" "}
                                hosting, almacenamiento, analítica, envío de
                                emails, soporte, monitoreo y seguridad, bajo
                                acuerdos de confidencialidad y con el objetivo
                                de prestar el servicio.
                            </li>
                            <li>
                                <strong>b) Proveedor de pagos</strong> (si
                                aplica): para procesar cobros y prevención de
                                fraude.
                            </li>
                            <li>
                                <strong>c) Cumplimiento legal:</strong> si una
                                ley, orden judicial o autoridad competente lo
                                requiere.
                            </li>
                            <li>
                                <strong>d) Operaciones corporativas:</strong> en
                                caso de reorganización, fusión o transferencia
                                del negocio (respetando esta Política y la
                                normativa aplicable).
                            </li>
                        </ul>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            8) TRANSFERENCIAS INTERNACIONALES
                        </h2>
                        <p>
                            Es posible que algunos proveedores procesen datos
                            desde otros países. En esos casos, adoptamos medidas
                            razonables para protegerlos y, cuando corresponda
                            (por ejemplo, para datos sujetos a normativa
                            europea), se utilizan salvaguardas como cláusulas
                            contractuales tipo u otros mecanismos reconocidos.
                        </p>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            9) PLAZOS DE CONSERVACIÓN
                        </h2>
                        <p>Conservamos tus datos:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Mientras tu cuenta esté activa, para prestarte
                                el servicio.
                            </li>
                            <li>
                                Luego de la baja/eliminación, durante el tiempo
                                necesario para: (i) cumplir obligaciones
                                legales, (ii) resolver disputas, (iii) hacer
                                valer acuerdos, y (iv) mantener seguridad e
                                integridad (por ejemplo, logs).
                            </li>
                            <li>
                                Copias de respaldo pueden persistir por períodos
                                acotados hasta su rotación. Cuando es posible,
                                los datos se eliminan o se
                                anonimiza/seudonimiza.
                            </li>
                        </ul>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            10) SEGURIDAD DE LA INFORMACIÓN
                        </h2>
                        <p>
                            Aplicamos medidas técnicas y organizativas
                            razonables para proteger los datos (por ejemplo,
                            controles de acceso, monitoreo, buenas prácticas de
                            infraestructura). Aun así, ningún sistema es 100%
                            infalible; por eso, si detectamos un incidente
                            relevante, actuaremos para mitigarlo y, cuando
                            corresponda, informarlo.
                        </p>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            11) TUS DERECHOS (ARGENTINA)
                        </h2>
                        <p>
                            Si estás en Argentina, la Ley 25.326 reconoce, entre
                            otros, los derechos de acceso, rectificación,
                            actualización y supresión de tus datos personales.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>Derecho de acceso:</strong> podés
                                solicitar qué datos tenemos sobre vos y su
                                tratamiento.
                            </li>
                            <li>
                                <strong>
                                    Rectificación/actualización/supresión:
                                </strong>{" "}
                                podés pedir correcciones o eliminación cuando
                                corresponda.
                            </li>
                        </ul>
                        <p>
                            Para ejercerlos, escribinos a{" "}
                            <a
                                href="mailto:hola@linkea.ar"
                                className="text-brand-500 hover:underline"
                            >
                                hola@linkea.ar
                            </a>{" "}
                            con el asunto "Datos personales" e indicá tu
                            solicitud. Podemos pedirte información para
                            verificar identidad.
                        </p>
                        <p>
                            Plazos orientativos según normativa y guías
                            públicas: el acceso debe atenderse dentro de los
                            plazos legales aplicables (comúnmente dentro de 10
                            días desde la solicitud) y las solicitudes de
                            rectificación/actualización/supresión dentro de
                            plazos breves (comúnmente 5 días hábiles), según el
                            caso.
                        </p>
                        <p>
                            <strong>Autoridad de control:</strong> la{" "}
                            <a
                                href="https://www.argentina.gob.ar/aaip"
                                className="text-brand-500 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA
                                (AAIP)
                            </a>{" "}
                            es el órgano de control de la Ley 25.326. Si
                            considerás que tus derechos no fueron atendidos,
                            podés presentar un reclamo/denuncia ante la AAIP.
                        </p>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            12) TUS DERECHOS (EEE / REINO UNIDO / SUIZA) — SI
                            APLICA
                        </h2>
                        <p>
                            Si te encontrás en el Espacio Económico Europeo,
                            Reino Unido o Suiza, y la normativa te resulta
                            aplicable, podés tener derechos como: acceso,
                            rectificación, supresión, oposición, limitación del
                            tratamiento, portabilidad y a no ser objeto de
                            decisiones automatizadas en ciertos supuestos. Para
                            ejercerlos, contactanos en{" "}
                            <a
                                href="mailto:hola@linkea.ar"
                                className="text-brand-500 hover:underline"
                            >
                                hola@linkea.ar
                            </a>
                            .
                        </p>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            13) MENORES DE EDAD
                        </h2>
                        <p>
                            Linkea no está dirigida a menores de 13 años. Si sos
                            madre/padre o representante y creés que un menor nos
                            brindó datos personales, escribinos para
                            gestionarlo.
                        </p>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            14) ENLACES A SITIOS DE TERCEROS
                        </h2>
                        <p>
                            Tu página puede incluir enlaces a sitios o servicios
                            de terceros. No controlamos sus prácticas de
                            privacidad. Te recomendamos revisar sus políticas.
                        </p>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            15) CAMBIOS A ESTA POLÍTICA
                        </h2>
                        <p>
                            Podemos actualizar esta Política para reflejar
                            cambios en el servicio o requisitos legales.
                            Publicaremos la versión vigente en el sitio y
                            actualizaremos la fecha al inicio.
                        </p>
                        <h2 className="text-xl font-bold text-neutral-900 mt-8">
                            16) CONTACTO
                        </h2>
                        <p>
                            Para consultas o solicitudes sobre privacidad:{" "}
                            <a
                                href="mailto:hola@linkea.ar"
                                className="text-brand-500 hover:underline"
                            >
                                hola@linkea.ar
                            </a>
                        </p>
                        <ul>
                            {/* <li>
                                <strong>Responsable:</strong>{" "}
                                <em>No disponible</em>
                            </li>
                            <li>
                                <strong>Dirección:</strong>{" "}
                                <em>No disponible</em>
                            </li> */}
                            <li>
                                <strong>Ciudad / País:</strong>{" "}
                                <em>San Carlos de Bariloche, Argentina</em>
                            </li>
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t border-neutral-200 text-center">
                        <a
                            href="https://linkea.ar"
                            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                        >
                            Linkea {new Date().getFullYear()}
                        </a>
                    </div>
                </div>
            </div>
        </WebLayout>
    );
}
