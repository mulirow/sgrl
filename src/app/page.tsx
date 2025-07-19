import Header from "@/components/Header";

// ANTES DE RODAR

// baixar .env
// npm install
// npx prisma generate
// npx prisma db push

// RODAR:

// npm run dev

// Antes do comit

// npm run lint
// npm run build


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Header rota="/login" user="" />
    </div>
  );
}
