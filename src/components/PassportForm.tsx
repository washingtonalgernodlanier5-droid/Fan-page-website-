import React from 'react';
import { PassportData, SecurityOverlay } from '../types';
import { Mail, Phone, MapPin, Heart, Info, ArrowLeftRight, Check, RefreshCw, Download, Sparkles, Lock, Unlock, ShieldAlert, Activity, Palette, Sliders, CheckCircle, Zap, ShieldCheck } from 'lucide-react';

interface PassportFormProps {
  data: PassportData;
  onChange: (newData: Partial<PassportData>) => void;
  onReset: () => void;
  isAdminMode: boolean;
  onToggleAdmin: () => void;
  onDownloadDossier: () => void;
  overlays: SecurityOverlay;
  onOverlayChange: (newOverlay: Partial<SecurityOverlay>) => void;
}

export const PassportForm: React.FC<PassportFormProps> = ({
  data,
  onChange,
  onReset,
  isAdminMode,
  onToggleAdmin,
  onDownloadDossier,
  overlays,
  onOverlayChange
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleDownload = (e: React.MouseEvent, url: string, filename: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-stone-200/60 p-6 flex flex-col gap-6 select-none">
      
      {/* Visual Identity section */}
      <div className="flex justify-between items-center pb-4 border-b border-stone-100">
        <div>
          <h2 className="text-sm font-bold text-stone-900 tracking-wider uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 block animate-pulse"></span>
            Personal Dossier Editor
          </h2>
          <p className="text-[11px] text-stone-500 mt-0.5">Edit credentials to update the Italian Passport instantly.</p>
        </div>
        {isAdminMode && (
          <button
            onClick={onReset}
            className="text-[11px] font-mono text-stone-600 hover:text-red-700 bg-stone-100 hover:bg-stone-200/80 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors flex items-center gap-1.5 font-bold uppercase cursor-pointer"
          >
            <RefreshCw size={11} />
            Full Reset
          </button>
        )}
      </div>

      {/* Dynamic Security Clearance & Admin Portal State */}
      <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-all duration-300 ${
        isAdminMode
          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-sm'
          : 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
              isAdminMode ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isAdminMode ? <Unlock size={14} className="text-emerald-700" /> : <Lock size={14} className="text-amber-700" />}
            </div>
            <div>
              <span className="block text-[8px] font-mono leading-none tracking-widest text-stone-500 font-bold uppercase">
                SECURITY CLEARANCE STATUS
              </span>
              <span className="block text-xs font-black font-sans mt-0.5 uppercase tracking-wide">
                {isAdminMode ? 'FEDERAL ADMIN MODE / LEVEL-3' : 'CITIZEN SCAN (READ-ONLY)'}
              </span>
            </div>
          </div>

          {isAdminMode && (
            <button
              type="button"
              onClick={onToggleAdmin}
              className="text-[9px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer font-sans select-none tracking-wider uppercase bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-sm hover:shadow-md"
            >
              Lock Panel
            </button>
          )}
        </div>

        {/* Informative policy statement */}
        <p className="text-[10px] leading-relaxed text-stone-600 font-medium">
          {isAdminMode 
            ? 'Clearance Granted. You are authorized to modify Volodymyr Testardi’s official physical details. Press full reset or lock panel to seal.' 
            : 'Access Sealed. Default citizen view is read-only to preserve security integrity. Authenticate Admin privileges to calibrate parameters.'}
        </p>

        {/* Admin Dossier Download Button */}
        {isAdminMode && (
          <button
            type="button"
            onClick={onDownloadDossier}
            className="w-full mt-1 bg-emerald-700 hover:bg-emerald-800 text-white py-1.5 rounded-lg font-bold text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 shadow border border-emerald-800 cursor-pointer"
          >
            <Download size={12} />
            EXPORT HIGH-RES DOSSIER (.JSON)
          </button>
        )}
      </div>

      {/* Biometric Portrait Selector & Advanced Customizations (Admin only) */}
      {isAdminMode && (
        <>
          <div className="bg-stone-50 rounded-2xl p-4.5 border border-stone-200/60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] uppercase font-bold text-stone-700 tracking-wider flex items-center gap-1.5">
                <Info size={12} className="text-amber-600 shrink-0" />
                Biometric Photo Gallery
              </h3>
              <span className="text-[9px] font-mono font-black text-rose-700 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5 uppercase z-10">
                OFFICIAL CELEBRITY SOURCES
              </span>
            </div>

            <div className="flex flex-col gap-2.5">

              {/* Option 6: Fresh Cut Elegant Suit ID (Requested Modern Standard) */}
              <div 
                onClick={() => {
                  if (isAdminMode) {
                    onChange({ photoUrl: '/src/assets/images/volodymyr_clean_shaven_suit_1781254178490.jpg' });
                  }
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all relative ${
                  data.photoUrl === '/src/assets/images/volodymyr_clean_shaven_suit_1781254178490.jpg'
                    ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm'
                    : 'bg-white/50 border-stone-200 hover:bg-white'
                } ${isAdminMode ? 'cursor-pointer hover:border-emerald-400' : 'cursor-not-allowed opacity-90'}`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="relative shrink-0">
                    <img 
                      src="/src/assets/images/volodymyr_clean_shaven_suit_1781254178490.jpg" 
                      alt="Style 6: Premium Clean-Shaven" 
                      className="w-10 h-12 object-cover rounded shadow-sm border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -top-1 -right-1 bg-stone-650 text-white p-0.5 rounded-full z-10">
                      <Sparkles size={6} className="animate-spin" />
                    </span>
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1">
                      <span className="block text-[10px] font-black text-stone-800">Clean-Shaven Black Suit</span>
                    </div>
                    <span className="block text-[8px] text-stone-500 font-medium font-sans">Fresh & clean face, slim cheeks, trimmed hair, black designer suit</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDownload(e, '/src/assets/images/volodymyr_clean_shaven_suit_1781254178490.jpg', 'volodymyr_clean_shaven_black_suit.jpg')}
                  className="p-2 ml-2 text-stone-500 hover:text-emerald-700 hover:bg-stone-100 rounded-lg border border-stone-200 bg-stone-50 transition-colors cursor-pointer select-none"
                  title="Download clean-shaven black suit high-res photo"
                >
                  <Download size={12} />
                </button>
              </div>

              {/* Option 5: Sovereign Beige Sweater (Core) */}
              <div 
                onClick={() => {
                  if (isAdminMode) {
                    onChange({ photoUrl: '/src/assets/images/volodymyr_beige_sweater_biometric_1781252081370.jpg' });
                  }
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all relative ${
                  data.photoUrl === '/src/assets/images/volodymyr_beige_sweater_biometric_1781252081370.jpg'
                    ? 'bg-white border-emerald-500/80 ring-2 ring-emerald-500/5 shadow-sm'
                    : 'bg-white/50 border-stone-200 hover:bg-white'
                } ${isAdminMode ? 'cursor-pointer hover:border-emerald-450' : 'cursor-not-allowed opacity-90'}`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="relative shrink-0">
                    <img 
                      src="/src/assets/images/volodymyr_beige_sweater_biometric_1781252081370.jpg" 
                      alt="Style 5: Sovereign Beige" 
                      className="w-10 h-12 object-cover rounded shadow-sm border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1">
                      <span className="block text-[10px] font-black text-stone-800">Sovereign Beige</span>
                    </div>
                    <span className="block text-[8px] text-stone-500 font-medium font-sans">Volodymyr holding casual biometric gaze</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDownload(e, '/src/assets/images/volodymyr_beige_sweater_biometric_1781252081370.jpg', 'volodymyr_beige_sweater_biometric.jpg')}
                  className="p-2 ml-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg border border-stone-200 bg-stone-50 transition-colors cursor-pointer select-none"
                  title="Download sovereign beige sweater high-res photo"
                >
                  <Download size={12} />
                </button>
              </div>

              {/* Option 4: Executive Suit ID */}
              <div 
                onClick={() => {
                  if (isAdminMode) {
                    onChange({ photoUrl: '/src/assets/images/volodymyr_suit_biometric_1781220217399.jpg' });
                  }
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all relative ${
                  data.photoUrl === '/src/assets/images/volodymyr_suit_biometric_1781220217399.jpg' || !data.photoUrl
                    ? 'bg-white border-red-500 ring-2 ring-red-500/10 shadow-sm'
                    : 'bg-white/50 border-stone-200 hover:bg-white'
                } ${isAdminMode ? 'cursor-pointer hover:border-red-400' : 'cursor-not-allowed opacity-90'}`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="relative shrink-0">
                    <img 
                      src="/src/assets/images/volodymyr_suit_biometric_1781220217399.jpg" 
                      alt="Style 4: Executive Suit" 
                      className="w-10 h-12 object-cover rounded shadow-sm border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white p-0.5 rounded-full z-10">
                      <Sparkles size={6} className="animate-spin" />
                    </span>
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1">
                      <span className="block text-[10px] font-black text-red-700">Executive Suit ID</span>
                    </div>
                    <span className="block text-[8px] text-stone-500 font-medium">Volodymyr dressed in black designer suit</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDownload(e, '/src/assets/images/volodymyr_suit_biometric_1781220217399.jpg', 'volodymyr_suit_biometric.jpg')}
                  className="p-2 ml-2 text-stone-500 hover:text-red-700 hover:bg-stone-100 rounded-lg border border-stone-200 bg-stone-50 transition-colors cursor-pointer select-none"
                  title="Download executive suit high-res image"
                >
                  <Download size={12} />
                </button>
              </div>
              
              {/* Option 1 */}
              <div 
                onClick={() => {
                  if (isAdminMode) {
                    onChange({ photoUrl: '/src/assets/images/passport_photo_volodymyr_1781217798121.jpg' });
                  }
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all relative ${
                  data.photoUrl === '/src/assets/images/passport_photo_volodymyr_1781217798121.jpg'
                    ? 'bg-white border-red-500 ring-2 ring-red-500/10 shadow-sm'
                    : 'bg-white/50 border-stone-200 hover:bg-white'
                } ${isAdminMode ? 'cursor-pointer hover:border-red-400' : 'cursor-not-allowed opacity-90'}`}
              >
                <div className="flex items-center gap-3 truncate">
                  <img 
                    src="/src/assets/images/passport_photo_volodymyr_1781217798121.jpg" 
                    alt="Style 1" 
                    className="w-10 h-12 object-cover rounded shadow-sm border border-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <span className="block text-[10px] font-bold text-stone-800">Biometric Studio ID</span>
                    <span className="block text-[8px] text-stone-500 font-medium">Standard biometric pose</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDownload(e, '/src/assets/images/passport_photo_volodymyr_1781217798121.jpg', 'volodymyr_biometric_style_1.jpg')}
                  className="p-2 ml-2 text-stone-500 hover:text-red-700 hover:bg-stone-100 rounded-lg border border-stone-200 bg-stone-50 transition-colors cursor-pointer select-none"
                  title="Download style 1 high-res image"
                >
                  <Download size={12} />
                </button>
              </div>

              {/* Option 2 */}
              <div 
                onClick={() => {
                  if (isAdminMode) {
                    onChange({ photoUrl: '/src/assets/images/volodymyr_biometric_v2_1781219076370.jpg' });
                  }
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all relative ${
                  data.photoUrl === '/src/assets/images/volodymyr_biometric_v2_1781219076370.jpg'
                    ? 'bg-white border-red-500 ring-2 ring-red-500/10 shadow-sm'
                    : 'bg-white/50 border-stone-200 hover:bg-white'
                } ${isAdminMode ? 'cursor-pointer hover:border-red-400' : 'cursor-not-allowed opacity-90'}`}
              >
                <div className="flex items-center gap-3 truncate">
                  <img 
                    src="/src/assets/images/volodymyr_biometric_v2_1781219076370.jpg" 
                    alt="Style 2" 
                    className="w-10 h-12 object-cover rounded shadow-sm border border-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <span className="block text-[10px] font-bold text-stone-800 font-sans">Biometric Style 2</span>
                    <span className="block text-[8px] text-stone-500 font-medium">Ministry High-Res source</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDownload(e, '/src/assets/images/volodymyr_biometric_v2_1781219076370.jpg', 'volodymyr_biometric_style_2.jpg')}
                  className="p-2 ml-2 text-stone-500 hover:text-red-700 hover:bg-stone-100 rounded-lg border border-stone-200 bg-stone-50 transition-colors cursor-pointer select-none"
                  title="Download style 2 high-res image"
                >
                  <Download size={12} />
                </button>
              </div>

              {/* Option 3: Ear Cuff Biometric Source */}
              <div 
                onClick={() => {
                  if (isAdminMode) {
                    onChange({ photoUrl: '/src/assets/images/volodymyr_ear_cuff_biometric_1781259031665.jpg' });
                  }
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all relative ${
                  data.photoUrl === '/src/assets/images/volodymyr_ear_cuff_biometric_1781259031665.jpg' || !data.photoUrl
                    ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm'
                    : 'bg-white/50 border-stone-200 hover:bg-white'
                } ${isAdminMode ? 'cursor-pointer hover:border-emerald-400' : 'cursor-not-allowed opacity-90'}`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="relative shrink-0">
                    <img 
                      src="/src/assets/images/volodymyr_ear_cuff_biometric_1781259031665.jpg" 
                      alt="Style 3: Ear Cuff Biometric" 
                      className="w-10 h-12 object-cover rounded shadow-sm border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full z-10">
                      <Sparkles size={6} className="animate-pulse" />
                    </span>
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1">
                      <span className="block text-[10px] font-black text-emerald-800">Biometric Portrait (Default)</span>
                      <span className="text-[7px] font-mono font-bold bg-emerald-100 text-emerald-950 px-1 rounded uppercase">DEFAULT</span>
                    </div>
                    <span className="block text-[8px] text-stone-500 font-medium leading-normal whitespace-normal w-52">
                      Oval face/tapered jaw, brown-hazel almond eyes, slight smile, right ear cuff (viewer's left). Ultra precise.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDownload(e, '/src/assets/images/volodymyr_ear_cuff_biometric_1781259031665.jpg', 'volodymyr_ear_cuff_biometric.jpg')}
                  className="p-2 ml-2 text-stone-500 hover:text-red-700 hover:bg-stone-100 rounded-lg border border-stone-200 bg-stone-50 transition-colors cursor-pointer select-none"
                  title="Download ear cuff biometric photo file"
                >
                  <Download size={12} />
                </button>
              </div>

            </div>
          </div>

          {/* Dynamic Passport Photo Physical Print Tuner */}
          <div className="bg-stone-50 rounded-2xl p-4.5 border border-stone-200/60 text-left">
            <h3 className="text-[10px] uppercase font-bold text-stone-700 tracking-wider flex items-center gap-1.5 mb-3 select-none">
              <Palette size={12} className="text-amber-600 shrink-0" />
              Physical Print & Photo Filter Tuner
            </h3>
            
            {/* Photo Filter Layout selector */}
            <div className="space-y-3.5">
              <div>
                <span className="block text-[8.5px] font-bold text-stone-500 uppercase tracking-widest mb-2 font-mono">
                  Ink & Bleed Print Simulation
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'analog-print', label: 'Analog Rosette', desc: 'Halftone press ink' },
                    { id: 'biometric-mono', label: 'State Mono', desc: 'High-contrast ink' },
                    { id: 'vintage-faded', label: 'Vintage Faded', desc: 'Aged warm sepia' },
                    { id: 'digital', label: 'Raw Digital', desc: 'No-filter source' }
                  ].map((filterOption) => (
                    <button
                      key={filterOption.id}
                      type="button"
                      disabled={!isAdminMode}
                      onClick={() => isAdminMode && onOverlayChange({ photoFilter: filterOption.id as any })}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between group ${
                        (overlays.photoFilter || 'analog-print') === filterOption.id
                          ? 'bg-white border-red-500 ring-2 ring-red-500/10 shadow-sm'
                          : 'bg-white/50 border-stone-200 hover:bg-white hover:border-stone-300'
                      } ${isAdminMode ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
                    >
                      <span className={`text-[9.5px] font-black uppercase tracking-wider block ${
                        (overlays.photoFilter || 'analog-print') === filterOption.id ? 'text-red-700' : 'text-stone-700'
                      }`}>
                        {filterOption.label}
                      </span>
                      <span className="text-[7.5px] text-stone-400 mt-1 leading-none font-medium">
                        {filterOption.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Core Physical Document Elements Toggles */}
              <div>
                <span className="block text-[8.5px] font-bold text-stone-500 uppercase tracking-widest mb-2 font-mono">
                  Physical Texture & Security Seals
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Halftone / Paper Substrate Fibers */}
                  <button
                    type="button"
                    disabled={!isAdminMode}
                    onClick={() => isAdminMode && onOverlayChange({ paperFiber: !overlays.paperFiber })}
                    className={`flex gap-2.5 items-center p-2.5 rounded-xl border transition-all text-left ${
                      overlays.paperFiber
                        ? 'bg-white border-emerald-500/80 ring-2 ring-emerald-500/5'
                        : 'bg-white/50 border-stone-200 hover:bg-white'
                    } ${isAdminMode ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                      overlays.paperFiber ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-300 bg-white'
                    }`}>
                      {overlays.paperFiber && <Check size={10} strokeWidth={3} />}
                    </div>
                    <div>
                      <span className="block text-[9px] font-black uppercase text-stone-800 tracking-wider leading-tight">Paper Fibers</span>
                      <span className="block text-[7px] text-stone-400 font-medium">Organic wood pulp texture</span>
                    </div>
                  </button>

                  {/* Overlapping Stamp */}
                  <button
                    type="button"
                    disabled={!isAdminMode}
                    onClick={() => isAdminMode && onOverlayChange({ overlayStamp: !overlays.overlayStamp })}
                    className={`flex gap-2.5 items-center p-2.5 rounded-xl border transition-all text-left ${
                      overlays.overlayStamp
                        ? 'bg-white border-emerald-500/80 ring-2 ring-emerald-500/5'
                        : 'bg-white/50 border-stone-200 hover:bg-white'
                    } ${isAdminMode ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                      overlays.overlayStamp ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-300 bg-white'
                    }`}>
                      {overlays.overlayStamp && <Check size={10} strokeWidth={3} />}
                    </div>
                    <div>
                      <span className="block text-[9px] font-black uppercase text-stone-800 tracking-wider leading-tight">Circular Stamp</span>
                      <span className="block text-[7px] text-stone-400 font-medium">Ink bleed overlay</span>
                    </div>
                  </button>

                  {/* Guilloche Lines Over Photo */}
                  <button
                    type="button"
                    disabled={!isAdminMode}
                    onClick={() => isAdminMode && onOverlayChange({ guillocheOverPhoto: !overlays.guillocheOverPhoto })}
                    className={`flex gap-2.5 items-center p-2.5 rounded-xl border transition-all text-left ${
                      overlays.guillocheOverPhoto
                        ? 'bg-white border-emerald-500/80 ring-2 ring-emerald-500/5'
                        : 'bg-white/50 border-stone-200 hover:bg-white'
                    } ${isAdminMode ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                      overlays.guillocheOverPhoto ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-300 bg-white'
                    }`}>
                      {overlays.guillocheOverPhoto && <Check size={10} strokeWidth={3} />}
                    </div>
                    <div>
                      <span className="block text-[9px] font-black uppercase text-stone-800 tracking-wider leading-tight">Security Wave</span>
                      <span className="block text-[7px] text-stone-400 font-medium">Anti-substitution lines</span>
                    </div>
                  </button>

                  {/* Photo Hologram OVD */}
                  <button
                    type="button"
                    disabled={!isAdminMode}
                    onClick={() => isAdminMode && onOverlayChange({ photoHologram: !overlays.photoHologram })}
                    className={`flex gap-2.5 items-center p-2.5 rounded-xl border transition-all text-left ${
                      overlays.photoHologram
                        ? 'bg-white border-emerald-500/80 ring-2 ring-emerald-500/5'
                        : 'bg-white/50 border-stone-200 hover:bg-white'
                    } ${isAdminMode ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                      overlays.photoHologram ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-300 bg-white'
                    }`}>
                      {overlays.photoHologram && <Check size={10} strokeWidth={3} />}
                    </div>
                    <div>
                      <span className="block text-[9px] font-black uppercase text-stone-800 tracking-wider leading-tight">Diffractive OVD</span>
                      <span className="block text-[7px] text-stone-400 font-medium">Holographic photo star</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!isAdminMode ? (
        <div className="flex flex-col gap-5 animate-fade-in text-left">
          {/* Read-Only Informative Warning Banner */}
          <div className="bg-amber-50 border border-amber-200/60 p-3 rounded-xl flex items-start gap-2 text-amber-900 select-none">
            <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider leading-none">Security Access: Sealed (Read-Only)</h4>
              <p className="text-[9px] text-stone-600 mt-0.5 leading-relaxed font-sans font-medium">
                Standard clearance logs only permit visualization. Toggle "Unseal Admin" above to enable dynamic signature modification, biometric landmark offset adjustments, or core detail calibrations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 bg-stone-50 rounded-xl p-4 border border-stone-200/55 shadow-sm">
              <span className="block text-[8px] font-bold text-stone-404 uppercase tracking-widest mb-1 font-mono">Citizen Identity Holder</span>
              <div className="text-sm font-black font-sans text-stone-900 tracking-wide flex items-center gap-1.5 uppercase">
                <span>{data.surname} {data.givenNames}</span>
              </div>
            </div>

            <div className="bg-stone-50/50 rounded-xl p-3 border border-stone-200/40 shadow-sm">
              <span className="block text-[8px] font-bold text-stone-404 uppercase tracking-wider font-mono">Date of Birth</span>
              <span className="text-xs font-mono font-bold text-stone-800 mt-1 block">{data.dateOfBirth}</span>
            </div>

            <div className="bg-stone-50/50 rounded-xl p-3 border border-stone-200/40 shadow-sm">
              <span className="block text-[8px] font-bold text-stone-404 uppercase tracking-wider font-mono">Luogo di Nascita</span>
              <span className="text-[11px] font-mono font-bold text-stone-800 mt-1 block uppercase truncate" title={data.placeOfBirth}>{data.placeOfBirth}</span>
            </div>

            <div className="bg-stone-50/50 rounded-xl p-3 border border-stone-200/40 shadow-sm">
              <span className="block text-[8px] font-bold text-stone-404 uppercase tracking-wider font-mono">Cittadinanza</span>
              <span className="text-xs font-mono font-bold text-stone-800 mt-1 block uppercase">{data.nationality}</span>
            </div>

            <div className="bg-stone-50/50 rounded-xl p-3 border border-stone-200/40 shadow-sm">
              <span className="block text-[8px] font-bold text-stone-404 uppercase tracking-wider font-mono">Sesso / Sex</span>
              <span className="text-xs font-mono font-bold text-stone-800 mt-1 block uppercase">{data.sex === 'M' ? 'Male (M)' : data.sex === 'F' ? 'Female (F)' : 'Other (X)'}</span>
            </div>

            <div className="bg-stone-50/50 rounded-xl p-3 border border-stone-200/40 shadow-sm">
              <span className="block text-[8px] font-bold text-stone-404 uppercase tracking-wider font-mono">Passport Number</span>
              <span className="text-xs font-mono font-black text-red-700 mt-1 block tracking-wider uppercase">{data.passportNumber}</span>
            </div>

            <div className="bg-stone-50/50 rounded-xl p-3 border border-stone-200/40 shadow-sm">
              <span className="block text-[8px] font-bold text-stone-404 uppercase tracking-wider font-mono">Personal Code</span>
              <span className="text-xs font-mono font-bold text-stone-800 mt-1 block tracking-tight uppercase">{data.personalNumber}</span>
            </div>

            <div className="col-span-2 bg-stone-50/30 rounded-xl p-4 border border-dashed border-stone-200">
              <span className="block text-[8px] font-bold text-stone-404 uppercase tracking-widest mb-2.5 flex items-center gap-1 font-mono">
                <MapPin size={11} className="text-red-700 animate-pulse" />
                Verified Civil Residence & Registry Contacts
              </span>
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs font-mono">
                <div>
                  <span className="block text-[8px] text-stone-404 font-bold uppercase tracking-wider">RESIDENCY (COUNTRY)</span>
                  <span className="font-bold text-stone-800 uppercase mt-0.5 block">{data.residentialAddress}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-stone-404 font-bold uppercase tracking-wider">COMUNE / CITY</span>
                  <span className="font-bold text-stone-800 uppercase mt-0.5 block">{data.city} ({data.postalCode})</span>
                </div>
                <div className="col-span-2 border-t border-stone-100 pt-2.5">
                  <span className="block text-[8px] text-stone-404 font-bold uppercase tracking-wider">EMAIL COMMUNICATION</span>
                  <span className="font-bold text-stone-800 mt-0.5 block break-all text-[11px]">{data.emailAddress}</span>
                </div>
                <div className="col-span-2 border-t border-stone-100 pt-2.5">
                  <span className="block text-[8px] text-stone-404 font-bold uppercase tracking-wider">SECURE TELEPHONY</span>
                  <span className="font-bold text-stone-800 mt-0.5 block">{data.phoneNumber}</span>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-stone-50 rounded-xl p-3 border border-stone-200/45 flex items-center justify-between">
              <div>
                <span className="block text-[8px] font-bold text-stone-404 uppercase tracking-wider font-mono">Autograph SPECIMEN</span>
                <span className="text-xs font-sans font-bold text-stone-800 mt-0.5 block">{data.signatureText}</span>
              </div>
              <div className="px-2.5 py-1 rounded bg-stone-200 text-stone-600 text-[9px] font-mono font-black uppercase select-none tracking-wider">
                LOCK_CONFIRMED
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-fade-in text-left">
          <div className="grid grid-cols-2 gap-4">
            {/* Surname */}
            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                1. Surname (Cognome)
              </label>
              <input
                type="text"
                name="surname"
                value={data.surname}
                onChange={handleInputChange}
                className="w-full text-xs font-mono border border-emerald-300 rounded-xl px-3 py-2.5 outline-none transition-all font-bold bg-white focus:ring-1 focus:ring-emerald-500 text-stone-850 shadow-sm"
                placeholder="e.g. TESTARDI"
              />
            </div>

            {/* Given name */}
            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                2. Given Names (Nomi)
              </label>
              <input
                type="text"
                name="givenNames"
                value={data.givenNames}
                onChange={handleInputChange}
                className="w-full text-xs font-mono border border-emerald-300 rounded-xl px-3 py-2.5 outline-none transition-all font-bold bg-white focus:ring-1 focus:ring-emerald-500 text-stone-850 shadow-sm"
                placeholder="e.g. Volodymyr"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                4. Date of Birth (Data nascita)
              </label>
              <input
                type="text"
                name="dateOfBirth"
                value={data.dateOfBirth}
                onChange={handleInputChange}
                className="w-full text-xs font-mono border border-emerald-300 rounded-xl px-3 py-2.5 outline-none transition-all bg-white focus:ring-1 focus:ring-emerald-500 text-stone-850 shadow-sm"
                placeholder="DD/MM/YYYY"
              />
            </div>

            {/* Country & Place of birth */}
            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                6. Place of Birth (Luogo)
              </label>
              <input
                type="text"
                name="placeOfBirth"
                value={data.placeOfBirth}
                onChange={handleInputChange}
                className="w-full text-xs font-mono border border-emerald-300 rounded-xl px-3 py-2.5 outline-none transition-all bg-white focus:ring-1 focus:ring-emerald-500 text-stone-850 shadow-sm"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                3. Nationality (Cittadinanza)
              </label>
              <input
                type="text"
                name="nationality"
                value={data.nationality}
                onChange={handleInputChange}
                className="w-full text-xs font-mono border border-emerald-300 rounded-xl px-3 py-2.5 outline-none transition-all uppercase bg-white focus:ring-1 focus:ring-emerald-500 text-stone-850 shadow-sm"
              />
            </div>

            {/* Sex Selection */}
            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                5. Sex (Sesso)
              </label>
              <select
                name="sex"
                value={data.sex}
                onChange={handleInputChange}
                className="w-full text-xs font-mono border border-emerald-300 rounded-xl px-3 py-2.5 outline-none transition-all bg-white focus:ring-1 focus:ring-emerald-500 text-stone-850 shadow-sm"
              >
                <option value="M">Male (M)</option>
                <option value="F">Female (F)</option>
                <option value="X">Other (X)</option>
              </select>
            </div>

            {/* Passport Serial */}
            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                Passport Number
              </label>
              <input
                type="text"
                name="passportNumber"
                value={data.passportNumber}
                onChange={handleInputChange}
                className="w-full text-xs font-mono border border-emerald-300 rounded-xl px-3 py-2.5 outline-none transition-all bg-white focus:ring-1 focus:ring-emerald-500 text-stone-850 shadow-sm"
              />
            </div>

            {/* Personal ID */}
            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                Personal Code / Fiscal
              </label>
              <input
                type="text"
                name="personalNumber"
                value={data.personalNumber}
                onChange={handleInputChange}
                className="w-full text-xs font-mono border border-emerald-300 rounded-xl px-3 py-2.5 outline-none transition-all bg-white focus:ring-1 focus:ring-emerald-500 text-stone-850 shadow-sm"
              />
            </div>
          </div>

          {/* Auxiliary Civil Records */}
          <div className="pt-4 border-t border-stone-100">
            <h3 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
              <MapPin size={12} className="text-emerald-750" />
              Civil Status & Residency Info
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-stone-600 mb-1">
                  Residential Address (Stato)
                </label>
                <input
                  type="text"
                  name="residentialAddress"
                  value={data.residentialAddress}
                  onChange={handleInputChange}
                  className="w-full text-xs font-mono border border-emerald-300 rounded-lg px-2.5 py-2 outline-none transition-all bg-white focus:ring-1 text-stone-850 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-stone-600 mb-1">
                  City (Comune di residenza)
                </label>
                <input
                  type="text"
                  name="city"
                  value={data.city}
                  onChange={handleInputChange}
                  className="w-full text-xs font-mono border border-emerald-300 rounded-lg px-2.5 py-2 outline-none transition-all bg-white focus:ring-1 text-stone-850 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-stone-600 mb-1">
                  Postal Code (CAP)
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={data.postalCode}
                  onChange={handleInputChange}
                  className="w-full text-xs font-mono border border-emerald-300 rounded-lg px-2.5 py-2 outline-none transition-all bg-white focus:ring-1 text-stone-850 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-stone-600 mb-1">
                  Civil Relationship Status
                </label>
                <input
                  type="text"
                  name="relationshipStatus"
                  value={data.relationshipStatus}
                  onChange={handleInputChange}
                  className="w-full text-xs font-sans border border-emerald-300 rounded-lg px-2.5 py-2 outline-none transition-all bg-white focus:ring-1 text-stone-850 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Communications */}
          <div className="pt-4 border-t border-stone-100">
            <h3 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
              <Mail size={12} className="text-emerald-750" />
              Contact Information & Signature
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-medium text-stone-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={data.emailAddress}
                  onChange={handleInputChange}
                  className="w-full text-xs font-mono border border-emerald-300 rounded-lg px-2.5 py-2 outline-none transition-all bg-white focus:ring-1 text-stone-850 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-stone-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={data.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full text-xs font-mono border border-emerald-300 rounded-lg px-2.5 py-2 outline-none transition-all bg-white focus:ring-1 text-stone-850 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-stone-600 mb-1">
                  Autograph Text (Firma)
                </label>
                <input
                  type="text"
                  name="signatureText"
                  value={data.signatureText}
                  onChange={handleInputChange}
                  className="w-full text-xs font-mono border border-emerald-300 rounded-lg px-2.5 py-2 outline-none transition-all bg-white focus:ring-1 text-stone-850 shadow-sm"
                  placeholder="e.g. V. Testardi"
                />
              </div>
            </div>
          </div>

          {/* Advanced Federal Calibration Desk - MODERN ADMIN CARD PROPERTIES TOOLS */}
          <div className="pt-5 border-t border-stone-200/80 mt-2 bg-stone-50/60 p-4.5 rounded-xl border border-stone-200/50 flex flex-col gap-4 animate-fade-in shadow-inner">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-stone-900 tracking-wider uppercase flex items-center gap-2 font-sans">
                <Sparkles size={13} className="text-emerald-700 animate-spin" />
                FEDERAL SECURE CALIBRATION DESK
              </h3>
              <span className="text-[8px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md uppercase border border-emerald-200 tracking-widest leading-none">
                Active Calibrator
              </span>
            </div>
            <p className="text-[10px] text-stone-500 leading-relaxed font-sans font-medium -mt-1">
              Admin exclusive: Tune and verify physical booklet characteristics in real-time. Dynamic values bind immediately to upper and lower booklet pages.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1.5">
              {/* Laser scan speed */}
              <div className="bg-white p-3 rounded-lg border border-stone-200/60 shadow-sm">
                <label className="block text-[9px] font-bold text-stone-600 uppercase tracking-wide mb-1 flex items-center justify-between font-mono">
                  <span>Landmark Sweep Rate</span>
                  <span className="font-mono text-emerald-700 font-bold">{(overlays.scanSpeedSec || 2.8).toFixed(1)}s / cycle</span>
                </label>
                <p className="layer-desc text-[8px] text-stone-400 mb-2 font-sans">Adjust biometric sweep sweeper speed</p>
                <input 
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.2"
                  value={overlays.scanSpeedSec || 2.8}
                  onChange={(e) => onOverlayChange({ scanSpeedSec: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-600 h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Biometric accuracy matching score */}
              <div className="bg-white p-3 rounded-lg border border-stone-200/60 shadow-sm">
                <label className="block text-[9px] font-bold text-stone-600 uppercase tracking-wide mb-1 flex items-center justify-between font-mono">
                  <span>Biometric Accordance Score</span>
                  <span className="font-mono text-emerald-700 font-bold">{(overlays.biometricMatchScore || 100.0).toFixed(1)}%</span>
                </label>
                <p className="layer-desc text-[8px] text-stone-400 mb-2 font-sans">Simulated facial correspondence index</p>
                <input 
                  type="range"
                  min="90.0"
                  max="100.0"
                  step="0.1"
                  value={overlays.biometricMatchScore || 100.0}
                  onChange={(e) => onOverlayChange({ biometricMatchScore: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-600 h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Landmark scan laser hue */}
              <div className="bg-white p-3 rounded-lg border border-stone-200/60 shadow-sm flex flex-col justify-between">
                <div>
                  <label className="block text-[9px] font-bold text-stone-600 uppercase tracking-wide mb-0.5 font-mono">
                    Landmark Laser Hue
                  </label>
                  <p className="layer-desc text-[8px] text-stone-400 mb-2 font-sans">Set coordinate projection laser spectral band</p>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mt-1">
                  {(['cyan', 'green', 'rose', 'amber'] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => onOverlayChange({ laserColor: color })}
                      className={`text-[9px] font-bold uppercase py-1 px-1.5 rounded-md border text-center transition-all ${
                        (overlays.laserColor || 'cyan') === color
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-600'
                      }`}
                    >
                      <div className="flex gap-1 items-center justify-center">
                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                          color === 'cyan' ? 'bg-cyan-400' : color === 'green' ? 'bg-emerald-500' : color === 'rose' ? 'bg-rose-500' : 'bg-amber-400'
                        }`} />
                        {color}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hologram pattern selection */}
              <div className="bg-white p-3 rounded-lg border border-stone-200/60 shadow-sm flex flex-col justify-between">
                <div>
                  <label className="block text-[9px] font-bold text-stone-600 uppercase tracking-wide mb-0.5 font-mono">
                    Holographic OVD Finish
                  </label>
                  <p className="layer-desc text-[8px] text-stone-400 mb-2 font-sans">Select metalized diffractive diffraction foil shape</p>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mt-1 font-mono">
                  {(['stars', 'hexagons', 'stripes'] as const).map((pattern) => (
                    <button
                      key={pattern}
                      type="button"
                      onClick={() => onOverlayChange({ hologramPattern: pattern })}
                      className={`text-[8.5px] font-bold uppercase py-1 px-1 rounded-md border text-center transition-all capitalize ${
                        (overlays.hologramPattern || 'stars') === pattern
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-600'
                      }`}
                    >
                      {pattern}
                    </button>
                  ))}
                </div>
              </div>

              {/* Watermark print opacity */}
              <div className="bg-white p-3 rounded-lg border border-stone-200/60 shadow-sm">
                <label className="block text-[9px] font-bold text-stone-600 uppercase tracking-wide mb-1 flex items-center justify-between font-mono">
                  <span>Watermark Print Opacity</span>
                  <span className="font-mono text-emerald-700 font-bold">{Math.round((overlays.watermarkOpacity !== undefined ? overlays.watermarkOpacity : 0.10) * 100)}%</span>
                </label>
                <p className="layer-desc text-[8px] text-stone-400 mb-2 font-sans">Configure paper substrate transparent crest index</p>
                <input 
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.05"
                  value={overlays.watermarkOpacity !== undefined ? overlays.watermarkOpacity : 0.10}
                  onChange={(e) => onOverlayChange({ watermarkOpacity: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-600 h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Signature autograph ink */}
              <div className="bg-white p-3 rounded-lg border border-stone-200/60 shadow-sm flex flex-col justify-between">
                <div>
                  <label className="block text-[9px] font-bold text-stone-600 uppercase tracking-wide mb-0.5 font-mono">
                    Specimen Autograph Ink
                  </label>
                  <p className="layer-desc text-[8px] text-stone-400 mb-2 font-sans">Set ink pigment formulation for signatory autograph</p>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mt-1 font-mono">
                  {(['blue', 'purple', 'black'] as const).map((ink) => (
                    <button
                      key={ink}
                      type="button"
                      onClick={() => onOverlayChange({ signatureInk: ink })}
                      className={`text-[9px] font-bold uppercase py-1 px-1 rounded-md border text-center transition-all capitalize ${
                        (overlays.signatureInk || 'blue') === ink
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-600'
                      }`}
                    >
                      <div className="flex gap-1 items-center justify-center">
                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                          ink === 'blue' ? 'bg-[#1e3a8a]' : ink === 'purple' ? 'bg-[#581c87]' : 'bg-stone-900'
                        }`} />
                        {ink}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
