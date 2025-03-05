import { AuthForm } from "../../components/auth/AuthForm";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full max-w-[480px] mx-4">
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-8">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/images/logo_name.png"
              alt="Essencial"
              width={140}
              height={43}
              priority
            />
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900">Entrar</h2>
          <p className="mt-2 text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="text-[#4285f4] hover:text-[#2b6bda] font-medium"
            >
              Registre-se
            </Link>
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
