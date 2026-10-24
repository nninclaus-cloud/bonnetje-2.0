import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: TrafficLegalLanding,
});

export function TrafficLegalLanding() {
  // Calculator state
  const [violationType, setViolationType] = useState<"speed" | "alcohol" | "phone" | "redlight">("speed");
  const [speedZone, setSpeedZone] = useState<"city" | "highway">("city");
  const [speedExcess, setSpeedExcess] = useState<number>(35);
  const [alcoholLevel, setAlcoholLevel] = useState<string>("0.40");
  const [isNoviceDriver, setIsNoviceDriver] = useState<boolean>(false);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [courtCity, setCourtCity] = useState("Antwerpen");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Strafmaat berekening conform Belgische Wegcode & Politierechtbanktarieven
  const calculateSanction = () => {
    let fineMin = 80;
    let fineMax = 400;
    let suspensionMin = 0;
    let suspensionMax = 0;
    let mandatoryExam = false;

    if (violationType === "speed") {
      if (speedZone === "city") {
        if (speedExcess > 30) {
          fineMin = 160;
          fineMax = 2000;
          suspensionMin = 8;
          suspensionMax = 180;
          if (isNoviceDriver) mandatoryExam = true;
        } else if (speedExcess > 20) {
          fineMin = 110;
          fineMax = 500;
          suspensionMin = 0;
          suspensionMax = 30;
        }
      } else {
        if (speedExcess > 40) {
          fineMin = 160;
          fineMax = 2000;
          suspensionMin = 8;
          suspensionMax = 180;
          if (isNoviceDriver) mandatoryExam = true;
        } else {
          fineMin = 110;
          fineMax = 400;
        }
      }
    } else if (violationType === "alcohol") {
      const level = parseFloat(alcoholLevel);
      if (level >= 0.65) {
        fineMin = 1600;
        fineMax = 16000;
        suspensionMin = 30;
        suspensionMax = 365;
        if (isNoviceDriver) mandatoryExam = true;
      } else if (level >= 0.35) {
        fineMin = 400;
        fineMax = 4000;
        suspensionMin = 8;
        suspensionMax = 90;
      } else {
        fineMin = 179;
        fineMax = 500;
      }
    } else if (violationType === "phone") {
      // 3e graads inbreuk
      fineMin = 174;
      fineMax = 2000;
      suspensionMin = isNoviceDriver ? 8 : 0;
      suspensionMax = 30;
      if (isNoviceDriver) mandatoryExam = true;
    } else if (violationType === "redlight") {
      fineMin = 174;
      fineMax = 2000;
      suspensionMin = 8;
      suspensionMax = 30;
      if (isNoviceDriver) mandatoryExam = true;
    }

    return { fineMin, fineMax, suspensionMin, suspensionMax, mandatoryExam };
  };

  const sanction = calculateSanction();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmitIntake = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadSuccess(true);
    setTimeout(() => {
      setIsUploadOpen(false);
      setUploadSuccess(false);
      setFiles([]);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Top Banner: Rechtszekerheid & Balie */}
      <div className="bg-[#121826] text-slate-300 text-[11px] py-2 px-4 text-center font-medium border-b border-slate-800">
        <span>Gerechtelijke verdediging conform art. 202 Verzekeringswet • Vrije keuze van advocaat • Vergoeding via uw rechtsbijstand</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#121826] flex items-center justify-center font-bold text-emerald-400 text-sm tracking-tight">
              P
            </div>
            <div className="leading-none">
              <span className="text-base font-extrabold tracking-tight text-[#121826]">
                POLITIE<span className="text-emerald-600">RECHT</span>.be
              </span>
              <span className="block text-[9px] font-semibold text-slate-400 tracking-wider uppercase">Verkeersverdediging</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="#calculator" className="text-xs font-semibold text-slate-600 hover:text-slate-900 hidden sm:block">
              Strafmaat berekenen
            </a>
            <a href="#werking" className="text-xs font-semibold text-slate-600 hover:text-slate-900 hidden sm:block">
              Kosteloze dekking?
            </a>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 bg-[#121826] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
            >
              Dagvaarding Uploaden
            </button>
          </div>
        </div>
      </header>

      {/* Hero Sectie */}
      <section className="pt-14 pb-16 px-4 sm:px-6 bg-linear-to-b from-white via-slate-50 to-slate-100/60 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            9 van de 10 autobestuurders hebben recht op kosteloze bijstand
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Dagvaarding ontvangen voor de{" "}
            <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy underline-offset-8">
              Politierechtbank?
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Uw autoverzekering dekt in bijna alle gevallen de kosten van een gespecialiseerd verkeersadvocaat integraal. Wij controleren direct uw polis en zorgen dat u er niet alleen voor staat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Dagvaarding Veilig Uploaden</span>
            </button>
            <a
              href="#calculator"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl border border-slate-300 transition text-center cursor-pointer"
            >
              Bereken eerst uw strafmaat
            </a>
          </div>

          {/* Drie vertrouwenspunten */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-900 block">100% Kosteloze Intake</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block leading-normal">
                Wij vragen de dekking op bij uw maatschappij (D.A.S., AXA, Baloise, etc.).
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-900 block">Vrije Keuze van Advocaat</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block leading-normal">
                U bent niet verplicht de advocaat van de verzekeraar te aanvaarden (art. 202 Verzekeringswet).
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-900 block">Rijbewijs Beschermen</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block leading-normal">
                Focus op vrijspraak, vermindering van geldboete of rijverbod enkel in het weekend.
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactieve Strafmaat Calculator */}
      <section id="calculator" className="py-14 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-900 text-white">
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400 block mb-1">
              Indicatieve Strafmaat Tool
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">Wat riskeert u bij de politierechter?</h2>
            <p className="text-xs text-slate-400 mt-1">
              Bereken de wettelijke geldboetes en rijverboden volgens de Belgische wegcode.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Overtreding Selectie */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Type Overtreding
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "speed", label: "Snelheid" },
                  { id: "alcohol", label: "Alcohol / Intoxicatie" },
                  { id: "phone", label: "GSM achter stuur" },
                  { id: "redlight", label: "Rood Verkeerslicht" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setViolationType(item.id as any)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                      violationType === item.id
                        ? "bg-[#121826] text-white border-[#121826]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Specifieke velden per overtreding */}
            {violationType === "speed" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Locatie</label>
                  <select
                    value={speedZone}
                    onChange={(e) => setSpeedZone(e.target.value as any)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 font-medium outline-none"
                  >
                    <option value="city">Bebouwde kom, zone 30 of schoolomgeving</option>
                    <option value="highway">Autosnelweg of ringweg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gecorrigeerde overtreding: <span className="font-bold text-emerald-700">+{speedExcess} km/u</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    step={1}
                    value={speedExcess}
                    onChange={(e) => setSpeedExcess(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 mt-2"
                  />
                </div>
              </div>
            )}

            {violationType === "alcohol" && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gemeten alcoholgehalte (mg/l uitgeademde alveolaire lucht)
                </label>
                <select
                  value={alcoholLevel}
                  onChange={(e) => setAlcoholLevel(e.target.value)}
                  className="w-full sm:w-1/2 text-xs bg-white border border-slate-300 rounded-lg p-2.5 font-medium outline-none"
                >
                  <option value="0.25">0,22 mg/l tot 0,35 mg/l (Lichte intoxicatie)</option>
                  <option value="0.40">0,35 mg/l tot 0,65 mg/l (Zware intoxicatie)</option>
                  <option value="0.75">Vanaf 0,65 mg/l of dronkenschap (Onmiddellijke intrekking)</option>
                </select>
              </div>
            )}

            {/* Beginnend bestuurder toggle */}
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
              <input
                type="checkbox"
                id="novice"
                checked={isNoviceDriver}
                onChange={(e) => setIsNoviceDriver(e.target.checked)}
                className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
              />
              <label htmlFor="novice" className="text-xs text-amber-900 font-medium cursor-pointer">
                <strong>Beginnend bestuurder?</strong> (U heeft uw definitief rijbewijs B minder dan 2 jaar)
              </label>
            </div>

            {/* Resultaat Card */}
            <div className="bg-slate-900 text-white p-5 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400 font-semibold uppercase">Wettelijke sanctiebandbreedte</span>
                {sanction.mandatoryExam && (
                  <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2.5 py-0.5 rounded font-bold">
                    Verplicht herstelexamen van toepassing
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block">Geschatte geldboete (incl. opdeciemen)</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    € {sanction.fineMin} – € {sanction.fineMax}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Mogelijk rijverbod</span>
                  <span className="text-2xl font-black font-mono text-white">
                    {sanction.suspensionMin === 0 ? "Niet verplicht (facultatief)" : `${sanction.suspensionMin} tot ${sanction.suspensionMax} dagen`}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                <p className="text-[11px] text-slate-400">
                  Een gespecialiseerd advocaat kan pleiten voor een lagere boete, uitstel van straf of weekendrijverbod.
                </p>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer"
                >
                  Regel Gratis Verdediging
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Hoe het werkt (3 stappen) */}
      <section id="werking" className="py-14 px-4 sm:px-6 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase">Proces</span>
            <h2 className="text-2xl font-extrabold text-slate-900">In 3 stappen naar een zorgeloze zitting</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-700 block">STAP 01</span>
              <h3 className="text-sm font-bold text-slate-900">Foto van de Dagvaarding</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fotografeer met uw smartphone het document dat u van de gerechtsdeurwaarder ontving en upload het via onze beveiligde tool.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-700 block">STAP 02</span>
              <h3 className="text-sm font-bold text-slate-900">Dekking Rechtsbijstand</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Wij vragen de bevestiging van dekking rechtstreeks op bij uw rechtsbijstandsverzekeraar. U betaalt zelf geen ereloon.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-700 block">STAP 03</span>
              <h3 className="text-sm font-bold text-slate-900">Verdediging ter Zitting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                De aangesloten advocaat bereidt uw dossier grondig voor en verschijnt voor de politierechter om uw rijbewijs te verdedigen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-slate-50">
        <p className="font-semibold text-slate-700">POLITIERECHT.be — Juridische bijstand voor de Belgische Politierechtbank</p>
        <p className="text-[11px] mt-1 text-slate-400">
          De juridische verdediging wordt uitsluitend gevoerd door erkende advocaten ingeschreven aan de Orde van Vlaamse Balies.
        </p>
      </footer>

      {/* MODAL: 60-Seconden Dagvaarding Upload */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-xl border border-slate-200 relative">
            
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                Snelle Intake • Vrije Advocaatkeuze
              </span>
              <h3 className="text-lg font-bold text-slate-900">Meld uw Dagvaarding Aan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Vul uw gegevens in en upload een foto van het voorblad. Wij controleren direct uw rechtsbijstandsdekking.
              </p>
            </div>

            {uploadSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-emerald-900">Dossier Goed Ontvangen</h4>
                <p className="text-xs text-emerald-700">
                  Wij nemen binnen 24 uur contact met u op om de dekking van uw autoverzekering te bevestigen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitIntake} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Naam & Voornaam</label>
                    <input
                      type="text"
                      required
                      placeholder="bv. Thomas Peeters"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">GSM / Telefoonnummer</label>
                    <input
                      type="tel"
                      required
                      placeholder="04xx xx xx xx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nummerplaat voertuig</label>
                    <input
                      type="text"
                      placeholder="bv. 1-ABC-123"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bevoegde Rechtbank</label>
                    <select
                      value={courtCity}
                      onChange={(e) => setCourtCity(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white outline-none"
                    >
                      <option value="Antwerpen">Politierechtbank Antwerpen</option>
                      <option value="Mechelen">Politierechtbank Mechelen</option>
                      <option value="Turnhout">Politierechtbank Turnhout</option>
                      <option value="Brussel">Politierechtbank Brussel</option>
                      <option value="Gent">Politierechtbank Gent</option>
                      <option value="Ander">Andere politierechtbank</option>
                    </select>
                  </div>
                </div>

                {/* Upload zone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Foto('s) van het gerechtsdeurwaardersexploot
                  </label>
                  <label className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer text-center">
                    <svg className="w-6 h-6 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs font-bold text-slate-800">Tik om foto te nemen of bestand te kiezen</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG of PDF tot 15MB</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {files.length > 0 && (
                    <div className="mt-2 text-xs text-emerald-700 font-medium">
                      ✓ {files.length} bestand(en) geselecteerd: {files.map(f => f.name).join(", ")}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">🔒 Volledig onder beroepsgeheim</span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#121826] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Verstuur naar Advocaat
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
