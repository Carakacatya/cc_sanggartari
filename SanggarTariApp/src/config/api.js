export const GAS_URL = "https://script.google.com/macros/s/AKfycbxNZO93KzrWfZ9uVJErbO74f09dp-D0IpU3DB1o5ewyFAcng38fFZi793VH2ZXX9oHk/exec";

export const COLORS = {
  ink: '#12100e',
  paper: '#f7f2ea',
  warm: '#ede5d4',
  gold: '#b8860b',
  gold2: '#d4a017',
  rust: '#8b3a2a',
  sage: '#5a6e52',
  text: '#2d2520',
  muted: '#8a7968',
};

export function getCat(nama) {
  const n = (nama || '').toLowerCase();
  if (n.includes('akademi') || n.includes('academy')) return 'Akademi';
  if (n.includes('studio')) return 'Studio';
  if (n.includes('sekolah') || n.includes('school')) return 'Sekolah';
  if (n.includes('sanggar')) return 'Sanggar Tari';
  return 'Lainnya';
}

export const CATEGORIES = ['Semua', 'Sanggar Tari', 'Studio', 'Akademi', 'Sekolah', 'Lainnya'];