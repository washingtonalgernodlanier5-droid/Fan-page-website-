import React, { useRef, useState } from 'react';
import { PassportData, SecurityOverlay } from '../types';
import { Check, ShieldAlert, Sparkles, AlertCircle, Eye, Lock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface MicroPrintBorderProps {
  id: string;
  text: string;
  showUv: boolean;
  isZoomed: boolean;
}

const MicroPrintBorder: React.FC<MicroPrintBorderProps> = ({ id, text, showUv, isZoomed }) => {
  return (
    <div className={`absolute left-0 right-0 bottom-0 h-[4px] overflow-hidden pointer-events-none select-none transition-all duration-300 ${isZoomed ? 'opacity-95 translate-y-[1px]' : 'opacity-40'}`}>
      <svg className="w-full h-full" viewBox="0 0 300 3" preserveAspectRatio="none">
        <path id={`mpPath-${id}`} d="M 0 1.5 H 300" fill="none" stroke="none" />
        <text 
          className={`font-mono text-[2.2px] font-black tracking-widest leading-none ${
            showUv ? 'fill-indigo-400 font-extrabold drop-shadow-[0_0_1px_rgba(129,140,248,0.7)]' : 'fill-amber-900/40'
          }`}
          letterSpacing="0.1px"
        >
          <textPath href={`#mpPath-${id}`} startOffset="0%">
            {text.toUpperCase().repeat(12)}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

interface PassportCardProps {
  data: PassportData;
  overlay: SecurityOverlay;
  onHoverHologram: (e: React.MouseEvent<HTMLDivElement>) => void;
  hologramPos: { x: number; y: number };
  onSelectQrCode?: () => void;
  onSelectNfcChip?: () => void;
}

export const PassportCard: React.FC<PassportCardProps> = ({
  data,
  overlay,
  onHoverHologram,
  hologramPos,
  onSelectQrCode,
  onSelectNfcChip
}) => {
  const bookletRef = useRef<HTMLDivElement>(null);

  // Generate Italian MRZ (Machine Readable Zone)
  const generateMRZ = () => {
    const cleanStr = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '<');
    
    // Line 1
    const surnameClean = cleanStr(data.surname);
    const givenClean = cleanStr(data.givenNames);
    let line1 = `P<ITA${surnameClean}<<${givenClean}`;
    line1 = line1.padEnd(44, '<').substring(0, 44);

    // Line 2
    const passNo = data.passportNumber.toUpperCase().padEnd(9, '<').substring(0, 9);
    const passCheck = "4"; 
    const nationality = "ITA";
    
    // Parse DOB DD/MM/YYYY to YYMMDD
    let dobFormatted = "970318"; 
    if (data.dateOfBirth) {
      const parts = data.dateOfBirth.split('/');
      if (parts.length === 3) {
        const yy = parts[2].substring(2);
        const mm = parts[1].padStart(2, '0');
        const dd = parts[0].padStart(2, '0');
        dobFormatted = `${yy}${mm}${dd}`;
      }
    }
    const dobCheck = "6";
    const sexChar = data.sex;
    
    // Parse Date of expiry to YYMMDD
    let expFormatted = "320610"; 
    if (data.dateOfExpiry) {
      const parts = data.dateOfExpiry.split('/');
      if (parts.length === 3) {
        const yy = parts[2].substring(2);
        const mm = parts[1].padStart(2, '0');
        const dd = parts[0].padStart(2, '0');
        expFormatted = `${yy}${mm}${dd}`;
      }
    }
    const expCheck = "8";
    const personalNo = data.personalNumber.toUpperCase().padEnd(14, '<').substring(0, 14);
    const finalCheck = "3";

    let line2 = `${passNo}${passCheck}ITA${dobFormatted}${dobCheck}${sexChar}${expFormatted}${expCheck}${personalNo}${finalCheck}`;
    line2 = line2.substring(0, 44);

    return { line1, line2 };
  };

  const { line1, line2 } = generateMRZ();
  const identityString = `IT-PASSPORT-VERIFY:SURNAME=${data.surname.toUpperCase()};GIVEN=${data.givenNames.toUpperCase()};NUM=${data.passportNumber.toUpperCase()};DOB=${data.dateOfBirth};SEX=${data.sex};EXP=${data.dateOfExpiry}`;

  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [isMagnifierHovered, setIsMagnifierHovered] = useState(false);
  const [bookletSize, setBookletSize] = useState({ width: 440, height: 620 });

  const renderPassportContent = (isZoomed = false) => {
    return (
      <div className={`flex flex-col h-full w-full relative transition-[background-color,border-color] duration-500 ${isZoomed ? 'zoomed-passport-mirror' : ''}`}>
        {/* Organic Security Fibers distributed randomly across the canvas */}
        {overlay.paperFiber && (
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none select-none z-10" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            {/* Fiber 1 */}
            <path d="M 12 15 Q 15 17 14 22" fill="none" stroke={overlay.showUvLight ? '#4ade80' : '#b45309'} strokeWidth={isZoomed ? "0.22" : "0.08"} opacity={overlay.showUvLight ? "0.8" : "0.22"} />
            {/* Fiber 2 */}
            <path d="M 85 24 Q 82 28 88 32" fill="none" stroke={overlay.showUvLight ? '#f43f5e' : '#1e3a8a'} strokeWidth={isZoomed ? "0.2" : "0.07"} opacity={overlay.showUvLight ? "0.85" : "0.25"} />
            {/* Fiber 3 */}
            <path d="M 45 68 Q 42 70 48 74" fill="none" stroke={overlay.showUvLight ? '#60a5fa' : '#b45309'} strokeWidth={isZoomed ? "0.24" : "0.08"} opacity={overlay.showUvLight ? "0.9" : "0.22"} />
            {/* Fiber 4 */}
            <path d="M 22 84 Q 25 80 28 85" fill="none" stroke={overlay.showUvLight ? '#4ade80' : '#1e3a8a'} strokeWidth={isZoomed ? "0.18" : "0.06"} opacity={overlay.showUvLight ? "0.8" : "0.24"} />
            {/* Fiber 5 */}
            <path d="M 74 55 Q 71 58 76 62" fill="none" stroke={overlay.showUvLight ? '#fb923c' : '#78350f'} strokeWidth={isZoomed ? "0.2" : "0.07"} opacity={overlay.showUvLight ? "0.85" : "0.25"} />
            {/* Fiber 6 */}
            <path d="M 38 40 Q 40 45 35 48" fill="none" stroke={overlay.showUvLight ? '#f43f5e' : '#b45309'} strokeWidth={isZoomed ? "0.22" : "0.08"} opacity={overlay.showUvLight ? "0.8" : "0.2"} />
          </svg>
        )}
        {/* UPPER PAGE: Details Page */}
        <div className="relative flex-1 p-6 flex flex-col justify-between overflow-hidden border-b border-dashed border-[#e6dcc5]">
          
          {/* Symmetrical Guilloche on Upper Page */}
          {overlay.showGuilloche && (
            <div 
              className="absolute inset-0 opacity-[0.14] pointer-events-none mix-blend-multiply bg-center bg-cover transition-opacity duration-300"
              style={{ backgroundImage: `url("/src/assets/images/guilloche_passport_pattern_1781217782586.jpg")` }}
            />
          )}

          {/* Upper Page Header */}
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h2 className={`text-[10px] font-black tracking-widest font-sans uppercase leading-none ${overlay.showUvLight ? 'text-indigo-400' : 'text-amber-950/90'}`}>
                REPUBBLICA ITALIANA
              </h2>
              <p className={`text-[8px] uppercase font-bold tracking-wider font-sans mt-0.5 ${overlay.showUvLight ? 'text-indigo-300/60' : 'text-amber-800/60'}`}>
                MINISTERO DELL'INTERNO / MINISTRY OF INTERIOR
              </p>
            </div>
            <div className="text-right flex items-center gap-2">
              <span className={`text-[8px] font-mono uppercase tracking-widest font-bold block ${overlay.showUvLight ? 'text-indigo-400' : 'text-amber-900/80'}`}>
                YA785
              </span>
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectNfcChip) onSelectNfcChip();
                }}
                className="w-7 h-5 bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 hover:from-amber-400 hover:to-yellow-300 rounded border border-amber-800/40 cursor-pointer p-0.5 shadow-sm transition-all duration-300 relative group"
                title="Scan Embedded Contactless NFC e-Chip"
              >
                <svg className="w-full h-full text-amber-950/80 stroke-current fill-none stroke-[0.8]" viewBox="0 0 10 10">
                  <rect x="2" y="2" width="6" height="6" rx="0.5" />
                  <line x1="2" y1="5" x2="8" y2="5" />
                  <line x1="5" y1="2" x2="5" y2="8" />
                  <circle cx="5" cy="5" r="1.5" />
                </svg>
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              </div>
            </div>
          </div>

          {/* Italian Republic Centered Coat of Arms Watermark */}
          {overlay.showWatermark && (
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300"
              style={{ opacity: isZoomed ? (overlay.watermarkOpacity !== undefined ? overlay.watermarkOpacity * 1.5 : 0.18) : (overlay.watermarkOpacity !== undefined ? overlay.watermarkOpacity : 0.10) }}
            >
              <div className="relative flex flex-col items-center justify-center">
                <svg className={`w-36 h-36 ${overlay.showUvLight ? 'text-indigo-400' : 'text-amber-950/80'}`} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" fill="none" strokeWidth={isZoomed ? "0.6" : "1.5"} strokeDasharray={isZoomed ? "1,0.5" : "none"} />
                  <polygon points="50,15 53,30 68,30 57,40 61,55 50,45 39,55 43,40 32,30 47,30" fill="currentColor" />
                  {isZoomed && (
                    <>
                      <circle cx="50" cy="50" r="35" stroke="currentColor" fill="none" strokeWidth="0.3" strokeDasharray="2,0.6" />
                      <circle cx="50" cy="50" r="26" stroke="currentColor" fill="none" strokeWidth="0.2" strokeDasharray="1,0.4" />
                    </>
                  )}
                </svg>
                {isZoomed && (
                  <span className="absolute bottom-6 text-[1.8px] font-mono font-bold tracking-widest text-[#78350f]/50 uppercase text-center select-none block leading-none">
                    * MINISTERO INTERNO * YA785 SPECIMEN *
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Primary Identity Info Fields (Details mainly) */}
          <div className="relative z-10 grid grid-cols-2 gap-y-3 gap-x-4 text-left mt-4 select-text">
            
            {/* Surname */}
            <div className="col-span-2 relative pb-1 border-b border-[#ebdcb8]/15">
              <span className={`block text-[7px] uppercase font-bold tracking-wide ${overlay.showUvLight ? 'text-indigo-400/80' : 'text-amber-900/60'}`}>
                1. Cognome / Surname
              </span>
              <span className={`block text-xs font-bold font-mono tracking-wider ${overlay.showUvLight ? 'text-indigo-200' : 'text-stone-850'}`}>
                {data.surname.toUpperCase()}
              </span>
              <MicroPrintBorder id="surname" text="COGNOME * SURNAME * ITALIA * REPUBBLICA ITALIANA * SPECIMEN * " showUv={overlay.showUvLight} isZoomed={isZoomed} />
            </div>

            {/* Given names */}
            <div className="col-span-2 relative pb-1 border-b border-[#ebdcb8]/15">
              <span className={`block text-[7px] uppercase font-bold tracking-wide ${overlay.showUvLight ? 'text-indigo-400/80' : 'text-amber-900/60'}`}>
                2. Nomi / Given Names
              </span>
              <span className={`block text-xs font-bold font-mono tracking-wider ${overlay.showUvLight ? 'text-indigo-200' : 'text-stone-850'}`}>
                {data.givenNames}
              </span>
              <MicroPrintBorder id="names" text="NOMI * GIVEN NAMES * REPUBBLICA ITALIANA * SPECIMEN * " showUv={overlay.showUvLight} isZoomed={isZoomed} />
            </div>

            {/* Nationality */}
            <div className="relative pb-1 border-b border-[#ebdcb8]/15">
              <span className={`block text-[7px] uppercase font-bold tracking-wide ${overlay.showUvLight ? 'text-indigo-400/80' : 'text-amber-900/60'}`}>
                3. Cittadinanza / Nationality
              </span>
              <span className={`block text-[11px] font-bold font-mono ${overlay.showUvLight ? 'text-indigo-200' : 'text-stone-850'}`}>
                {data.nationality.toUpperCase()}
              </span>
              <MicroPrintBorder id="nationality" text="CITTADINANZA * NATIONALITY * ITA * ITALIANO * " showUv={overlay.showUvLight} isZoomed={isZoomed} />
            </div>

            {/* Date of Birth */}
            <div className="relative pb-1 border-b border-[#ebdcb8]/15">
              <span className={`block text-[7px] uppercase font-bold tracking-wide ${overlay.showUvLight ? 'text-indigo-400/80' : 'text-amber-900/60'}`}>
                4. Data di nascita / Date of birth
              </span>
              <span className={`block text-[11px] font-bold font-mono ${overlay.showUvLight ? 'text-indigo-200' : 'text-stone-850'}`}>
                {data.dateOfBirth}
              </span>
              <MicroPrintBorder id="dob" text="DATA DI NASCITA * DATE OF BIRTH * ITA * " showUv={overlay.showUvLight} isZoomed={isZoomed} />
            </div>

            {/* Place of Birth */}
            <div className="relative pb-1 col-span-2 border-b border-[#ebdcb8]/15">
              <span className={`block text-[7px] uppercase font-bold tracking-wide ${overlay.showUvLight ? 'text-indigo-400/80' : 'text-amber-900/60'}`}>
                5. Luogo di nascita / Place of birth
              </span>
              <span className={`block text-[11px] font-bold font-mono tracking-wide ${overlay.showUvLight ? 'text-indigo-200' : 'text-stone-850'}`}>
                {data.placeOfBirth.toUpperCase()}
              </span>
              <MicroPrintBorder id="pob" text="LUOGO DI NASCITA * PLACE OF BIRTH * ITALIA * " showUv={overlay.showUvLight} isZoomed={isZoomed} />
            </div>

            {/* Sex */}
            <div>
              <span className={`block text-[7px] uppercase font-bold tracking-wide ${overlay.showUvLight ? 'text-indigo-400/80' : 'text-amber-900/60'}`}>
                6. Sesso / Sex
              </span>
              <span className={`block text-[11px] font-bold font-mono ${overlay.showUvLight ? 'text-indigo-200' : 'text-stone-850'}`}>
                {data.sex}
              </span>
            </div>

            {/* Physical Identity seal seal */}
            <div className="text-right flex items-end justify-end">
              <div className={`text-[6px] font-mono tracking-widest font-bold border border-dotted px-1.5 py-0.5 rounded ${overlay.showUvLight ? 'border-indigo-400/45 text-indigo-400' : 'border-amber-900/20 text-amber-800'}`}>
                ITA SPECIMEN
              </div>
            </div>

          </div>

          <div className="h-2" />
        </div>

        {/* BOOKLET SPINE: Middle Fold Sewn Binding thread representation */}
        <div className="h-3 relative bg-[#ece5cd] z-10 flex items-center justify-center border-y border-[#dfd4ba] shadow-inner select-none no-print">
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-white/10" />
          {/* Dotted thread seam lines */}
          <div className="w-full border-t border-dashed border-[#a39775] opacity-50" />
          <div className="absolute px-3 bg-[#e2d9b9] border border-[#beb18c] py-0.5 rounded-full text-[6px] font-mono tracking-widest text-[#73684b] uppercase font-bold scale-90">
            FLEXIBLE BINDING SPINE
          </div>
        </div>

        {/* LOWER PAGE: Biometric Portrait & Auxiliary Verification Details */}
        <div className="relative flex-1 p-6 pt-4 flex flex-col justify-between overflow-hidden">
          
          {/* Symmetrical Guilloche on Lower Page */}
          {overlay.showGuilloche && (
            <div 
              className="absolute inset-0 opacity-[0.14] pointer-events-none mix-blend-multiply bg-center bg-cover transition-opacity duration-300"
              style={{ backgroundImage: `url("/src/assets/images/guilloche_passport_pattern_1781217782586.jpg")` }}
            />
          )}

          {/* UV Background layout */}
          {overlay.showUvLight && (
            <div 
              className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_70%,_rgba(99,102,241,0.22)_0%,_rgba(0,0,0,0)_85%)] mix-blend-screen z-10 animate-pulse duration-[3000ms]"
              style={{ opacity: (overlay.uvIntensity ?? 100) / 100 }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <svg className="w-4/5 h-4/5 text-indigo-400 fill-none stroke-1" viewBox="0 0 100 100">
                  <polygon points="50,15 54,26 66,26 56,33 60,45 50,38 40,45 44,33 34,26 46,26" />
                  <path d="M15,50 Q50,90 85,50" />
                </svg>
              </div>
              <div className="absolute bottom-16 right-16 w-1.5 h-1.5 bg-green-400 rounded-full blur-[1px] animate-ping" />
              <div className="absolute top-10 left-20 w-1.5 h-1.5 bg-pink-500 rounded-full blur-[0.5px] animate-ping" />
            </div>
          )}

          {/* Interactive Metallic Foil Hologram on entire lower area */}
          {overlay.isHologramActive && !overlay.showUvLight && (
            <div 
              className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-90 overflow-hidden transition-all duration-300 hologram-overlay"
              style={{
                background: overlay.hologramPattern === 'hexagons'
                  ? `radial-gradient(circle 150px at ${hologramPos.x}px ${hologramPos.y - 120}px, rgba(16, 185, 129, 0.5) 0%, rgba(99, 102, 241, 0.3) 45%, rgba(236, 72, 153, 0.2) 75%, rgba(0,0,0,0) 100%)`
                  : overlay.hologramPattern === 'stripes'
                  ? `radial-gradient(circle 150px at ${hologramPos.x}px ${hologramPos.y - 120}px, rgba(234, 179, 8, 0.5) 0%, rgba(236, 72, 153, 0.3) 45%, rgba(59, 130, 246, 0.2) 75%, rgba(0,0,0,0) 100%)`
                  : `radial-gradient(circle 150px at ${hologramPos.x}px ${hologramPos.y - 120}px, rgba(236, 72, 153, 0.4) 0%, rgba(59, 130, 246, 0.3) 35%, rgba(16, 185, 129, 0.2) 60%, rgba(254, 240, 138, 0.08) 85%, rgba(0,0,0,0) 100%)`
              }}
            >
              {/* Secondary Spectral Rainbow Sweep Bar (Linear Parallax effect) */}
              <div 
                className="absolute inset-0 opacity-40 mix-blend-color-dodge pointer-events-none transition-transform duration-150 ease-out"
                style={{
                  background: `linear-gradient(${135 + (hologramPos.x - 200) * 0.08}deg, rgba(239, 68, 68, 0) 20%, rgba(239, 68, 68, 0.25) 35%, rgba(234, 179, 8, 0.25) 45%, rgba(16, 185, 129, 0.25) 55%, rgba(59, 130, 246, 0.25) 65%, rgba(139, 92, 246, 0) 80%)`,
                  transform: `translateX(${(hologramPos.x - 220) * 0.18}px)`
                }}
              />

              {/* Dynamic Micro-Pattern Layers with multi-velocity parallax shift */}
              {overlay.hologramPattern === 'hexagons' && (
                <div 
                  className="absolute inset-0 opacity-25 mix-blend-color-dodge transition-transform duration-150 ease-out"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='48.5' viewBox='0 0 28 48.5'%3E%3Cpath d='M0 0 L14 8 L28 0 L28 16 L14 24 L0 16 Z M0 24.25 L14 32.25 L28 24.25 L28 40.25 L14 48.25 L0 40.25 Z' fill='none' stroke='%23ffffff' stroke-width='0.4' stroke-opacity='0.6'/%3E%3C/svg%3E")`,
                    transform: `translate(${(hologramPos.x - 220) * -0.08}px, ${(hologramPos.y - 120) * -0.08}px)`
                  }}
                />
              )}

              {overlay.hologramPattern === 'stripes' && (
                <div 
                  className="absolute inset-0 opacity-30 mix-blend-color-dodge transition-transform duration-150 ease-out"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cline x1='0' y1='16' x2='16' y2='0' stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.5'/%3E%3Cline x1='0' y1='8' x2='8' y2='0' stroke='%23ffffff' stroke-width='0.4' stroke-opacity='0.4'/%3E%3Cline x1='8' y1='16' x2='16' y2='8' stroke='%23ffffff' stroke-width='0.4' stroke-opacity='0.4'/%3E%3C/svg%3E")`,
                    transform: `translate(${(hologramPos.x - 220) * -0.12}px, ${(hologramPos.y - 120) * -0.12}px)`
                  }}
                />
              )}

              {overlay.hologramPattern !== 'hexagons' && overlay.hologramPattern !== 'stripes' && (
                /* Concentric circular waves / seals for the default pattern */
                <div 
                  className="absolute inset-0 opacity-25 mix-blend-color-dodge transition-transform duration-150 ease-out"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='none' stroke='%23ffffff' stroke-width='0.3' stroke-opacity='0.4'/%3E%3Ccircle cx='20' cy='20' r='14' fill='none' stroke='%23ffffff' stroke-width='0.25' stroke-dasharray='1,2' stroke-opacity='0.5'/%3E%3Ccircle cx='20' cy='20' r='10' fill='none' stroke='%23ffffff' stroke-width='0.3' stroke-opacity='0.4'/%3E%3Ccircle cx='20' cy='20' r='6' fill='none' stroke='%23ffffff' stroke-width='0.2' stroke-opacity='0.5'/%3E%3C/svg%3E")`,
                    transform: `translate(${(hologramPos.x - 220) * -0.1}px, ${(hologramPos.y - 120) * -0.1}px)`
                  }}
                />
              )}

              {/* Floating holographic state crest seal translating positively (3D Depth Pop) */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen opacity-50 transition-transform duration-150 ease-out"
                style={{
                  transform: `translate(${(hologramPos.x - 220) * 0.08}px, ${(hologramPos.y - 120) * 0.08}px)`
                }}
              >
                <svg className="w-56 h-56 text-[#a7f3d0] stroke-current fill-none" viewBox="0 0 100 100">
                  <polygon points="50,15 54,32 72,32 58,42 63,58 50,48 37,58 42,42 28,32 46,32" strokeWidth="0.32" strokeOpacity="0.45" />
                  <circle cx="50" cy="42" r="32" strokeWidth="0.25" strokeDasharray="3,1.5" strokeOpacity="0.35" />
                  <circle cx="50" cy="42" r="24" strokeWidth="0.2" strokeOpacity="0.2" />
                  <path d="M 28,68 Q 50,88 72,68" strokeWidth="0.32" strokeOpacity="0.45" />
                </svg>
              </div>

              {/* Subtle metallic reflection lines moving at a fast factor */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none transition-transform duration-150 ease-out"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 10px)',
                  transform: `translate(${(hologramPos.x - 220) * 0.25}px, ${(hologramPos.y - 120) * 0.25}px)`
                }}
              />

              {/* Original secure text elements translated slightly for elegant 3D displacement */}
              <div 
                className="absolute inset-0 flex items-center justify-around text-white/10 text-[7.5px] font-bold tracking-widest uppercase py-10 select-none transition-transform duration-150 ease-out"
                style={{
                  transform: `translate(${(hologramPos.x - 220) * 0.04}px, ${(hologramPos.y - 120) * 0.04}px)`
                }}
              >
                <span className="transform rotate-12">{overlay.hologramPattern === 'hexagons' ? 'HEX_CRYSTAL_OVD' : overlay.hologramPattern === 'stripes' ? 'STRIPE_OVD_FILM' : 'QUESTURA ROMA'}</span>
                <span className="transform -rotate-12">{overlay.hologramPattern === 'hexagons' ? 'VERIFIED_SECURE' : overlay.hologramPattern === 'stripes' ? 'FEDERAL_GRADIENT' : 'ITALY RESIDENZA'}</span>
              </div>
            </div>
          )}

          {/* Left Block (Biometric Passport Photo) and Right Block (Other variables) */}
          <div className="relative z-10 grid grid-cols-12 gap-x-4 items-start pt-1.5 text-left select-text">
            
            {/* Left Hand: Biometric Face & Autograph */}
            <div className="col-span-12 sm:col-span-5 flex flex-col items-center relative">
              
              <div className="relative w-full aspect-[0.78] rounded-xl overflow-hidden border-2 border-amber-900/10 bg-[#e2dac3] p-0.5 shadow-md group">
                <img 
                  role="img"
                  src={data.photoUrl ? data.photoUrl : "/src/assets/images/volodymyr_suit_biometric_1781220217399.jpg"}
                  alt="Volodymyr Testardi Biometric Face"
                  className={`w-full h-full object-cover rounded-lg transition-all duration-500 ${
                    !overlay.showUvLight && overlay.photoFilter === 'analog-print'
                      ? 'contrast-[1.06] saturate-[0.68] brightness-[0.98] grayscale-[4%]'
                      : !overlay.showUvLight && overlay.photoFilter === 'biometric-mono'
                      ? 'grayscale contrast-[1.15] brightness-[0.95]'
                      : !overlay.showUvLight && overlay.photoFilter === 'vintage-faded'
                      ? 'sepia-[0.36] contrast-[0.91] brightness-[1.01] saturate-[0.68]'
                      : !overlay.showUvLight
                      ? 'grayscale-[8%] contrast-[1.02] brightness-100'
                      : ''
                  }`}
                  style={overlay.showUvLight ? {
                    filter: `brightness(${100 - (overlay.uvIntensity ?? 100) * 0.55}%) contrast(${100 + (overlay.uvIntensity ?? 100) * 0.35}%) saturate(${100 + (overlay.uvIntensity ?? 100) * 0.50}%) hue-rotate(${(overlay.uvIntensity ?? 100) * 2.4}deg)`
                  } : undefined}
                  referrerPolicy="no-referrer"
                />

                {/* Raw Paper Substance & Organic Fiber Texture Overlay */}
                {overlay.paperFiber && !overlay.showUvLight && (
                  <svg className="absolute inset-0 pointer-events-none opacity-[0.16] mix-blend-overlay z-15" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="fiberPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="10" y2="7" stroke="#6b4423" strokeWidth="0.4" opacity="0.35" />
                        <line x1="3" y1="10" x2="10" y2="1" stroke="#2c1e14" strokeWidth="0.25" opacity="0.3" />
                        <line x1="0" y1="5" x2="10" y2="5" stroke="#ffffff" strokeWidth="0.5" opacity="0.45" />
                        <path d="M 1,9 Q 5,1 9,8" fill="none" stroke="#653512" strokeWidth="0.25" opacity="0.3" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#fiberPattern)" />
                  </svg>
                )}

                {/* Fine Halftone Rosette Printing Press Dither Overlay */}
                {overlay.photoFilter === 'analog-print' && !overlay.showUvLight && (
                  <svg className="absolute inset-0 pointer-events-none opacity-[0.22] mix-blend-multiply z-15" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="halftonePattern" width="2.2" height="2.2" patternUnits="userSpaceOnUse">
                        <circle cx="0.9" cy="0.9" r="0.45" fill="#1c1917" />
                        <circle cx="2.0" cy="2.0" r="0.35" fill="#78350f" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#halftonePattern)" />
                  </svg>
                )}

                {/* Intaglio Guilloche Security Wavy Lines Overlapping Photo */}
                {overlay.guillocheOverPhoto && !overlay.showUvLight && (
                  <svg className="absolute inset-0 pointer-events-none opacity-[0.24] mix-blend-multiply z-15" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M -10 16 Q 15 4 40 18 T 90 18 T 140 18" fill="none" stroke="#9a3412" strokeWidth="0.28" />
                    <path d="M -10 34 Q 15 22 40 34 T 90 34 T 140 34" fill="none" stroke="#1e3a8a" strokeWidth="0.22" />
                    <path d="M -10 52 Q 15 39 40 52 T 90 52 T 140 52" fill="none" stroke="#78350f" strokeWidth="0.28" />
                    <path d="M -10 70 Q 15 57 40 70 T 90 70 T 140 70" fill="none" stroke="#1c1917" strokeWidth="0.22" />
                    <path d="M -10 88 Q 15 75 40 88 T 90 88 T 140 88" fill="none" stroke="#9a3412" strokeWidth="0.22" />
                  </svg>
                )}

                {/* Diffractive Holographic Star Security Seal Overlay with 3D parallax offsets */}
                {overlay.photoHologram && !overlay.showUvLight && (
                  <div 
                    className="absolute inset-0 pointer-events-none z-18 mix-blend-color-dodge overflow-hidden"
                    style={{
                      background: `radial-gradient(circle 105px at ${hologramPos.x - 40}px ${hologramPos.y - 100}px, rgba(16, 185, 129, 0.45) 0%, rgba(239, 68, 68, 0.28) 35%, rgba(59, 130, 246, 0.25) 65%, rgba(0,0,0,0) 100%)`,
                      opacity: 0.90
                    }}
                  >
                    {/* Parallax Holographic micro-circles background pattern */}
                    <div 
                      className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-150 ease-out"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Ccircle cx='6' cy='6' r='4' fill='none' stroke='%23ffffff' stroke-width='0.3' stroke-opacity='0.4'/%3E%3C/svg%3E")`,
                        transform: `translate(${(hologramPos.x - 220) * -0.05}px, ${(hologramPos.y - 120) * -0.05}px)`
                      }}
                    />
                    
                    <div 
                      className="absolute top-[28%] left-[28%] -translate-x-1/2 -translate-y-1/2 opacity-35 group-hover:opacity-50 transition-all duration-150 ease-out"
                      style={{
                        transform: `translate(${(hologramPos.x - 220) * 0.08}px, ${(hologramPos.y - 120) * 0.08}px) translate(-50%, -50%)`
                      }}
                    >
                      <svg className="w-16 h-16 text-[#a7f3d0] animate-pulse duration-[3000ms]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="50,15 53,38 78,38 58,52 65,75 50,60 35,75 42,52 22,38 47,38" />
                        <circle cx="50" cy="50" r="28" strokeDasharray="3,3" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Simulated laser security lines over photo */}
                {!overlay.showUvLight && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/5 via-amber-400/5 to-transparent pointer-events-none mix-blend-screen" />
                )}

                {/* Overlapping official stamp watermark */}
                {overlay.showWatermark && !overlay.showUvLight && (
                  <div 
                    className="absolute -bottom-1 -right-1 pointer-events-none select-none transition-all duration-300"
                    style={{ opacity: (overlay.watermarkOpacity !== undefined ? overlay.watermarkOpacity : 0.10) * 5.0 }}
                  >
                    <svg className="w-11 h-11 text-white/70" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="currentColor" fill="none" strokeWidth="2.5" />
                      <path d="M22,50 L78,50 M50,22 L50,78" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                )}

                {/* High-Tech Biometric Landmarks overlay visualization */}
                {overlay.showLandmarks && (() => {
                  const laserStyleKeys = {
                    cyan: {
                      textClass: 'fill-cyan-400 text-cyan-400',
                      borderClass: 'border-cyan-400/85',
                      cornerBorder: 'border-cyan-400',
                      laserBg: 'bg-cyan-400',
                      shadowStyle: '0 0 10px #22d3ee, 0 0 20px rgba(6,182,212,0.6)',
                      boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
                      mats: 'rgba(34, 211, 238, 0.45)',
                      linesColor: 'rgba(34, 211, 238, 0.5)',
                      lightLineColor: 'rgba(34, 211, 238, 0.3)',
                      dots: '#22d3ee',
                      darkNode: '#06b6d4'
                    },
                    green: {
                      textClass: 'fill-emerald-400 text-emerald-400',
                      borderClass: 'border-[#34d399]/85',
                      cornerBorder: 'border-[#34d399]',
                      laserBg: 'bg-[#34d399]',
                      shadowStyle: '0 0 10px #34d399, 0 0 20px rgba(5,150,105,0.6)',
                      boxShadow: '0 0 15px rgba(52, 211, 153, 0.2)',
                      mats: 'rgba(52, 211, 153, 0.45)',
                      linesColor: 'rgba(52, 211, 153, 0.5)',
                      lightLineColor: 'rgba(52, 211, 153, 0.3)',
                      dots: '#34d399',
                      darkNode: '#059669'
                    },
                    rose: {
                      textClass: 'fill-rose-400 text-rose-400',
                      borderClass: 'border-[#f43f5e]/85',
                      cornerBorder: 'border-[#f43f5e]',
                      laserBg: 'bg-[#f43f5e]',
                      shadowStyle: '0 0 10px #f43f5e, 0 0 20px rgba(225,29,72,0.6)',
                      boxShadow: '0 0 15px rgba(244, 63, 94, 0.2)',
                      mats: 'rgba(244, 63, 94, 0.45)',
                      linesColor: 'rgba(244, 63, 94, 0.5)',
                      lightLineColor: 'rgba(244, 63, 94, 0.3)',
                      dots: '#f43f5e',
                      darkNode: '#e11d48'
                    },
                    amber: {
                      textClass: 'fill-amber-400 text-amber-400',
                      borderClass: 'border-[#fbbf24]/85',
                      cornerBorder: 'border-[#fbbf24]',
                      laserBg: 'bg-[#fbbf24]',
                      shadowStyle: '0 0 10px #fbbf24, 0 0 20px rgba(217,119,6,0.6)',
                      boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)',
                      mats: 'rgba(245, 158, 11, 0.45)',
                      linesColor: 'rgba(245, 158, 11, 0.5)',
                      lightLineColor: 'rgba(245, 158, 11, 0.3)',
                      dots: '#fbbf24',
                      darkNode: '#d97706'
                    }
                  }[overlay.laserColor || 'cyan'];

                  const scanDur = overlay.scanSpeedSec !== undefined ? overlay.scanSpeedSec : 2.8;

                  return (
                    <div className="absolute inset-0 pointer-events-none select-none z-20">
                      
                      {/* Glowing face tracker bounding box */}
                      <div className={`absolute top-[18%] left-[24%] w-[52%] h-[50%] border ${laserStyleKeys.borderClass} rounded-2xl animate-pulse bg-cyan-950/5`} style={{ boxShadow: laserStyleKeys.boxShadow }}>
                        <span className={`absolute -top-3.5 left-0.5 text-[4.5px] font-mono leading-none font-bold uppercase tracking-wider ${laserStyleKeys.textClass} bg-black/75 px-1 py-0.5 rounded border border-cyan-400/30`}>
                          FACE DETECT : V_TESTARDI_2026
                        </span>
                        {/* Technical corner brackets */}
                        <span className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${laserStyleKeys.cornerBorder}`} />
                        <span className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${laserStyleKeys.cornerBorder}`} />
                        <span className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${laserStyleKeys.cornerBorder}`} />
                        <span className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${laserStyleKeys.cornerBorder}`} />
                      </div>

                      {/* Laser Sweeper Bar with Custom color glow */}
                      <div 
                        className={`absolute left-0 right-0 h-0.5 ${laserStyleKeys.laserBg} opacity-90 z-25 pointer-events-none`}
                        style={{ 
                          animation: `scan ${scanDur}s ease-in-out infinite`,
                          boxShadow: laserStyleKeys.shadowStyle
                        }}
                      />

                      {/* Biometric Landmark Vector Mesh overlay */}
                      <svg className="absolute inset-0 w-full h-full mix-blend-screen" viewBox="0 0 100 100">
                        {/* Background grid reticle dots */}
                        <circle cx="20" cy="20" r="0.2" fill={laserStyleKeys.dots} opacity="0.4" />
                        <circle cx="80" cy="20" r="0.2" fill={laserStyleKeys.dots} opacity="0.4" />
                        <circle cx="20" cy="80" r="0.2" fill={laserStyleKeys.dots} opacity="0.4" />
                        <circle cx="80" cy="80" r="0.2" fill={laserStyleKeys.dots} opacity="0.4" />

                        {(() => {
                          const dlibPoints = [
                            // Jawline (0-16): 17 points
                            { x: 31.0, y: 31.5 }, { x: 31.2, y: 35.5 }, { x: 31.8, y: 39.5 }, { x: 32.8, y: 43.5 }, { x: 34.2, y: 47.5 }, { x: 36.2, y: 51.5 }, { x: 39.0, y: 55.0 }, { x: 42.5, y: 57.8 }, { x: 46.2, y: 59.8 }, { x: 50.0, y: 60.5 }, { x: 53.8, y: 59.8 }, { x: 57.5, y: 57.8 }, { x: 61.0, y: 55.0 }, { x: 63.8, y: 51.5 }, { x: 65.8, y: 47.5 }, { x: 67.2, y: 43.5 }, { x: 68.2, y: 39.5 },
                            // Left Eyebrow (17-21): 5 points
                            { x: 33.5, y: 29.5 }, { x: 36.0, y: 28.5 }, { x: 39.0, y: 28.2 }, { x: 42.0, y: 28.8 }, { x: 45.0, y: 30.0 },
                            // Right Eyebrow (22-26): 5 points
                            { x: 55.0, y: 30.0 }, { x: 58.0, y: 28.8 }, { x: 61.0, y: 28.2 }, { x: 64.0, y: 28.5 }, { x: 66.5, y: 29.5 },
                            // Nose Bridge (27-30): 4 points
                            { x: 50.0, y: 31.5 }, { x: 50.0, y: 35.0 }, { x: 50.0, y: 38.5 }, { x: 50.0, y: 42.0 },
                            // Nose Base (31-35): 5 points
                            { x: 46.0, y: 45.0 }, { x: 48.0, y: 45.2 }, { x: 50.0, y: 45.5 }, { x: 52.0, y: 45.2 }, { x: 54.0, y: 45.0 },
                            // Left Eye (36-41): 6 points
                            { x: 36.8, y: 34.5 }, { x: 38.8, y: 33.5 }, { x: 41.2, y: 33.5 }, { x: 43.2, y: 34.5 }, { x: 41.2, y: 35.5 }, { x: 38.8, y: 35.5 },
                            // Right Eye (42-47): 6 points
                            { x: 56.8, y: 34.5 }, { x: 58.8, y: 33.5 }, { x: 61.2, y: 33.5 }, { x: 63.2, y: 34.5 }, { x: 61.2, y: 35.5 }, { x: 58.8, y: 35.5 },
                            // Outer Lips (48-59): 12 points
                            { x: 41.5, y: 51.5 }, { x: 44.5, y: 50.5 }, { x: 47.5, y: 50.0 }, { x: 50.0, y: 50.5 }, { x: 52.5, y: 50.0 }, { x: 55.5, y: 50.5 }, { x: 58.5, y: 51.5 }, { x: 55.5, y: 53.5 }, { x: 52.5, y: 54.0 }, { x: 50.0, y: 54.5 }, { x: 47.5, y: 54.0 }, { x: 44.5, y: 53.5 },
                            // Inner Lips (60-67): 8 points
                            { x: 43.5, y: 51.5 }, { x: 47.0, y: 51.0 }, { x: 50.0, y: 51.2 }, { x: 53.0, y: 51.0 }, { x: 56.5, y: 51.5 }, { x: 53.0, y: 52.5 }, { x: 50.0, y: 52.8 }, { x: 47.0, y: 52.5 }
                          ];

                          const renderPath = (indices: number[], close = false) => {
                            const ptsStr = indices.map(i => `${dlibPoints[i].x},${dlibPoints[i].y}`).join(' ');
                            if (close && indices.length > 0) {
                              const firstPoint = `${dlibPoints[indices[0]].x},${dlibPoints[indices[0]].y}`;
                              return <polygon points={`${ptsStr} ${firstPoint}`} fill="none" stroke={laserStyleKeys.linesColor} strokeWidth="0.2" />;
                            }
                            return <polyline points={ptsStr} fill="none" stroke={laserStyleKeys.linesColor} strokeWidth="0.2" />;
                          };

                          return (
                            <>
                              {/* Inter-pupillary centerline & triangulation */}
                              <line x1="40.0" y1="34.5" x2="60.0" y2="34.4" stroke={laserStyleKeys.linesColor} strokeWidth="0.3" strokeDasharray="1,1" />

                              {/* Standard dlib connections */}
                              {renderPath(Array.from({ length: 17 }, (_, i) => i))} {/* Jawline */}
                              {renderPath(Array.from({ length: 5 }, (_, i) => i + 17))} {/* Left Eyebrow */}
                              {renderPath(Array.from({ length: 5 }, (_, i) => i + 22))} {/* Right Eyebrow */}
                              {renderPath(Array.from({ length: 4 }, (_, i) => i + 27))} {/* Nose Bridge */}
                              {renderPath(Array.from({ length: 5 }, (_, i) => i + 31))} {/* Nose Base */}
                              {renderPath(Array.from({ length: 6 }, (_, i) => i + 36), true)} {/* Left Eye */}
                              {renderPath(Array.from({ length: 6 }, (_, i) => i + 42), true)} {/* Right Eye */}
                              {renderPath(Array.from({ length: 12 }, (_, i) => i + 48), true)} {/* Outer Lips */}
                              {renderPath(Array.from({ length: 8 }, (_, i) => i + 60), true)} {/* Inner Lips */}

                              {/* Glowing Pupils & tracking nodes */}
                              <circle cx="40.0" cy="34.5" r="1.4" fill="none" stroke={laserStyleKeys.dots} strokeWidth="0.4" className="animate-pulse" />
                              <circle cx="39.8" cy="34.5" r="0.4" fill={laserStyleKeys.dots} />
                              <text x="24" y="33" className={`text-[2px] font-mono ${laserStyleKeys.textClass} font-bold tracking-tight`}>L_PUPIL (40.0, 34.5)</text>

                              <circle cx="60.0" cy="34.5" r="1.4" fill="none" stroke={laserStyleKeys.dots} strokeWidth="0.4" className="animate-pulse" />
                              <circle cx="60.0" cy="34.5" r="0.4" fill={laserStyleKeys.dots} />
                              <text x="61.5" y="33" className={`text-[2px] font-mono ${laserStyleKeys.textClass} font-bold tracking-tight`}>R_PUPIL (60.0, 34.5)</text>

                              {/* Nose Tip Center point */}
                              <circle cx="50.0" cy="42.0" r="0.8" fill="none" stroke={laserStyleKeys.dots} strokeWidth="0.3" />
                              <circle cx="50.0" cy="42.0" r="0.3" fill={laserStyleKeys.dots} />
                              <text x="51" y="41.5" className={`text-[1.8px] font-mono ${laserStyleKeys.textClass} font-bold`}>N_TIP (50.0, 42.0)</text>

                              {/* Chin Anchor Center node */}
                              <circle cx="50.0" cy="60.5" r="0.8" fill="#ec4899" className="animate-ping" />
                              <circle cx="50.0" cy="60.5" r="0.5" fill="#db2777" />
                              <text x="51.5" y="63" className="text-[1.8px] font-mono fill-pink-400 font-black">CHIN_BASE</text>

                              {/* 68 Individual Landmarks Dots */}
                              {dlibPoints.map((pt, idx) => (
                                <circle 
                                  key={idx} 
                                  cx={pt.x} 
                                  cy={pt.y} 
                                  r="0.4" 
                                  fill={laserStyleKeys.dots} 
                                  stroke="#ffffff" 
                                  strokeWidth="0.08" 
                                />
                              ))}
                            </>
                          );
                        })()}

                        {/* Vertical line of facial symmetry */}
                        <line x1="50" y1="18" x2="50" y2="72" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="0.2" strokeDasharray="3,2" />

                        {/* Floating high-tech parameters in viewport */}
                        <rect x="5" y="5" width="28" height="11" rx="0.8" fill="rgba(0,0,0,0.55)" stroke="rgba(34,211,238,0.2)" strokeWidth="0.2" />
                        <text x="7" y="8" className="text-[1.8px] font-mono fill-emerald-400 font-bold uppercase tracking-wider">SECURE MATCH</text>
                        <text x="7" y="11" className="text-[1.5px] font-mono fill-stone-300">SCORE: {(overlay.biometricMatchScore || 100.0).toFixed(1)}%</text>
                        <text x="7" y="14" className="text-[1.5px] font-mono fill-stone-300">SYM: 99.8% OK</text>

                        <rect x="67" y="5" width="28" height="11" rx="0.8" fill="rgba(0,0,0,0.55)" stroke="rgba(34,211,238,0.2)" strokeWidth="0.2" />
                        <text x="69" y="8" className={`text-[1.8px] font-mono ${laserStyleKeys.textClass} font-bold uppercase tracking-wider`}>INDEX SENSORS</text>
                        <text x="69" y="11" className="text-[1.5px] font-mono fill-stone-300">PTS: 68 RET_OK</text>
                        <text x="69" y="14" className="text-[1.5px] font-mono fill-stone-300">SPD: {scanDur}s</text>
                      </svg>
                    </div>
                  );
                })()}
              </div>

              {/* Autograph / Signature underneath foto */}
              <div className="mt-2.5 w-full border-b border-[#e1d3b5] pb-0.5 flex flex-col items-center justify-end h-9">
                <span className={`text-[5.5px] uppercase font-bold self-start leading-none ${overlay.showUvLight ? 'text-indigo-400/70' : 'text-amber-800/40'}`}>
                  Firma / Signature
                </span>
                <div 
                  className={`font-signature text-base relative select-none leading-none mb-0.5 ${
                    overlay.showUvLight 
                      ? 'text-indigo-400 glow-sm font-bold scale-105' 
                      : overlay.signatureInk === 'purple'
                      ? 'text-[#581c87] saturate-150 font-bold'
                      : overlay.signatureInk === 'black'
                      ? 'text-stone-950 font-bold'
                      : 'text-[#1e3a8a] saturate-150 font-medium'
                  }`}
                  style={{ fontFamily: '"La Belle Aurore", "Caveat", "Brush Script MT", cursive' }}
                >
                  {data.signatureText || 'V. Testardi'}
                </div>
              </div>

              {/* Overlapping Official Circular Ink Stamp (Bleeds onto physical adjoining page) */}
              {overlay.overlayStamp && (
                <div 
                  className={`absolute pointer-events-none select-none z-22 bottom-8 -right-3 w-[84px] h-[84px] rounded-full flex items-center justify-center font-mono font-black transform rotate-12 ${
                    overlay.showUvLight 
                      ? 'text-pink-500/80 drop-shadow-[0_0_4px_rgba(236,72,153,0.6)]' 
                      : 'text-blue-900/35 mix-blend-multiply'
                  }`}
                  style={{
                    backgroundImage: `radial-gradient(circle, transparent 58%, currentColor 60%, transparent 63%)`,
                    fontSize: '4.8px',
                    letterSpacing: '0.2px',
                    textShadow: '0.1px 0.1px 0.2px rgba(0,0,0,0.02)'
                  }}
                >
                  <svg className="absolute w-full h-full fill-none stroke-current" viewBox="0 0 100 100">
                    {/* Inner seal circle */}
                    <circle cx="50" cy="50" r="27" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
                    {/* Seal Star in center */}
                    <polygon points="50,40 52.5,47 59.5,47 54,51 56.5,58 50,53.5 43.5,58 46,51 40.5,47 47.5,47" fill="currentColor" stroke="none" opacity="0.65" />
                    {/* Text curved wrap simulation */}
                    <path id="stampPath" d="M 17,50 A 33,33 0 1,1 83,50 A 33,33 0 1,1 17,50" fill="none" stroke="none" />
                    <text className="font-bold fill-current uppercase tracking-[0.2px] text-[5px]">
                      <textPath href="#stampPath" startOffset="0%">
                        * MINISTERO'DELL'INTERNO * REPUBBLICA ITALIANA * QUESTURA_ROMA
                      </textPath>
                    </text>
                  </svg>
                </div>
              )}

            </div>

            {/* Right Hand: Other verification variables */}
            <div className="col-span-7 grid grid-cols-2 gap-y-2 gap-x-2 text-left">
              
              {/* Doc Number */}
              <div className="col-span-2 relative pb-0.5 border-b border-[#ebdcb8]/15">
                <span className={`block text-[6.5px] uppercase font-bold leading-none ${overlay.showUvLight ? 'text-indigo-400/70' : 'text-amber-900/50'}`}>
                  N. di passaporto / Passport No.
                </span>
                <span className={`block text-[11px] font-mono font-bold tracking-widest ${overlay.showUvLight ? 'text-cyan-400 glow-sm' : 'text-red-700'}`}>
                  {data.passportNumber.toUpperCase()}
                </span>
                <MicroPrintBorder id="lp_passport" text="N PASSAPORTO * PASSPORT NO * YA785 * SECURE * " showUv={overlay.showUvLight} isZoomed={isZoomed} />
              </div>

              {/* Date of Issue & Expiry */}
              <div className="relative pb-0.5 border-b border-[#ebdcb8]/15">
                <span className={`block text-[6.5px] uppercase font-bold leading-none ${overlay.showUvLight ? 'text-indigo-400/70' : 'text-amber-900/50'}`}>
                  Data di rilascio / Issue State
                </span>
                <span className={`block text-[9.5px] font-mono font-bold ${overlay.showUvLight ? 'text-indigo-200' : 'text-stone-850'}`}>
                  {data.dateOfIssue}
                </span>
                <MicroPrintBorder id="lp_issue" text="DATA DI RILASCIO * DATE OF ISSUE * " showUv={overlay.showUvLight} isZoomed={isZoomed} />
              </div>

              <div className="relative pb-0.5 border-b border-[#ebdcb8]/15">
                <span className={`block text-[6.5px] uppercase font-bold leading-none ${overlay.showUvLight ? 'text-indigo-400/70' : 'text-amber-900/50'}`}>
                  Data di scadenza / Expiry State
                </span>
                <span className={`block text-[9.5px] font-mono font-bold ${overlay.showUvLight ? 'text-indigo-200' : 'text-stone-850'}`}>
                  {data.dateOfExpiry}
                </span>
                <MicroPrintBorder id="lp_expiry" text="DATA DI SCADENZA * DATE OF EXPIRY * " showUv={overlay.showUvLight} isZoomed={isZoomed} />
              </div>

              {/* Fiscal Authority */}
              <div className="col-span-2 relative pb-0.5 border-b border-[#ebdcb8]/15">
                <span className={`block text-[6.5px] uppercase font-bold leading-none ${overlay.showUvLight ? 'text-indigo-400/70' : 'text-amber-900/50'}`}>
                  Autorità / Authority
                </span>
                <span className={`block text-[9.5px] font-bold font-mono uppercase tracking-tight ${overlay.showUvLight ? 'text-indigo-200' : 'text-stone-850'}`}>
                  {data.authority}
                </span>
                <MicroPrintBorder id="lp_authority" text="AUTORITA * AUTHORITY * QUESTURA ROMA * " showUv={overlay.showUvLight} isZoomed={isZoomed} />
              </div>

              {/* Registered Residency Address details */}
              <div className="col-span-2 relative pb-0.5 border-b border-[#ebdcb8]/15">
                <div className="flex justify-between">
                  <div>
                    <span className={`block text-[6.5px] uppercase font-bold leading-none ${overlay.showUvLight ? 'text-indigo-400/70' : 'text-amber-900/50'}`}>
                      Address & Commune (Italia)
                    </span>
                    <span className="block text-[9px] font-semibold font-mono text-stone-700 capitalize">
                      {data.city} ({data.postalCode}), {data.residentialAddress}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`block text-[6.5px] uppercase font-bold leading-none ${overlay.showUvLight ? 'text-indigo-400/70' : 'text-amber-900/50'}`}>
                      Civil Status
                    </span>
                    <span className="block text-[9px] font-semibold font-mono text-stone-700">
                      {data.relationshipStatus}
                    </span>
                  </div>
                </div>
                <MicroPrintBorder id="lp_address" text="RESIDENZA * ADDRESS * CITTA REGIONE LOMBARDO * " showUv={overlay.showUvLight} isZoomed={isZoomed} />
              </div>

              {/* Digital Contacts */}
              <div className="col-span-1 min-w-0 pr-1">
                <span className={`block text-[6.5px] uppercase font-bold leading-none ${overlay.showUvLight ? 'text-indigo-400/70' : 'text-amber-900/50'}`}>
                  Digital Contacts
                </span>
                <span className={`block text-[7px] font-semibold font-mono leading-tight mt-1 truncate ${overlay.showUvLight ? 'text-stone-300' : 'text-stone-700'}`}>
                  {data.emailAddress}
                </span>
                <span className={`block text-[7.5px] font-semibold font-mono mt-0.5 ${overlay.showUvLight ? 'text-stone-400' : 'text-stone-600'}`}>
                  {data.phoneNumber}
                </span>
              </div>

              {/* Secure QR Code Stamp Block */}
              <div 
                onClick={onSelectQrCode}
                className={`col-span-1 flex items-center gap-1.5 border hover:border-emerald-500/50 p-1 rounded-lg transition-all duration-300 cursor-pointer shadow-inner relative group select-none overflow-hidden ${
                  overlay.showUvLight 
                    ? 'border-indigo-500/20 bg-slate-900/60' 
                    : 'border-[#ebdcb8] bg-[#f9f5e8] hover:bg-[#fffdf5]'
                }`}
                title="Click to Simulate QR Mobile Scan"
              >
                {/* SVG QR Code */}
                <div className="p-0.5 bg-white rounded border border-[#ebdcb8]/40 shrink-0">
                  <QRCodeSVG 
                    value={identityString}
                    size={38}
                    level="H"
                    includeMargin={false}
                    fgColor={overlay.showUvLight ? '#818cf8' : '#292524'}
                    bgColor="transparent"
                  />
                </div>
                {/* Stamp Details */}
                <div className="flex flex-col justify-center min-w-0">
                  <span className={`block text-[5.5px] uppercase font-black tracking-widest leading-none ${overlay.showUvLight ? 'text-indigo-400' : 'text-emerald-800'}`}>
                    {overlay.showUvLight ? 'UV_2D_SEAL' : 'SECURE_QR'}
                  </span>
                  <span className={`block text-[5px] font-mono mt-0.5 leading-none truncate ${overlay.showUvLight ? 'text-indigo-300/60' : 'text-stone-500'}`}>
                    EXP: {data.dateOfExpiry}
                  </span>
                  <span className="block text-[4.5px] font-mono font-black text-emerald-600 hover:text-emerald-700 mt-0.5 leading-none animate-pulse">
                    SCAN SIM
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Machine Readable Zone (MRZ) bottom of the vertical layout booklet */}
          {overlay.showMrzLayout && (
            <div className={`mt-3 py-2 px-4 rounded-xl border font-mono text-[9.5px] leading-tight select-all transition-all duration-300 tracking-[0.24em] ${
              overlay.showUvLight 
                ? 'bg-slate-900/70 text-indigo-400 glow-sm border-indigo-500/30' 
                : 'bg-[#faf2db] text-stone-900 border-[#ebdcb8]'
            }`}
            style={{ letterSpacing: '0.24em' }}
            >
              <div className="font-semibold select-all truncate">{line1}</div>
              <div className="font-semibold select-all truncate">{line2}</div>
            </div>
          )}

        </div>
      </div>
    );
  };

  return (
    <div className="relative select-none w-full max-w-[480px]">
      {/* Interactive Floating Blueprint Badge */}
      <div className="absolute -top-3 left-3 bg-red-700/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-medium text-white tracking-widest shadow-lg z-25 border border-red-500 flex items-center gap-1.5 uppercase no-print">
        <Sparkles size={11} className="animate-spin text-amber-300" />
        Official Opened Booklet Scale
      </div>

      {/* Main Booklet Frame */}
      <div 
        id="passport-card-viewport"
        ref={bookletRef}
        onMouseEnter={() => setIsMagnifierHovered(true)}
        onMouseLeave={() => setIsMagnifierHovered(false)}
        onMouseMove={(e) => {
          onHoverHologram(e);
          const rect = bookletRef.current?.getBoundingClientRect();
          if (rect) {
            setMagnifierPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            });
            setBookletSize({
              width: rect.width,
              height: rect.height
            });
          }
        }}
        className={`relative w-full rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl border flex flex-col ${
          overlay.showUvLight 
            ? 'bg-slate-950 border-indigo-500 shadow-indigo-500/30' 
            : 'bg-[#faf6e9] border-[#d4cbb0] shadow-amber-950/20'
        }`}
        style={{
          aspectRatio: '0.71', // Standard golden physical vertical aspect ratio for opened booklet
          boxShadow: overlay.showUvLight 
            ? '0 25px 60px -12px rgba(99, 102, 241, 0.4), inset 0 0 60px rgba(0,0,0,0.95)' 
            : '0 25px 60px -12px rgba(120, 80, 40, 0.25), inset 0 0 35px rgba(216, 205, 178, 0.35)'
        }}
      >
        {renderPassportContent(false)}

        {/* Floating Magnifying Glass Lens */}
        {overlay.showMagnifier && isMagnifierHovered && (
          <div 
            className="absolute border-4 rounded-full pointer-events-none z-50 overflow-hidden"
            style={{
              width: '150px',
              height: '150px',
              left: `${magnifierPos.x - 75}px`,
              top: `${magnifierPos.y - 75}px`,
              boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.8), inset 0 0 32px rgba(0,0,0,0.45)',
              borderColor: overlay.showUvLight ? '#818cf8' : '#d97706', // neon purple under uv, amber gold under standard light
              backgroundColor: overlay.showUvLight ? '#060814' : '#faf6e9',
            }}
          >
            {/* Scale up structure inside the lens */}
            <div 
              className="absolute origin-top-left"
              style={{
                width: `${bookletSize.width}px`,
                height: `${bookletSize.height}px`,
                left: `${-magnifierPos.x * 2.5 + 75}px`,
                top: `${-magnifierPos.y * 2.5 + 75}px`,
                transform: 'scale(2.5)',
              }}
            >
              {renderPassportContent(true)}
            </div>
            
            {/* Fine Reticle Grid crosshair overlay inside the glass */}
            <div className="absolute inset-0 pointer-events-none border border-red-500/10 flex items-center justify-center">
              <div className="w-4 h-[1px] bg-red-500/25 absolute" />
              <div className="h-4 w-[1px] bg-red-500/25 absolute" />
              <div className="w-10 h-10 rounded-full border border-red-500/15 absolute" />
              <span className="absolute bottom-2 right-4 font-mono text-[7px] text-red-500/60 font-black tracking-widest bg-black/40 px-1 py-0.5 rounded leading-none uppercase">
                2.5X ZOOM
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
