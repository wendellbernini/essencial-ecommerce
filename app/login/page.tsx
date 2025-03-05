import { AuthForm } from "../../components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{" "}
            <a
              href="#"
              className="font-medium text-orange-500 hover:text-orange-600"
            >
              crie uma conta gratuita
            </a>
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
