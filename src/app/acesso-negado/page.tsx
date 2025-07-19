import Link from 'next/link';

export default function AcessoNegado() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
            <p className="text-lg mb-6">
                Você não tem permissão para acessar esta página.
            </p>
            <Link href="/" className="text-blue-500 hover:underline">
                Voltar à Homepage
            </Link>
        </div>
    );
}