// Esta é a camada que TODAS as páginas usam para ler/gravar dados.
// Antes ela mandava fetch() para o backend Node.
// Agora ela fala direto com o Firebase (Auth + Firestore + Storage).
//
// Os nomes das funções (api.list, api.create, api.login, etc.) foram
// mantidos EXATAMENTE iguais aos de antes, de propósito: assim nenhuma
// página React precisa mudar, só esta camada por baixo.
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateAuthProfile
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit as fsLimit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from './firebaseClient';

// Nomes das "gavetas" (coleções) do Firestore — precisam bater com as
// mesmas usadas nas regras de segurança (firestore.rules).
const COLLECTIONS = {
  users: 'usuarios',
  properties: 'propriedades',
  areas: 'areas',
  diagnostics: 'diagnosticos',
  plans: 'planos_transicao',
  applications: 'aplicacoes_manejo',
  alternatives: 'manejos_alternativos',
  monitoring: 'monitoramentos',
  technical: 'acompanhamentos_tecnicos',
  documents: 'documentos',
  calendar: 'calendario',
  harvests: 'safras',
  employees: 'funcionarios',
  inputs: 'insumos',
  finance: 'financeiro',
  soilAnalyses: 'analises_solo',
  certification: 'certificacao',
  supportMessages: 'suporte_mensagens'
};

function col(moduleKey) {
  const name = COLLECTIONS[moduleKey];
  if (!name) throw new Error(`Módulo desconhecido: ${moduleKey}`);
  return collection(db, name);
}

function currentUid() {
  const u = auth.currentUser;
  if (!u) throw new Error('Não autenticado');
  return u.uid;
}

// Tenta executar uma escrita no Firestore algumas vezes, com pequenas
// pausas entre as tentativas. Usado logo após criar a conta no
// Authentication, quando o token de login pode levar um instante para
// propagar e a primeira escrita pode ser recusada por permissão mesmo
// com as regras corretas.
async function salvarComRetry(fn, tentativas = 3, esperaMs = 700) {
  let ultimoErro;
  for (let i = 0; i < tentativas; i++) {
    try {
      return await fn();
    } catch (e) {
      ultimoErro = e;
      const permissao = String(e?.code || e?.message || '').includes('permission');
      if (!permissao || i === tentativas - 1) throw e;
      await new Promise((resolve) => setTimeout(resolve, esperaMs));
    }
  }
  throw ultimoErro;
}

// ---------- Perfil do usuário (guardado à parte, na coleção "usuarios") ----------
async function fetchProfile(uid) {
  const snap = await getDoc(doc(db, COLLECTIONS.users, uid));
  return snap.exists() ? { id: snap.id, uid: snap.id, ...snap.data() } : null;
}

