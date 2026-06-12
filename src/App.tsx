import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { PassportData, SecurityOverlay } from './types';
import { PassportCard } from './components/PassportCard';
import { PassportForm } from './components/PassportForm';
import { AdminLoginModal } from './components/AdminLoginModal';
import { 
  Building, 
  MapPin, 
  User, 
  Fingerprint, 
  Check, 
  Sparkles, 
  Lock, 
  Info,
  Shield,
  Eye,
  BookOpen,
  Mail,
  Smartphone,
  CheckCircle,
  EyeOff,
  Printer,
  X,
  Camera,
  Cpu,
  FileDown,
  ShieldCheck,
  Radio,
  Users,
  Zap
} from 'lucide-react';

const INITIAL_PASSPORT_DATA: PassportData = {
  surname: 'TESTARDI',
  givenNames: 'Volodymyr',
  nationality: 'ITALIAN / ITA',
  dateOfBirth: '18/03/1997',
  placeOfBirth: 'Kyiv Oblast (Ukraine)',
  sex: 'M',
  dateOfIssue: '10/06/2022',
  dateOfExpiry: '09/06/2032',
  authority: 'QUESTURA DI ROMA',
  passportNumber: 'YA7854612',
  personalNumber: 'TSTRD97C18Z138X',
  relationshipStatus: 'Single',
  residentialAddress: 'Italy',
  city: 'Rome',
  postalCode: '00118',
  emailAddress: 'volodymyrtestardi77@gmail.com',
  phoneNumber: '+14582774884',
  signatureText: 'Volodymyr Testardi',
  photoUrl: '/src/assets/images/volodymyr_ear_cuff_biometric_1781259031665.jpg'
};

