import React, { useState, useEffect, useRef } from "react";
import { P, TH, MODULES, COUNTRIES, LEVELS, GOALS, LANGS, POSES, MEDITATIONS, SEQUENCES } from "./constants";
import { uuid, shortCode, safeGet, safeSet, enviarNotificacao, abrirGmailCompose, copiarParaClipboard } from "./utils";
import { Lotus, Toast } from "./components/Common";
import { auth, db } from "./firebase";
import { GoogleGenAI } from "@google/genai";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  getDocFromServer,
  limit,
  getDocs,
  deleteDoc
} from "firebase/firestore";

const ADMIN_EMAIL  = "josematos.chico@gmail.com";
const ADMIN_PASS   = "lotus2024";
const LOTUS_CLICKS = 7;

function BreathController({steps, active, phase, setPhase, count, setCount, timer, setTimer}: any) {
  const ref = useRef<any>(null)
  useEffect(() => {
    if (!active || !steps?.length) return
    if (ref.current) clearInterval(ref.current)
    const currentStep = steps[phase % steps.length]
    const totalSec = currentStep?.sec || 4
    setCount(totalSec)
    let remaining = totalSec
    const iv = setInterval(() => {
      remaining--
      setCount(remaining)
      if (remaining <= 0) {
        clearInterval(iv)
        setPhase((p: number) => p + 1)
      }
    }, 1000)
    ref.current = iv
    setTimer(iv)
    return () => clearInterval(iv)
  }, [active, phase])

  useEffect(() => {
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [])

  return null
}

interface EBProps {
  children: React.ReactNode;
}

interface EBState {
  hasError: boolean;
  error: any;
}

export class ErrorBoundary extends React.Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): EBState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let msg = "Ocorreu um erro inesperado.";
      try {
        const parsed = JSON.parse(this.state.error.message);
        if (parsed.error) msg = `Erro de Permissão: ${parsed.error}`;
      } catch (e) {
        msg = this.state.error.message || msg;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-red-500">⚠️</span>
            </div>
            <h2 className="text-2xl font-serif text-stone-800 mb-4">Ops! Algo deu errado</h2>
            <p className="text-stone-600 mb-8 leading-relaxed">
              {msg}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-stone-800 text-stone-50 rounded-xl font-medium hover:bg-stone-900 transition-colors"
            >
              Recarregar Aplicativo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [dark, setDark]           = useState(false)
  const [lang, setLang]           = useState("pt-BR")
  const [scr, setScr]             = useState("splash")
  const [tab, setTab]             = useState("home")
  const [authTab, setAuthTab]     = useState("login")
  const [user, setUser]           = useState<any>(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [mod, setMod]             = useState<any>(null)
  const [cls, setCls]             = useState<any>(null)
  const [tasks, setTasks]         = useState<any[]>([])
  const [prog, setProg]           = useState<any>({})
  const [regs, setRegs]           = useState<any[]>([])
  const [aiMsgs, setAiMsgs]       = useState<any[]>([])
  const [aiTxt, setAiTxt]         = useState("")
  const [aiLoad, setAiLoad]       = useState(false)
  const [toast, setToast]         = useState<any>(null)
  const [errorInfo, setErrorInfo] = useState<any>(null)
  const [lClicks, setLClicks]     = useState(0)
  const [adminStep, setAdminStep] = useState("pw")
  const [adminPw, setAdminPw]     = useState("")
  const [adminQ, setAdminQ]       = useState("")
  const [mailSt, setMailSt]       = useState<any>(null)
  const [actCode, setActCode]     = useState("")
  const [codeSt, setCodeSt]       = useState<any>(null)
  const [taskF, setTaskF]         = useState({title:"",module:"",assignee:"",deadline:"",status:"pendente",notes:""})
  const [showTF, setShowTF]       = useState(false)
  const [showPremiumCard, setShowPremiumCard] = useState(false)
  const [loginF, setLoginF]       = useState({email:"", password:""})
  const [regF, setRegF]           = useState({nome:"",email:"",idade:"",pais:"Brasil",nivel:"Iniciante",goals:[],phone:"",password:"",bio:""})
  const [regLoading, setRegLoading]   = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [breathActive, setBreathActive] = useState(false)
  const [breathPhase, setBreathPhase]   = useState(0)
  const [breathCount, setBreathCount]   = useState(0)
  const [breathTimer, setBreathTimer]   = useState<any>(null)
  const [openPose, setOpenPose]         = useState<any>(null)
  const [testEmail, setTestEmail]   = useState<any>(null)
  const [showPoses, setShowPoses]   = useState(false)
  const [showMeditations, setShowMeditations] = useState(false)
  const [showSequences, setShowSequences] = useState(false)
  const [playingMed, setPlayingMed]       = useState<any>(null)
  const [medLoading, setMedLoading]       = useState(false)
  const [playingSeq, setPlayingSeq]       = useState<any>(null)
  const [playingPose, setPlayingPose]     = useState<any>(null)
  const [playingModule, setPlayingModule] = useState<any>(null)
  const mainAudioRef = useRef<HTMLAudioElement | null>(null)
  const seqAudioRef = useRef<HTMLAudioElement | null>(null)
  const [selectedPose, setSelectedPose]   = useState<any>(null)
  const [selectedMeditation, setSelectedMeditation] = useState<any>(null)
  const [selectedSequence, setSelectedSequence] = useState<any>(null)
  const [medFilter, setMedFilter] = useState("Todos")
  const [medSearch, setMedSearch] = useState("")
  const aiScrollRef = useRef<HTMLDivElement | null>(null)
  const lTimer = useRef<any>(null)
  const T = dark ? TH.dark : TH.light
  const allCls: any[] = (MODULES as any).flatMap((m: any) => m.classes);

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=Nunito:wght@300;400;600;700;800&display=swap');
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes shim{0%,100%{opacity:.5}50%{opacity:1}}
    @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
    .reg-item{animation:slideIn .3s ease-out forwards}
    .hov:hover{opacity:.88;transform:translateY(-1px)!important}.hov{transition:all .2s!important}
    .cHov:hover{transform:translateY(-3px)!important;box-shadow:0 10px 32px rgba(46,196,182,.22)!important}.cHov{transition:all .25s!important}
    input:focus,textarea:focus,select:focus{border-color:${P.trq}!important;outline:none}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${P.trq}44;border-radius:3px}
    .chip{background:${dark?"#1E2A40":"#EEE8FF"};border:1.5px solid ${T.brd};border-radius:8px;padding:6px 12px;font-size:13px;cursor:pointer;color:${T.text};font-family:'Nunito',sans-serif;transition:all .18s}
    .chip.on{background:${P.trq};color:#fff;border-color:${P.trq}}
  `

  const stopAllAudio = () => {
    if (mainAudioRef.current) {
      mainAudioRef.current.pause();
      mainAudioRef.current.currentTime = 0;
      mainAudioRef.current.src = "";
    }
    if (seqAudioRef.current) {
      seqAudioRef.current.pause();
      seqAudioRef.current.currentTime = 0;
      seqAudioRef.current.src = "";
    }
    setPlayingMed(null);
    setPlayingSeq(null);
    setPlayingPose(null);
    setPlayingModule(null);
    setMedLoading(false);
  }

  const toggleMeditation = (m: any) => {
    if (playingMed?.id === m.id) {
      stopAllAudio();
    } else {
      stopAllAudio();
      setMedLoading(true);
      setPlayingMed(m);
      if (mainAudioRef.current) {
        mainAudioRef.current.src = m.audioUrl;
        mainAudioRef.current.load();
        mainAudioRef.current.play().catch(err => {
          console.warn("Meditation audio error:", err);
          sh("Erro ao carregar áudio da meditação. Verifique sua conexão.", "err");
          setPlayingMed(null);
          setMedLoading(false);
        });
      }
      sh(`Iniciando: ${m.title} 🧘`, "info");
    }
  }

  const togglePoseAudio = (p: any) => {
    if (playingPose?.id === p.id) {
      stopAllAudio();
    } else {
      stopAllAudio();
      setMedLoading(true);
      setPlayingPose(p);
      if (mainAudioRef.current) {
        mainAudioRef.current.src = p.audioUrl;
        mainAudioRef.current.load();
        mainAudioRef.current.play().catch(err => {
          console.warn("Pose audio error:", err);
          sh("Erro ao carregar áudio da postura.", "err");
          setPlayingPose(null);
          setMedLoading(false);
        });
      }
      sh(`Áudio da postura: ${p.name} 🧘`);
    }
  }

  const toggleModuleAudio = (c: any) => {
    if (playingModule?.id === c.id) {
      stopAllAudio();
    } else {
      stopAllAudio();
      setMedLoading(true);
      setPlayingModule(c);
      if (mainAudioRef.current) {
        mainAudioRef.current.src = c.audioUrl;
        mainAudioRef.current.load();
        mainAudioRef.current.play().catch(err => {
          console.warn("Module audio error:", err);
          sh("Erro ao carregar áudio da aula.", "err");
          setPlayingModule(null);
          setMedLoading(false);
        });
      }
      sh(`Áudio da aula: ${c.title} 🎵`);
    }
  }

  const toggleSequenceAudio = (seq: any) => {
    if (playingSeq?.id === seq.id) {
      stopAllAudio();
    } else {
      stopAllAudio();
      setPlayingSeq(seq);
      if (seqAudioRef.current) {
        seqAudioRef.current.src = seq.audioUrl;
        seqAudioRef.current.load();
        seqAudioRef.current.play().catch(err => {
          console.warn("Seq audio error:", err);
          sh("Erro ao carregar áudio da sequência.", "err");
          setPlayingSeq(null);
        });
      }
      sh(`Trilha sonora ativa: ${seq.title} 🎵`);
    }
  }

  useEffect(() => {
    if (aiScrollRef.current) {
      aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight
    }
  }, [aiMsgs, aiLoad])

  const sh = (msg: string, type: string = "ok", ms: number = 3500) => {
    setToast({msg, type})
    setTimeout(() => setToast(null), ms)
  }

  const handleFirestoreError = (error: any, operationType: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      operationType,
      path,
      authInfo: {
        userId: auth.currentUser?.uid ?? null,
        email: auth.currentUser?.email ?? null,
        emailVerified: auth.currentUser?.emailVerified ?? null,
        isAnonymous: auth.currentUser?.isAnonymous ?? null,
        tenantId: auth.currentUser?.tenantId ?? null,
        providerInfo: auth.currentUser?.providerData.map(p => ({
          providerId: p.providerId,
          displayName: p.displayName,
          email: p.email,
          photoUrl: p.photoURL
        })) ?? []
      }
    };
    console.error("Firestore Error:", JSON.stringify(errInfo));
    setErrorInfo(errInfo);
    throw new Error(JSON.stringify(errInfo));
  }

  const s: any = {
    wrap: {minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'Nunito',sans-serif", transition:"all .4s"},
    card: {background:T.card, borderRadius:16, padding:20, boxShadow:T.shd, borderTop:`1px solid ${T.brd}`, borderRight:`1px solid ${T.brd}`, borderBottom:`1px solid ${T.brd}`, borderLeft:`1px solid ${T.brd}`},
    btn:  (bg=P.trq, fg="#fff") => ({background:bg, color:fg, border:"none", borderRadius:12, padding:"12px 24px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all .2s", boxShadow:`0 4px 14px ${bg}44`}),
    inp:  {background:T.inp, border:`1.5px solid ${T.brd}`, borderRadius:10, padding:"11px 14px", color:T.text, fontFamily:"'Nunito',sans-serif", fontSize:15, width:"100%", outline:"none", boxSizing:"border-box"},
    lbl:  {fontSize:13, fontWeight:700, color:T.sec, marginBottom:5, display:"block"},
  }

  useEffect(() => {
    const loadLocal = async () => {
      const p = await safeGet("yoga_prog");
      const t = await safeGet("yoga_tasks");
      if (p) setProg(p);
      if (t) setTasks(t);
    };
    loadLocal();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setIsAuthReady(false);
      if (u) {
        try {
          const path = `users/${u.uid}`;
          const userDoc = await getDoc(doc(db, "users", u.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({ ...u, ...data });
            const approved = data.isApproved || data.role === 'admin' || u.email === ADMIN_EMAIL;
            setIsApproved(approved);
            
            if (data.progress) setProg(data.progress);
            if (data.tasks) setTasks(data.tasks);

            if (approved) {
              setScr("app");
            } else {
              setScr("pending");
            }
          } else {
            setUser(u);
            setScr("pending");
          }
        } catch (err) {
          handleFirestoreError(err, "get", `users/${u.uid}`);
        }
      } else {
        setUser(null);
        setIsApproved(false);
        if (scr === "splash") {
          setTimeout(() => setScr("app"), 2700);
        }
      }
      setIsAuthReady(true);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (user && isAuthReady) {
      const unsubUser = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const approved = data.isApproved || data.role === 'admin' || user.email === ADMIN_EMAIL;
          setIsApproved(approved);
          
          if (approved && scr === "pending") {
            setScr("app");
            sh("Acesso liberado! 🪷");
          }
        } else {
          // Se o documento foi deletado pelo admin, desloga o usuário
          if (user.email !== ADMIN_EMAIL) {
            signOut(auth);
            sh("Sua conta não foi encontrada ou foi removida.", "warn");
          }
        }
      }, (err) => {
        // Silenciar erro se for apenas falta de permissão momentânea (comum em trocas de estado)
        if (!err.message.includes("permission-denied")) {
          handleFirestoreError(err, "get", `users/${user.uid}`);
        }
      });
      return () => unsubUser();
    }
  }, [user, isAuthReady, scr]);

  useEffect(() => {
    const isActuallyAdmin = user?.role === 'admin' || user?.email === ADMIN_EMAIL;
    // Permitir busca de dados se for admin logado OU se estiver na tela de admin (após senha)
    if ((isActuallyAdmin && isAuthReady) || scr === "admin") {
      const q = query(collection(db, "users"), limit(500));
      const unsubAppr = onSnapshot(q, (snap) => {
        const all = snap.docs.map(d => ({ id: d.id, uid: d.id, ...d.data() }));
        const sorted = all.sort((a: any, b: any) => {
          const tA = a.createdAt?.seconds || 0;
          const tB = b.createdAt?.seconds || 0;
          return tB - tA;
        });
        setRegs(sorted);
      }, (err) => {
        // Silenciar erro se não estiver logado mas estiver na tela admin, 
        // as regras agora permitem acesso público para o painel.
        if (scr === "admin") {
          console.warn("Firestore access:", err.message);
        } else {
          handleFirestoreError(err, "list", "users");
        }
      });
      return () => unsubAppr();
    }
  }, [user, isAuthReady, scr]);


  const checkApproval = async () => {
    if (!user) return;
    const path = `users/${user.uid}`;
    try {
      const userDoc = await getDocFromServer(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().isApproved) {
        setScr("app");
        sh("Acesso liberado! 🪷");
      } else {
        sh("Ainda aguardando ativação...","info");
      }
    } catch (e: any) {
      handleFirestoreError(e, "get", path);
    }
  }

  const doLogin = async () => {
    if (!loginF.email || !loginF.password) return sh("Preencha tudo", "err");
    setIsLoggingIn(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, loginF.email, loginF.password);
      setLoginF({ email: "", password: "" });
      sh("Bem-vinda(o) de volta! ✨");
      
      // Forçar verificação de aprovação imediatamente após login
      const path = `users/${cred.user.uid}`;
      try {
        const userDoc = await getDoc(doc(db, "users", cred.user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.isApproved || data.role === 'admin' || cred.user.email === ADMIN_EMAIL) {
            setScr("app");
          } else {
            setScr("pending");
          }
        }
      } catch (e: any) {
        handleFirestoreError(e, "get", path);
      }
    } catch (e: any) {
      console.error("Erro no login:", e);
      if (e.code === 'auth/operation-not-allowed') {
        sh("Erro: O provedor de E-mail/Senha não está ativado no Firebase Console.", "err", 6000);
      } else if (e.code === 'auth/too-many-requests') {
        sh("Muitas tentativas falhas. Acesso bloqueado temporariamente. Tente novamente em alguns minutos.", "err", 8000);
      } else if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        if (loginF.email === ADMIN_EMAIL) {
          sh("Senha incorreta para o administrador. Se esqueceu, use o Login com Google no Painel Admin ou recupere a senha.", "err", 6000);
        } else {
          sh("E-mail ou senha incorretos. Verifique seus dados.", "err");
        }
      } else {
        sh("Erro ao entrar: " + e.message, "err");
      }
    } finally {
      setIsLoggingIn(false);
    }
  }

  const forgotPassword = async () => {
    if (!loginF.email) return sh("Digite seu e-mail primeiro", "warn");
    try {
      await sendPasswordResetEmail(auth, loginF.email);
      sh("E-mail de recuperação enviado! Verifique sua caixa de entrada. 📧");
    } catch (e: any) {
      console.error("Erro no reset:", e);
      sh("Erro ao enviar e-mail de recuperação.", "err");
    }
  }

  const doLogout = async () => {
    await signOut(auth);
    setAdminStep("pw");
    setAdminPw("");
    setScr("app");
    setTab("home");
    sh("Até logo! 👋");
  }

  const doRegister = async () => {
    const nome = regF.nome?.trim();
    const email = regF.email?.trim().toLowerCase();
    const password = regF.password;
    const idade = parseInt(regF.idade as string);
    const pais = regF.pais;

    if (!nome || !email || isNaN(idade) || idade <= 0 || !password || !pais)
      return sh("Preencha os campos obrigatórios corretamente ⚠️","err")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return sh("E-mail inválido ❌","err")
    if (password.length < 6)
      return sh("Senha deve ter no mínimo 6 caracteres","err")

    setRegLoading(true);
    setMailSt("sending");

    console.log("Iniciando cadastro para:", email);

    try {
      // Se já houver um usuário logado, deslogar primeiro de forma segura
      if (auth.currentUser) {
        try {
          await signOut(auth);
        } catch (soErr) {
          console.warn("signOut falhou (não fatal):", soErr);
        }
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuário Auth criado:", cred.user.uid);
      
      try {
        await updateProfile(cred.user, { displayName: nome });
      } catch (upErr) {
        console.warn("updateProfile falhou (não fatal):", upErr);
      }
      
      const code = shortCode();
      const userData = {
        uid: cred.user.uid,
        nome,
        email,
        idade,
        pais,
        nivel: regF.nivel || "Iniciante",
        goals: regF.goals || [],
        phone: regF.phone?.trim() || "",
        bio: regF.bio?.trim() || "",
        role: "user",
        isApproved: false,
        activationCode: code,
        createdAt: serverTimestamp()
      };

      const path = `users/${cred.user.uid}`;
      try {
        console.log("Salvando documento no Firestore...");
        await setDoc(doc(db, "users", cred.user.uid), userData);
        console.log("Documento salvo com sucesso.");
      } catch (e: any) {
        console.error("Erro ao salvar no Firestore:", e);
        // Se falhar o Firestore, tentamos pelo menos avisar o admin via notificação
        // Mas lançamos o erro para o catch principal tratar
        handleFirestoreError(e, "create", path);
      }

      // Notificação não bloqueante
      enviarNotificacao(userData, code).then(res => {
        if (res.web3) setMailSt("sent");
        else if (res.clipboard) setMailSt("clipboard");
        else setMailSt("fallback");
      }).catch(err => {
        console.error("Erro na notificação:", err);
        setMailSt("fallback");
      });
      
      sh("✨ Cadastro realizado com sucesso! ✨", "info");
      setRegF({nome:"",email:"",idade:"",pais:"Brasil",nivel:"Iniciante",goals:[],phone:"",password:"",bio:""});
      
      setTimeout(() => {
        setScr("pending");
        sh("Seu acesso está sendo processado. Aguarde um instante. ⏳", "info");
      }, 1500);
    } catch (e: any) {
      setMailSt(null);
      console.error("Erro detalhado no cadastro:", e);
      
      const errorCode = e.code || "";
      const errorMessage = e.message || "";

      if (errorCode === 'auth/operation-not-allowed') {
        sh("Erro: O provedor de E-mail/Senha não está ativado no Firebase Console.", "err", 6000);
      } else if (errorCode === 'auth/admin-restricted-operation') {
        sh("Erro: O cadastro de novos usuários está desativado no Firebase.", "err", 6000);
      } else if (errorCode === 'auth/email-already-in-use') {
        sh("Este e-mail já está em uso. Tente fazer login. 📧", "err");
      } else if (errorCode === 'auth/weak-password') {
        sh("Senha muito fraca. Use pelo menos 6 caracteres.", "err");
      } else if (errorCode === 'auth/invalid-email') {
        sh("E-mail inválido. Verifique a digitação.", "err");
      } else if (errorMessage.includes("permission-denied") || errorMessage.includes("insufficient permissions")) {
        sh("Erro de permissão no banco de dados. Contate o suporte.", "err");
      } else if (errorCode === 'auth/network-request-failed') {
        sh("Erro de conexão. Verifique sua internet.", "err");
      } else {
        sh("Erro ao realizar cadastro: " + (errorCode || "Erro desconhecido"), "err");
      }
    } finally {
      setRegLoading(false);
    }
  }

  const applyCode = async () => {
    if (!actCode.trim()) return sh("Digite o código","err")
    const code = actCode.trim().toUpperCase();
    setCodeSt("ch")
    
    // 1. Procura nos regs (se for admin)
    let hit = regs.find(r => r.activationCode === code);
    
    // 2. Se não achou, verifica se é o código do próprio usuário logado
    if (!hit && user && (user as any).activationCode === code) {
      hit = user;
    }

    // 3. Se ainda não achou, tenta buscar diretamente no Firestore
    if (!hit) {
      try {
        const q = query(collection(db, "users"), where("activationCode", "==", code), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          hit = { id: snap.docs[0].id, uid: snap.docs[0].id, ...snap.docs[0].data() };
        }
      } catch (e) {
        handleFirestoreError(e, "list", "users");
      }
    }

    if (!hit) {
      sh("Código inválido ❌","err");
      setCodeSt("fail");
    } else if (hit.isApproved) {
      sh("Código já utilizado ⚠️","warn");
      setCodeSt("fail");
    } else {
      setCodeSt("ok");
      const path = `users/${hit.uid}`;
      try {
        await updateDoc(doc(db, "users", hit.uid), { isApproved: true });
        sh(`✅ ${hit.email} ativado!`)
      } catch (e: any) {
        handleFirestoreError(e, "update", path);
      }
    }
    setTimeout(() => setCodeSt(null), 3000)
  }

  const markDone = async (id: string) => {
    const isRemoving = prog[id];
    const newProg = {...prog, [id]: !prog[id]}
    setProg(newProg)
    await safeSet("yoga_prog", newProg)
    
    if (user) {
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, "users", user.uid), { progress: newProg });
      } catch (e: any) {
        handleFirestoreError(e, "update", path);
      }
    }
    
    if (!isRemoving) {
      // Automação: Se marcou como concluído, procura tarefa relacionada
      const relatedClass = allCls.find(c => c.id === id);
      const newTasks = tasks.map(t => {
        const titleMatch = t.title.toLowerCase().includes(relatedClass?.title.toLowerCase() || "");
        const moduleMatch = t.module && relatedClass?.id.startsWith(t.module.substring(0,2));
        if (titleMatch || moduleMatch) {
          return {...t, status: "concluido" as const};
        }
        return t;
      });
      setTasks(newTasks);
      await safeSet("yoga_tasks", newTasks);
      sh("Aula concluída e tarefas atualizadas! ✨");
    } else {
      sh("Aula marcada como pendente.");
    }
  }

  const getModuleStatus = (m: any) => {
    const doneCount = m.classes.filter((c: any) => prog[c.id]).length;
    const total = m.classes.length;
    if (doneCount === 0) return { label: "Pendente", color: T.sec, icon: "⏳", pct: 0 };
    if (doneCount === total) return { label: "Concluído", color: P.grn, icon: "✅", pct: 100 };
    return { label: "Em Progresso", color: P.celD, icon: "🔄", pct: Math.round((doneCount/total)*100) };
  }

  const saveTasks = async (arr: any[]) => { 
    setTasks(arr); 
    await safeSet("yoga_tasks", arr);
    if (user) {
      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, "users", user.uid), { tasks: arr });
      } catch (e: any) {
        handleFirestoreError(e, "update", path);
      }
    }
  }
  const addTask = () => {
    if (!taskF.title) return sh("Informe o título","err")
    saveTasks([...tasks, {...taskF, id:Date.now(), createdAt:new Date().toISOString()}])
    setTaskF({title:"",module:"",assignee:"",deadline:"",status:"pendente",notes:""})
    setShowTF(false); sh("Tarefa criada ✅")
  }
  const changeTS = (id: number, status: string) => saveTasks(tasks.map(t => t.id===id ? {...t,status} : t))
  const delTask = (id: number) => saveTasks(tasks.filter(t => t.id!==id))

  const lotusClick = () => {
    const n = lClicks + 1; setLClicks(n)
    if (lTimer.current) clearTimeout(lTimer.current)
    if (n >= LOTUS_CLICKS) { 
      setScr("admin"); 
      setAdminStep("pw"); 
      setLClicks(0) 
    }
    else lTimer.current = setTimeout(() => setLClicks(0), 3000)
  }

  const approveUser = async (email: string) => {
    const hit = regs.find(r => r.email === email);
    if (!hit) return sh("Usuário não encontrado", "err");
    const path = `users/${hit.uid}`;
    try {
      await updateDoc(doc(db, "users", hit.uid), { isApproved: true });
      sh(`✅ Conta de ${email} ativada!`);
    } catch (e: any) {
      handleFirestoreError(e, "update", path);
    }
  }

  const revokeUser = async (email: string) => {
    const hit = regs.find(r => r.email === email);
    if (!hit) return sh("Usuário não encontrado", "err");
    const path = `users/${hit.uid}`;
    try {
      await updateDoc(doc(db, "users", hit.uid), { isApproved: false });
      sh(`🚫 Acesso de ${email} revogado.`);
    } catch (e: any) {
      handleFirestoreError(e, "update", path);
    }
  }

  const resendEmail = async (reg: any) => {
    const codigo = reg.activationCode || shortCode();
    const r = await enviarNotificacao(reg, codigo);
    if (!r.web3 && !r.gmail) abrirGmailCompose(reg, codigo);
    sh("📧 E-mail reenviado!");
  };

  const deleteUser = async (user: any) => {
    const id = user.uid || user.id;
    const path = `users/${id}`;
    try {
      await deleteDoc(doc(db, "users", id));
      sh(`🗑️ Registro de ${user.nome || 'usuário'} removido.`);
    } catch (e: any) {
      handleFirestoreError(e, "delete", path);
    }
  };

  const deleteAllPending = async () => {
    const toDelete = regs.filter(r => !r.isApproved && r.email !== ADMIN_EMAIL);
    if (toDelete.length === 0) return sh("Nenhum registro pendente", "info");
    
    sh(`🗑️ Excluindo ${toDelete.length} registros...`, "info");
    try {
      const promises = toDelete.map(r => deleteDoc(doc(db, "users", r.id || r.uid)));
      await Promise.all(promises);
      sh(`${toDelete.length} registros excluídos com sucesso! 🗑️`);
    } catch (e: any) {
      handleFirestoreError(e, "delete", "users");
    }
  };

  const sendAI = async () => {
    if (!aiTxt.trim() || aiLoad) return
    const msg = aiTxt.trim(); setAiTxt("")
    const newMsgs = [...aiMsgs, {r:"u", t:msg}]
    setAiMsgs(newMsgs); setAiLoad(true)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const history = aiMsgs.map(m => ({
        role: m.r === "u" ? "user" : "model",
        parts: [{ text: m.t }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history,
          { role: "user", parts: [{ text: msg }] }
        ],
        config: {
          systemInstruction: "Você é Ananda, professora de yoga carinhosa. Responda sempre em português com emojis de yoga e flores. Dê dicas práticas de posturas, respiração, meditação e bem-estar. Seja encorajadora e use uma linguagem suave."
        }
      });
      
      const reply = response.text || "🙏 Tente novamente em breve.";
      setAiMsgs(c => [...c, {r:"a", t:reply}])
    } catch (err) {
      console.error("Gemini Error:", err);
      setAiMsgs(c => [...c, {r:"a", t:"🧘 Estou meditando... tente novamente em instantes."}])
    }
    setAiLoad(false)
  }

  const handleAdminAuth = async () => {
    if (adminPw === ADMIN_PASS) {
      setAdminStep("panel");
      sh("Painel liberado! 🔐");
    } else {
      sh("Senha do painel incorreta", "err");
    }
  }

  const syncAdminAccount = async (method: 'email' | 'google') => {
    setRegLoading(true);
    try {
      if (auth.currentUser) await signOut(auth);
      
      if (method === 'email') {
        try {
          await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASS);
        } catch (e: any) {
          if (e.code === "auth/invalid-credential" || e.code === "auth/wrong-password") {
            throw new Error("A senha 'lotus2024' não coincide com a senha desta conta no Firebase. Use o Login com Google ou o login principal.");
          }
          throw e;
        }
      } else {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ login_hint: ADMIN_EMAIL });
        const result = await signInWithPopup(auth, provider);
        if (result.user.email !== ADMIN_EMAIL) {
          await signOut(auth);
          throw new Error(`Por favor, use a conta ${ADMIN_EMAIL}`);
        }
      }
      
      sh("Sincronizado como Administrador! 🔐");
    } catch (e: any) {
      console.error("Erro na sincronização:", e);
      sh(e.message || "Erro de sincronização", "err", 7000);
    } finally {
      setRegLoading(false);
    }
  }

  if (scr === "splash") return (
    <div style={{...s.wrap,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
      <style>{CSS}</style>
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        {[P.trq,P.lil,P.cel].map((c,i)=>(<div key={i} style={{position:"absolute",borderRadius:"50%",border:`1.5px solid ${c}44`,width:180+i*130,height:180+i*130,top:"50%",left:"50%",transform:"translate(-50%,-50%)",animation:`pulse ${2.5+i}s ease-in-out ${i*.6}s infinite`}}/>))}
      </div>
      <div onClick={lotusClick} style={{cursor:"pointer",animation:"float 3s ease-in-out infinite"}}><Lotus size={88} color={P.trq} spin/></div>
      {lClicks > 0 && <p style={{fontSize:11,color:P.lil,marginTop:10}}>{"◆".repeat(lClicks)}{"◇".repeat(LOTUS_CLICKS-lClicks)}</p>}
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:36,color:P.trq,marginTop:18,animation:"fadeUp .8s .3s ease both",opacity:0}}>Yoga em Casa</h1>
      <p style={{color:T.sec,fontStyle:"italic",animation:"fadeUp .8s .6s ease both",opacity:0,marginTop:4}}>Respire. Mova-se. Transforme-se.</p>
      <p style={{fontSize:12,color:T.sec,marginTop:44,animation:"shim 1.8s infinite"}}>🌸 Carregando...</p>
    </div>
  )

  if (scr === "pending") return (
    <div style={{...s.wrap,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
      <style>{CSS}</style>
      <div onClick={lotusClick} style={{animation:"float 4s ease-in-out infinite", cursor:"pointer"}}><Lotus size={76} color={P.lil} spin/></div>
      {lClicks > 0 && <p style={{fontSize:11,color:P.lil,marginTop:10}}>{"◆".repeat(lClicks)}{"◇".repeat(LOTUS_CLICKS-lClicks)}</p>}
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:P.lil,marginTop:16}}>Cadastro Realizado 🌸</h2>
      <p style={{color:T.sec,maxWidth:340,marginTop:10,lineHeight:1.7,fontSize:14}}>
        Seus dados foram salvos. Um código de ativação foi enviado para o administrador.
        Assim que o acesso for liberado, você poderá entrar na sua conta.
      </p>

      <div style={{...s.card,marginTop:16,maxWidth:380,width:"100%",textAlign:"left"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{fontSize:22}}>
            {mailSt==="sent"?"✅":mailSt==="gmail"?"📬":mailSt==="clipboard"?"📋":mailSt==="sending"?"⏳":"📧"}
          </span>
          <div>
            <div style={{fontWeight:700,fontSize:14}}>
              {mailSt==="sent"      ?"✅ Notificação enviada!":
               mailSt==="gmail"     ?"📬 E-mail pronto para envio":
               mailSt==="clipboard" ?"📋 Dados copiados":
               mailSt==="sending"   ?"⏳ Processando...":
               mailSt==="fallback"  ?"⚠️ Aguardando liberação":
               "Aguardando ativação..."}
            </div>
          </div>
        </div>
      </div>

      <div style={{...s.card,marginTop:12,maxWidth:380,width:"100%",textAlign:"left"}}>
        <div style={{fontWeight:800,fontSize:14,marginBottom:6}}>🔑 Tem um código de ativação?</div>
        <div style={{display:"flex",gap:10}}>
          <input style={{...s.inp,flex:1,textTransform:"uppercase",letterSpacing:4,fontWeight:800,fontSize:18,textAlign:"center"}}
            placeholder="ABC123" maxLength={6} value={actCode}
            onChange={e=>setActCode(e.target.value.toUpperCase())}
            onKeyDown={e=>e.key==="Enter"&&applyCode()}/>
          <button className="hov" onClick={applyCode} style={{...s.btn(P.trq),whiteSpace:"nowrap",padding:"11px 18px"}}>
            {codeSt==="ch"?"...":"Ativar →"}
          </button>
        </div>
      </div>

      <div style={{display:"flex",gap:12,marginTop:16,flexWrap:"wrap",justifyContent:"center"}}>
        <button className="hov" onClick={checkApproval} style={s.btn(P.trq)}>🔄 Verificar Status</button>
        <button className="hov" onClick={doLogout} style={{...s.btn(T.cardAlt,T.sec),boxShadow:"none",border:`1px solid ${T.brd}`}}>← Sair / Voltar</button>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}
    </div>
  )

  if (scr === "admin") return (
    <div style={{...s.wrap,padding:20,overflowY:"auto"}}>
      <style>{CSS}</style>
      <div style={{maxWidth:720,margin:"0 auto",paddingBottom:40}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
          <Lotus size={36} color={P.trq}/>
          <div>
            <h1 style={{fontSize:18,fontWeight:800,color:P.trq}}>Painel Administrativo</h1>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:P.grn,fontWeight:700,textTransform:"uppercase"}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:P.grn,animation:"pulse 1.5s infinite"}}/>
              Live Sync
            </div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            <button onClick={()=>setDark(!dark)} style={{...s.btn(T.cardAlt,""),padding:"7px 10px",boxShadow:"none",border:`1px solid ${T.brd}`}}>{dark?"☀️":"🌙"}</button>
            <button className="hov" onClick={doLogout} style={{...s.btn(P.brn),padding:"8px 16px",fontSize:13}}>← Sair</button>
          </div>
        </div>

        {adminStep === "pw" ? (
          <div style={{...s.card,maxWidth:340,margin:"50px auto",textAlign:"center"}}>
            <Lotus size={48} color={P.trq} spin/>
            <h3 style={{margin:"12px 0 16px"}}>🔐 Acesso Restrito</h3>
            <input style={{...s.inp,textAlign:"center",marginBottom:12}} type="password"
              placeholder="Senha do administrador" value={adminPw}
              onChange={e=>setAdminPw(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleAdminAuth()}/>
            <button className="hov" onClick={handleAdminAuth} style={s.btn(P.trq)}>Entrar</button>
          </div>
        ):(
          <>
            <div style={{...s.card, marginBottom: 14, borderLeft: `4px solid ${P.trq}`, background: `${P.trq}11`}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div>
                  <h3 style={{fontWeight:800, color:P.trq}}>📊 Status do Sistema</h3>
                  <div style={{fontSize:12, color:T.sec, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap"}}>
                    <span>Administrador: <b>{user?.email || "Acesso Direto"}</b></span>
                    <span style={{color:P.grn, fontWeight:700}}>● Integração Ativa</span>
                    <span style={{opacity:0.5}}>|</span>
                    <span>Inscrições: <b>{regs.length}</b></span>
                  </div>
                </div>
                <div style={{display:"flex", gap:8}}>
                  <button className="hov" onClick={() => window.location.reload()} style={{...s.btn(P.trq), padding:"6px 12px", fontSize:12}}>🔄 Recarregar</button>
                  <button className="hov" onClick={doLogout} style={{...s.btn(P.red), padding:"6px 12px", fontSize:12}}>🚪 Sair</button>
                </div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
              {[
                {l:"Total Inscritos",v:regs.length,c:P.trq,i:"📋"},
                {l:"Contas Ativas",v:regs.filter(r => r.isApproved).length,c:P.grn,i:"✅"},
                {l:"Aguardando",v:regs.filter(r => !r.isApproved).length,c:P.lil,i:"⏳"},
              ].map(x=>(
                <div key={x.l} style={{...s.card,textAlign:"center",padding:14,borderTop:`3px solid ${x.c}`}}>
                  <div style={{fontSize:20}}>{x.i}</div>
                  <div style={{fontSize:26,fontWeight:800,color:x.c}}>{x.v}</div>
                  <div style={{fontSize:11,color:T.sec}}>{x.l}</div>
                </div>
              ))}
            </div>

            <div style={{marginBottom:12}}>
              <input style={s.inp} placeholder="🔍 Buscar..." value={adminQ} onChange={e=>setAdminQ(e.target.value)}/>
            </div>

            <div style={{...s.card,marginBottom:14,borderLeft:`4px solid ${P.gld}`,background:`${P.gld}11`}}>
              <h3 style={{fontWeight:800,marginBottom:6,color:P.gld}}>🔧 Testar Envio de E-mail</h3>
              <p style={{fontSize:12,color:T.sec,marginBottom:10}}>
                Clique para enviar um e-mail de teste para <strong>{ADMIN_EMAIL}</strong> e confirmar as notificações.
              </p>
              <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                <button className="hov" onClick={async()=>{
                  setTestEmail("loading")
                  const usuario = {nome:"Teste Admin",email:"admin@yoga.com",idade:"30",pais:"Brasil",nivel:"Iniciante",goals:["Teste"],phone:"99999",bio:"Teste"}
                  const r = await enviarNotificacao(usuario, "TESTE1")
                  if (r.web3)      setTestEmail("web3_ok")
                  else if (r.gmail) setTestEmail("gmail_ok")
                  else if (r.clipboard) setTestEmail("clip_ok")
                  else setTestEmail("falhou")
                  setTimeout(()=>setTestEmail(null), 10000)
                }} disabled={testEmail==="loading"} style={{...s.btn(P.gld,"#fff"),padding:"9px 18px",fontSize:13}}>
                  {testEmail==="loading" ? "⏳ Testando..." : "🧪 Testar Envio Agora"}
                </button>
                {testEmail && testEmail!=="loading" && (
                  <div style={{padding:"10px 14px",borderRadius:10,fontSize:13,fontWeight:700,
                    background: testEmail.includes("ok") ? `${P.grn}22` : `${P.red}22`,
                    color: testEmail.includes("ok") ? P.grn : P.red,
                    border:`1px solid ${testEmail.includes("ok")?P.grn:P.red}44`}}>
                    {testEmail==="web3_ok"  && "✅ Web3Forms funcionou!"}
                    {testEmail==="gmail_ok" && "📬 Gmail aberto!"}
                    {testEmail==="clip_ok"  && "📋 Dados copiados!"}
                    {testEmail==="falhou"   && "❌ Falhou. Verifique o console."}
                  </div>
                )}
              </div>
            </div>

            <div style={s.card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <h3 style={{fontWeight:800,marginBottom:0}}>👥 Inscrições</h3>
                {regs.filter(r => !r.isApproved && r.email !== ADMIN_EMAIL).length > 0 && (
                  <button onClick={deleteAllPending} style={{...s.btn("transparent", P.red), border:`1px solid ${P.red}`, padding:"6px 12px", fontSize:12, boxShadow:"none"}}>🗑️ Excluir Todos Pendentes</button>
                )}
              </div>
              {regs.filter(r=>!adminQ||r.nome?.toLowerCase().includes(adminQ.toLowerCase())||r.email?.toLowerCase().includes(adminQ.toLowerCase())).length === 0
                ? <p style={{color:T.sec,textAlign:"center",padding:20}}>{adminQ?"Sem resultados.":"Nenhuma inscrição ainda."}</p>
                : regs.filter(r=>!adminQ||r.nome?.toLowerCase().includes(adminQ.toLowerCase())||r.email?.toLowerCase().includes(adminQ.toLowerCase())).map(r=>{
                    const ok = r.isApproved
                    const isNew = r.createdAt && (Date.now() - (r.createdAt.seconds * 1000) < 300000); // 5 minutes
                    const codigo = r.activationCode
                    return (
                      <div key={r.id} className="reg-item" style={{borderBottom:`1px solid ${T.brd}`,padding:"14px 0"}}>
                        <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                          <div style={{width:42,height:42,borderRadius:"50%",flexShrink:0,background:ok?`${P.grn}22`:`${P.lil}22`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,color:ok?P.grn:P.lilD}}>
                            {r.nome?.[0]?.toUpperCase()}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{fontWeight:800,fontSize:15}}>{r.nome}</div>
                              {isNew && <span style={{background:P.trq,color:"#fff",fontSize:9,padding:"2px 6px",borderRadius:4,fontWeight:900,animation:"pulse 1s infinite"}}>NOVO</span>}
                            </div>
                            <div style={{fontSize:12,color:T.sec,marginTop:2}}>📧 <b>{r.email}</b></div>
                            <div style={{fontSize:11,color:T.sec}}>📞 {r.phone||"—"} · 🌍 {r.pais} · 🧘 {r.nivel}</div>
                            <div style={{fontSize:11,color:T.sec}}>🎯 {(r.goals||[]).join(", ")||"—"}</div>
                            <div style={{fontSize:11,color:T.sec}}>📅 {r.createdAt ? (r.createdAt.toDate ? r.createdAt.toDate().toLocaleString("pt-BR") : new Date(r.createdAt).toLocaleString("pt-BR")) : "Recém criado"}</div>
                            {r.bio&&<div style={{fontSize:11,color:T.sec,fontStyle:"italic"}}>💬 {r.bio}</div>}
                            {!ok && codigo && (
                              <div 
                                onClick={() => {
                                  navigator.clipboard.writeText(codigo);
                                  sh("Código copiado! 📋");
                                }}
                                style={{marginTop:8,background:T.cardAlt,borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"center",gap:10, cursor:"pointer"}}
                                className="hov"
                              >
                                <span style={{fontSize:12,color:T.sec}}>🔑 Código:</span>
                                <span style={{fontWeight:800,fontSize:18,letterSpacing:3,color:P.trq}}>{codigo}</span>
                                <span style={{fontSize:12, marginLeft:"auto"}}>📋</span>
                              </div>
                            )}
                            {ok && <span style={{display:"inline-block",marginTop:6,background:`${P.grn}22`,color:P.grn,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700}}>✅ Acesso Ativo</span>}
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:8,flexShrink:0}}>
                            {!ok
                              ? <>
                                  <button className="hov" onClick={()=>approveUser(r.email)} style={{...s.btn(P.trq),padding:"7px 14px",fontSize:13}}>✓ Ativar Conta</button>
                                  <button className="hov" onClick={()=>resendEmail(r)} style={{...s.btn(P.brnL,"#fff"),padding:"6px 12px",fontSize:12}}>📧 Reenviar Código</button>
                                  <button className="hov" onClick={()=>deleteUser(r)} style={{...s.btn("transparent", P.red), border:`1px solid ${P.red}`, padding:"6px 12px", fontSize:12, boxShadow:"none"}}>🗑️ Excluir Inscrição</button>
                                </>
                              : <>
                                  <button className="hov" onClick={()=>revokeUser(r.email)} style={{...s.btn(P.red,"#fff"),padding:"6px 12px",fontSize:12}}>Revogar Acesso</button>
                                  <button className="hov" onClick={()=>deleteUser(r)} style={{...s.btn("transparent", P.red), border:`1px solid ${P.red}`, padding:"6px 12px", fontSize:12, boxShadow:"none", marginTop:4}}>🗑️ Eliminar Usuário</button>
                                </>
                            }
                          </div>
                        </div>
                      </div>
                    )
                  })
              }
            </div>
          </>
        )}
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}
    </div>
  )

  if (scr !== "app" && scr !== "auth") return null
  const done = Object.values(prog).filter(v => v).length

  if (cls) {
    const m = MODULES.find(m => m.classes.find(c => c.id === cls.id))
    const currentIndex = allCls.findIndex(c => c.id === cls.id)
    const prevCls = currentIndex > 0 ? allCls[currentIndex - 1] : null
    const nextCls = currentIndex < allCls.length - 1 ? allCls[currentIndex + 1] : null

    const isLocked = (c: any) => !c.isFree && !isApproved;

    const handleNav = (target: any) => {
      if (!target) return;
      if (isLocked(target)) {
        sh("🔒 Próxima aula é privada. Cadastre-se para desbloquear!", "warn");
        setCls(null);
        setScr("auth");
        setAuthTab("register");
      } else {
        setCls(target);
        setBreathActive(false);
        setOpenPose(null);
      }
    };

    return (
      <div style={{...s.wrap, overflowY:"auto"}}>
        <style>{CSS}</style>
        <div style={{position:"sticky",top:0,zIndex:100,background:T.nav,backdropFilter:"blur(12px)",borderBottom:`1px solid ${T.brd}`,padding:"11px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={()=>{setCls(null);setBreathActive(false);setOpenPose(null);}} style={{background:"transparent",border:"none",color:T.text,cursor:"pointer",fontSize:20}}>✕</button>
          <div style={{textAlign:"center", flex:1, margin:"0 10px"}}>
            <div style={{fontSize:10,color:T.sec,textTransform:"uppercase",letterSpacing:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m?.title}</div>
            <div style={{fontWeight:800,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cls.title}</div>
          </div>
          <div style={{display:"flex", gap:8}}>
            <button onClick={() => handleNav(prevCls)} disabled={!prevCls} style={{background:T.cardAlt, border:`1px solid ${T.brd}`, borderRadius:8, padding:"4px 8px", cursor:prevCls?"pointer":"default", opacity:prevCls?1:.3, fontSize:12}}>◀</button>
            <button onClick={() => handleNav(nextCls)} disabled={!nextCls} style={{background:T.cardAlt, border:`1px solid ${T.brd}`, borderRadius:8, padding:"4px 8px", cursor:nextCls?"pointer":"default", opacity:nextCls?1:.3, fontSize:12}}>▶</button>
          </div>
        </div>

        <div style={{maxWidth:700,margin:"0 auto",paddingBottom:40}}>
          <div style={{position:"relative",width:"100%",paddingTop:"56.25%",background:"#000"}}>
            <iframe
              style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}}
              src={`https://www.youtube.com/embed/${cls.videoId}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div style={{padding:16}}>
            <div style={{...s.card,marginBottom:12,borderLeft:`4px solid ${m?.color||P.trq}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{background:`${m?.color||P.trq}22`,color:m?.tc||P.trq,borderRadius:6,padding:"3px 10px",fontSize:12,fontWeight:700}}>{cls.level}</span>
                <span style={{fontSize:13,color:T.sec}}>⏱ {cls.min} minutos</span>
              </div>
              <p style={{fontSize:14,lineHeight:1.6,color:T.text,margin:0}}>{cls.desc}</p>
            </div>

            {cls.breathSteps && (
              <div style={{...s.card, marginBottom:12, textAlign:"center", background:`linear-gradient(135deg, ${T.card}, ${T.cardAlt})`, border:`2px solid ${P.trq}44`}}>
                <h3 style={{fontWeight:800, marginBottom:12, display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
                  🌬️ Exercício de Respiração
                </h3>
                <BreathController 
                  steps={cls.breathSteps} 
                  active={breathActive} 
                  phase={breathPhase} 
                  setPhase={setBreathPhase} 
                  count={breathCount} 
                  setCount={setBreathCount} 
                  timer={breathTimer} 
                  setTimer={setBreathTimer} 
                />
                <div style={{position:"relative", width:140, height:140, margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center"}}>
                  <div style={{
                    position:"absolute", inset:0, borderRadius:"50%", 
                    border:`4px solid ${breathActive ? cls.breathSteps[breathPhase % cls.breathSteps.length]?.color || P.trq : T.brd}`,
                    transition:"all 0.5s ease",
                    transform: breathActive ? "scale(1.1)" : "scale(1)",
                    opacity: breathActive ? 1 : 0.3
                  }} />
                  <div style={{textAlign:"center", zIndex:1}}>
                    <div style={{fontSize:18, fontWeight:800, color: breathActive ? cls.breathSteps[breathPhase % cls.breathSteps.length]?.color || P.trq : T.sec}}>
                      {breathActive ? cls.breathSteps[breathPhase % cls.breathSteps.length]?.name : "Pronto?"}
                    </div>
                    {breathActive && <div style={{fontSize:32, fontWeight:900}}>{breathCount}s</div>}
                  </div>
                </div>
                <button 
                  className="hov" 
                  onClick={() => setBreathActive(!breathActive)} 
                  style={s.btn(breathActive ? P.red : P.trq)}
                >
                  {breathActive ? "Parar Exercício" : "Iniciar Respiração"}
                </button>
              </div>
            )}

            <div style={{...s.card,marginBottom:12}}>
              <h3 style={{fontWeight:800,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                🎵 Trilha Sonora Recomendada
              </h3>
              <div style={{display:"flex",alignItems:"center",gap:12,background:T.cardAlt,padding:12,borderRadius:12,border:`1px solid ${T.brd}`}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:P.trq,display:"flex",alignItems:"center",justifyContent:"center",animation: (playingModule?.id === cls.id && !medLoading) ? "spin 8s linear infinite" : "none"}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14}}>{cls.music}</div>
                  <div style={{fontSize:12,color:T.sec}}>{playingModule?.id === cls.id ? (medLoading ? "Carregando..." : "Tocando agora") : "Áudio Funcional"}</div>
                </div>
                <button 
                  className="hov"
                  onClick={() => toggleModuleAudio(cls)}
                  style={{...s.btn(playingModule?.id === cls.id ? P.red : P.trq), padding:"8px 16px", fontSize:12, boxShadow:"none"}}
                >
                  {playingModule?.id === cls.id ? "Parar" : "Ouvir"}
                </button>
              </div>
            </div>

            {/* Conteúdo sempre liberado */}
            <div style={{...s.card,marginBottom:12}}>
              <h3 style={{fontWeight:800,marginBottom:14}}>🧘 Guia de Posturas (Ilustrado)</h3>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {(cls.poses||[]).map((p: any,i: number)=>{
                  const pObj = typeof p === "object" ? p : {name:p, emoji:"🧘", desc:""}
                  const isOpen = openPose === i
                  return (
                    <div key={i}
                      onClick={()=>setOpenPose(isOpen?null:i)}
                      style={{
                        background: isOpen ? `${m?.color||P.trq}18` : T.cardAlt,
                        border:`1.5px solid ${isOpen ? m?.color||P.trq : T.brd}`,
                        borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"all .25s",
                      }}>
                      <div style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px"}}>
                        <div style={{width:34,height:34,borderRadius:10,background:`${m?.color||P.trq}22`,
                          display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                          {pObj.emoji||"🧘"}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:700,fontSize:14}}>{pObj.name||pObj}</div>
                        </div>
                        <span style={{color:T.sec,fontSize:16,transition:"transform .25s",
                            transform:isOpen?"rotate(180deg)":"rotate(0deg)",display:"inline-block"}}>▾</span>
                      </div>
                      {isOpen && (
                        <div style={{padding:"0 14px 14px",borderTop:`1px solid ${m?.color||P.trq}22`}}>
                          {pObj.img && (
                            <img src={pObj.img} alt={pObj.name} referrerPolicy="no-referrer" style={{width:"100%", height:160, objectFit:"cover", borderRadius:8, marginTop:12}} />
                          )}
                          <p style={{color:T.sec,fontSize:14,lineHeight:1.75,margin:0,marginTop:10}}>
                            {pObj.desc || "Mantenha a respiração fluida e o foco no momento presente."}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{...s.card,marginTop:12}}>
              <h3 style={{fontWeight:800,marginBottom:14}}>✨ Benefícios desta Prática</h3>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {(cls.benefits||[]).map((b: any,i: number)=>{
                  const bObj = typeof b === "object" ? b : {text:b, icon:"◆", intensity:75}
                  return (
                    <div key={i}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:5}}>
                        <span style={{fontSize:20,flexShrink:0}}>{bObj.icon||"◆"}</span>
                        <span style={{fontSize:14,fontWeight:600,flex:1}}>{bObj.text||b}</span>
                        <span style={{fontSize:12,color:P.trq,fontWeight:800,flexShrink:0}}>{bObj.intensity||""}%</span>
                      </div>
                      {bObj.intensity && (
                        <div style={{background:T.cardAlt,borderRadius:99,height:6,overflow:"hidden",marginLeft:30}}>
                          <div style={{
                            height:"100%",borderRadius:99,
                            background:`linear-gradient(90deg,${m?.color||P.trq},${P.trq})`,
                            width:`${bObj.intensity}%`,
                            transition:"width 1s ease",
                          }}/>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <button className="hov" onClick={()=>markDone(cls.id)} style={{...s.btn(prog[cls.id]?P.grn:P.trq),width:"100%",marginTop:18,fontSize:16,padding:"14px"}}>
              {prog[cls.id]?"✅ Aula Concluída!":"Marcar como Concluída 🎉"}
            </button>
          </div>
        </div>
        {toast && <Toast msg={toast.msg} type={toast.type}/>}
      </div>
    )
  }

  return (
    <div style={{...s.wrap,paddingBottom:76}}>
      <style>{CSS}</style>

      <div style={{position:"sticky",top:0,zIndex:100,background:T.nav,backdropFilter:"blur(12px)",borderBottom:`1px solid ${T.brd}`,padding:"11px 14px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
          <div onClick={lotusClick} style={{cursor:"pointer"}}><Lotus size={28} color={P.trq}/></div>
          {lClicks > 0 && <div style={{fontSize:6, color:P.lil, marginTop:2, letterSpacing:1}}>{"◆".repeat(lClicks)}</div>}
        </div>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,color:P.trq}}>Yoga em Casa</span>
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setDark(!dark)} style={{background:T.cardAlt,border:`1px solid ${T.brd}`,borderRadius:10,padding:"6px 10px",cursor:"pointer",fontSize:15,lineHeight:1}}>{dark?"☀️":"🌙"}</button>
          {user ? (
            <div style={{width:32,height:32,borderRadius:"50%",background:`${P.trq}22`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:P.trq,fontSize:14}}>{user?.nome?.[0]?.toUpperCase()||"U"}</div>
          ) : (
            <div style={{display:"flex", gap:8}}>
              <button onClick={()=>{setScr("auth"); setAuthTab("login"); setShowPremiumCard(false);}} style={{...s.btn("transparent", P.trq), border:`1px solid ${P.trq}`, padding:"6px 12px", fontSize:12, boxShadow:"none"}}>Entrar</button>
              <button onClick={()=>{setScr("auth"); setAuthTab("register"); setShowPremiumCard(false);}} style={{...s.btn(P.trq), padding:"6px 12px", fontSize:12, boxShadow:"none"}}>Cadastrar</button>
            </div>
          )}
        </div>
      </div>

      <div style={{maxWidth:700,margin:"0 auto",padding:"14px 14px 0"}}>
        {scr === "auth" && (
          <div style={{animation:"fadeUp .45s ease both", paddingBottom:40}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div onClick={lotusClick} style={{cursor:"pointer",display:"inline-block"}}><Lotus size={64} color={P.trq} spin/></div>
              {lClicks > 0 && <p style={{fontSize:11,color:P.lil,marginTop:8}}>{"◆".repeat(lClicks)}{"◇".repeat(LOTUS_CLICKS-lClicks)}</p>}
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:P.trq,marginTop:8}}>Yoga em Casa</h1>
              {showPremiumCard && authTab === "register" && (
                <div style={{
                  ...s.card, 
                  marginTop: 16, 
                  marginBottom: 24,
                  background: `linear-gradient(135deg, ${P.lil}, ${P.lilD})`, 
                  color: "#fff",
                  textAlign: "center",
                  padding: "24px 20px",
                  border: "none",
                  animation: "fadeUp 0.6s ease both"
                }}>
                  <div style={{fontSize:40, marginBottom:12}}>💎</div>
                  <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:22, marginBottom:8}}>Acesso Vitalício Premium</h3>
                  <div style={{fontSize:28, fontWeight:900, marginBottom:10}}>R$ 97,00</div>
                  <p style={{fontSize:14, opacity:0.9, marginBottom:20, lineHeight:1.5}}>
                    Desbloqueie todos os módulos e aulas com um <b>pagamento único</b>. 
                    Sem mensalidades, acesso para sempre!
                  </p>
                  <button 
                    className="hov" 
                    onClick={() => { 
                      const el = document.getElementById("reg-form-title");
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{...s.btn("#fff", P.lilD), width:"100%"}}
                  >
                    Cadastrar para Ativar
                  </button>
                </div>
              )}
              {lClicks > 0 && <p style={{fontSize:11,color:P.lil}}>{"◆".repeat(lClicks)}{"◇".repeat(LOTUS_CLICKS-lClicks)}</p>}
            </div>

            <div style={{display:"flex",background:T.card,borderRadius:12,padding:4,marginBottom:16,border:`1px solid ${T.brd}`}}>
              {[["login","🔑 Entrar"],["register","🌸 Cadastrar"]].map(([k,v])=>(
                <button key={k} onClick={()=>setAuthTab(k)} style={{flex:1,padding:"10px 0",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all .2s",background:authTab===k?P.trq:"transparent",color:authTab===k?"#fff":T.sec}}>{v}</button>
              ))}
            </div>

            <div style={s.card}>
              {authTab === "login" ? (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22}}>Bem-vinda(o) de volta 🙏</h2>
                  {[{k:"email",l:"E-mail",t:"email",p:"seu@email.com"},{k:"password",l:"Senha",t:"password",p:"••••••••"}].map((f: any)=>(
                    <div key={f.k}><label style={s.lbl}>{f.l}</label>
                      <input style={s.inp} type={f.t} placeholder={f.p} value={(loginF as any)[f.k]}
                        onChange={e=>setLoginF({...loginF,[f.k]:e.target.value})}
                        onKeyDown={e=>e.key==="Enter"&&doLogin()}/></div>
                  ))}
                  <button className="hov" onClick={doLogin} style={s.btn(P.trq)}>Entrar →</button>
                  <div style={{textAlign:"center", marginTop: -4}}>
                    <span onClick={forgotPassword} style={{fontSize:12, color:T.sec, cursor:"pointer", textDecoration:"underline"}}>Esqueci minha senha</span>
                  </div>
                  <p style={{textAlign:"center",fontSize:13,color:T.sec}}>Sem conta? <span onClick={()=>setAuthTab("register")} style={{color:P.trq,cursor:"pointer",fontWeight:700}}>Cadastre-se</span></p>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <h2 id="reg-form-title" style={{fontFamily:"'Playfair Display',serif",fontSize:22}}>Inicie sua jornada 🌸</h2>
                  <div style={{padding:"8px 12px",background:`${P.trq}11`,borderRadius:8,borderLeft:`3px solid ${P.trq}`,fontSize:12,color:T.sec,lineHeight:1.5}}>
                    📋 Seus dados são enviados ao administrador para ativação do acesso.
                  </div>
                  {[
                    {k:"nome",    l:"Nome completo *",      t:"text",     p:"Seu nome"},
                    {k:"email",   l:"E-mail *",             t:"email",    p:"seu@email.com"},
                    {k:"phone",   l:"Telefone / WhatsApp",  t:"tel",      p:"+55 (11) 99999-9999"},
                    {k:"idade",   l:"Idade *",              t:"number",   p:"Ex: 28"},
                    {k:"password",l:"Criar senha *",        t:"password", p:"Mínimo 6 caracteres"},
                  ].map((f: any)=>(
                    <div key={f.k}><label style={s.lbl}>{f.l}</label>
                      <input style={s.inp} type={f.t} placeholder={f.p} value={(regF as any)[f.k]}
                        onChange={e=>setRegF({...regF,[f.k]:e.target.value})}/></div>
                  ))}
                  <div><label style={s.lbl}>País *</label>
                    <select style={{...s.inp,cursor:"pointer"}} value={regF.pais} onChange={e=>setRegF({...regF,pais:e.target.value})}>
                      {COUNTRIES.map(c=><option key={c}>{c}</option>)}
                    </select></div>
                  <div><label style={s.lbl}>Nível de experiência</label>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {LEVELS.map(l=><button key={l} className={`chip${regF.nivel===l?" on":""}`} onClick={()=>setRegF({...regF,nivel:l})}>{l}</button>)}
                    </div></div>
                  <div><label style={s.lbl}>Objetivos</label>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {GOALS.map(g=>{const on=(regF.goals||[]).includes(g);return(
                        <button key={g} className={`chip${on?" on":""}`}
                          onClick={()=>{const c=regF.goals||[];setRegF({...regF,goals:on?c.filter(x=>x!==g):[...c,g]})}}>
                          {g}</button>
                      )})}
                    </div></div>
                  <div><label style={s.lbl}>Sobre você (opcional)</label>
                    <textarea style={{...s.inp,resize:"vertical",minHeight:60}} placeholder="Sua história com yoga..."
                      value={regF.bio} onChange={e=>setRegF({...regF,bio:e.target.value})}/></div>
                  <button className="hov" onClick={doRegister} disabled={regLoading}
                    style={{...s.btn(P.trq), opacity:regLoading ? 0.7 : 1, display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
                    {regLoading
                      ? <><span style={{width:16,height:16,borderTop:"2px solid #fff",borderRight:"2px solid #ffffff44",borderBottom:"2px solid #ffffff44",borderLeft:"2px solid #ffffff44",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite"}}/> Salvando...</>
                      : "CADASTRAR PARA ATIVAR 🪷"}
                  </button>
                  <p style={{fontSize:11,color:T.sec,textAlign:"center"}}>Após o cadastro, um código de ativação é enviado ao administrador.</p>
                </div>
              )}
            </div>
            
            <button onClick={() => setScr("app")} style={{background:"transparent", border:"none", color:T.sec, cursor:"pointer", display:"block", margin:"20px auto", fontSize:14, textDecoration:"underline"}}>
              Voltar para o Início
            </button>
          </div>
        )}

        {tab==="home" && scr !== "auth" && (
          <div style={{animation:"fadeUp .45s ease both"}}>
            {/* Hero Banner */}
            <div style={{
              ...s.card, 
              marginBottom: 20, 
              background: `linear-gradient(135deg, ${P.celD}, ${P.trq})`, 
              color: "#fff",
              padding: "30px 24px",
              position: "relative",
              overflow: "hidden",
              border: "none"
            }}>
              <div style={{position:"absolute", right:-20, bottom:-20, opacity:0.2}}>
                <Lotus size={180} color="#fff" />
              </div>
              <div style={{position:"relative", zIndex:1}}>
                <div style={{fontSize:12, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", opacity:0.9, marginBottom:8}}>Bem-vindo ao</div>
                <h1 style={{fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:800, marginBottom:12}}>Yoga em Casa</h1>
                <p style={{fontSize:14, lineHeight:1.6, maxWidth:"80%", opacity:0.9, marginBottom:24}}>
                  Sua plataforma completa para praticar yoga em casa. Aprenda posturas, siga sequências guiadas e organize sua prática com facilidade.
                </p>
                <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
                  <button className="hov" onClick={() => setTab("modules")} style={{...s.btn("#fff", P.trq), padding:"10px 20px", fontSize:14}}>🧘 Começar Praticar</button>
                  {!user && (
                    <button className="hov" onClick={() => { setScr("auth"); setAuthTab("register"); setShowPremiumCard(true); }} style={{...s.btn(P.gld, "#fff"), padding:"10px 20px", fontSize:14}}>✨ CADASTRAR PARA ATIVAR</button>
                  )}
                  <button className="hov" onClick={() => setTab("ai")} style={{...s.btn("rgba(255,255,255,0.2)", "#fff"), border:"1px solid rgba(255,255,255,0.4)", padding:"10px 20px", fontSize:14, boxShadow:"none"}}>🤖 Falar com a IA</button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12, marginBottom:24}}>
              {[
                {v:"20+", l:"Posturas", i:"🧘", c:P.trq},
                {v:"12+", l:"Sequências", i:"🌊", c:P.celD},
                {v:"20", l:"Minutos Médios", i:"⏱️", c:P.lil},
                {v:"Todos", l:"Nível", i:"⭐", c:P.gld}
              ].map(x => (
                <div key={x.l} style={{...s.card, padding:12, textAlign:"left"}}>
                  <div style={{fontSize:20, marginBottom:8}}>{x.i}</div>
                  <div style={{fontSize:18, fontWeight:800, color:x.c}}>{x.v}</div>
                  <div style={{fontSize:11, color:T.sec}}>{x.l}</div>
                </div>
              ))}
            </div>

            {/* Feature Cards */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24}}>
              {/* Aprenda Posturas */}
              <div className="cHov" style={{...s.card, cursor:"pointer"}} onClick={() => setShowPoses(true)}>
                <div style={{fontSize:24, marginBottom:12}}>🧘</div>
                <h3 style={{fontWeight:800, fontSize:16, marginBottom:8}}>Aprenda Posturas</h3>
                <p style={{fontSize:12, color:T.sec, lineHeight:1.5, marginBottom:16}}>Instruções detalhadas de 8 posturas fundamentais do yoga</p>
                <button style={{...s.btn(P.trq), padding:"8px 16px", fontSize:12, boxShadow:"none"}}>Ver Posturas</button>
              </div>

              {/* Meditação */}
              <div className="cHov" style={{...s.card, cursor:"pointer"}} onClick={() => setShowMeditations(true)}>
                <div style={{fontSize:24, marginBottom:12}}>🧠</div>
                <h3 style={{fontWeight:800, fontSize:16, marginBottom:8}}>Meditação</h3>
                <p style={{fontSize:12, color:T.sec, lineHeight:1.5, marginBottom:16}}>12 práticas guiadas: mindfulness, respiração, mantras e mais</p>
                <button style={{...s.btn(P.celD), padding:"8px 16px", fontSize:12, boxShadow:"none"}}>Meditar</button>
              </div>

              {/* Sequências Guiadas */}
              <div className="cHov" style={{...s.card, cursor:"pointer"}} onClick={() => setShowSequences(true)}>
                <div style={{fontSize:24, marginBottom:12}}>🌊</div>
                <h3 style={{fontWeight:800, fontSize:16, marginBottom:8}}>Sequências Guiadas</h3>
                <p style={{fontSize:12, color:T.sec, lineHeight:1.5, marginBottom:16}}>Sequências prontas para diferentes objetivos e níveis</p>
                <button style={{...s.btn(P.celD), padding:"8px 16px", fontSize:12, boxShadow:"none"}}>Ver Sequências</button>
              </div>

              {/* Gestão de Prática */}
              <div className="cHov" style={{...s.card, cursor:"pointer"}} onClick={() => setTab("tasks")}>
                <div style={{fontSize:24, marginBottom:12}}>📋</div>
                <h3 style={{fontWeight:800, fontSize:16, marginBottom:8}}>Gestão de Prática</h3>
                <p style={{fontSize:12, color:T.sec, lineHeight:1.5, marginBottom:16}}>Organize tarefas, atribua responsáveis e monitore progresso</p>
                <button style={{...s.btn(P.brnL), padding:"8px 16px", fontSize:12, boxShadow:"none"}}>Gerenciar</button>
              </div>
            </div>

            {/* Dica do Dia */}
            <div style={{
              ...s.card, 
              background: dark ? "rgba(46,196,182,0.1)" : "#F0FFF8", 
              border: `1px solid ${P.trq}33`,
              display: "flex",
              gap: 12,
              alignItems: "flex-start"
            }}>
              <div style={{fontSize:24}}>💡</div>
              <div>
                <div style={{fontWeight:800, fontSize:14, color:P.trq, marginBottom:4}}>Dica do Dia</div>
                <p style={{fontSize:13, lineHeight:1.6, color:T.text}}>
                  A respiração é a âncora do yoga. Quando se perder em uma postura, volte a atenção para a respiração — longa, profunda e constante. Isso acalma o sistema nervoso e traz clareza mental.
                </p>
              </div>
            </div>

            {/* New Detail Modals */}
            {showPoses && (
              <div style={{position:"fixed", inset:0, zIndex:1000, background:T.bg, overflowY:"auto", padding: selectedPose ? 0 : 20, animation:"fadeUp 0.3s ease"}}>
                <div style={{maxWidth: selectedPose ? "100%" : 700, margin:"0 auto"}}>
                  {!selectedPose ? (
                    <>
                      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20}}>
                        <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:24}}>🧘 Posturas Fundamentais</h2>
                        <button onClick={() => { setShowPoses(false); setSelectedPose(null); }} style={{background:"transparent", border:"none", fontSize:24, cursor:"pointer", color:T.text}}>✕</button>
                      </div>
                      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
                        {POSES.map((p, idx) => {
                          const isLocked = !isApproved && idx > 0;
                          return (
                            <div 
                              key={p.id} 
                              className={isLocked ? "" : "cHov"} 
                              style={{
                                ...s.card, 
                                cursor: isLocked ? "default" : "pointer",
                                position: "relative",
                                overflow: "hidden",
                                opacity: isLocked ? 0.7 : 1
                              }} 
                              onClick={() => {
                                if (isLocked) {
                                  sh("🔒 Conteúdo privado. Cadastre-se para desbloquear!", "warn");
                                  setScr("auth");
                                  setAuthTab("register");
                                } else {
                                  setSelectedPose(p);
                                }
                              }}
                            >
                              <div style={{ transition: "all 0.3s" }}>
                                <img src={p.img} alt={p.name} referrerPolicy="no-referrer" style={{width:"100%", height:120, objectFit:"cover", borderRadius:8, marginBottom:12}} />
                                <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:8}}>
                                  <span style={{fontSize:20}}>{p.emoji}</span>
                                  <h4 style={{fontWeight:800}}>{p.name}</h4>
                                </div>
                                <p style={{fontSize:12, color:T.sec, lineHeight:1.5}}>{p.desc}</p>
                                <div style={{marginTop:12, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                                    <span style={{fontSize:10, background:T.cardAlt, padding:"2px 6px", borderRadius:4}}>{p.level}</span>
                                    <span style={{fontSize:10, color:P.trq, fontWeight:700}}>{isLocked ? "🔒 Privado" : "Ver detalhes →"}</span>
                                </div>
                              </div>
                              {isLocked && (
                                <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.05)"}}>
                                  <div style={{width:40, height:40, borderRadius:"50%", background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.4)"}}>
                                    <span style={{fontSize:20}}>🔒</span>
                                  </div>
                                </div>
                              )}
                              {!isLocked && idx === 0 && (
                                <div style={{position:"absolute", top:8, left:8, background:P.trq, color:"#fff", fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:4, boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}>GRÁTIS</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div style={{minHeight:"100vh", background:T.bg}}>
                      <div style={{position:"relative", height:300, width:"100%"}}>
                        <img src={selectedPose.img} alt={selectedPose.name} referrerPolicy="no-referrer" style={{width:"100%", height:"100%", objectFit:"cover"}} />
                        <div style={{position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8))"}} />
                        <button 
                          onClick={() => setSelectedPose(null)} 
                          style={{position:"absolute", top:20, right:20, background:"rgba(0,0,0,0.5)", border:"none", borderRadius:"50%", width:40, height:40, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20}}
                        >✕</button>
                        <div style={{position:"absolute", bottom:20, left:20, right:20, color:"#fff"}}>
                          <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
                            <span style={{fontSize:32}}>{selectedPose.emoji}</span>
                            <div>
                                <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:28, margin:0}}>{selectedPose.title}</h2>
                                <p style={{fontSize:14, fontStyle:"italic", opacity:0.8, margin:0}}>{selectedPose.name}</p>
                            </div>
                          </div>
                          <div style={{display:"flex", gap:10}}>
                            <span style={{background:P.trq, color:"#fff", padding:"4px 12px", borderRadius:6, fontSize:12, fontWeight:700}}>{selectedPose.level}</span>
                            <span style={{background:"rgba(255,255,255,0.2)", backdropFilter:"blur(4px)", color:"#fff", padding:"4px 12px", borderRadius:6, fontSize:12, fontWeight:700}}>⏱️ {selectedPose.time}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{padding:20, maxWidth:700, margin:"0 auto"}}>
                        <div style={{...s.card, marginBottom:20, background: dark ? "rgba(46,196,182,0.05)" : "#F0FFF8", border:`1px solid ${P.trq}33`}}>
                            <p style={{fontSize:15, lineHeight:1.6, color:T.text, margin:0}}>{selectedPose.desc}</p>
                        </div>

                        <div style={{...s.card, marginBottom:20}}>
                          <h3 style={{fontWeight:800, marginBottom:16, display:"flex", alignItems:"center", gap:8}}>
                            📋 Instruções Passo a Passo
                          </h3>
                          <div style={{display:"flex", flexDirection:"column", gap:16}}>
                            {selectedPose.instructions.map((step: string, i: number) => (
                              <div key={i} style={{display:"flex", gap:12, alignItems:"flex-start"}}>
                                <div style={{width:24, height:24, borderRadius:"50%", background:P.trq, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, flexShrink:0}}>
                                  {i + 1}
                                </div>
                                <p style={{fontSize:14, lineHeight:1.5, margin:0}}>{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div style={{...s.card, marginBottom:20}}>
                          <h3 style={{fontWeight:800, marginBottom:16, display:"flex", alignItems:"center", gap:8}}>
                            ✨ Benefícios
                          </h3>
                          <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                            {selectedPose.benefits.map((benefit: string, i: number) => (
                              <span key={i} style={{background:`${P.trq}11`, color:P.trq, border:`1px solid ${P.trq}33`, padding:"6px 14px", borderRadius:99, fontSize:13, fontWeight:600}}>
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{...s.card, marginBottom:40}}>
                          <h3 style={{fontWeight:800, marginBottom:16, display:"flex", alignItems:"center", gap:8}}>
                            🎵 Áudio Imersivo
                          </h3>
                          <div style={{display:"flex", alignItems:"center", gap:12, background:T.cardAlt, padding:12, borderRadius:12, border:`1px solid ${T.brd}`}}>
                            <div style={{width:40, height:40, borderRadius:"50%", background:P.trq, display:"flex", alignItems:"center", justifyContent:"center", animation: (playingPose?.id === selectedPose.id && !medLoading) ? "spin 8s linear infinite" : "none"}}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                            </div>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:700, fontSize:14}}>Foco e Presença</div>
                              <div style={{fontSize:12, color:T.sec}}>{playingPose?.id === selectedPose.id ? (medLoading ? "Carregando..." : "Tocando agora") : "Trilha sonora para sua prática"}</div>
                            </div>
                            <button 
                              className="hov"
                              onClick={() => togglePoseAudio(selectedPose)}
                              style={{...s.btn(playingPose?.id === selectedPose.id ? P.red : P.trq), padding:"8px 16px", fontSize:12, boxShadow:"none"}}
                            >
                              {playingPose?.id === selectedPose.id ? "Parar" : "Ouvir"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {showMeditations && (
              <div style={{position:"fixed", inset:0, zIndex:1000, background:T.bg, overflowY:"auto", padding:20, animation:"fadeUp 0.3s ease"}}>
                <div style={{maxWidth:selectedMeditation ? 700 : 1000, margin:"0 auto"}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20}}>
                    <div style={{display:"flex", alignItems:"center", gap:12}}>
                      {selectedMeditation && (
                        <button onClick={() => setSelectedMeditation(null)} style={{background:"transparent", border:"none", fontSize:20, cursor:"pointer", color:T.text}}>←</button>
                      )}
                      <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:24}}>
                        {selectedMeditation ? selectedMeditation.title : "🧠 Meditação"}
                      </h2>
                    </div>
                    <button onClick={() => { setShowMeditations(false); stopAllAudio(); setSelectedMeditation(null); }} style={{background:"transparent", border:"none", fontSize:24, cursor:"pointer", color:T.text}}>✕</button>
                  </div>

                  {!selectedMeditation ? (
                    <>
                      <p style={{color:T.sec, fontSize:14, marginBottom:20}}>{MEDITATIONS.length} práticas para aquietar a mente e expandir a consciência</p>
                      
                      <div style={{marginBottom:24}}>
                        <input 
                          style={{...s.inp, marginBottom:16}} 
                          placeholder="Buscar meditação..." 
                          value={medSearch} 
                          onChange={e => setMedSearch(e.target.value)} 
                        />
                        <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
                          {["Todos", "Respiração", "Mindfulness", "Relaxamento", "Compaixão", "Mantra", "Visualização", "Restaurativa"].map(cat => (
                            <button 
                              key={cat} 
                              className={`chip${medFilter===cat?" on":""}`} 
                              style={{fontSize:12}}
                              onClick={() => setMedFilter(cat)}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:20}}>
                        {MEDITATIONS
                          .filter(m => medFilter === "Todos" || m.category === medFilter)
                          .filter(m => !medSearch || m.title.toLowerCase().includes(medSearch.toLowerCase()) || m.desc.toLowerCase().includes(medSearch.toLowerCase()))
                          .map((m, idx) => {
                          const isPlaying = playingMed?.id === m.id;
                          const isLocked = !isApproved && idx > 0;
                          return (
                            <div 
                              key={m.id} 
                              className={isLocked ? "" : "cHov"} 
                              style={{
                                ...s.card, 
                                display:"flex", 
                                flexDirection:"column", 
                                gap:12, 
                                borderTop: isPlaying ? `4px solid ${P.trq}` : `1px solid ${T.brd}`,
                                position: "relative",
                                overflow: "hidden",
                                opacity: isLocked ? 0.7 : 1,
                                cursor: isLocked ? "default" : "pointer"
                              }}
                              onClick={() => {
                                if (isLocked) {
                                  sh("🔒 Conteúdo privado. Cadastre-se para desbloquear!", "warn");
                                  setScr("auth");
                                  setAuthTab("register");
                                }
                              }}
                            >
                              <div style={{ transition: "all 0.3s", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{fontSize:32}}>{m.emoji}</div>
                                <h4 style={{fontWeight:800, fontSize:18, margin:0}}>{m.title}</h4>
                                
                                <div style={{display:"flex", gap:8}}>
                                  <span style={{fontSize:11, background:T.cardAlt, padding:"2px 8px", borderRadius:4, fontWeight:700}}>{m.level}</span>
                                  <span style={{fontSize:11, background:T.cardAlt, padding:"2px 8px", borderRadius:4, fontWeight:700}}>⏱️ {m.min} min</span>
                                </div>

                                <div style={{fontSize:11, color:P.lil, fontWeight:800, textTransform:"uppercase"}}>{m.category}</div>
                                
                                <p style={{fontSize:13, color:T.sec, lineHeight:1.5, margin:0, flex:1}}>{m.desc}</p>
                                
                                <div style={{fontSize:12, color:T.sec, display:"flex", alignItems:"center", gap:6}}>
                                  🎵 <span style={{fontStyle:"italic"}}>{m.audioInfo}</span>
                                </div>

                                <div style={{display:"flex", gap:10, marginTop:10}}>
                                  <button className="hov" onClick={(e) => { e.stopPropagation(); if(!isLocked) setSelectedMeditation(m); }} style={{...s.btn(T.cardAlt, T.text), flex:1, padding:"10px", fontSize:13, boxShadow:"none", border:`1px solid ${T.brd}`}}>
                                    Ver Detalhes
                                  </button>
                                  <button className="hov" onClick={(e) => { e.stopPropagation(); if(!isLocked) toggleMeditation(m); }} style={{...s.btn(isPlaying ? P.red : P.trq), flex:1, padding:"10px", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:6}}>
                                    {isPlaying && medLoading ? (
                                      <span style={{width:12, height:12, border:"2px solid #fff", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.6s linear infinite"}} />
                                    ) : isPlaying ? "⏹️ Parar" : "▶️ Praticar"}
                                  </button>
                                </div>
                              </div>

                              {isLocked && (
                                <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.05)"}}>
                                  <div style={{width:48, height:48, borderRadius:"50%", background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.4)"}}>
                                    <span style={{fontSize:24}}>🔒</span>
                                  </div>
                                </div>
                              )}
                              {!isLocked && idx === 0 && (
                                <div style={{position:"absolute", top:8, right:8, background:P.trq, color:"#fff", fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:4, boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}>GRÁTIS</div>
                              )}

                              {isPlaying && !isLocked && (
                                <div style={{background:T.cardAlt, padding:12, borderRadius:12, border:`1px solid ${T.brd}`, marginTop:10, animation:"fadeUp 0.3s ease"}}>
                                  <div style={{display:"flex", alignItems:"center", gap:10}}>
                                    <div style={{width:24, height:24, borderRadius:"50%", background:P.trq, display:"flex", alignItems:"center", justifyContent:"center", animation: medLoading ? "pulse 1s infinite" : "spin 8s linear infinite"}}>
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                                    </div>
                                    <div style={{fontSize:11, fontWeight:700}}>{medLoading ? "Carregando áudio..." : "Tocando agora..."}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div style={{animation:"fadeUp 0.4s ease"}}>
                      <div style={{position:"relative", height:240, borderRadius:20, overflow:"hidden", marginBottom:24}}>
                        <img src={selectedMeditation.img} alt={selectedMeditation.title} referrerPolicy="no-referrer" style={{width:"100%", height:"100%", objectFit:"cover"}} />
                        <div style={{position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.7), transparent)", display:"flex", alignItems:"flex-end", padding:24}}>
                          <div>
                            <div style={{fontSize:48, marginBottom:8}}>{selectedMeditation.emoji}</div>
                            <h1 style={{color:"#fff", margin:0, fontFamily:"'Playfair Display',serif", fontSize:32}}>{selectedMeditation.title}</h1>
                            <div style={{display:"flex", gap:10, marginTop:12}}>
                              <span style={{background:"rgba(255,255,255,0.2)", color:"#fff", padding:"4px 12px", borderRadius:99, fontSize:12, fontWeight:700, backdropFilter:"blur(4px)"}}>{selectedMeditation.level}</span>
                              <span style={{background:"rgba(255,255,255,0.2)", color:"#fff", padding:"4px 12px", borderRadius:99, fontSize:12, fontWeight:700, backdropFilter:"blur(4px)"}}>⏱️ {selectedMeditation.min} min</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{display:"grid", gridTemplateColumns:"1fr", gap:20}}>
                        <div style={s.card}>
                          <h3 style={{fontWeight:800, marginBottom:12}}>📖 Sobre esta prática</h3>
                          <p style={{fontSize:15, lineHeight:1.6, color:T.sec, margin:0}}>{selectedMeditation.desc}</p>
                        </div>

                        <div style={s.card}>
                          <h3 style={{fontWeight:800, marginBottom:16, display:"flex", alignItems:"center", gap:8}}>
                            📝 Instruções Passo a Passo
                          </h3>
                          <div style={{display:"flex", flexDirection:"column", gap:16}}>
                            {selectedMeditation.instructions.map((step: string, i: number) => (
                              <div key={i} style={{display:"flex", gap:12, alignItems:"flex-start"}}>
                                <div style={{width:24, height:24, borderRadius:"50%", background:P.trq, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, flexShrink:0}}>
                                  {i + 1}
                                </div>
                                <p style={{fontSize:14, lineHeight:1.5, margin:0}}>{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div style={s.card}>
                          <h3 style={{fontWeight:800, marginBottom:16, display:"flex", alignItems:"center", gap:8}}>
                            ✨ Benefícios
                          </h3>
                          <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                            {selectedMeditation.benefits.map((benefit: string, i: number) => (
                              <span key={i} style={{background:`${P.trq}11`, color:P.trq, border:`1px solid ${P.trq}33`, padding:"6px 14px", borderRadius:99, fontSize:13, fontWeight:600}}>
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{...s.card, marginBottom:40}}>
                          <h3 style={{fontWeight:800, marginBottom:16, display:"flex", alignItems:"center", gap:8}}>
                            🎵 Controle de Áudio
                          </h3>
                          <div style={{display:"flex", alignItems:"center", gap:12, background:T.cardAlt, padding:16, borderRadius:12, border:`1px solid ${T.brd}`}}>
                            <div style={{width:48, height:48, borderRadius:"50%", background:P.trq, display:"flex", alignItems:"center", justifyContent:"center", animation: (playingMed?.id === selectedMeditation.id && !medLoading) ? "spin 8s linear infinite" : "none"}}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                            </div>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:700, fontSize:15}}>{selectedMeditation.title}</div>
                              <div style={{fontSize:12, color:T.sec}}>{medLoading ? "Carregando..." : (playingMed?.id === selectedMeditation.id ? "Em execução" : "Pronto para iniciar")}</div>
                            </div>
                            <button 
                              className="hov" 
                              onClick={() => toggleMeditation(selectedMeditation)}
                              style={{...s.btn(playingMed?.id === selectedMeditation.id ? P.red : P.trq), padding:"10px 20px", fontSize:14}}
                            >
                              {playingMed?.id === selectedMeditation.id ? "Parar" : "Iniciar"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {showSequences && (
              <div style={{position:"fixed", inset:0, zIndex:1000, background:T.bg, overflowY:"auto", padding: selectedSequence ? 0 : 20, animation:"fadeUp 0.3s ease"}}>
                <div style={{maxWidth: selectedSequence ? "100%" : 1000, margin:"0 auto"}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, padding: selectedSequence ? "20px 20px 0" : 0}}>
                    <div>
                      <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:28, marginBottom:4}}>
                        {selectedSequence ? selectedSequence.title : "🌊 Sequências Guiadas"}
                      </h2>
                      {!selectedSequence && <p style={{color:T.sec, fontSize:14}}>Fluxos completos para diferentes objetivos</p>}
                    </div>
                    <button onClick={() => { setShowSequences(false); stopAllAudio(); setSelectedSequence(null); }} style={{background:"transparent", border:"none", fontSize:24, cursor:"pointer", color:T.text}}>✕</button>
                  </div>

                  {!selectedSequence ? (
                    <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(450px, 1fr))", gap:24, paddingBottom:40}}>
                      {SEQUENCES.map((seq, idx) => {
                        const isLocked = !isApproved && idx > 0;
                        return (
                          <div 
                            key={seq.id} 
                            className={isLocked ? "" : "cHov"} 
                            style={{
                              ...s.card, 
                              padding:0, 
                              overflow:"hidden", 
                              display:"flex", 
                              flexDirection:"column",
                              position: "relative",
                              opacity: isLocked ? 0.7 : 1,
                              cursor: isLocked ? "default" : "pointer"
                            }}
                            onClick={() => {
                              if (isLocked) {
                                sh("🔒 Conteúdo privado. Cadastre-se para desbloquear!", "warn");
                                setScr("auth");
                                setAuthTab("register");
                              }
                            }}
                          >
                            <div style={{ transition: "all 0.3s", flex: 1, display: "flex", flexDirection: "column" }}>
                              <div style={{
                                background: `linear-gradient(135deg, ${P.trq}dd, ${P.trqD})`,
                                padding: "24px 20px",
                                color: "#fff"
                              }}>
                                <div style={{fontSize:32, marginBottom:12}}>{seq.emoji}</div>
                                <h3 style={{fontWeight:800, fontSize:20, marginBottom:8}}>{seq.title}</h3>
                                <div style={{display:"flex", gap:8}}>
                                  <span style={{fontSize:11, background:"rgba(255,255,255,0.2)", padding:"4px 10px", borderRadius:20, fontWeight:600}}>{seq.level}</span>
                                  <span style={{fontSize:11, background:"rgba(255,255,255,0.2)", padding:"4px 10px", borderRadius:20, fontWeight:600}}>⏱️ {seq.time}</span>
                                </div>
                              </div>
                              
                              <div style={{padding:20, flex:1, display:"flex", flexDirection:"column"}}>
                                <p style={{fontSize:14, color:T.sec, lineHeight:1.6, marginBottom:20}}>{seq.desc}</p>
                                
                                <div style={{marginBottom:20}}>
                                  <div style={{fontSize:11, fontWeight:800, color:T.sec, textTransform:"uppercase", letterSpacing:1, marginBottom:10}}>Posturas Incluídas:</div>
                                  <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
                                    {seq.posesIncluded?.map(p => (
                                      <span key={p} style={{fontSize:11, background:T.cardAlt, padding:"4px 10px", borderRadius:6, border:`1px solid ${T.brd}`}}>{p}</span>
                                    ))}
                                  </div>
                                </div>

                                <button 
                                  onClick={(e) => { e.stopPropagation(); if(!isLocked) setSelectedSequence(seq); }}
                                  style={{...s.btn(P.trq), width:"100%", marginTop:"auto", display:"flex", alignItems:"center", justifyContent:"center", gap:8}}
                                >
                                  ▶ Iniciar Sequência
                                </button>
                              </div>
                            </div>

                            {isLocked && (
                              <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.05)"}}>
                                <div style={{width:56, height:56, borderRadius:"50%", background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.4)"}}>
                                  <span style={{fontSize:28}}>🔒</span>
                                </div>
                              </div>
                            )}
                            {!isLocked && idx === 0 && (
                              <div style={{position:"absolute", top:12, right:12, background:P.trq, color:"#fff", fontSize:11, fontWeight:800, padding:"4px 12px", borderRadius:6, boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}>GRÁTIS</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{animation:"fadeUp 0.4s ease"}}>
                      <div style={{height:300, position:"relative", overflow:"hidden"}}>
                        <img src={selectedSequence.img} style={{width:"100%", height:"100%", objectFit:"cover"}} referrerPolicy="no-referrer" />
                        <div style={{position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.8), transparent)"}} />
                        <div style={{position:"absolute", bottom:30, left:30, right:30, color:"#fff"}}>
                          <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:8}}>
                            <span style={{background:P.trq, padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700}}>{selectedSequence.level}</span>
                            <span style={{fontSize:14, opacity:0.9}}>⏱️ {selectedSequence.time}</span>
                          </div>
                          <h1 style={{fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:800}}>{selectedSequence.title}</h1>
                        </div>
                      </div>

                      <div style={{maxWidth:800, margin:"0 auto", padding:"40px 20px"}}>
                        <div style={{display:"grid", gridTemplateColumns:"1fr 300px", gap:40}}>
                          <div>
                            <h3 style={{fontWeight:800, fontSize:20, marginBottom:16}}>Sobre esta Sequência</h3>
                            <p style={{fontSize:16, color:T.sec, lineHeight:1.7, marginBottom:32}}>{selectedSequence.desc}</p>

                            <h3 style={{fontWeight:800, fontSize:20, marginBottom:16}}>Guia Passo a Passo</h3>
                            <div style={{display:"flex", flexDirection:"column", gap:16, marginBottom:40}}>
                              {selectedSequence.instructions.map((step: string, i: number) => (
                                <div key={i} style={{display:"flex", gap:16, alignItems:"flex-start"}}>
                                  <div style={{
                                    width:28, height:28, borderRadius:"50%", background:P.trq, color:"#fff", 
                                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                                    fontSize:14, fontWeight:800
                                  }}>{i+1}</div>
                                  <p style={{fontSize:15, color:T.text, lineHeight:1.6, paddingTop:4}}>{step}</p>
                                </div>
                              ))}
                            </div>

                            <h3 style={{fontWeight:800, fontSize:20, marginBottom:16}}>Benefícios da Prática</h3>
                            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                              {selectedSequence.benefits.map((b: string) => (
                                <div key={b} style={{display:"flex", alignItems:"center", gap:8, background:T.cardAlt, padding:12, borderRadius:12}}>
                                  <span style={{color:P.trq}}>✓</span>
                                  <span style={{fontSize:14}}>{b}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div style={{display:"flex", flexDirection:"column", gap:24}}>
                            <div style={{...s.card, position:"sticky", top:20}}>
                              <h4 style={{fontWeight:800, marginBottom:16}}>Áudio Imersivo</h4>
                              <div style={{background:T.cardAlt, padding:16, borderRadius:12, marginBottom:20, textAlign:"center"}}>
                                <div style={{fontSize:40, marginBottom:12, animation: playingSeq?.id === selectedSequence.id ? "float 3s infinite ease-in-out" : "none"}}>
                                  {playingSeq?.id === selectedSequence.id ? "🎵" : "🔇"}
                                </div>
                                <div style={{fontWeight:700, fontSize:14, marginBottom:4}}>
                                  {playingSeq?.id === selectedSequence.id ? "Tocando trilha sonora..." : "Áudio pausado"}
                                </div>
                                <div style={{fontSize:12, color:T.sec}}>Frequência de relaxamento</div>
                              </div>

                              <button 
                                onClick={() => toggleSequenceAudio(selectedSequence)}
                                style={{...s.btn(playingSeq?.id === selectedSequence.id ? P.red : P.trq), width:"100%", fontSize:14}}
                              >
                                {playingSeq?.id === selectedSequence.id ? "Parar Áudio" : "Iniciar Áudio"}
                              </button>
                              
                              <button 
                                onClick={() => setSelectedSequence(null)}
                                style={{...s.btn(T.cardAlt), color:T.text, width:"100%", marginTop:12, border:`1px solid ${T.brd}`, boxShadow:"none"}}
                              >
                                Voltar para Lista
                              </button>
                            </div>

                            <div style={s.card}>
                              <h4 style={{fontWeight:800, marginBottom:16}}>Posturas Chave</h4>
                              <div style={{display:"flex", flexDirection:"column", gap:12}}>
                                {selectedSequence.posesIncluded.map((pName: string) => {
                                  const poseData = POSES.find(p => p.name === pName || p.title === pName);
                                  return (
                                    <div key={pName} style={{display:"flex", alignItems:"center", gap:12}}>
                                      <div style={{width:40, height:40, borderRadius:8, background:T.cardAlt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20}}>
                                        {poseData?.emoji || "🧘"}
                                      </div>
                                      <div style={{fontSize:13, fontWeight:600}}>{pName}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="modules"&&(
          <div style={{animation:"fadeUp .45s ease both"}}>
            {!mod?(
              <>
                <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,marginBottom:14}}>🧘 Módulos de Yoga</h2>
                {MODULES.map(m=>{
                  const st = getModuleStatus(m);
                  return (
                    <div 
                      key={m.id} 
                      className={(!isApproved && m.id !== 1) ? "" : "cHov"} 
                      style={{
                        ...s.card,
                        marginBottom:14,
                        cursor: (!isApproved && m.id !== 1) ? "default" : "pointer",
                        position:"relative",
                        overflow:"hidden",
                        opacity: (!isApproved && m.id !== 1) ? 0.7 : 1
                      }} 
                      onClick={()=>{
                        setMod(m);
                      }}
                    >
                      <div style={{ transition: "all 0.3s" }}>
                        <div style={{display:"flex",gap:12,marginBottom:10}}><span style={{fontSize:32}}>{m.emoji}</span>
                          <div>
                            <div style={{fontWeight:800,fontSize:18}}>{m.title}</div>
                            <div style={{fontSize:13,color:T.sec}}>{m.sub}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                          <span style={{background:`${m.color}22`,color:m.tc,borderRadius:6,padding:"3px 10px",fontSize:12,fontWeight:700}}>{m.level}</span>
                          <span style={{background:T.cardAlt,borderRadius:6,padding:"3px 10px",fontSize:12}}>📚 {m.classes.length} aulas</span>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.sec,marginBottom:4}}><span>Progresso</span><span>{st.pct}%</span></div>
                        <div style={{background:T.cardAlt,borderRadius:99,height:8,overflow:"hidden"}}>
                          <div style={{height:"100%",background:m.color,borderRadius:99,width:`${st.pct}%`,transition:"width .5s"}}/>
                        </div>
                      </div>
                      {!isApproved && ![1, 2, 3].includes(m.id) && (
                        <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.05)"}}>
                          <div style={{width:40, height:40, borderRadius:"50%", background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.4)"}}>
                            <span style={{fontSize:20}}>🔒</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Subscription Banner */}
                <div style={{
                  ...s.card, 
                  marginTop: 20, 
                  background: `linear-gradient(135deg, ${P.lil}, ${P.lilD})`, 
                  color: "#fff",
                  textAlign: "center",
                  padding: "24px 20px",
                  border: "none",
                  animation: "fadeUp 0.6s ease both"
                }}>
                  <div style={{fontSize:40, marginBottom:12}}>💎</div>
                  <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:22, marginBottom:8}}>Acesso Vitalício Premium</h3>
                  <div style={{fontSize:28, fontWeight:900, marginBottom:10}}>R$ 97,00</div>
                  <p style={{fontSize:14, opacity:0.9, marginBottom:20, lineHeight:1.5}}>
                    Desbloqueie todos os módulos e aulas com um <b>pagamento único</b>. 
                    Sem mensalidades, acesso para sempre!
                  </p>
                  {!user ? (
                    <button 
                      className="hov" 
                      onClick={() => { setScr("auth"); setAuthTab("register"); setShowPremiumCard(true); }}
                      style={{...s.btn("#fff", P.lilD), width:"100%"}}
                    >
                      Cadastrar para Ativar
                    </button>
                  ) : !isApproved ? (
                    <div style={{background:"rgba(255,255,255,0.15)", borderRadius:12, padding:12, fontSize:13, fontWeight:600}}>
                      ⏳ Cadastro realizado! Aguardando ativação pelo administrador.
                    </div>
                  ) : (
                    <div style={{background:"rgba(255,255,255,0.2)", borderRadius:12, padding:12, fontSize:13, fontWeight:700}}>
                      ✅ Você já é Premium! Aproveite sua jornada.
                    </div>
                  )}
                </div>
              </>
            ):(
              <>
                <button onClick={()=>setMod(null)} style={{background:"transparent",border:"none",color:T.sec,cursor:"pointer",marginBottom:12,fontSize:13,fontFamily:"'Nunito',sans-serif"}}>← Módulos</button>
                <div style={{...s.card,marginBottom:14,borderTop:`4px solid ${mod.color}`}}>
                  <div style={{fontSize:32,marginBottom:6}}>{mod.emoji}</div>
                  <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20}}>{mod.title}</h2>
                  <p style={{color:T.sec,fontSize:13,marginTop:4}}>{mod.sub}</p>
                </div>
                {mod.classes.map((c: any,i: number)=>{
                  const locked = (!c.isFree || [2, 3].includes(mod.id)) && !isApproved;
                  return (
                    <div key={c.id} className="cHov" style={{...s.card,marginBottom:12,cursor:"pointer",animation:`fadeUp .4s ${i*.07}s ease both`,opacity:0,padding:0,overflow:"hidden",position:"relative"}} 
                      onClick={()=>{
                        if (locked) {
                          sh("🔒 Conteúdo privado. Cadastre-se para desbloquear!", "warn");
                          setScr("auth");
                          setAuthTab("register");
                        } else {
                          setCls(c);setBreathActive(false);setBreathPhase(0);setBreathCount(0);setOpenPose(null);
                        }
                      }}>
                      <div style={{position:"relative",height:130,overflow:"hidden",background:"#000"}}>
                        <img
                          src={c.thumb||`https://img.youtube.com/vi/${c.videoId}/hqdefault.jpg`}
                          alt={c.title}
                          style={{width:"100%",height:"100%",objectFit:"cover",opacity:locked?.4:.85}}
                          onError={(e: any)=>{e.target.src=c.img}}
                        />
                        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {locked ? (
                            <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 12px rgba(0,0,0,.4)"}}>
                              <span style={{fontSize:24}}>🔒</span>
                            </div>
                          ) : (
                            <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(255,0,0,.85)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 12px rgba(0,0,0,.4)"}}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                          )}
                        </div>
                        {prog[c.id]&&<div style={{position:"absolute",top:8,right:8,background:P.grn,color:"#fff",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>✓ Feita</div>}
                        <div style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,.75)",color:"#fff",borderRadius:5,padding:"2px 7px",fontSize:11,fontWeight:700}}>{c.min} min</div>
                        {c.isFree && ![2, 3].includes(mod.id) && <div style={{position:"absolute",top:8,left:8,background:P.trq,color:"#fff",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:800}}>GRÁTIS</div>}
                      </div>
                      <div style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:800,fontSize:15,marginBottom:3}}>{c.title}</div>
                          <div style={{fontSize:12,color:T.sec,display:"flex",gap:12}}>
                            <span>🎯 {c.level}</span>
                            <span>🎵 {c.audioLabel||c.music}</span>
                          </div>
                        </div>
                        <span style={{color:T.sec,fontSize:22,flexShrink:0}}>{locked ? "🔒" : "›"}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {tab==="tasks"&&(
          <div style={{animation:"fadeUp .45s ease both"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22}}>📋 Tarefas</h2>
              <button className="hov" onClick={()=>setShowTF(!showTF)} style={s.btn(P.trq)}>{showTF?"✕ Cancelar":"+ Nova"}</button>
            </div>
            {showTF&&(
              <div style={{...s.card,marginBottom:14,borderTop:`3px solid ${P.trq}`}}>
                <h3 style={{fontWeight:800,marginBottom:12}}>Nova Tarefa</h3>
                <div style={{display:"flex",flexDirection:"column",gap:11}}>
                  {[{k:"title",l:"Título *",t:"text",p:"Ex: Praticar yoga pela manhã"},{k:"assignee",l:"Responsável",t:"text",p:"Nome"},{k:"deadline",l:"Prazo",t:"date"}].map((f: any)=>(
                    <div key={f.k}><label style={s.lbl}>{f.l}</label>
                      <input style={s.inp} type={f.t} placeholder={f.p||""} value={(taskF as any)[f.k]} onChange={e=>setTaskF({...taskF,[f.k]:e.target.value})}/></div>
                  ))}
                  <div><label style={s.lbl}>Módulo</label>
                    <select style={{...s.inp,cursor:"pointer"}} value={taskF.module} onChange={e=>setTaskF({...taskF,module:e.target.value})}>
                      <option value="">Nenhum</option>
                      {MODULES.map(m=><option key={m.id} value={m.title}>{m.emoji} {m.title}</option>)}
                    </select></div>
                  <div><label style={s.lbl}>Status</label>
                    <select style={{...s.inp,cursor:"pointer"}} value={taskF.status} onChange={e=>setTaskF({...taskF,status:e.target.value})}>
                      <option value="pendente">⏳ Pendente</option><option value="em_progresso">🔄 Em Progresso</option><option value="concluido">✅ Concluído</option>
                    </select></div>
                  <div><label style={s.lbl}>Notas</label>
                    <textarea style={{...s.inp,resize:"vertical",minHeight:60}} value={taskF.notes} onChange={e=>setTaskF({...taskF,notes:e.target.value})}/></div>
                  <button className="hov" onClick={addTask} style={s.btn(P.trq)}>Salvar ✓</button>
                </div>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
              {[{s:"pendente",l:"Pendentes",c:P.lil},{s:"em_progresso",l:"Progresso",c:P.celD},{s:"concluido",l:"Concluídos",c:P.grn}].map(x=>(
                <div key={x.s} style={{...s.card,textAlign:"center",padding:12,borderTop:`3px solid ${x.c}`}}>
                  <div style={{fontSize:22,fontWeight:800,color:x.c}}>{tasks.filter(t=>t.status===x.s).length}</div>
                  <div style={{fontSize:11,color:T.sec}}>{x.l}</div>
                </div>
              ))}
            </div>
            {tasks.length===0
              ? <div style={{...s.card,textAlign:"center",padding:40}}><div style={{fontSize:44,marginBottom:10}}>📋</div><p style={{color:T.sec}}>Nenhuma tarefa ainda.</p></div>
              : tasks.map(t=>{
                  const ST: any ={pendente:{c:P.lil},em_progresso:{c:P.celD},concluido:{c:P.grn}}
                      const st=ST[t.status]||ST.pendente
                      return(
                        <div key={t.id} style={{...s.card,marginBottom:10,borderLeft:`4px solid ${st.c}`,opacity:t.status==="concluido"?.75:1}}>
                          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:700,fontSize:15,textDecoration:t.status==="concluido"?"line-through":"none"}}>{t.title}</div>
                              <div style={{fontSize:12,color:T.sec,marginTop:2}}>
                                {t.assignee&&<span>👤 {t.assignee} · </span>}
                                {t.deadline&&<span>📅 {new Date(t.deadline+"T12:00:00").toLocaleDateString("pt-BR")} · </span>}
                                {t.module&&<span>📚 {t.module}</span>}
                              </div>
                              {t.notes&&<p style={{fontSize:12,color:T.sec,marginTop:4,fontStyle:"italic"}}>{t.notes}</p>}
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:7,flexShrink:0}}>
                              <select value={t.status} onChange={e=>changeTS(t.id,e.target.value)}
                                style={{background:`${st.c}22`,border:`1px solid ${st.c}`,borderRadius:8,padding:"4px 8px",fontSize:12,color:T.text,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
                                <option value="pendente">⏳ Pendente</option><option value="em_progresso">🔄 Progresso</option><option value="concluido">✅ Concluído</option>
                              </select>
                              <button onClick={()=>delTask(t.id)} style={{background:`${P.red}18`,border:`1px solid ${P.red}44`,borderRadius:8,padding:"4px 8px",fontSize:11,color:P.red,cursor:"pointer"}}>🗑</button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                }
            </div>
        )}

        {tab==="ai"&&(
          <div style={{animation:"fadeUp .45s ease both",display:"flex",flexDirection:"column",height:"calc(100vh - 166px)"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,margin:0}}>🤖 Ananda — IA Professora</h2>
              <button onClick={() => setAiMsgs([])} style={{background:"transparent", border:"none", color:P.red, fontSize:11, cursor:"pointer", fontWeight:700, opacity: aiMsgs.length > 0 ? 1 : 0, transition: "opacity 0.3s"}}>🗑️ Limpar Conversa</button>
            </div>
            <>
              <p style={{fontSize:13,color:T.sec,marginBottom:12}}>Tire dúvidas sobre yoga, posturas, respiração e bem-estar.</p>
                <div ref={aiScrollRef} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,paddingRight:4}}>
                  {aiMsgs.length===0&&(
                    <div style={{...s.card,textAlign:"center",padding:28}}>
                      <Lotus size={52} color={P.lil} spin/>
                      <p style={{marginTop:10,color:T.sec,fontSize:14,lineHeight:1.7}}>Olá! Sou Ananda 🌸<br/>Como posso ajudar sua prática?</p>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",marginTop:12}}>
                        {["Como fazer a postura do guerreiro?","Yoga para iniciantes?","Como respirar na prática?","Benefícios do yin yoga"].map(q=>(
                          <button key={q} className="hov" onClick={()=>setAiTxt(q)} style={{...s.btn(`${P.trq}18`,P.trq),padding:"7px 11px",fontSize:12,boxShadow:"none",border:`1px solid ${P.trq}44`}}>{q}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {aiMsgs.map((m,i)=>(
                    <div key={i} style={{display:"flex",gap:8,flexDirection:m.r==="u"?"row-reverse":"row",alignItems:"flex-end"}}>
                      <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,background:m.r==="u"?P.trq:`${P.lil}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>
                        {m.r==="u"?"🧘":<Lotus size={18} color={P.lil}/>}
                      </div>
                      <div style={{background:m.r==="u"?P.trq:T.card,color:m.r==="u"?"#fff":T.text,borderRadius:m.r==="u"?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"10px 14px",maxWidth:"78%",fontSize:14,lineHeight:1.65,border:m.r==="a"?`1px solid ${T.brd}`:"none"}}>{m.t}</div>
                    </div>
                  ))}
                  {aiLoad&&(<div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:`${P.lil}33`,display:"flex",alignItems:"center",justifyContent:"center"}}><Lotus size={18} color={P.lil}/></div>
                    <div style={{...s.card,padding:"10px 14px"}}><span style={{animation:"shim 1s infinite",display:"inline-block"}}>Ananda está digitando... 🌸</span></div>
                  </div>)}
                </div>
                <div style={{display:"flex",gap:10,marginTop:12}}>
                  <input style={{...s.inp,flex:1}} placeholder="Pergunte sobre yoga..." value={aiTxt}
                    onChange={e=>setAiTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAI()}/>
                  <button className="hov" onClick={sendAI} disabled={aiLoad} style={s.btn(P.trq)}>➤</button>
                </div>
              </>
          </div>
        )}

        {tab==="profile"&&(
          <div style={{animation:"fadeUp .45s ease both"}}>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,marginBottom:14}}>👤 Meu Perfil</h2>
            <div style={{...s.card,marginBottom:14,textAlign:"center",padding:28}}>
              <div style={{width:68,height:68,borderRadius:"50%",background:`${P.trq}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:800,color:P.trq,margin:"0 auto 10px"}}>{user?.nome?.[0]?.toUpperCase()}</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20}}>{user?.nome}</h3>
              <p style={{color:T.sec,fontSize:13,marginTop:3}}>{user?.email}</p>
              {isApproved && <div style={{marginTop:10, color:P.grn, fontSize:12, fontWeight:700}}>✅ Conta Ativa</div>}
            </div>
            {(user?.email === ADMIN_EMAIL || user?.role === 'admin') && (
              <button className="hov" onClick={() => { setScr("admin"); setAdminStep("pw"); }} style={{...s.btn(P.trq), width:"100%", marginBottom:10}}>⚙️ Painel Administrativo</button>
            )}
            <button className="hov" onClick={doLogout} style={{...s.btn(P.red,"#fff"),width:"100%",marginTop:14}}>Sair da Conta</button>
          </div>
        )}
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.nav,backdropFilter:"blur(12px)",borderTop:`1px solid ${T.brd}`,display:"flex",justifyContent:"space-around",padding:"6px 0 8px",zIndex:100}}>
        {[{id:"home",i:"🏠",l:"Início"},{id:"modules",i:"🧘",l:"Aulas"},{id:"tasks",i:"📋",l:"Tarefas"},{id:"ai",i:"🤖",l:"IA Yoga"},{id:"profile",i:"👤",l:"Perfil"}].map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);setMod(null); if(scr==="auth") setScr("app")}}
            style={{background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 12px",borderRadius:10,fontFamily:"'Nunito',sans-serif",opacity:tab===t.id?1:.45,transition:"all .2s"}}>
            <span style={{fontSize:20}}>{t.i}</span>
            <span style={{fontSize:10,fontWeight:700,color:tab===t.id?P.trq:T.sec}}>{t.l}</span>
          </button>
        ))}
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type}/>}

      {/* Global Audio Controllers - Root Level for Persistence */}
      <audio 
        ref={mainAudioRef}
        preload="auto"
        crossOrigin="anonymous"
        onPlay={() => setMedLoading(false)}
        onPlaying={() => setMedLoading(false)}
        onWaiting={() => setMedLoading(true)}
        onCanPlay={() => { 
          if (playingMed || playingPose || playingModule) {
            mainAudioRef.current?.play().catch(err => {
              console.warn("Main audio play error:", err);
              setMedLoading(false);
            }); 
          }
        }}
        onEnded={() => { 
          setPlayingMed(null); 
          setPlayingPose(null);
          setPlayingModule(null);
          setMedLoading(false); 
        }}
        onError={() => { 
          console.error("Main audio error event");
          if (playingMed || playingPose || playingModule) {
            sh("Erro ao carregar áudio ❌ Verifique sua conexão.", "err"); 
            setPlayingMed(null); 
            setPlayingPose(null);
            setPlayingModule(null);
            setMedLoading(false); 
          }
        }}
      />
      <audio 
        ref={seqAudioRef}
        preload="auto"
        crossOrigin="anonymous"
        loop
        onCanPlay={() => { 
          if (playingSeq) {
            seqAudioRef.current?.play().catch(err => console.warn("Seq audio play error:", err.message || err)); 
          }
        }}
        onError={() => { 
          console.error("Seq audio error event");
          if (playingSeq) {
            sh("Erro ao carregar trilha sonora ❌", "err"); 
            setPlayingSeq(null); 
          }
        }}
      />
      
      {errorInfo && (
        <div style={{position:"fixed", inset:0, zIndex:10000, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
          <div style={{...s.card, maxWidth:500, width:"100%", textAlign:"center"}}>
            <h2 style={{color:P.red, marginBottom:16}}>Ops! Algo deu errado 🧘</h2>
            <p style={{marginBottom:20, fontSize:14, color:T.sec}}>Ocorreu um erro inesperado. Tente recarregar a página.</p>
            <div style={{background:T.cardAlt, padding:12, borderRadius:8, fontSize:12, textAlign:"left", marginBottom:20, overflowX:"auto"}}>
              <code style={{color:P.red}}>{errorInfo.error}</code>
            </div>
            <button onClick={() => window.location.reload()} style={s.btn(P.trq)}>Recarregar Página</button>
          </div>
        </div>
      )}
    </div>
  )
}