export const api = {
  // ---------- Autenticação ----------
  async login(identifier, password) {
    const cred = await signInWithEmailAndPassword(auth, identifier, password);
    const profile = await fetchProfile(cred.user.uid);
    if (!profile) throw new Error('Perfil do usuário não encontrado');
    if (profile.status === 'BLOQUEADO') {
      await signOut(auth);
      throw new Error('Usuário bloqueado');
    }
    if (profile.tipoUsuario === 'agronomo' && profile.aprovado === false) {
      await signOut(auth);
      throw new Error('Cadastro de agrônomo aguardando aprovação');
    }
    return { user: { uid: cred.user.uid, ...profile } };
  },

  async register(body) {
    const tipo = body.tipoUsuario || 'produtor';
    if (!body.email || !body.senha || !body.nomeCompleto)
      throw new Error('Nome, e-mail e senha são obrigatórios');
    const cred = await createUserWithEmailAndPassword(auth, body.email, body.senha);
    await updateAuthProfile(cred.user, { displayName: body.nomeCompleto });
    const profile = {
      nomeCompleto: body.nomeCompleto,
      email: String(body.email).toLowerCase(),
      telefone: body.telefone || '',
      cpf: body.cpf || '',
      crea: body.crea || '',
      tipoUsuario: tipo,
      status: 'ATIVO',
      // Agrônomo precisa ser aprovado por um admin antes de acessar.
      aprovado: tipo !== 'agronomo',
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp()
    };
    // Logo depois de criar a conta no Authentication, o token de login
    // pode levar um instante para propagar antes que as regras do
    // Firestore reconheçam o usuário como autenticado. Tentamos de novo
    // algumas vezes antes de desistir, em vez de falhar na primeira.
    try {
      await salvarComRetry(() => setDoc(doc(db, COLLECTIONS.users, cred.user.uid), profile));
    } catch (e) {
      // Se mesmo com retry não deu certo, desfaz a criação da conta no
      // Authentication. Sem isso, o e-mail ficaria "preso" — a pessoa
      // não conseguiria logar (falta o perfil) nem se cadastrar de novo
      // (o e-mail já existiria).
      try {
        await cred.user.delete();
      } catch (_) {
        // Se nem isso for possível (ex: sessão expirou), segue o erro
        // original — o suporte/admin resolve manualmente pelo Console.
      }
      throw e;
    }
    return { uid: cred.user.uid, ...profile };
  },

  async forgot(emailAddr) {
    // Usa o fluxo pronto do Firebase: envia um LINK de redefinição por
    // e-mail (diferente do código numérico que existia antes).
    await sendPasswordResetEmail(auth, emailAddr);
    return true;
  },

  async reset() {
    // Com o Firebase, a redefinição acontece na página de link enviada
    // por e-mail (fora do app). Esta função fica só para compatibilidade.
    throw new Error('Use o link enviado por e-mail para redefinir sua senha.');
  },

  async profile() {
    const uid = currentUid();
    const profile = await fetchProfile(uid);
    if (!profile) throw new Error('Perfil não encontrado');
    return { uid, ...profile };
  },

  async updateProfile(body) {
    const uid = currentUid();
    const allowed = {};
    if (body.nomeCompleto !== undefined) allowed.nomeCompleto = body.nomeCompleto;
    if (body.telefone !== undefined) allowed.telefone = body.telefone;
    if (body.fotoUrl !== undefined) allowed.fotoUrl = body.fotoUrl;
    allowed.atualizadoEm = serverTimestamp();
    await updateDoc(doc(db, COLLECTIONS.users, uid), allowed);
    if (allowed.nomeCompleto && auth.currentUser)
      await updateAuthProfile(auth.currentUser, { displayName: allowed.nomeCompleto });
    return fetchProfile(uid);
  },

  // ---------- CRUD genérico (usado por CrudPage e várias páginas) ----------
  // Limite padrão de itens carregados por vez. Exposto para que a UI
  // possa avisar o usuário quando ele for atingido.
  LIST_LIMIT: 200,

  async list(moduleKey) {
    const uid = currentUid();
    // Ordena do mais novo para o mais antigo. Requer que os documentos
    // tenham o campo "criadoEm" (todos os criados por api.create têm).
    const q = query(
      col(moduleKey),
      where('usuarioUid', '==', uid),
      orderBy('criadoEm', 'desc'),
      fsLimit(this.LIST_LIMIT)
    );
    let snap;
    try {
      snap = await getDocs(q);
    } catch (err) {
      // Registros antigos podem não ter "criadoEm"; nesse caso o orderBy
      // falha. Caímos de volta para uma consulta sem ordenação para não
      // quebrar dados legados.
      if (String(err?.message || '').includes('orderBy') || err?.code === 'failed-precondition') {
        snap = await getDocs(
          query(col(moduleKey), where('usuarioUid', '==', uid), fsLimit(this.LIST_LIMIT))
        );
      } else {
        throw err;
      }
    }
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Sinaliza (de forma não intrusiva) que pode haver mais registros do
    // que o limite. A UI pode checar items.__hasMore se quiser avisar.
    if (items.length === this.LIST_LIMIT) {
      Object.defineProperty(items, '__hasMore', { value: true, enumerable: false });
    }
    return items;
  },

  async create(moduleKey, body) {
    const uid = currentUid();
    const data = {
      ...body,
      usuarioUid: uid,
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp()
    };
    const ref2 = await addDoc(col(moduleKey), data);
    return { id: ref2.id, ...data };
  },

  async update(moduleKey, id, body) {
    const uid = currentUid();
    const docRef = doc(db, COLLECTIONS[moduleKey], id);
    const current = await getDoc(docRef);
    if (!current.exists()) throw new Error('Registro não encontrado');
    if (current.data().usuarioUid !== uid) throw new Error('Acesso negado');
    await updateDoc(docRef, { ...body, atualizadoEm: serverTimestamp() });
    const updated = await getDoc(docRef);
    return { id: updated.id, ...updated.data() };
  },

  async remove(moduleKey, id) {
    const uid = currentUid();
    const docRef = doc(db, COLLECTIONS[moduleKey], id);
    const current = await getDoc(docRef);
    if (!current.exists()) throw new Error('Registro não encontrado');
    if (current.data().usuarioUid !== uid) throw new Error('Acesso negado');
    await deleteDoc(docRef);
    return true;
  },

  // ---------- Dashboard ----------
  async summary() {
    // Antes era calculado no backend. Agora cada página busca o que
    // precisa direto; aqui devolvemos um resumo simples e seguro.
    // getCountFromServer conta no servidor sem baixar os documentos —
    // muito mais barato do que ler tudo só para contar.
    const uid = currentUid();
    const propsCount = await getCountFromServer(
      query(col('properties'), where('usuarioUid', '==', uid))
    );
    return { propriedades: propsCount.data().count };
  },

  // ---------- Administração ----------
  // Atenção: estas 3 funções só funcionam se as REGRAS do Firestore
  // liberarem leitura/escrita da coleção "usuarios" para quem tiver
  // tipoUsuario == "admin". Veja o arquivo firestore.rules.
  async users() {
    const snap = await getDocs(collection(db, COLLECTIONS.users));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async updateUser(id, body) {
    await updateDoc(doc(db, COLLECTIONS.users, id), {
      ...body,
      atualizadoEm: serverTimestamp()
    });
    return true;
  },

  async adminStats() {
    // Contagens agregadas no servidor (getCountFromServer) — não baixa
    // os documentos, só o número. Escala bem mesmo com muitos registros.
    const [users, props, plans] = await Promise.all([
      getCountFromServer(collection(db, COLLECTIONS.users)),
      getCountFromServer(collection(db, COLLECTIONS.properties)),
      getCountFromServer(collection(db, COLLECTIONS.plans))
    ]);
    return {
      usuarios: users.data().count,
      propriedades: props.data().count,
      planosAtivos: plans.data().count
    };
  },

  // ---------- Chat / Suporte (coleção suporte_mensagens) ----------
  // Envia uma mensagem do usuário logado. Fica protegida pelas regras:
  // cada usuário só lê e escreve as próprias mensagens (usuarioUid).
  async sendMessage(text) {
    const uid = currentUid();
    const data = {
      usuarioUid: uid,
      texto: String(text || '').trim(),
      autor: 'usuario',
      criadoEm: serverTimestamp()
    };
    if (!data.texto) throw new Error('Mensagem vazia');
    const ref2 = await addDoc(col('supportMessages'), data);
    return { id: ref2.id, ...data };
  },

  // Escuta as mensagens do usuário em tempo real. Retorna a função de
  // "unsubscribe" para o componente parar de escutar ao desmontar.
  onMessages(callback) {
    const uid = currentUid();
    const q = query(
      col('supportMessages'),
      where('usuarioUid', '==', uid),
      orderBy('criadoEm', 'asc'),
      fsLimit(200)
    );
    return onSnapshot(
      q,
      (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      () => callback([])
    );
  },

  // ---------- Upload de arquivos (Storage) ----------
  async upload(file) {
    const uid = currentUid();
    const path = `documentos/${uid}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, path };
  }
};

// Usado pelo AuthContext para saber, em tempo real, se há alguém logado
// (substitui o antigo "ler token salvo no localStorage").
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) return callback(null);
    const profile = await fetchProfile(fbUser.uid);
    callback(profile ? { uid: fbUser.uid, ...profile } : null);
  });
}

export async function logoutFirebase() {
  await signOut(auth);
}
