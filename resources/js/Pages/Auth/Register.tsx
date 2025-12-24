import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Get started with your free account today"
        >
            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        id="first_name"
                        type="text"
                        label="Name"
                        value={data.first_name}
                        onChange={(e) => setData("first_name", e.target.value)}
                        autoFocus
                        error={errors.first_name}
                    />

                    <Input
                        id="last_name"
                        type="text"
                        label="Last Name"
                        value={data.last_name}
                        onChange={(e) => setData("last_name", e.target.value)}
                        error={errors.last_name}
                    />
                </div>

                <Input
                    id="username"
                    type="text"
                    label="Username"
                    value={data.username}
                    onChange={(e) => setData("username", e.target.value)}
                    error={errors.username}
                />

                <Input
                    id="email"
                    type="email"
                    label="Email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    error={errors.email}
                />

                <Input
                    id="password"
                    type="password"
                    label="Password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    error={errors.password}
                />

                <Input
                    id="password_confirmation"
                    type="password"
                    label="Confirm Password"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    error={errors.password_confirmation}
                />

                <div className="flex items-center justify-end">
                    <Link
                        href={route("login")}
                        className="underline text-sm text-neutral-500 dark:text-neutral-400 hover:text-brand-500 rounded-md transition-colors"
                    >
                        Already registered?
                    </Link>
                </div>

                <Button
                    className="w-full text-base py-6 rounded-2xl"
                    isLoading={processing}
                >
                    Register
                </Button>
            </form>
        </AuthLayout>
    );
}
