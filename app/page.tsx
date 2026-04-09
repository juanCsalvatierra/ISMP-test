"use client";
import Link from "next/link";

const HomePage = () => {
  return (
    <main>
      <h1 className="text-center py-10 text-3xl">Pruebas ISMP Anatomy</h1>
      <div className="w-full h-full p-5 flex flex-col place-items-center place-content-center gap-5">
        <h2 className="text-2xl">Modelos 3D</h2>
        <ul className="text-center flex flex-col gap-3">
          <li className="hover:text-amber-500 transition-all duration-300 ease-in-out"><Link href="/skeleton">Esqueleto y cartilagos</Link></li>
          <li className="hover:text-amber-500 transition-all duration-300 ease-in-out"><Link href="/muscles">Musculos</Link></li>
          <li className="hover:text-amber-500 transition-all duration-300 ease-in-out"><Link href="/organs">Organos</Link></li>
        </ul>
      </div>
    </main>
  );
};

export default HomePage;
