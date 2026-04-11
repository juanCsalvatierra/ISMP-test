"use client";
import Link from "next/link";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <h1 className="ui-title text-center py-10 text-3xl font-semibold">Pruebas ISMP Anatomy</h1>
      <div className="w-full h-full p-5 flex flex-col place-items-center place-content-center gap-5">
        <h2 className="ui-title text-2xl font-medium">Modelos 3D</h2>
        <ul className="text-center flex flex-col gap-3 text-secondary">
          <li className="ui-link"><Link href="/skeleton">Esqueleto y cartilagos</Link></li>
          <li className="ui-link"><Link href="/muscles">Musculos</Link></li>
          <li className="ui-link"><Link href="/organs">Organos</Link></li>
        </ul>
      </div>
    </main>
  );
};

export default HomePage;
