import { P } from "./constants";

export const uuid = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3) | 8).toString(16)
});

export const shortCode = () => {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  return Array.from({length:6}, () => c[Math.floor(Math.random() * c.length)]).join("")
};

export const safeGet = async (key: string, shared = false) => {
  try {
    const r = await window.storage.get(key, shared);
    if (!r || !r.value) return null;
    return JSON.parse(r.value);
  } catch (e) {
    console.warn(`storage.get(${key}) falhou:`, e);
    return null;
  }
};

export const safeSet = async (key: string, val: any, shared = false) => {
  try {
    // Replacer para evitar estruturas circulares e elementos DOM (como HTMLAudioElement)
    const cache = new Set();
    const json = JSON.stringify(val, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (cache.has(value)) return; // Remove circular
        if (value instanceof HTMLElement || value instanceof Event) return; // Remove DOM/Events
        cache.add(value);
      }
      return value;
    });
    await window.storage.set(key, json, shared);
    return true;
  } catch (e) {
    console.warn(`storage.set(${key}) falhou:`, e);
    return false;
  }
};

export function montarMensagem(usuario: any, codigo: string) {
  return [
    "╔══════════════════════════════════════╗",
    "   YOGA LOTUS — Nova Inscrição",
    "╚══════════════════════════════════════╝",
    "",
    "DADOS DO USUÁRIO:",
    "  Nome:      " + (usuario.nome   || "-"),
    "  Email:     " + (usuario.email  || "-"),
    "  Telefone:  " + (usuario.phone  || "-"),
    "  Idade:     " + (usuario.idade  || "-") + " anos",
    "  País:      " + (usuario.pais   || "-"),
    "  Nível:     " + (usuario.nivel  || "-"),
    "  Objetivos: " + ((usuario.goals||[]).join(", ") || "-"),
    "  Bio:       " + (usuario.bio    || "-"),
    "  Data:      " + new Date().toLocaleString("pt-BR"),
    "",
    "══════════════════════════════════════════",
    "CÓDIGO DE ATIVAÇÃO: " + codigo,
    "══════════════════════════════════════════",
    "",
    "→ Use este código no painel admin para identificar e aprovar o usuário.",
    "→ O acesso só será liberado após sua ativação manual no painel.",
  ].join("\n")
}

export async function tentarWeb3Forms(usuario: any, codigo: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const resp = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        access_key: "3c4c25c8-18e1-4940-abf1-6307294127cc",
        subject:    "[Yoga Lotus] Nova Inscrição — " + (usuario.nome || "Novo Usuário"),
        from_name:  "Yoga Lotus",
        email:      "josematos.chico@gmail.com",
        message:    montarMensagem(usuario, codigo),
        botcheck:   false,
      }),
    })
    clearTimeout(timeoutId);
    const json = await resp.json()
    if (resp.ok && json.success) { console.log("✅ Web3Forms OK"); return true }
    console.warn("⚠️ Web3Forms falhou:", json.message)
    return false
  } catch(e: any) {
    console.warn("⚠️ Web3Forms erro de rede:", e.message)
    return false
  }
}

export function abrirGmailCompose(usuario: any, codigo: string) {
  try {
    const assunto = encodeURIComponent("[Yoga Lotus] Nova Inscrição — " + (usuario.nome||""))
    const corpo   = encodeURIComponent(montarMensagem(usuario, codigo))
    const url = "https://mail.google.com/mail/?view=cm" +
                "&to=josematos.chico@gmail.com" +
                "&su=" + assunto +
                "&body=" + corpo
    window.open(url, "_blank")
    return true
  } catch(e) { console.warn("Gmail compose erro:", e); return false }
}

export async function copiarParaClipboard(usuario: any, codigo: string) {
  try {
    await navigator.clipboard.writeText(montarMensagem(usuario, codigo))
    return true
  } catch(e) { return false }
}

export async function enviarNotificacao(usuario: any, codigo: string) {
  const resultado = { web3: false, gmail: false, clipboard: false }
  
  // Tenta Web3Forms em segundo plano
  resultado.web3 = await tentarWeb3Forms(usuario, codigo)
  
  // Copia para o clipboard automaticamente (útil para o admin se ele estiver testando)
  resultado.clipboard = await copiarParaClipboard(usuario, codigo)
  
  // NÃO abrimos o Gmail automaticamente aqui, pois isso interrompe o fluxo do usuário.
  // O Gmail será uma opção manual na tela de "pendente" se necessário.
  
  console.log("📧 Resultado notificação silenciosa:", resultado)
  return resultado
}
