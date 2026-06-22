export function CalendarSection() {
  const year = 2026;
  const month = 7;
  const day = 18;

  const weddingDate = new Date(year, month - 1, day);
  const monthName = new Intl.DateTimeFormat('es-MX', { month: 'long' }).format(weddingDate);

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

  return (
    <div className="inline-block glass-card p-6 md:p-8 rounded-sm mx-auto">
      <div className="text-center mb-4">
        <p className="font-serif text-2xl text-olive-700 capitalize">{monthName}</p>
        <p className="text-slate-400 text-xs tracking-[0.15em] uppercase">{year}</p>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((d) => (
          <div key={d} className="text-[10px] text-slate-400 tracking-[0.1em] uppercase py-1">
            {d}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((d) => (
          <div
            key={d}
            className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-sm rounded-sm transition-colors ${
              d === day
                ? 'bg-olive-600 text-white font-bold shadow-lg shadow-olive-600/40 scale-110'
                : 'text-slate-600 hover:bg-olive-100'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-olive-600 text-xs font-medium mt-1">7:00 PM · Llegada de invitados</p>
      </div>
    </div>
  );
}
