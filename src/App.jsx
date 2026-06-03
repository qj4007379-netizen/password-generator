import { useState, useCallback, useEffect, useRef } from "react";
import "./index.css";
import { FaCopy, FaCheck, FaUndo, FaShieldAlt, FaKey } from "react-icons/fa";

function App() {
  const [length, setLength] = useState(16);
  const [numberAllowed, setNumberAllowed] = useState(true);
  const [characterAllowed, setCharAllowed] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const passwordRef = useRef(null);

  const generatePassword = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (numberAllowed) str += "0123456789";
    if (characterAllowed) str += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }

    setPassword(pass);
    setCopied(false);
  }, [length, numberAllowed, characterAllowed]);

  // Auto-generate when settings change
  useEffect(() => {
    generatePassword();
  }, [length, numberAllowed, characterAllowed, generatePassword]);

  const copyPasswordToClipboard = useCallback(() => {
    if (password) {
      passwordRef.current?.select();
      passwordRef.current?.setSelectionRange(0, 999);
      window.navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [password]);

  const getStrength = () => {
    if (length < 8) return { label: "Weak", color: "bg-red-500", percent: 25 };
    if (length < 12) return { label: "Medium", color: "bg-yellow-500", percent: 50 };
    if (length < 16) return { label: "Strong", color: "bg-blue-500", percent: 75 };
    return { label: "Very Strong", color: "bg-green-500", percent: 100 };
  };

  const strength = getStrength();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-emerald-500/20">
            <FaKey className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Secure Password</h1>
          <p className="text-slate-400">Generate strong, secure passwords instantly</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          {/* Password Display */}
          <div className="relative mb-6">
            <div className="bg-slate-950/50 rounded-2xl p-1 flex items-center border border-slate-700/50 focus-within:border-emerald-500/50 transition-colors">
              <input
                type="text"
                value={password}
                className="flex-1 bg-transparent text-white text-lg font-mono py-4 px-4 outline-none placeholder-slate-600"
                placeholder="Click generate to create password"
                readOnly
                ref={passwordRef}
              />
              <button
                onClick={copyPasswordToClipboard}
                className={`p-3 mr-1 rounded-xl transition-all duration-200 ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
                title={copied ? "Copied!" : "Copy"}
              >
                {copied ? <FaCheck size={14} /> : <FaCopy size={14} />}
              </button>
            </div>
          </div>

          {/* Strength Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <FaShieldAlt className={`${strength.color.replace('bg-', 'text-')} text-sm`} />
                <span className="text-slate-300 text-sm font-medium">{strength.label}</span>
              </div>
              <span className="text-slate-500 text-sm">{length} characters</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all duration-500 ease-out`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
          </div>

          {/* Length Control */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-300 font-medium">Password Length</span>
              <span className="text-emerald-400 font-bold text-xl">{length}</span>
            </div>
            <input
              type="range"
              min={4}
              max={32}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <label className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors border border-slate-700/30">
              <input
                type="checkbox"
                checked={numberAllowed}
                onChange={() => setNumberAllowed((prev) => !prev)}
                className="w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500/50 bg-slate-700"
              />
              <div>
                <span className="text-white text-sm font-medium block">Numbers</span>
                <span className="text-slate-500 text-xs">0-9</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors border border-slate-700/30">
              <input
                type="checkbox"
                checked={characterAllowed}
                onChange={() => setCharAllowed((prev) => !prev)}
                className="w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500/50 bg-slate-700"
              />
              <div>
                <span className="text-white text-sm font-medium block">Symbols</span>
                <span className="text-slate-500 text-xs">!@#$%&*</span>
              </div>
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePassword}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            <FaUndo />
            Generate Password
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          100% secure • Generated locally in your browser
        </p>
      </div>
    </div>
  );
}

export default App;
