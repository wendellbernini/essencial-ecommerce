export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Página não encontrada
      </h2>
      <p className="text-gray-500 text-center max-w-md mb-8">
        A página que você está procurando não existe ou foi movida.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        Voltar para a página inicial
      </a>
    </div>
  );
}