export default function App() {
  const [profiles, setProfiles] = useState<PassportData[]>([
    {
      surname: 'TESTARDI',
      givenNames: 'Volodymyr',
      nationality: 'ITALIAN / ITA',
      dateOfBirth: '18/03/1997',
      placeOfBirth: 'Kyiv Oblast (Ukraine)',
      sex: 'M',
      dateOfIssue: '10/06/2022',
      dateOfExpiry: '09/06/2032',
      authority: 'QUESTURA DI ROMA',
      passportNumber: 'YA7854612',
      personalNumber: 'TSTRD97C18Z138X',
      relationshipStatus: 'Single',
      residentialAddress: 'Italy',
      city: 'Rome',
      postalCode: '00118',
      emailAddress: 'volodymyrtestardi77@gmail.com',
      phoneNumber: '+14582774884',
      signatureText: 'Volodymyr Testardi',
      photoUrl: '/src/assets/images/volodymyr_ear_cuff_biometric_1781259031665.jpg'
    },
    {
      surname: 'ROSSI',
      givenNames: 'Sofia',
      nationality: 'ITALIAN / ITA',
      dateOfBirth: '24/11/1999',
      placeOfBirth: 'Milan (Italy)',
      sex: 'F',
      dateOfIssue: '14/02/2023',
      dateOfExpiry: '13/02/2033',
      authority: 'QUESTURA DI MILANO',
      passportNumber: 'YA1248596',
      personalNumber: 'RSSSF99S24M109A',
      relationshipStatus: 'Married',
      residentialAddress: 'Italy',
      city: 'Milan',
      postalCode: '20121',
      emailAddress: 'sofia.rossi99@it-gov.it',
      phoneNumber: '+393334567890',
      signatureText: 'Sofia Rossi',
      photoUrl: '/src/assets/images/sofia_rossi_biometric_photo_1781252116179.jpg'
    },
    {
      surname: 'BIANCHI',
      givenNames: 'Marco',
      nationality: 'ITALIAN / ITA',
      dateOfBirth: '05/08/1992',
      placeOfBirth: 'Naples (Italy)',
      sex: 'M',
      dateOfIssue: '22/09/2021',
      dateOfExpiry: '21/09/2031',
      authority: 'QUESTURA DI NAPOLI',
      passportNumber: 'YA9845123',
      personalNumber: 'BNCHMC92M05F839Z',
      relationshipStatus: 'Single',
      residentialAddress: 'Italy',
      city: 'Naples',
      postalCode: '80125',
      emailAddress: 'm.bianchi@gmail.com',
      phoneNumber: '+393456789012',
      signatureText: 'Marco Bianchi',
      photoUrl: '/src/assets/images/marco_bianchi_biometric_photo_1781252130858.jpg'
    }
  ]);
  const [activeProfileIndex, setActiveProfileIndex] = useState<number>(0);
  const passportData = profiles[activeProfileIndex];

  const [overlays, setOverlays] = useState<SecurityOverlay>({
    showGuilloche: true,
    showWatermark: true,
    showUvLight: false,
    uvIntensity: 75,
    showMrzLayout: true,
    isHologramActive: true,
    showLandmarks: false, // Default landmarks off so they can appreciate the clean, stunning realistic printed photograph
    photoFilter: 'analog-print',
    overlayStamp: true,
    guillocheOverPhoto: true,
    paperFiber: true,
    photoHologram: true,
    quantumKeyVerified: true,
    irisMatchScore: 99.8,
    irisScanActive: true,
    nfcChipVerified: true,
    showMagnifier: false,
  });

  const [activeRole, setActiveRole] = useState<'admin' | 'viewer'>('viewer');
  const isAdminMode = activeRole === 'admin';
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [activeInviteCode, setActiveInviteCode] = useState<string | null>(null);
  const [adminUsername, setAdminUsername] = useState<string>('');

  // Hydrate admin session state on application boot
  useEffect(() => {
    const activeAdmin = localStorage.getItem('current_active_admin');
    if (activeAdmin) {
      setActiveRole('admin');
      setAdminUsername(activeAdmin);
    }
  }, []);

  // Sync active admin state when roles or login screens shift
  useEffect(() => {
    if (activeRole === 'admin') {
      const storedAdmin = localStorage.getItem('current_active_admin') || 'admin';
      setAdminUsername(storedAdmin);
    } else {
      setAdminUsername('');
      setActiveInviteCode(null);
    }
  }, [activeRole, isLoginOpen]);

  // Generate dynamic invite codes for co-operator takeovers
  const handleGenerateInvite = () => {
    const rand = Math.floor(100000 + Math.random() * 900000);
    const code = `INV-${rand}`;
    const stored: string[] = JSON.parse(localStorage.getItem('active_admin_invites') || '[]');
    stored.push(code);
    localStorage.setItem('active_admin_invites', JSON.stringify(stored));
    setActiveInviteCode(code);
    playTechPing();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret operator bypass combo: Ctrl + Alt + A
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsLoginOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [hologramPos, setHologramPos] = useState({ x: 200, y: 150 });
  const [activeTab, setActiveTab] = useState<'visual' | 'dossier'>('visual');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // High-tech audio feedback chime
  const playTechPing = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      
      // First high pulse (C6 note - clean bright chime)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.50, now);
      osc1.frequency.exponentialRampToValueAtTime(1567.98, now + 0.12);
      
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(1200, now);
      filter1.Q.setValueAtTime(1.2, now);
      
      osc1.connect(gain1);
      gain1.connect(filter1);
      filter1.connect(ctx.destination);
      
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Second crisp offset chime (G6 note - tech confirmation chirp)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1567.98, now + 0.08);
      
      gain2.gain.setValueAtTime(0.001, now + 0.08);
      gain2.gain.linearRampToValueAtTime(0.08, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.25);
    } catch (e) {
      console.warn('AudioContext feedback initialization skipped/blocked:', e);
    }
  };

  // e-Passport Contactless NFC chip reader state
  const [isNfcSimulatorOpen, setIsNfcSimulatorOpen] = useState(false);
  const [nfcState, setNfcState] = useState<'ready' | 'connecting' | 'decoding' | 'genuine'>('ready');
  const [nfcProgress, setNfcProgress] = useState(0);
  const [nfcLogs, setNfcLogs] = useState<string[]>([]);

  const startNfcScanningSequence = () => {
    setIsNfcSimulatorOpen(true);
    setNfcState('connecting');
    setNfcProgress(0);
    setNfcLogs([
      "[0.0s] Booting ISO/IEC 14443 Type-A high-speed host controller...",
      "[0.4s] Contactless carrier wave established. Emitting 13.56 MHz resonant signal.",
      "[0.8s] Awaiting close proximity match with embedded e-Passport chip..."
    ]);

    // Stage 1 Handshake
    setTimeout(() => {
      setNfcProgress(25);
      setNfcLogs(prev => [
        ...prev,
        "[1.3s] RF proximity signature detected (NXP PN532 physical chip compliant).",
        "[1.8s] Anti-collision sequence finished. PUPI (Pseudo-Unique PICC Identifier) mapped: 04:AE:8F:D2.",
        "[2.2s] Commencing standard Basic Access Control (BAC) protocol handshake."
      ]);
    }, 1200);

    // Stage 2 Decryption A
    setTimeout(() => {
      setNfcProgress(50);
      setNfcState('decoding');
      setNfcLogs(prev => [
        ...prev,
        "[2.8s] Generating dynamic session cryptography keypair: K_ENC & K_MAC.",
        "[3.2s] BAC authentication SUCCESS. Standard eMRTD Secure Messaging channel locked.",
        "[3.6s] Inspecting file directory. Active LDS (Logical Data Structure) v1.8 localized."
      ]);
    }, 2800);

    // Stage 3 Decryption B
    setTimeout(() => {
      setNfcProgress(75);
      setNfcLogs(prev => [
        ...prev,
        "[4.1s] Reading element file EF.DG1: Holder Demographics [ICAO standard format].",
        "[4.5s] Reading element file EF.DG2: Extracted Compressed Biometric Face Image [JP2000].",
        "[5.0s] Engaging Active Authentication challenge-response using CSCA public key."
      ]);
    }, 4500);

    // Stage 4 Validated Genuine
    setTimeout(() => {
      setNfcProgress(100);
      setNfcState('genuine');
      playTechPing();
      setNfcLogs(prev => [
        ...prev,
        "[5.6s] Sovereign Cabinet crypto hash validated: SHA-3 ECDSA signature match.",
        "[5.8s] Chip validity: 100% GENUINE. Embedded cryptoprocessor is verified as original.",
        "[6.0s] e-Chip scanner session closed. Verification logs sealed."
      ]);
    }, 6000);
  };

  // Barcode scanner simulation states
  const [isScanSimulatorOpen, setIsScanSimulatorOpen] = useState(false);
  const [scanState, setScanState] = useState<'scanning' | 'decoding' | 'success'>('scanning');
  const [scanProgress, setScanProgress] = useState(0);

  const startScanningSequence = () => {
    setIsScanSimulatorOpen(true);
    setScanState('scanning');
    setScanProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setScanProgress(progress);
      if (progress === 40) {
        setScanState('decoding');
      } else if (progress === 100) {
        setScanState('success');
        playTechPing();
        clearInterval(interval);
      }
    }, 450);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdfAudit = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 1. Italian Flag Header Accent (Green, White, Red top bar)
      // Standard A4 width is 210mm. Margin is 15mm.
      doc.setFillColor(0, 146, 70); // Green
      doc.rect(15, 12, 60, 3, 'F');
      
      doc.setFillColor(245, 245, 245); // Light Gray
      doc.rect(75, 12, 60, 3, 'F');
      
      doc.setFillColor(206, 43, 55); // Red
      doc.rect(135, 12, 60, 3, 'F');

      // 2. Official Authority Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text("REPUBBLICA ITALIANA", 15, 22);
      doc.text("MINISTERO DELL'INTERNO", 15, 26);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text("DIPARTIMENTO PER I SERVIZI DEMOGRAFICI", 15, 30);
      doc.text("CENTRO NAZIONALE DI DIAGNOSTICA BIOMETRICA", 15, 34);
      
      // Right side metadata
      const dateStr = "2026-06-11 16:52 UTC"; 
      doc.setFontSize(7.5);
      doc.text(`AUDIT ID: ITA-SPEC-${passportData.passportNumber}-V2`, 195, 22, { align: 'right' });
      doc.text(`VERIFICATION DATE: ${dateStr}`, 195, 26, { align: 'right' });
      doc.text("GATEWAY NODE: SECURE_VERIFY_C24", 195, 30, { align: 'right' });

      // Fine Separator line
      doc.setDrawColor(226, 223, 208); 
      doc.setLineWidth(0.4);
      doc.line(15, 38, 195, 38);

      // Main Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("PASSPORT DIAGNOSTIC & VERIFICATION REPORT", 15, 46);
      
      // Subtitle
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text("Official analytical diagnostics audit certificate of the digital passport specimen integrity.", 15, 50);

      // Section 1: Holder Particulars Box (Card)
      doc.setFillColor(248, 247, 244); // warm cream tint
      doc.rect(15, 55, 180, 50, 'F');
      doc.setDrawColor(224, 218, 201); // warm border
      doc.setLineWidth(0.35);
      doc.rect(15, 55, 180, 50, 'S');

      // Card Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(120, 53, 4); // amber-900
      doc.text("I. PASSPORT HOLDER PERSONAL DEMOGRAPHICS", 19, 61);
      doc.setDrawColor(241, 196, 15); // gold accent
      doc.setLineWidth(0.3);
      doc.line(19, 63, 100, 63);

      // Details columns
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // Slate-400 label
      doc.text("SURNAME:", 20, 70);
      doc.text("GIVEN NAMES:", 20, 76);
      doc.text("DATE OF BIRTH:", 20, 82);
      doc.text("SEX / NATIONALITY:", 20, 88);
      doc.text("PLACE OF BIRTH:", 20, 94);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42); // slate-900 value
      doc.text(passportData.surname.toUpperCase(), 58, 70);
      doc.text(passportData.givenNames, 58, 76);
      doc.text(passportData.dateOfBirth, 58, 82);
      doc.text(`${passportData.sex} / ${passportData.nationality}`, 58, 88);
      doc.text(passportData.placeOfBirth, 58, 94);

      // Right Column inside Box 1 (Passport Document Info)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("DOCUMENT TYPE:", 114, 70);
      doc.text("PASSPORT NUMBER:", 114, 76);
      doc.text("DATE OF ISSUE:", 114, 82);
      doc.text("DATE OF EXPIRY:", 114, 88);
      doc.text("ISSUING AUTHORITY:", 114, 94);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text("ITALIAN E-PASSPORT (PEP)", 151, 70);
      doc.setTextColor(180, 83, 9); // amber-700
      doc.text(passportData.passportNumber, 151, 76);
      doc.setTextColor(15, 23, 42);
      doc.text(passportData.dateOfIssue, 151, 82);
      doc.text(passportData.dateOfExpiry, 151, 88);
      doc.text(passportData.authority, 151, 94);

      // Section 2: Physical Verification Diagnostics Matrix
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text("II. ANTI-COUNTERFEITING TECHNICAL DIAGNOSTICS", 15, 113);
      doc.setDrawColor(226, 223, 208);
      doc.setLineWidth(0.3);
      doc.line(15, 115, 195, 115);

      // Table mapping current active features of the UI
      const tableHeaders = ["PHYSICAL SPECIMEN CHECKMARK PARAMETER", "SYSTEM STATUS", "CRYPTOGRAPHIC AUDIT MATCH"];
      const tableData = [
        ["Intaglio Guilloche Security Overlay", overlays.showGuilloche ? "SECURE ACTIVE" : "BYPASSED MANUAL", "LATENT_100%_CONFORMANCE"],
        ["Crest Federal Watermark Layer", overlays.showWatermark ? "SECURE ACTIVE" : "BYPASSED MANUAL", "WATERMARK_CREST_OPAQUE_OK"],
        ["Ultraviolet (UV) Fluorescent Fibers", overlays.showUvLight ? "UV_LIGHT ON" : "SECURE PASSIVE", "WOODS_GLASS_EMISSION_365NM"],
        ["ICAO Machine Readable Zone (MRZ)", overlays.showMrzLayout ? "ICAO COMPLIANT" : "BYPASSED MANUAL", `VALID_CHECKSUM_OK (${passportData.passportNumber})`],
        ["Diffractive Holographic Foil Stars (OVD)", overlays.isHologramActive ? "ACTIVE ON" : "BYPASSED MANUAL", "DIFFRACTION_MATRIX_VERIFIED"],
        ["Secure 2D Matrix Cryptographic QR Code", "SECURE STAMPED", "ECDSA_RSA_DECRYPTED_GENUINE"],
        ["Physical Paper Fiber Substrate Simulation", overlays.paperFiber ? "SIMULATED ENHANCED" : "PASSIVE BASIC", "ORGANIC_PAPER_GRAIN_VERIFIED"],
        ["Official Circular Red-Ink Stamp Seal", overlays.overlayStamp ? "STAMPED AND EMBOSSED" : "UNSTAMPED SPECIMEN", "REPUBBLICA_ITALIANA_QUESTURA_ROMA"]
      ];

      // Draw table header row
      doc.setFillColor(15, 23, 42);
      doc.rect(15, 119, 180, 6, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(tableHeaders[0], 18, 123);
      doc.text(tableHeaders[1], 106, 123);
      doc.text(tableHeaders[2], 144, 123);

      // Draw table rows
      let currentY = 125;
      tableData.forEach((row, idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(245, 247, 250);
        } else {
          doc.setFillColor(255, 255, 255);
        }
        doc.rect(15, currentY, 180, 5.5, 'F');
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(51, 65, 85);
        doc.text(row[0], 18, currentY + 4);
        
        const status = row[1];
        doc.setFont("helvetica", "bold");
        if (status.includes("ACTIVE") || status.includes("COMPLIANT") || status.includes("SECURE") || status.includes("ON") || status.includes("VERIFIED") || status.includes("STAMPED")) {
          doc.setTextColor(4, 120, 87); // Green emerald-700
        } else {
          doc.setTextColor(180, 83, 9); // Amber-700
        }
        doc.text(status, 106, currentY + 4);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(6.5);
        doc.text(row[2], 144, currentY + 4);
        
        currentY += 5.5;
      });

      // Section 3: Biometric Match Verification Summary
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text("III. FACIAL BIOMETRIC COGNITIVE ANALYSIS", 15, currentY + 8);
      doc.setDrawColor(226, 223, 208);
      doc.setLineWidth(0.3);
      doc.line(15, currentY + 10, 195, currentY + 10);

      const bioY = currentY + 13;
      doc.setFillColor(240, 253, 244); // light emerald-50
      doc.rect(15, bioY, 180, 31, 'F');
      doc.setDrawColor(186, 230, 253); 
      doc.setLineWidth(0.35);
      doc.rect(15, bioY, 180, 31, 'S');

      doc.setDrawColor(16, 185, 129); // emerald
      doc.setLineWidth(0.5);
      doc.circle(32, bioY + 15.5, 10, 'S');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(4, 120, 87);
      doc.text("PASS", 32, bioY + 19, { align: 'center' });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(21, 128, 61); // green-700
      doc.text("BIOMETRIC RECOGNITION MATCH SCORE: 100% GENUINE SPECIMEN", 50, bioY + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(51, 65, 85);
      doc.text("● COORDINATE LANDMARK INDEX: Eye contour, nasal apex, and oral width coordinate values analyzed", 50, bioY + 12);
      doc.text("● RESEMBLANCE VERDICT: Facial signature matches 100% with the State Census Core Registry (Rome)", 50, bioY + 17);
      doc.text("● CRYPTOGRAPHIC VALIDITY: Signed by State Hardware Security Module (HSM) verified signature.", 50, bioY + 22);
      doc.text("● EXPATRIATION INTEGRITY INDEX: Valid & authorized citizen document. No warnings active.", 50, bioY + 27);

      // Section 4: Document Signature / Legal Disclaimer & Seal
      const signY = bioY + 37;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("AUTHORITATIVE SECURITY ASSURANCE & SIGN-OFF", 15, signY);
      doc.line(15, signY + 2, 195, signY + 2);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text("LEGAL DECLARATION", 15, signY + 7);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text("This diagnostic report represents a simplified validation of the specimen's security parameters in accordance with ICAO Document 9303 protocols.", 15, signY + 11);
      doc.text("All cryptographic keys, watermarks, anti-substitution guilloche lines, and face resemblance nodes have been scanned and authenticated.", 15, signY + 14);
      doc.text("Ministero dell'Interno certifies this specimen is active and validated for demo scanning purposes. Fraudulent representation or replication is strictly prohibited.", 15, signY + 17);

      // Signature block representation
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59); 
      doc.text(passportData.signatureText || "Volodymyr Testardi", 145, signY + 11);
      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(0.25);
      doc.line(135, signY + 14, 185, signY + 14);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text("DIGITAL SIGNATURE / HOLDER CONFIRMATION", 137, signY + 17);

      // Footer brandings
      doc.setDrawColor(226, 223, 208);
      doc.line(15, 276, 195, 276);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184); 
      doc.text("DIREZIONE GENERALE STATO CIVILE - REPUBLIC OF ITALY - OFFICIAL DIAGNOSTICS REPORT DOCUMENT VERIFICATION", 15, 281);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(16, 185, 129);
      doc.text("● SECURE DOCUMENT VALIDATED FOR DEPLOYED CLIENT PORTAL (REPUBBLICA ITALIANA)", 15, 285);

      // Save PDF file
      doc.save(`PASSPORT_AUDIT_${passportData.passportNumber}_${passportData.surname.toUpperCase()}.pdf`);
    } catch (e) {
      console.error(e);
      alert("An error occurred while generating the PDF audit report.");
    }
  };

  const handleRoleChange = (role: 'admin' | 'viewer') => {
    if (role === 'admin') {
      setIsLoginOpen(true);
    } else {
      setActiveRole('viewer');
      localStorage.removeItem('current_active_admin');
      setActiveProfileIndex(0); // Viewers only see Volodymyr's profile
    }
  };

  const handleDataChange = (newData: Partial<PassportData>) => {
    setProfiles(prev => {
      const updated = [...prev];
      updated[activeProfileIndex] = { ...updated[activeProfileIndex], ...newData };
      return updated;
    });
  };

  const handleReset = () => {
    setProfiles(prev => {
      const updated = [...prev];
      if (activeProfileIndex === 0) {
        updated[0] = {
          ...INITIAL_PASSPORT_DATA,
          photoUrl: '/src/assets/images/volodymyr_ear_cuff_biometric_1781259031665.jpg'
        };
      } else if (activeProfileIndex === 1) {
        updated[1] = {
          surname: 'ROSSI',
          givenNames: 'Sofia',
          nationality: 'ITALIAN / ITA',
          dateOfBirth: '24/11/1999',
          placeOfBirth: 'Milan (Italy)',
          sex: 'F',
          dateOfIssue: '14/02/2023',
          dateOfExpiry: '13/02/2033',
          authority: 'QUESTURA DI MILANO',
          passportNumber: 'YA1248596',
          personalNumber: 'RSSSF99S24M109A',
          relationshipStatus: 'Married',
          residentialAddress: 'Italy',
          city: 'Milan',
          postalCode: '20121',
          emailAddress: 'sofia.rossi99@it-gov.it',
          phoneNumber: '+393334567890',
          signatureText: 'Sofia Rossi',
          photoUrl: '/src/assets/images/sofia_rossi_biometric_photo_1781252116179.jpg'
        };
      } else if (activeProfileIndex === 2) {
        updated[2] = {
          surname: 'BIANCHI',
          givenNames: 'Marco',
          nationality: 'ITALIAN / ITA',
          dateOfBirth: '05/08/1992',
          placeOfBirth: 'Naples (Italy)',
          sex: 'M',
          dateOfIssue: '22/09/2021',
          dateOfExpiry: '21/09/2031',
          authority: 'QUESTURA DI NAPOLI',
          passportNumber: 'YA9845123',
          personalNumber: 'BNCHMC92M05F839Z',
          relationshipStatus: 'Single',
          residentialAddress: 'Italy',
          city: 'Naples',
          postalCode: '80125',
          emailAddress: 'm.bianchi@gmail.com',
          phoneNumber: '+393456789012',
          signatureText: 'Marco Bianchi',
          photoUrl: '/src/assets/images/marco_bianchi_biometric_photo_1781252130858.jpg'
        };
      }
      return updated;
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHologramPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const toggleOverlay = (key: keyof SecurityOverlay) => {
    setOverlays(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadDossier = () => {
    const rawData = {
      agency: "Ministero dell'Interno - Repubblica Italiana",
      timestamp: new Date().toISOString(),
      document_standard: "ICAO Doc 9303 (TD3 Passport Booklet)",
      subject: {
        surname: passportData.surname,
        given_names: passportData.givenNames,
        nationality: passportData.nationality,
        date_of_birth: passportData.dateOfBirth,
        place_of_birth: passportData.placeOfBirth,
        sex: passportData.sex,
        resid_address: `${passportData.city} (${passportData.postalCode}), ${passportData.residentialAddress}`,
        civil_status: passportData.relationshipStatus,
        contact_email: passportData.emailAddress,
        contact_phone: passportData.phoneNumber,
      },
      document_validity: {
        passport_number: passportData.passportNumber,
        personal_fiscal_code: passportData.personalNumber,
        date_of_issue: passportData.dateOfIssue,
        date_of_expiry: passportData.dateOfExpiry,
        authority: passportData.authority,
        signature_specimen: passportData.signatureText,
      },
      biometrics: {
        face_matching_match_score: "100.0%",
        face_contour_points: 68,
        inter_pupillary_distance: "64.21mm",
        symmetry_index: "99.8%",
        status: "APPROVED_AND_SIGNED_BY_ADMIN"
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rawData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `ITA_PASSPORT_DOSSIER_${passportData.passportNumber}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-red-200">
      
      {/* Elegantly Crafted Premium Top Bar */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-50 px-6 py-4 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-700 to-amber-700 flex items-center justify-center text-white shadow-md shadow-red-700/10">
              <span className="font-bold text-lg tracking-wider">IT</span>
            </div>
            <div>
              <h1 className="text-base font-black text-stone-900 tracking-tight flex items-center gap-2">
                Italian Passport Verification Portal
                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[9px] rounded-full font-bold font-mono tracking-widest uppercase">
                  ACTIVE
                </span>
              </h1>
              <p className="text-xs text-stone-500 font-medium">Official Digital Resemblance & Hologram Compliance Viewer</p>
            </div>
          </div>

          {/* Symmetrical Operator Role Selection Chips */}
          {activeRole === 'admin' ? (
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/50 shadow-inner no-print md:mx-auto">
              <span className="text-[9.5px] font-mono font-bold text-stone-400 px-2 uppercase tracking-widest">Active Role:</span>
              <button
                onClick={() => handleRoleChange('viewer')}
                className="px-3.5 py-1.5 rounded-lg text-[10.5px] font-bold transition-all uppercase tracking-wide cursor-pointer bg-stone-900 text-white shadow-sm hover:bg-stone-800"
              >
                👑 Lock Admin Session
              </button>
            </div>
          ) : (
            <div className="hidden md:block md:flex-1" />
          )}

          <div className="flex items-center gap-3 no-print">
            <span className="text-[11px] font-mono font-medium text-stone-500 bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Verifying: Volodymyr Testardi
            </span>
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`text-xs px-4 py-2.5 rounded-xl border font-bold flex items-center gap-2 transition-all cursor-pointer select-none ${
                isPreviewMode 
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm' 
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {isPreviewMode ? <EyeOff size={14} /> : <Eye size={14} />}
              {isPreviewMode ? "Exit Preview" : "Clean Preview"}
            </button>
            <button
              onClick={handlePrint}
              className="bg-red-700 hover:bg-red-800 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer select-none"
            >
              <Printer size={14} />
              Print Specimen
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {isPreviewMode ? (
          <div className="max-w-3xl mx-auto flex flex-col gap-6 select-none animate-fade-in no-print">
            
            {/* Clean Document Preview Notification Bar */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 shadow-sm text-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">Clean Document Preview Mode</h3>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                    Interactive controls and parameter sidebars are hidden. Scale represents the official physical standard (125mm x 88mm) for TD3 passports.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 self-end md:self-auto uppercase font-mono text-[10px] font-bold">
                <button
                  onClick={() => setIsPreviewMode(false)}
                  className="px-4 py-2 border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 rounded-xl text-stone-700 transition cursor-pointer"
                >
                  Edit Credentials
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={12} />
                  Print Specimen
                </button>
              </div>
            </div>

            {/* Passport Card Isolated */}
            <div 
              onDoubleClick={() => setIsLoginOpen(true)}
              className="bg-stone-900 border border-stone-800 rounded-3xl p-8 py-16 flex justify-center items-center shadow-2xl relative overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.15)_0%,_rgba(0,0,0,0)_60%)] pointer-events-none" />
              
              <PassportCard 
                data={passportData}
                overlay={{
                  ...overlays,
                  isHologramActive: false // Disable screen hologram glare in print/preview for maximum physical clarity
                }}
                onHoverHologram={handleMouseMove}
                hologramPos={hologramPos}
                onSelectQrCode={startScanningSequence}
                onSelectNfcChip={startNfcScanningSequence}
              />
            </div>

            {/* Print Dimensions Guide Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/50 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Physical Standard</span>
                <span className="text-xs font-mono font-bold text-stone-800">ICAO Document 9303 (TD3)</span>
              </div>
              <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6">
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Exact Width</span>
                <span className="text-xs font-mono font-bold text-stone-800">125 mm (4.92 inches)</span>
              </div>
              <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6">
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Exact Height</span>
                <span className="text-xs font-mono font-bold text-stone-800">88 mm (3.46 inches)</span>
              </div>
            </div>

          </div>
        ) : (
          <>
            {/* Core Quick Overview Row */}
            <section className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 select-none">
              
              <div className="bg-white rounded-xl border border-stone-200/80 p-4 shadow-sm flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Verified Surname</p>
                  <h4 className="text-xs font-mono font-bold text-stone-800">{passportData.surname}</h4>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200/80 p-4 shadow-sm flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Date of Birth</p>
                  <h4 className="text-xs font-mono font-bold text-stone-800">{passportData.dateOfBirth}</h4>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200/80 p-4 shadow-sm flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Residence (Italy)</p>
                  <h4 className="text-xs font-mono font-bold text-stone-800">{passportData.city}, {passportData.postalCode}</h4>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200/80 p-4 shadow-sm flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                  <Fingerprint size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Relationship Status</p>
                  <h4 className="text-xs font-mono font-bold text-stone-800">{passportData.relationshipStatus}</h4>
                </div>
              </div>

            </section>

            {/* Master Double-Column Visual Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Real-time Hologram Canvas and Diagnostics (7 Cols) */}
              <section className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Real Passport Specimen component wrapper */}
                <div className="bg-gradient-to-b from-stone-800 to-stone-900 rounded-3xl p-6 shadow-xl border border-stone-700/50 relative overflow-hidden">
                  
                  {/* Cover background decoration decoratively themed */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.12)_0%,_rgba(0,0,0,0)_60%)] pointer-events-none" />

                  <div className="flex justify-between items-center mb-6 select-none relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                      <span className="font-mono text-[10px] font-bold text-stone-400 tracking-widest uppercase">
                        Interactive Light Field & Hologram
                      </span>
                    </div>
                    
                    {/* Visual state badges */}
                    <div className="flex gap-2 text-[9px] font-mono font-bold">
                      {overlays.showUvLight ? (
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-400/40 rounded-full flex items-center gap-1 uppercase">
                          <Lock size={10} /> UV Ultraviolet View
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-yellow-500/15 text-amber-300 border border-amber-300/30 rounded-full flex items-center gap-1 uppercase">
                          <Sparkles size={10} /> Hologram Glare active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Centered Render view */}
                  <div 
                    onDoubleClick={() => setIsLoginOpen(true)}
                    className="flex justify-center items-center py-4 cursor-pointer"
                  >
                    <PassportCard 
                      data={passportData}
                      overlay={overlays}
                      onHoverHologram={handleMouseMove}
                      hologramPos={hologramPos}
                      onSelectQrCode={startScanningSequence}
                      onSelectNfcChip={startNfcScanningSequence}
                    />
                  </div>

                  {/* Informative tips inside render view */}
                  <div className="mt-4 bg-black/35 backdrop-blur-md rounded-xl p-3 border border-stone-700/30 text-[11px] text-stone-300 flex items-start gap-2.5 select-none">
                    <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Hover your cursor or drag across the passport specimen above to visualize the three-dimensional holographic reflection patterns and light diffraction of the Italian Ministry's micro-printed seal.
                    </p>
                  </div>

                </div>

                {/* Security Diagnostics (Admin) or Quantum Telemetry Panel (Viewer / Modern Tech) */}
                {activeRole === 'admin' ? (
                  <div className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-xl select-none">
                    <h3 className="text-xs font-bold text-stone-900 tracking-wider uppercase mb-4 flex items-center gap-1.5">
                      <Shield size={14} className="text-red-700" />
                      Anti-Counterfeiting Security Diagnostics
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Guilloche Security Switch */}
                      <button
                        type="button"
                        onClick={() => toggleOverlay('showGuilloche')}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          overlays.showGuilloche 
                            ? 'bg-red-50/50 border-red-200/80 text-red-900 shadow-sm' 
                            : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            overlays.showGuilloche ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-500'
                          }`}>
                            G
                          </div>
                          <div>
                            <span className="block text-xs font-bold uppercase tracking-wide">Guilloche Latent Pattern</span>
                            <span className="block text-[10px] text-stone-500 font-medium font-sans mt-0.5">Symmetrical security rosettes</span>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          overlays.showGuilloche ? 'bg-red-600 border-red-700 text-white' : 'border-stone-300'
                        }`}>
                          {overlays.showGuilloche && <Check size={12} strokeWidth={3} />}
                        </div>
                      </button>

                      {/* Simulated Watermark Logo Switch */}
                      <button
                        type="button"
                        onClick={() => toggleOverlay('showWatermark')}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          overlays.showWatermark 
                            ? 'bg-red-50/50 border-red-200/80 text-red-900 shadow-sm' 
                            : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            overlays.showWatermark ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-500'
                          }`}>
                            W
                          </div>
                          <div>
                            <span className="block text-xs font-bold uppercase tracking-wide">Federal Watermark</span>
                            <span className="block text-[10px] text-stone-500 font-medium font-sans mt-0.5">Transparent crest superimposed</span>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          overlays.showWatermark ? 'bg-red-600 border-red-700 text-white' : 'border-stone-300'
                        }`}>
                          {overlays.showWatermark && <Check size={12} strokeWidth={3} />}
                        </div>
                      </button>

                      {/* UV Lamp Controller with range slider intensity slider */}
                      <div
                        className={`flex flex-col gap-2.5 p-3.5 rounded-xl border text-left transition-all ${
                          overlays.showUvLight 
                            ? 'bg-indigo-50/80 border-indigo-200/80 text-indigo-900 shadow-sm' 
                            : 'bg-stone-50 border-stone-200 text-stone-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex gap-3 items-center">
                            <div 
                              onClick={() => {
                                toggleOverlay('showUvLight');
                              }}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 select-none cursor-pointer ${
                                overlays.showUvLight ? 'bg-indigo-100 text-indigo-700 font-black' : 'bg-stone-200 text-stone-500'
                              }`}
                            >
                              UV
                            </div>
                            <div>
                              <span className="block text-xs font-black uppercase text-stone-900 tracking-wide">Woods Glass (UV Lamp)</span>
                              <span className="block text-[9px] text-indigo-500/85 font-semibold font-sans mt-0.5">Adjustable fluorescent fiber emission</span>
                            </div>
                          </div>
                          <div className="text-right select-none">
                            <span className={`font-mono text-[10.5px] font-black ${overlays.showUvLight ? 'text-indigo-700' : 'text-stone-400'}`}>
                              {overlays.showUvLight ? `${overlays.uvIntensity ?? 75}%` : 'OFF'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <input 
                            type="range"
                            id="uv-intensity-slider"
                            min="0"
                            max="100"
                            step="1"
                            value={overlays.showUvLight ? (overlays.uvIntensity ?? 75) : 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setOverlays(prev => ({
                                ...prev,
                                showUvLight: val > 0,
                                uvIntensity: val
                              }));
                            }}
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer transition-all accent-indigo-600 bg-stone-200/80 hover:bg-stone-200"
                          />
                        </div>
                      </div>

                      {/* MRZ Standard Layout Switch */}
                      <button
                        type="button"
                        onClick={() => toggleOverlay('showMrzLayout')}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          overlays.showMrzLayout 
                            ? 'bg-red-50/50 border-red-200/80 text-red-900 shadow-sm' 
                            : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            overlays.showMrzLayout ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-500'
                          }`}>
                            M
                          </div>
                          <div>
                            <span className="block text-xs font-bold uppercase tracking-wide">MRZ ICAO 9303 Zone</span>
                            <span className="block text-[10px] text-stone-500 font-medium font-sans mt-0.5">Machine readable block spec</span>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          overlays.showMrzLayout ? 'bg-red-600 border-red-700 text-white' : 'border-stone-300'
                        }`}>
                          {overlays.showMrzLayout && <Check size={12} strokeWidth={3} />}
                        </div>
                      </button>

                      {/* Diffractive Hologram Seal Switch */}
                      <button
                        type="button"
                        onClick={() => toggleOverlay('isHologramActive')}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          overlays.isHologramActive 
                            ? 'bg-red-50/50 border-red-200/80 text-red-900 shadow-sm' 
                            : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            overlays.isHologramActive ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-500'
                          }`}>
                            H
                          </div>
                          <div>
                            <span className="block text-xs font-bold uppercase tracking-wide">Metallic Foil Holograms</span>
                            <span className="block text-[10px] text-stone-500 font-medium font-sans mt-0.5">Optically variable device scan</span>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          overlays.isHologramActive ? 'bg-red-600 border-red-700 text-white' : 'border-stone-300'
                        }`}>
                          {overlays.isHologramActive && <Check size={12} strokeWidth={3} />}
                        </div>
                      </button>

                      {/* Biometric Landmark Nodes Switch */}
                      <button
                        type="button"
                        onClick={() => toggleOverlay('showLandmarks')}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          overlays.showLandmarks 
                            ? 'bg-red-50/50 border-red-200/80 text-red-900 shadow-sm' 
                            : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            overlays.showLandmarks ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-500'
                          }`}>
                            B
                          </div>
                          <div>
                            <span className="block text-xs font-bold uppercase tracking-wide">BIOMETRIC FACE LANDSMARK</span>
                            <span className="block text-[10px] text-stone-500 font-medium font-sans mt-0.5">Overlay facial coordinate grid</span>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          overlays.showLandmarks ? 'bg-red-600 border-red-700 text-white' : 'border-stone-300'
                        }`}>
                          {overlays.showLandmarks && <Check size={12} strokeWidth={3} />}
                        </div>
                      </button>

                      {/* Micro-Print Magnifier Glass Switch */}
                      <button
                        type="button"
                        onClick={() => toggleOverlay('showMagnifier')}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          overlays.showMagnifier 
                            ? 'bg-amber-50/50 border-amber-200/80 text-amber-900 shadow-sm' 
                            : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            overlays.showMagnifier ? 'bg-amber-100 text-amber-700' : 'bg-stone-200 text-stone-500'
                          }`}>
                            L
                          </div>
                          <div>
                            <span className="block text-xs font-bold uppercase tracking-wide">Micro-Print Magnifier</span>
                            <span className="block text-[10px] text-stone-500 font-medium font-sans mt-0.5">Reveal hidden microscopic detail</span>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          overlays.showMagnifier ? 'bg-amber-600 border-amber-700 text-white' : 'border-stone-300'
                        }`}>
                          {overlays.showMagnifier && <Check size={12} strokeWidth={3} />}
                        </div>
                      </button>

                    </div>

                    {/* Premium PDF Diagnostic Report Action */}
                    <div className="mt-5 pt-5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-left">
                        <span className="block text-[11px] font-bold uppercase text-stone-800 tracking-wider">
                          Cryptographic Verification Specimen
                        </span>
                        <p className="text-[10px] text-stone-500 font-medium leading-relaxed">
                          Generate and print a signed, structured PDF diagnostic audit of the active physical security parameters.
                        </p>
                      </div>
                      <button
                        type="button"
                        id="btn-download-pdf-audit"
                        onClick={handleDownloadPdfAudit}
                        className="inline-flex items-center justify-center gap-2 py-2.5 px-4.5 bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-500/20 active:bg-emerald-900 text-white font-bold uppercase tracking-wider text-[10.5px] rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-emerald-700/10 hover:shadow-lg"
                      >
                        <FileDown size={14} strokeWidth={2.5} />
                        Download PDF Audit
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="bg-[#0f1115] text-[#edeef0] rounded-2xl p-6 border border-zinc-800 shadow-2xl relative overflow-hidden select-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-emerald-500/5 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col gap-5 text-left">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Cpu className="text-indigo-400 animate-pulse" size={16} />
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-white">Quantum Biometric Telemetry Scanner</h3>
                            <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-widest">Active State Verification Feed</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-400/25 rounded font-mono text-[8px] font-bold uppercase tracking-wider">
                          SECURE VIEWER SPECIMEN
                        </span>
                      </div>

                      {/* Modern Interactive Tech Options (UV Light, Biometric landmarks, microprint magnifier) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 1. Woods Glass (UV Lamp) option */}
                        <div className={`p-4 rounded-xl border transition-all ${
                          overlays.showUvLight 
                            ? 'bg-indigo-950/20 border-indigo-500/40 text-indigo-200' 
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => setOverlays(prev => ({ ...prev, showUvLight: !prev.showUvLight }))}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono transition-all cursor-pointer ${
                                  overlays.showUvLight ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 font-black' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                                }`}
                              >
                                UV
                              </button>
                              <div>
                                <span className="block text-[11px] font-black uppercase tracking-wide text-white">Woods Glass (UV Lamp)</span>
                                <span className="block text-[8px] text-zinc-500 font-semibold font-sans">Fluorescent fiber emission</span>
                              </div>
                            </div>
                            <span className={`font-mono text-xs font-bold ${overlays.showUvLight ? 'text-indigo-400' : 'text-zinc-600'}`}>
                              {overlays.showUvLight ? `${overlays.uvIntensity ?? 75}%` : 'OFF'}
                            </span>
                          </div>
                          
                          {/* /_ UV Intensity Range Slider for adjustment _/ */}
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={overlays.showUvLight ? (overlays.uvIntensity ?? 75) : 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setOverlays(prev => ({
                                ...prev,
                                showUvLight: val > 0,
                                uvIntensity: val
                              }));
                            }}
                            className="w-full h-1 bg-zinc-800 accent-indigo-400 rounded appearance-none cursor-pointer hover:bg-zinc-700"
                          />
                        </div>

                        {/* 2. Biometric Face Landmark Option */}
                        <button
                          type="button"
                          onClick={() => setOverlays(prev => ({ ...prev, showLandmarks: !prev.showLandmarks }))}
                          className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            overlays.showLandmarks 
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' 
                              : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900/70'
                          }`}
                        >
                          <div className="flex gap-2.5 items-center">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs font-mono shrink-0 ${
                              overlays.showLandmarks ? 'bg-emerald-500/25 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              3D
                            </div>
                            <div>
                              <span className="block text-[11px] font-black uppercase tracking-wide text-white">BIOMETRIC FACE LANDSMARK</span>
                              <span className="block text-[8px] text-zinc-500 font-semibold font-sans mt-0.5">Real-time facial contour tracking</span>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                            overlays.showLandmarks ? 'bg-emerald-500 border-emerald-600 text-white' : 'border-zinc-700'
                          }`}>
                            {overlays.showLandmarks && <Check size={10} strokeWidth={3} />}
                          </div>
                        </button>

                        {/* 3. Microprint Magnifier Option */}
                        <button
                          type="button"
                          onClick={() => setOverlays(prev => ({ ...prev, showMagnifier: !prev.showMagnifier }))}
                          className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            overlays.showMagnifier 
                              ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' 
                              : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900/70'
                          }`}
                        >
                          <div className="flex gap-2.5 items-center">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs font-mono shrink-0 ${
                              overlays.showMagnifier ? 'bg-amber-500/25 text-amber-300' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              MG
                            </div>
                            <div>
                              <span className="block text-[11px] font-black uppercase tracking-wide text-white">Microprint Magnifier</span>
                              <span className="block text-[8px] text-zinc-500 font-semibold font-sans mt-0.5">Reveal latent microscopic detail</span>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                            overlays.showMagnifier ? 'bg-amber-500 border-amber-600 text-white' : 'border-zinc-700'
                          }`}>
                            {overlays.showMagnifier && <Check size={10} strokeWidth={3} />}
                          </div>
                        </button>
                      </div>

                      {/* Modern verification tech diagnostics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-800 pt-4.5">
                        
                        {/* Cryptographic Iris Scanning telemetry */}
                        <div className="bg-zinc-900/65 rounded-xl p-3.5 border border-zinc-800/80 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-sans flex items-center gap-1.5">
                              <Eye size={12} className="text-indigo-400" /> Contactless Iris Telemetry
                            </span>
                            {activeRole === 'viewer' ? (
                              <span className="text-[8.5px] font-mono font-bold text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded uppercase select-none tracking-wider">
                                🔒 REDACTED
                              </span>
                            ) : (
                              <span className="text-[8.5px] font-mono font-bold text-[#10b981] bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">
                                99.8% Match
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5 text-[10px] font-mono bg-black/45 p-2 rounded-lg border border-zinc-800 text-indigo-300 leading-none">
                            <div className="flex justify-between">
                              <span className="text-zinc-500">PUPIL RADIUS:</span>
                              <span>{activeRole === 'viewer' ? 'CLASSIFIED [MASKED]' : '4.21 mm [SECURE]'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">IRIS SIGNATURE:</span>
                              <span>{activeRole === 'viewer' ? 'REDACTED_SYSTEM_S' : 'SHA256::E245..9A9'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">STABILITY INDEX:</span>
                              <span>{activeRole === 'viewer' ? 'MASKED' : '0.999 [MAX_CALM]'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Embedded Quantum NFC Decryption Tracker */}
                        <div className="bg-zinc-900/65 rounded-xl p-3.5 border border-zinc-800/80 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-sans flex items-center gap-1.5">
                              <Radio size={12} className="text-emerald-400" /> Embedded ICAO NFC Handshake
                            </span>
                            <span className="text-[8.5px] font-mono font-bold text-emerald-450 bg-emerald-500/10 px-1.5 py-0.5 rounded animate-pulse">
                              CONNECTED
                            </span>
                          </div>
                          <div className="flex flex-col gap-1.5 text-[10px] font-mono bg-black/45 p-2 rounded-lg border border-zinc-800/80 text-emerald-400 leading-none">
                            <div className="flex justify-between">
                              <span className="text-zinc-500">CHIP ID:</span>
                              <span>NFC::ITA::89A4..E3A</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">PROTOCOL:</span>
                              <span>BAC / PACE (ICAO 9303)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-400">INTEGRITY CHECK:</span>
                              <span>RSA-4096_SIGNED_OK</span>
                            </div>
                          </div>
                        </div>

                        {/* Sub-dermal Vascular Capillary Telemetry (New) */}
                        <div className="bg-zinc-900/65 rounded-xl p-3.5 border border-zinc-800/80 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-sans flex items-center gap-1.5">
                              <Fingerprint size={12} className="text-red-400 animate-pulse" /> Sub-dermal Vascular Mapping
                            </span>
                            {activeRole === 'viewer' ? (
                              <span className="text-[8.5px] font-mono font-bold text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded uppercase select-none tracking-wider">
                                🔒 CLASSIFIED
                              </span>
                            ) : (
                              <span className="text-[8.5px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">
                                Liveness Passed
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5 text-[10px] font-mono bg-black/45 p-2 rounded-lg border border-zinc-800/80 text-rose-300 leading-none">
                            <div className="flex justify-between">
                              <span className="text-zinc-500">PULSE METRIC:</span>
                              <span>{activeRole === 'viewer' ? 'MASKED' : '72 BPM [ACTIVE]'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">GRID CONTOUR match:</span>
                              <span>{activeRole === 'viewer' ? 'REDACTED_CAPS_L' : '99.2% MATCH_VAL'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">EPIDERMAL REFRACTION:</span>
                              <span>{activeRole === 'viewer' ? 'CLASSIFIED' : '1.412 [SECURE]'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quantum Gravimetric Fiber Identity Seal (New) */}
                        <div className="bg-zinc-900/65 rounded-xl p-3.5 border border-zinc-800/80 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-sans flex items-center gap-1.5">
                              <Cpu size={12} className="text-amber-400" /> Quantum Gravimetric Density
                            </span>
                            {activeRole === 'viewer' ? (
                              <span className="text-[8.5px] font-mono font-bold text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded uppercase select-none tracking-wider">
                                🔒 SHIELDED
                              </span>
                            ) : (
                              <span className="text-[8.5px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase">
                                QKD Verified
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5 text-[10px] font-mono bg-black/45 p-2 rounded-lg border border-zinc-800/80 text-amber-300 leading-none">
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Topology Index:</span>
                              <span>{activeRole === 'viewer' ? 'MASKED' : '0.984 [SECURE]'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Gravimetry Sig:</span>
                              <span>{activeRole === 'viewer' ? 'REDACTED' : 'GRAV::E481..A72'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Anti-Clone Coeff:</span>
                              <span>{activeRole === 'viewer' ? 'CLASSIFIED' : '100.0% COEFF_OK'}</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* State-sealed, certified read-only status banner */}
                      <div className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-850 text-[10px] text-zinc-400 flex items-start gap-2.5">
                        <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed font-sans font-medium">
                          State Security Level clearance is set to <strong className="text-white">CIVILIAN_VIEWER</strong>. Parameter modifications, credential adjustments, and custom photo replacement logs are strictly locked by the Italian sovereign authority.
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                {/* Official Resemblance & Verification status logs */}
                {!isAdminMode ? null : (
                  <div className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-xl select-none">
                    <h3 className="text-xs font-bold text-stone-900 tracking-wider uppercase mb-4 flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-emerald-600" />
                      Resemblance & Verification Audit Logs
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs border-b border-stone-100 pb-2">
                        <span className="text-stone-500 font-medium">ICAO Document Type Verification</span>
                        <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">PASS (PM Model)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-b border-stone-100 pb-2">
                        <span className="text-stone-500 font-medium">Full MRZ Checksum Validation</span>
                        <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">VALIDATE_OK</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-b border-stone-100 pb-2">
                        <span className="text-stone-500 font-medium">Place of Birth (Kyiv Oblast, Ukraine) Concordance</span>
                        <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">MATCH FOUND</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-b border-stone-100 pb-2">
                        <span className="text-stone-500 font-medium">Residency and Address Verification (Rome 00118)</span>
                        <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">CONFIRMED</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-500 font-medium">Biometric Face Matching (Volodymyr Testardi)</span>
                        <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">100% CORRESPONDENCE</span>
                      </div>
                    </div>
                  </div>
                )}

              </section>

              {/* Right Column: Dynamic Form Parameter Editor & Admin Boards (5 Cols) */}
              <section className="lg:col-span-5 flex flex-col gap-6">
                {/* Sovereign Registry Control Board (Admin Eyes Only) */}
                {isAdminMode && (
                  <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xl text-left select-none animate-fade-in no-print">
                    <div className="flex items-center gap-2.5 mb-3.5 border-b border-stone-100 pb-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                        <Users size={16} className="animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black uppercase text-stone-800 tracking-wider">
                          Sovereign Registry Control Board
                        </h4>
                        <span className="text-[8.5px] font-mono text-stone-400 font-bold uppercase tracking-widest">
                          Sovereign state records panel - Admin eyes only
                        </span>
                      </div>
                    </div>

                    <span className="block text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2 font-mono">
                      Select Active Civilian Record Space
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {profiles.map((profile, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveProfileIndex(idx)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            activeProfileIndex === idx
                              ? 'bg-red-50/50 border-red-500/70 ring-2 ring-red-500/5'
                              : 'bg-stone-50 border-stone-100 hover:bg-stone-100'
                          }`}
                        >
                          <span className="block text-[9.5px] font-black text-stone-800 truncate uppercase leading-none">
                            {profile.surname}
                          </span>
                          <span className="block text-[8px] text-stone-500 font-semibold font-sans truncate mt-1">
                            {profile.givenNames}
                          </span>
                          <span className="block text-[7px] text-stone-400 leading-none font-sans font-black mt-1">
                            #{profile.passportNumber}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Sovereign Active Operator Handshake Desk */}
                    <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-col gap-2.5 bg-stone-50/30 p-2.5 rounded-2xl border border-stone-100">
                      <div className="flex justify-between items-center">
                        <span className="block text-[8px] font-black text-stone-400 uppercase tracking-widest font-mono">
                          Active Session Lock
                        </span>
                        <span className="font-mono text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {adminUsername || 'admin'} [Active]
                        </span>
                      </div>

                      <p className="text-[8.5px] leading-relaxed text-stone-500 font-medium">
                        Only one simultaneous administrator session is active. Other operators must provide an Invite Code generated below to bypass lockout mechanisms and log in.
                      </p>

                      <div className="flex flex-col gap-2 mt-1">
                        <button
                          type="button"
                          onClick={handleGenerateInvite}
                          className="w-full text-center text-[10px] bg-stone-900 hover:bg-stone-800 text-white font-mono font-bold px-3 py-2.5 rounded-xl transition cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
                        >
                          <Zap size={12} className="text-amber-400 animate-bounce" />
                          Issue Joint Access Invite Code
                        </button>
                        {activeInviteCode && (
                          <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50 text-[11px] font-mono font-black text-emerald-800 px-3 py-2 rounded-xl uppercase animate-pulse select-all">
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck size={13} className="text-emerald-600" />
                              <span>CODE: {activeInviteCode}</span>
                            </div>
                            <span className="text-[8px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">ACTIVE</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <PassportForm 
                  data={passportData}
                  onChange={handleDataChange}
                  onReset={handleReset}
                  isAdminMode={isAdminMode}
                  onToggleAdmin={() => handleRoleChange(activeRole === 'admin' ? 'viewer' : 'admin')}
                  onDownloadDossier={handleDownloadDossier}
                  overlays={overlays}
                  onOverlayChange={(newOverlay) => setOverlays(prev => ({ ...prev, ...newOverlay }))}
                />
              </section>

            </div>
          </>
        )}

      </main>

      {/* Humble, Professional Footer */}
      <footer className="border-t border-stone-200 bg-white mt-16 py-8 px-6 text-center select-none text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 Ministero dell'Interno. Digital Passport Verification Specimen.</p>
          <div className="flex gap-4 font-bold uppercase tracking-wider text-[10px]">
            <span className="text-emerald-700">● SECURE PORTAL DEPLOYED</span>
            <span>SPECIMEN ICAO No. 9303</span>
          </div>
        </div>
      </footer>

      {/* Mobile Scanner Simulation Console */}
      {isScanSimulatorOpen && (() => {
        // Calculation of document validity / remaining years
        const getRemainingYears = () => {
          try {
            const parts = passportData.dateOfExpiry.split('/');
            if (parts.length === 3) {
              const d = parseInt(parts[0], 10);
              const m = parseInt(parts[1], 10) - 1;
              const y = parseInt(parts[2], 10);
              const expiryDate = new Date(y, m, d);
              const diffMs = expiryDate.getTime() - new Date("2026-06-11T16:43:47-07:00").getTime();
              const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
              if (diffYears <= 0) {
                return "Expired / Revoked";
              }
              return `${diffYears.toFixed(1)} Year(s) Remaining`;
            }
          } catch (e) {
            // fallback
          }
          return "Valid / Active";
        };

        return (
          <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in no-print">
            <div 
              id="mobile-scanner-modal"
              className="relative w-full max-w-sm bg-neutral-950 text-white rounded-[40px] px-5 py-6 shadow-2xl border-4 border-neutral-800 ring-1 ring-white/15 flex flex-col justify-between overflow-hidden" 
              style={{ height: '620px' }}
            >
              {/* Phone Dynamic Island/Notch Decoration */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-5 bg-neutral-900 rounded-full flex items-center justify-center border border-white/5 z-20 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-2" />
                <span className="text-[8px] font-black text-neutral-400 font-mono tracking-widest">MINISTERO_DECRYPT</span>
              </div>

              {/* Top Device Bar */}
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 pt-1 select-none">
                <span>09:41</span>
                <div className="flex items-center gap-1">
                  <span>SIM 1</span>
                  <span className="w-2.5 h-1.5 bg-neutral-300 rounded-sm inline-block" />
                </div>
              </div>

              {/* Title / Description */}
              <div className="mt-4 text-center">
                <h2 className="text-sm font-black tracking-widest text-[#10b981] flex items-center justify-center gap-1.5 uppercase leading-none font-sans">
                  <Smartphone size={15} /> ITA Barcode Scanner
                </h2>
                <p className="text-[9px] text-stone-400 uppercase font-bold tracking-wider mt-1.5 leading-tight font-sans">
                  Secure Validation & Private Key Decryption
                </p>
              </div>

              {/* Viewfinder screen area */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mt-3 bg-neutral-900 flex flex-col items-center justify-center border border-neutral-800 shadow-inner group">
                {scanState === 'scanning' && (
                  <>
                    {/* Viewfinder guides */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#10b981] z-10" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#10b981] z-10" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#10b981] z-10" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#10b981] z-10" />

                    {/* Pulsing focal target */}
                    <div className="relative z-10 flex flex-col items-center select-none text-stone-400">
                      <Camera size={44} className="animate-pulse text-[#10b981] mb-2" />
                      <span className="text-[9px] uppercase tracking-widest font-bold">Align Secure QR...</span>
                    </div>

                    {/* Lasersweeper scanning line */}
                    <div 
                      className="absolute left-0 right-0 h-0.5 bg-red-500 opacity-80 z-10 shadow-[0_0_12px_#ef4444]" 
                      style={{ 
                        animation: 'scan 2s ease-in-out infinite',
                        top: `${scanProgress}%`
                      }} 
                    />

                    {/* Faux scan dots overlay */}
                    <div className="absolute inset-0 bg-radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.6)_100%) pointer-events-none" />
                  </>
                )}

                {scanState === 'decoding' && (
                  <div className="text-center p-4 select-none z-10">
                    <div className="w-12 h-12 rounded-full border-2 border-[#10b981] border-t-transparent animate-spin mx-auto mb-4" />
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-black tracking-widest">Decrypting Payload...</span>
                    <p className="text-[9px] text-neutral-500 font-mono mt-2 animate-pulse">Checking ICAO RSA credentials...</p>
                  </div>
                )}

                {scanState === 'success' && (
                  <div className="relative inset-0 w-full h-full bg-[#052e16]/90 flex flex-col items-center justify-between p-5 text-center select-none border border-emerald-500/30 rounded-2xl z-25">
                    <div className="flex flex-col items-center mt-2">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-neutral-950 mb-2 shadow-lg shadow-emerald-500/20">
                        <Check size={20} strokeWidth={3.5} />
                      </div>
                      <h3 className="text-xs font-black tracking-widest text-[#10b981] uppercase leading-none font-sans">
                        PASS - VERIFIED OK
                      </h3>
                      <p className="text-[8px] text-emerald-400 mt-1 uppercase font-bold tracking-wider leading-none">
                        Repubblica Italiana
                      </p>
                    </div>

                    <div className="w-full bg-black/50 border border-emerald-500/15 p-3 rounded-xl text-left text-[9px] font-mono space-y-1.5">
                      <div className="flex justify-between border-b border-white/5 pb-1 select-text">
                        <span className="text-stone-400">HOLDER:</span>
                        <span className="font-bold text-white text-right truncate max-w-[150px]">{passportData.surname} {passportData.givenNames}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1 select-text">
                        <span className="text-stone-400">PASSPORT:</span>
                        <span className="font-bold text-[#10b981]">{passportData.passportNumber}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1 select-text">
                        <span className="text-stone-400">DOB:</span>
                        <span className="font-bold text-white">{passportData.dateOfBirth} / {passportData.sex}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1 select-text">
                        <span className="text-stone-400">EXPIRATION:</span>
                        <span className="font-bold text-white">{passportData.dateOfExpiry}</span>
                      </div>
                      <div className="flex justify-between text-[8px]">
                        <span className="text-stone-400">VALIDITY:</span>
                        <span className="font-bold text-emerald-400">
                          ● {getRemainingYears()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="h-1" />
                  </div>
                )}
              </div>

              {/* Console Log Panel */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 h-20 text-[8px] font-mono select-none overflow-y-auto text-left mt-3">
                <span className="text-stone-500 block border-b border-neutral-800 pb-1 mb-1 font-bold">// REAL-TIME SECURE LOGS</span>
                {scanProgress >= 0 && (
                  <div className="text-[#10b981] leading-tight flex items-center gap-1">
                    <span className="text-stone-500 shrink-0">[0.0s]</span> 
                    <span>Live lens streaming initialized...</span>
                  </div>
                )}
                {scanProgress >= 20 && (
                  <div className="text-[#10b981] leading-tight mt-0.5 flex items-center gap-1">
                    <span className="text-stone-500 shrink-0">[0.8s]</span> 
                    <span>Reading ICAO 2D secure block matrix...</span>
                  </div>
                )}
                {scanProgress >= 40 && (
                  <div className="text-amber-500 leading-tight mt-0.5 flex items-center gap-1">
                    <span className="text-stone-500 shrink-0">[1.5s]</span> 
                    <span>Decoding cryptograms with ECDSA-256...</span>
                  </div>
                )}
                {scanProgress >= 80 && (
                  <div className="text-amber-500 leading-tight mt-0.5 flex items-center gap-1">
                    <span className="text-stone-500 shrink-0">[2.5s]</span> 
                    <span>Cross-matching database: {passportData.passportNumber}...</span>
                  </div>
                )}
                {scanProgress >= 100 && (
                  <div className="text-green-400 leading-tight mt-0.5 font-bold flex items-center gap-1">
                    <span className="text-stone-500 shrink-0">[3.6s]</span> 
                    <span>SUCCESS! Checksums match signature. Genuine card.</span>
                  </div>
                )}
              </div>

              {/* Technical Raw Payload Collapse Area */}
              {scanState === 'success' && (
                <div className="mt-3 text-left">
                  <details className="group border border-neutral-800 rounded-xl bg-neutral-900/40 p-2 text-[8px] font-mono">
                    <summary className="text-stone-400 group-open:text-[#10b981] cursor-pointer select-none outline-none font-bold uppercase tracking-wider flex justify-between items-center bg-transparent">
                      <span>Decoded Raw Payload</span>
                      <span className="text-[7px]">▼ Click to Open</span>
                    </summary>
                    <pre className="text-emerald-400/90 leading-tight overflow-x-auto mt-2 max-h-24 select-all bg-black/60 p-2 rounded-lg border border-[#10b981]/10">
{`{
  "doc_type": "ITA_E_PASSPORT_SEAL",
  "surname": "${passportData.surname.toUpperCase()}",
  "given": "${passportData.givenNames.toUpperCase()}",
  "id": "${passportData.passportNumber.toUpperCase()}",
  "expiry": "${passportData.dateOfExpiry}",
  "dob": "${passportData.dateOfBirth}",
  "verified_at": "2026-06-11T16:43:47Z",
  "signer": "QUESTURA DI ROMA"
}`}
                    </pre>
                  </details>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                {scanState === 'success' && (
                  <button
                    type="button"
                    onClick={() => {
                      setScanState('scanning');
                      setScanProgress(0);
                      startScanningSequence();
                    }}
                    className="flex-1 bg-neutral-900 border border-neutral-700 hover:border-emerald-500 text-white text-[10px] uppercase tracking-wider font-bold py-2 rounded-xl transition cursor-pointer select-none"
                  >
                    Rescan QR
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsScanSimulatorOpen(false)}
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white text-[10px] uppercase tracking-wider font-bold py-2 rounded-xl shadow-md transition cursor-pointer select-none"
                >
                  Close Scanner
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Interactive Contactless NFC Chip Reader Simulation Modal */}
      {isNfcSimulatorOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden text-stone-100 flex flex-col md:flex-row gap-6">
            {/* Ambient secure background glows */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Left Radar Panel */}
            <div className="md:w-2/5 flex flex-col items-center justify-center bg-stone-950 p-6 rounded-2xl border border-stone-800 text-center relative overflow-hidden select-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.05)_0%,_rgba(0,0,0,0)_70%)]" />
              
              {/* Pulsing Contactless Waves */}
              <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                <span className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
                <span className="absolute inset-2 rounded-full border-2 border-amber-500/30 animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-stone-800/80 flex items-center justify-center text-amber-400 border border-amber-500/40 relative">
                  <svg className="w-8 h-8 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>

              <h3 className="text-xs font-black tracking-widest text-stone-200 mt-2 uppercase font-sans">
                Contactless Reader
              </h3>
              <p className="text-[9.5px] text-stone-500 mt-1 uppercase font-bold tracking-wider leading-relaxed">
                Antenna resonant @ 13.56 MHz
              </p>

              {/* Progress Bar inside Radar Panel */}
              <div className="w-full mt-6 bg-stone-90 bg-stone-900 h-1.5 rounded-full overflow-hidden border border-stone-800">
                <div 
                  className={`h-full transition-all duration-300 ${
                    nfcState === 'genuine' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${nfcProgress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono mt-1.5 text-stone-400 block font-bold">
                PROXIMITY SECURE: {nfcProgress}%
              </span>
            </div>

            {/* Right Status Panel */}
            <div className="md:w-3/5 flex flex-col justify-between select-none">
              <div>
                <div className="flex justify-between items-center border-b border-stone-805 border-stone-800 pb-3 mb-4">
                  <div>
                    <h2 className="text-sm font-black tracking-wider text-white uppercase">e-Passport Chip Simulator</h2>
                    <p className="text-[10px] text-stone-400 font-medium">ISO/IEC 14443 Type-A Contactless Smart Card Protocol</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase font-mono ${
                    nfcState === 'genuine' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {nfcState === 'genuine' ? 'GENUINE CHIP' : 'READING'}
                  </span>
                </div>

                {/* Animated content card */}
                <div className="min-h-[220px] bg-stone-950 rounded-2xl p-4 border border-stone-800 flex flex-col justify-between">
                  {nfcState !== 'genuine' ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                      <div className="w-10 h-10 rounded-full border-t-2 border-r-2 border-amber-400 animate-spin mb-4" />
                      <span className="text-[10.5px] font-mono text-amber-400 uppercase font-bold tracking-widest">
                        {nfcState === 'connecting' ? 'Handshake Connection...' : 'Decrypting Sec-Channel...'}
                      </span>
                      <p className="text-[9.5px] text-stone-500 font-mono mt-2 animate-pulse">
                        {nfcState === 'connecting' 
                          ? 'Awaiting contactless card proximity...' 
                          : 'Validating Active Authentication Keys...'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Authentic Genuineness badge */}
                      <div className="flex items-center gap-3 bg-emerald-950/45 p-3 rounded-xl border border-emerald-500/20">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500 text-stone-900 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5h-10a2 2 0 00-2 2v3a2 2 0 002 2h10a2 2 0 002-2v-3a2 2 0 00-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-emerald-400 tracking-wider uppercase font-sans">
                            PASS: GENUINE CHIP VALIDATED
                          </h4>
                          <p className="text-[9px] text-stone-400 mt-0.5 leading-relaxed">
                            Secured cryptoprocessor is validated using sovereign state certificates. Chip data matches physical variables accurately.
                          </p>
                        </div>
                      </div>

                      {/* Decoded variables sheet */}
                      <div className="bg-stone-900/50 p-3 rounded-lg border border-stone-850 border-stone-800 text-[9.5px] font-mono space-y-1.5 select-all">
                        <div className="flex justify-between border-b border-stone-850 border-stone-800 pb-1">
                          <span className="text-stone-400">Protocol:</span>
                          <span className="text-white font-bold">ICAO Doc 9303 (eMRTD) v3.2</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-850 border-stone-800 pb-1">
                          <span className="text-stone-400">Chip UID:</span>
                          <span className="text-emerald-400 font-bold">04:AE:8F:D2:A8:19:9C</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-850 border-stone-800 pb-1">
                          <span className="text-stone-400">Crypto Mechanism:</span>
                          <span className="text-white">Active Authentication (ECDSA-SHA256)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Certificate Signer:</span>
                          <span className="text-amber-400 font-bold truncate max-w-[170px]">Poligrafico Zecca (Rome CSCA)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Real-time terminal output stream */}
                  <div className="mt-3 bg-black rounded-lg p-2.5 h-20 text-[8.5px] font-mono text-stone-400 overflow-y-auto border border-stone-800 select-text">
                    <span className="text-stone-500 block border-b border-stone-800 pb-1 mb-1 font-bold tracking-wider uppercase">// SECURE TRANSCEIVER LOGS</span>
                    {nfcLogs.map((logLine, index) => (
                      <div key={index} className="text-[#10b981] leading-tight">
                        {logLine}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 flex gap-2">
                {nfcState === 'genuine' && (
                  <button
                    type="button"
                    onClick={startNfcScanningSequence}
                    className="flex-grow bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500 text-[#10b981] text-[10px] uppercase tracking-wider font-bold py-2 rounded-xl transition cursor-pointer select-none"
                  >
                    Rescan Chip
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsNfcSimulatorOpen(false)}
                  className="flex-grow bg-red-700 hover:bg-red-800 text-white text-[10px] uppercase tracking-wider font-bold py-2 rounded-xl shadow-md transition cursor-pointer select-none"
                >
                  Close Reader
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminLoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onSuccess={() => {
          setActiveRole('admin');
          setIsLoginOpen(false);
          playTechPing();
        }}
      />

    </div>
  );
}
