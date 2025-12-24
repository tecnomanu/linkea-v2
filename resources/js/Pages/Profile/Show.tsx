import { Head } from "@inertiajs/react";

export default function Show({ slug }: { slug: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <Head title={`Linkea - ${slug}`} />
            <div className="text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-2">
                    {slug}
                </h1>
                <p>Perfil público de Linkea.</p>
            </div>
        </div>
    );
}
