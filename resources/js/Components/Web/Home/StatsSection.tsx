import { BarChart3, Link2, Users } from "lucide-react";

export default function StatsSection() {
    const stats = [
        {
            icon: Users,
            value: "500+",
            label: "Usuarios activos",
            color: "from-primary-500 to-orange-500",
        },
        {
            icon: Link2,
            value: "2.5K+",
            label: "Bloques creados",
            color: "from-violet-500 to-purple-500",
        },
        {
            icon: BarChart3,
            value: "50K+",
            label: "Clicks totales",
            color: "from-emerald-500 to-teal-500",
        },
    ];

    return (
        <section className="relative z-20 -mt-12 mb-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="group relative bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div
                                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}
                            >
                                <stat.icon className="text-white" size={24} />
                            </div>
                            <div className="text-4xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-gray-500 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
