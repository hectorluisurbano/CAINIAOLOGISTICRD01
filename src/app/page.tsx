import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-bold text-yale-blue mb-2">Bienvenido a CAINAO SHIPPING</h2>
        <p className="text-slate-600 max-w-2xl">
          Tu plataforma integral para la gestión logística entre República Dominicana y China.
          Controla tus envíos, almacén virtual y servicios offshore en un solo lugar.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-cinnabar transition-colors">
          <h3 className="text-xl font-semibold mb-2">Envíos Activos</h3>
          <p className="text-4xl font-bold text-cinnabar">0</p>
          <p className="text-sm text-slate-500 mt-2">No tienes envíos en curso actualmente.</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-cinnabar transition-colors">
          <h3 className="text-xl font-semibold mb-2">Almacén Virtual</h3>
          <p className="text-4xl font-bold text-yale-blue">0</p>
          <p className="text-sm text-slate-500 mt-2">Artículos pendientes de consolidación.</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-cinnabar transition-colors">
          <h3 className="text-xl font-semibold mb-2">Saldo Billetera</h3>
          <p className="text-4xl font-bold text-green-600">$0.00</p>
          <p className="text-sm text-slate-500 mt-2">Disponible para pagos de servicios.</p>
        </div>
      </div>

      <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
        <h3 className="text-2xl font-bold mb-4">Acciones Rápidas</h3>
        <div className="flex flex-wrap gap-4">
          <Button className="h-12 px-8 text-lg bg-cinnabar hover:bg-cinnabar/90">
            Nuevo Envío
          </Button>
          <Button className="h-12 px-8 text-lg bg-yale-blue hover:bg-yale-blue/90">
            Solicitar Offshore
          </Button>
          <Button variant="outline" className="h-12 px-8 text-lg border-mikado-yellow text-yale-blue hover:bg-mikado-yellow/10">
            Recargar Billetera
          </Button>
        </div>
      </section>
    </div>
  );
}
