import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleSubmit = async () => {
    try {
      setStatusMessage("");
      if (isLogin) await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) { alert(err.message); }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setStatusMessage("Enter your email first, then click Forgot password.");
      return;
    }

    try {
      setIsSendingReset(true);
      setStatusMessage("");
      await sendPasswordResetEmail(auth, email.trim());
      setStatusMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      setStatusMessage(err.message);
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full p-10 bg-slate-950 border border-yellow-900 rounded-3xl text-center">
        <h1 className="text-5xl font-black text-yellow-600 mb-8 tracking-tighter uppercase">CodeQuest</h1>
        <input type="email" placeholder="Warrior Email" className="w-full bg-black border border-slate-800 p-4 mb-4 text-white rounded-xl focus:border-yellow-600 outline-none" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Warrior Password" className="w-full bg-black border border-slate-800 p-4 mb-4 text-white rounded-xl focus:border-yellow-600 outline-none" onChange={(e) => setPassword(e.target.value)} />
        {isLogin && (
          <div className="text-right mb-4">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isSendingReset}
              className="text-xs text-yellow-500 hover:text-yellow-400 disabled:opacity-50"
            >
              {isSendingReset ? "Sending reset link..." : "Forgot password?"}
            </button>
          </div>
        )}
        {statusMessage && (
          <p className="mb-4 text-xs text-slate-300 bg-black/40 border border-slate-800 rounded-lg p-3">
            {statusMessage}
          </p>
        )}
        <button onClick={handleSubmit} className="w-full bg-yellow-600 py-4 rounded-xl font-black text-black hover:bg-yellow-500 uppercase tracking-widest">{isLogin ? "Enter Realm" : "Forge Soul"}</button>
        <p className="mt-4 text-slate-500 cursor-pointer" onClick={() => {
          setIsLogin(!isLogin);
          setStatusMessage("");
        }}>{isLogin ? "Need a new soul? Register" : "Existing soul? Login"}</p>
      </div>
    </div>
  );
}