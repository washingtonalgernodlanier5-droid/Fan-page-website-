import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, X, Sparkles, Check, AlertTriangle, UserPlus, HelpCircle, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Operator {
  username: string;
  passcode: string;
  securityQuestion: string;
  securityAnswer: string;
}

const DEFAULT_OPERATOR: Operator = {
  username: 'admin',
  passcode: 'admin2026',
  securityQuestion: 'What is the sovereign authority city?',
  securityAnswer: 'rome'
};

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Registration States
  const [regUsername, setRegUsername] = useState('');
  const [regPasscode, setRegPasscode] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regQuestion, setRegQuestion] = useState('What was your first secure officer badge ID?');
  const [regAnswer, setRegAnswer] = useState('');
  
  // Login States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password States
  const [recoveryUsername, setRecoveryUsername] = useState('');
  const [foundOperator, setFoundOperator] = useState<Operator | null>(null);
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmNewPasscode, setConfirmNewPasscode] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'search' | 'challenge' | 'reset'>('search');

  // Common UI logic
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Exclusive simultaneous session lock states
  const [lockedAdmin, setLockedAdmin] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState('');

  // Load / Store operators from localStorage
  const getOperators = (): Operator[] => {
    try {
      const stored = localStorage.getItem('sovereign_operators');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [DEFAULT_OPERATOR];
  };

  const saveOperator = (op: Operator) => {
    try {
      const current = getOperators();
      const filtered = current.filter(x => x.username.toLowerCase() !== op.username.toLowerCase());
      filtered.push(op);
      localStorage.setItem('sovereign_operators', JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  };

  // Synchronize exclusive active session lockout
  useEffect(() => {
    if (isOpen) {
      setLockedAdmin(localStorage.getItem('current_active_admin'));
      setInviteCode('');
    }
  }, [isOpen, activeTab]);

  // Reset notifications on tab switch
  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
    // Clear inner inputs
    if (activeTab === 'forgot') {
      setRecoveryUsername('');
      setFoundOperator(null);
      setRecoveryAnswer('');
      setNewPasscode('');
      setConfirmNewPasscode('');
      setRecoveryStep('search');
    }
  }, [activeTab]);

  if (!isOpen) return null;

  // Synthesized audio feedback chime
  const playSound = (isSuccess: boolean) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isSuccess) {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150.00, now); 
        osc.frequency.linearRampToValueAtTime(90.00, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      // Browser autoplay policy guard
    }
  };

  const triggerFailure = (msg: string) => {
    playSound(false);
    setError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // ---------------- LOGIN ACTION ----------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const userClean = loginUsername.trim().toLowerCase();
      const passClean = loginPasscode;

      if (!userClean || !passClean) {
        triggerFailure('Please complete all credential fields.');
        setIsSubmitting(false);
        return;
      }

      // Enforce simultaneous single-admin session lockout rule
      if (lockedAdmin && lockedAdmin.toLowerCase() !== userClean) {
        const cleanInvite = inviteCode.trim().toUpperCase();
        if (!cleanInvite) {
          triggerFailure(`Administrative Lock: Operator "${lockedAdmin}" holds the active session. Separate operator login requires a valid Invite Code.`);
          setIsSubmitting(false);
          return;
        }

        const storedInvites: string[] = JSON.parse(localStorage.getItem('active_admin_invites') || '[]');
        if (!storedInvites.includes(cleanInvite)) {
          triggerFailure('Security Handshake Failed: Invalid or expired Admin Invite Code.');
          setIsSubmitting(false);
          return;
        }

        // Invite verified! Remove/consume the code
        const updatedInvites = storedInvites.filter(code => code !== cleanInvite);
        localStorage.setItem('active_admin_invites', JSON.stringify(updatedInvites));
      }

      const list = getOperators();
      const match = list.find(op => op.username.toLowerCase() === userClean && op.passcode === passClean);

      if (match) {
        playSound(true);
        // Lock this user as active
        localStorage.setItem('current_active_admin', match.username);
        onSuccess();
        // Clear login form
        setLoginUsername('');
        setLoginPasscode('');
        setInviteCode('');
        setIsSubmitting(false);
      } else {
        triggerFailure('Authentication Failed: Invalid Operator ID or Secure Passcode.');
        setIsSubmitting(false);
      }
    }, 450);
  };

  // ---------------- SIGN UP ACTION ----------------
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    
    const userClean = regUsername.trim().toLowerCase();
    if (userClean.length < 3) {
      triggerFailure('Operator ID must be at least 3 alphanumeric characters.');
      return;
    }

    if (regPasscode.length < 6) {
      triggerFailure('Secure passcode must be at least 6 characters for state compliance.');
      return;
    }

    if (regPasscode !== regConfirmPass) {
      triggerFailure('Passcode verification mismatch. Please confirm matching values.');
      return;
    }

    if (!regAnswer.trim()) {
      triggerFailure('Please provide an answer to your recovery security question.');
      return;
    }

    // Enforce invite code if single admin lock is currently active
    if (lockedAdmin) {
      const cleanInvite = inviteCode.trim().toUpperCase();
      if (!cleanInvite) {
        triggerFailure(`Registration Lockout: Co-operator profile registration on reserved node requires a valid Admin Invite Code.`);
        return;
      }

      const storedInvites: string[] = JSON.parse(localStorage.getItem('active_admin_invites') || '[]');
      if (!storedInvites.includes(cleanInvite)) {
        triggerFailure('Security Handshake Failed: Invalid or expired Admin Invite Code for profile allocation.');
        return;
      }

      // Consume code
      const updatedInvites = storedInvites.filter(code => code !== cleanInvite);
      localStorage.setItem('active_admin_invites', JSON.stringify(updatedInvites));
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Verify username uniqueness (except replacing)
      const list = getOperators();
      const alreadyExists = list.some(op => op.username.toLowerCase() === userClean && op.username.toLowerCase() !== 'admin');
      
      if (alreadyExists) {
        triggerFailure('Registration Blocked: Operator identifier is already allocated.');
        setIsSubmitting(false);
        return;
      }

      const newOp: Operator = {
        username: userClean,
        passcode: regPasscode,
        securityQuestion: regQuestion,
        securityAnswer: regAnswer.trim().toLowerCase()
      };

      saveOperator(newOp);
      playSound(true);
      setSuccessMsg(`Operator profile "${userClean}" successfully registered in local state archives.`);
      
      // Clear sign up inputs, transition to login with autofill
      setLoginUsername(userClean);
      setRegUsername('');
      setRegPasscode('');
      setRegConfirmPass('');
      setRegAnswer('');
      setInviteCode('');
      setIsSubmitting(false);
      
      // Forward to login
      setTimeout(() => {
        setActiveTab('login');
      }, 1500);

    }, 500);
  };

  // ---------------- FORGOT PASSWORD ACTIONS ----------------
  const handleFindOperatorForRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const userClean = recoveryUsername.trim().toLowerCase();
    const list = getOperators();
    const match = list.find(op => op.username.toLowerCase() === userClean);

    if (match) {
      playSound(true);
      setFoundOperator(match);
      setRecoveryStep('challenge');
    } else {
      triggerFailure('No operator record matches the provided identifier.');
    }
  };

  const handleVerifySecurityChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!foundOperator) return;

    if (recoveryAnswer.trim().toLowerCase() === foundOperator.securityAnswer.toLowerCase()) {
      playSound(true);
      setRecoveryStep('reset');
    } else {
      triggerFailure('Verification Error: Secret answer comparison mismatch.');
    }
  };

  const handleApplyNewPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!foundOperator) return;

    if (newPasscode.length < 6) {
      triggerFailure('Compliant passcode must contain at least 6 characters.');
      return;
    }

    if (newPasscode !== confirmNewPasscode) {
      triggerFailure('Passcode inputs mismatch. Please enter matching values.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const updatedOp: Operator = {
        ...foundOperator,
        passcode: newPasscode
      };

      saveOperator(updatedOp);
      playSound(true);
      setSuccessMsg('Passcode reset complete. New operator credentials mapped.');
      
      // Clear recovery state
      setLoginUsername(foundOperator.username);
      setRecoveryUsername('');
      setFoundOperator(null);
      setRecoveryStep('search');
      setIsSubmitting(false);

      // Auto travel back to login
      setTimeout(() => {
        setActiveTab('login');
      }, 1500);
    }, 450);
  };

  return (
    <div className="fixed inset-0 bg-stone-990/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div 
        className={`bg-white rounded-3xl border border-stone-200/90 max-w-[440px] w-full shadow-2xl relative overflow-hidden transition-all duration-300 ${
          isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
        }`}
      >
        {/* State Symmetrical Security Accent Lines (Italian Tricolore) */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#21cc6c] via-[#ffffff] to-[#d31a26]" />

        {/* Modal Header */}
        <div className="p-6 pb-2.5 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-700">
              <Shield size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-black text-stone-900 tracking-wider uppercase">Sovereign Registry Control</h2>
              <span className="text-[9px] font-mono font-black text-red-700 uppercase tracking-widest block mt-0.5">
                Interior Admin Panel * Rome Secur_Grid
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Dynamic Navigation Tabs inside the security portal */}
        <div className="px-6 pb-1 border-b border-stone-100 flex gap-4 text-xs font-bold uppercase tracking-wider select-none">
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'login' 
                ? 'border-emerald-600 text-stone-900' 
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'signup' 
                ? 'border-emerald-600 text-stone-900' 
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setActiveTab('forgot')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'forgot' 
                ? 'border-emerald-600 text-stone-900' 
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Success/Action Notification banner */}
        {successMsg && (
          <div className="mx-6 mt-4 bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-start gap-2 text-emerald-900 text-left">
            <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[10.5px] leading-relaxed font-sans font-semibold">
              {successMsg}
            </div>
          </div>
        )}

        {/* Error Notification Banner */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2 text-red-900 text-left">
            <AlertTriangle size={15} className="text-red-600 shrink-0 mt-0.5" />
            <div className="text-[10px] leading-relaxed font-sans font-semibold">
              {error}
            </div>
          </div>
        )}

        {/* -------------------- TAB 1: LOGIN VIEW -------------------- */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="p-6 flex flex-col gap-4 text-left">
            <div className="bg-stone-50 rounded-2xl border border-stone-200/60 p-4 font-sans select-none text-[10.5px] font-medium text-stone-600 leading-relaxed">
              <span className="font-bold flex items-center gap-1 text-stone-800 uppercase mb-1 font-mono text-[9px] tracking-wide text-emerald-700">
                <Sparkles size={11} /> Manual Administration Login Required
              </span>
              Verify your registered official operator identifier and passcode sequence to configure dynamic civil passport records. If you do not have a credential file registered yet, select the <strong className="text-stone-900">Sign Up</strong> tab to initiate state mapping.
            </div>

            <div className="flex flex-col gap-3.5 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  Operator Identifier
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter administrator ID (e.g. admin)"
                  className="w-full font-mono border border-stone-200 rounded-xl pl-3.5 pr-3 py-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-bold text-stone-850"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  Secure Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPasscode}
                    onChange={(e) => setLoginPasscode(e.target.value)}
                    placeholder="Enter operator passcode"
                    className="w-full font-mono border border-stone-200 rounded-xl pl-3.5 pr-10 py-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-black text-stone-850"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>

              {lockedAdmin && loginUsername.trim().toLowerCase() !== lockedAdmin.toLowerCase() && (
                <div className="flex flex-col gap-3.5 mt-1 border-t border-dashed border-stone-200 pt-3.5">
                  <div className="p-3 bg-red-50 border border-red-200 text-red-950 rounded-xl text-[10.5px] leading-relaxed font-sans font-semibold">
                    ⚠️ <span className="font-bold">Active Session Conflict</span>: Operator <strong className="text-red-700 select-all uppercase">"{lockedAdmin}"</strong> currently registers the active node. Simultaneous overrides require a valid co-operator Invite Code.
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                      Authorization Invite Code
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="Enter invite code (e.g. INV-XXXXXX)"
                      className="w-full font-mono border border-amber-300 bg-amber-50/15 rounded-xl px-3.5 py-2.5 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-bold text-stone-850 uppercase"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-lg shadow-stone-950/10 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
              ) : (
                <>
                  <Shield size={13} />
                  Acknowledge & Sign In
                </>
              )}
            </button>
          </form>
        )}

        {/* -------------------- TAB 2: SIGN UP VIEW -------------------- */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="p-6 flex flex-col gap-4 text-left">
            <div className="bg-stone-50 rounded-2xl border border-stone-200/60 p-4 font-sans select-none text-[10.5px] font-medium text-stone-600 leading-relaxed">
              <span className="font-bold flex items-center gap-1 text-stone-800 uppercase mb-1 font-mono text-[9px] tracking-wide text-indigo-700">
                <UserPlus size={11} /> Allocate Sovereign Operator Space
              </span>
              Register a new independent manual login identifier. For maximum security, you must select a recovery security question to restore credentials if forgotten.
            </div>

            <div className="flex flex-col gap-3 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  Choose Operator ID
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="At least 3 characters (e.g. interior_admin)"
                  className="w-full font-mono border border-stone-200 rounded-xl px-3.5 py-2.5 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold text-stone-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                    Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={regPasscode}
                    onChange={(e) => setRegPasscode(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full font-mono border border-stone-200 rounded-xl px-3.5 py-2.5 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-black text-stone-850"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                    Confirm Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPass}
                    onChange={(e) => setRegConfirmPass(e.target.value)}
                    placeholder="Confirm"
                    className="w-full font-mono border border-stone-200 rounded-xl px-3.5 py-2.5 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-black text-stone-850"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  Authentication Question (For Recovery)
                </label>
                <select
                  value={regQuestion}
                  onChange={(e) => setRegQuestion(e.target.value)}
                  className="w-full border border-stone-200 bg-white rounded-xl px-3.5 py-2.5 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium text-stone-800"
                >
                  <option>What was your first secure officer badge ID?</option>
                  <option>Which municipality issued your first token?</option>
                  <option>What is your secret agency codename?</option>
                  <option>What is the sovereign authority city?</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  Your Answer
                </label>
                <input
                  type="text"
                  required
                  value={regAnswer}
                  onChange={(e) => setRegAnswer(e.target.value)}
                  placeholder="Answer is case-insensitive"
                  className="w-full font-sans border border-stone-200 rounded-xl px-3.5 py-2.5 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold text-stone-850"
                />
              </div>

              {lockedAdmin && (
                <div className="flex flex-col gap-3.5 mt-2 border-t border-dashed border-stone-200 pt-3.5">
                  <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-950 rounded-xl text-[10.5px] leading-relaxed font-sans font-semibold">
                    ⚠️ <span className="font-bold">Registration Locked</span>: System space is currently locked by active operator <strong className="text-indigo-800 uppercase font-bold">"{lockedAdmin}"</strong>. New accounts must verify co-operator invite auth.
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                      Authorization Invite Code
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="INV-XXXXXX code is required to register"
                      className="w-full font-mono border border-amber-300 bg-amber-50/15 rounded-xl px-3.5 py-2.5 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-bold text-stone-850 uppercase"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-lg shadow-indigo-950/10 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
              ) : (
                <>
                  <UserPlus size={13} />
                  Submit Official Registration
                </>
              )}
            </button>
          </form>
        )}

        {/* -------------------- TAB 3: FORGOT PASSWORD VIEW (RECOVERY SPACE) -------------------- */}
        {activeTab === 'forgot' && (
          <div className="p-6 flex flex-col gap-4 text-left">
            <div className="bg-stone-50 rounded-2xl border border-stone-200/60 p-4 font-sans select-none text-[10.5px] font-medium text-stone-600 leading-relaxed">
              <span className="font-bold flex items-center gap-1 text-stone-800 uppercase mb-1 font-mono text-[9px] tracking-wide text-amber-700">
                <HelpCircle size={11} /> Administrative Lock Recovery Desk
              </span>
              Enter your Operator Identifier. If the operator records match, you will be requested to provide matching security answer credentials to map a replacement passcode.
            </div>

            {/* Recovery Step 1: Identifier lookup */}
            {recoveryStep === 'search' && (
              <form onSubmit={handleFindOperatorForRecovery} className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                    Registred Operator Identifier
                  </label>
                  <input
                    type="text"
                    required
                    value={recoveryUsername}
                    onChange={(e) => setRecoveryUsername(e.target.value)}
                    placeholder="Enter username (e.g. admin)"
                    className="w-full font-mono border border-stone-200 rounded-xl px-3.5 py-2.5 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-bold text-stone-850"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Retrieve Account Profile
                  <ArrowRight size={13} />
                </button>
              </form>
            )}

            {/* Recovery Step 2: Challenge question comparison */}
            {recoveryStep === 'challenge' && foundOperator && (
              <form onSubmit={handleVerifySecurityChallenge} className="flex flex-col gap-3.5">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-stone-800">
                  <span className="block text-[7.5px] font-mono text-stone-400 font-black uppercase tracking-wider">CHALLENGE SECURITY QUESTION</span>
                  <span className="text-[11px] font-bold mt-1 block leading-normal">{foundOperator.securityQuestion}</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                    Security Response
                  </label>
                  <input
                    type="text"
                    required
                    value={recoveryAnswer}
                    onChange={(e) => setRecoveryAnswer(e.target.value)}
                    placeholder="Case-insensitive answer"
                    className="w-full font-sans border border-stone-200 rounded-xl px-3.5 py-2.5 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-bold text-stone-800"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryStep('search');
                      setFoundOperator(null);
                    }}
                    className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                  >
                    Verify Response
                  </button>
                </div>
              </form>
            )}

            {/* Recovery Step 3: Re-mapping Passcode */}
            {recoveryStep === 'reset' && foundOperator && (
              <form onSubmit={handleApplyNewPasscode} className="flex flex-col gap-3.5">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-950 font-bold text-[10.5px]">
                  ✓ Challenge Handshake Verified! Please allocate your replacement administrative passcode below.
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                    New Secure Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full font-mono border border-stone-200 rounded-xl px-3.5 py-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-black text-stone-850"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                    Verify New Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPasscode}
                    onChange={(e) => setConfirmNewPasscode(e.target.value)}
                    placeholder="re-enter passcode"
                    className="w-full font-mono border border-stone-200 rounded-xl px-3.5 py-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-black text-stone-850"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-950/10 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                  ) : (
                    'Apply New Credentials'
                  )}
                </button>
              </form>
            )}

          </div>
        )}

        {/* Footer info lock stamp */}
        <div className="bg-stone-50 border-t border-stone-100 p-4 text-[9px] text-center font-mono text-stone-400 select-none">
          SYSTEM LEVEL-3 CRYPTO HANDSHAKE CERTIFIED
        </div>
      </div>

      {/* Embedded Shake CSS inside component style */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
};
