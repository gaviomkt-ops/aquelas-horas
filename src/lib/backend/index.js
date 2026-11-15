import { local } from './local.js';
import { makeSupabaseBackend } from './supabase.js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Com as duas variáveis preenchidas o app usa o Supabase; sem elas, roda em modo demonstração.
export const api = url && key ? makeSupabaseBackend(url, key) : local;
export const isDemo = api.mode === 'demo';
