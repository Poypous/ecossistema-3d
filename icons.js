/* Ícones SVG: um por espécie (cores próprias) e os da interface (currentColor). */
const ICONS = {
  /* ---------- espécies ---------- */
  lobo: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 6l9 8h14l9-8 2 20c0 9-8 16-18 16S6 35 6 26z" fill="#7f8c8d"/><path d="M11 10l5 5-4 3zM37 10l-5 5 4 3z" fill="#4a5457"/><path d="M17 28c2-3 12-3 14 0l-3 10h-8z" fill="#ecf0f1"/><circle cx="17" cy="23" r="2" fill="#1b1b1b"/><circle cx="31" cy="23" r="2" fill="#1b1b1b"/><path d="M21 31h6l-3 4z" fill="#1b1b1b"/></svg>`,
  cervo: `<svg viewBox="0 0 48 48" aria-hidden="true"><g stroke="#e6d5a8" stroke-width="3" fill="none" stroke-linecap="round"><path d="M16 18L10 6M10 6l-4 3M10 10l-5 1M32 18l6-12M38 6l4 3M38 10l5 1"/></g><ellipse cx="13" cy="19" rx="4" ry="2.5" fill="#ba8c63" transform="rotate(-30 13 19)"/><ellipse cx="35" cy="19" rx="4" ry="2.5" fill="#ba8c63" transform="rotate(30 35 19)"/><ellipse cx="24" cy="29" rx="11" ry="13" fill="#ba8c63"/><ellipse cx="24" cy="37" rx="6" ry="5" fill="#e9d3b4"/><circle cx="19" cy="27" r="1.8" fill="#222"/><circle cx="29" cy="27" r="1.8" fill="#222"/><ellipse cx="24" cy="39" rx="2.2" ry="1.6" fill="#222"/></svg>`,
  coelho: `<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="17" cy="12" rx="4" ry="11" fill="#d7ccc8"/><ellipse cx="31" cy="12" rx="4" ry="11" fill="#d7ccc8"/><ellipse cx="17" cy="13" rx="2" ry="8" fill="#f4a9b8"/><ellipse cx="31" cy="13" rx="2" ry="8" fill="#f4a9b8"/><ellipse cx="24" cy="31" rx="13" ry="12" fill="#e7ddd6"/><circle cx="19" cy="29" r="2" fill="#222"/><circle cx="29" cy="29" r="2" fill="#222"/><path d="M22 34h4l-2 3z" fill="#e58aa0"/><path d="M24 37v3M20 40c2 1 6 1 8 0" stroke="#8a7a72" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
  cutia: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="11" cy="16" r="5" fill="#6b4423"/><circle cx="37" cy="16" r="5" fill="#6b4423"/><ellipse cx="24" cy="28" rx="16" ry="14" fill="#8a5a2b"/><path d="M12 22c4-6 20-6 24 0-4-2-20-2-24 0z" fill="#c98c3a"/><ellipse cx="24" cy="36" rx="8" ry="5.5" fill="#e0c9a0"/><circle cx="17" cy="27" r="2" fill="#1b1b1b"/><circle cx="31" cy="27" r="2" fill="#1b1b1b"/><ellipse cx="24" cy="33" rx="2.4" ry="1.7" fill="#1b1b1b"/></svg>`,
  bugio: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="8" cy="26" r="5" fill="#b4440f"/><circle cx="40" cy="26" r="5" fill="#b4440f"/><circle cx="24" cy="24" r="17" fill="#d35400"/><ellipse cx="24" cy="27" rx="11" ry="10" fill="#f0c8a0"/><circle cx="19" cy="24" r="2" fill="#222"/><circle cx="29" cy="24" r="2" fill="#222"/><ellipse cx="24" cy="30" rx="3" ry="2" fill="#a0693a"/><path d="M19 35c3 2 7 2 10 0" stroke="#7a3d12" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M14 38c2 8 18 8 20 0-4 4-16 4-20 0z" fill="#9c3d08"/></svg>`,
  abelha: `<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="14" cy="14" rx="9" ry="6" fill="#cfe9ff" opacity=".9" transform="rotate(-30 14 14)"/><ellipse cx="34" cy="14" rx="9" ry="6" fill="#cfe9ff" opacity=".9" transform="rotate(30 34 14)"/><ellipse cx="24" cy="30" rx="12" ry="14" fill="#f1c40f"/><path d="M12 28c8 3 16 3 24 0v4c-8 3-16 3-24 0zM14 37c6 3 14 3 20 0l-1 3c-6 3-12 3-18 0z" fill="#1b1b1b"/><circle cx="24" cy="18" r="6" fill="#2b2b2b"/><circle cx="21.5" cy="17" r="1.4" fill="#fff"/><circle cx="26.5" cy="17" r="1.4" fill="#fff"/><path d="M21 13l-3-5M27 13l3-5" stroke="#2b2b2b" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  tucano: `<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="18" cy="28" rx="11" ry="14" fill="#1a1a22"/><path d="M12 36l-4 9 8-4z" fill="#1a1a22"/><circle cx="21" cy="14" r="8" fill="#1a1a22"/><ellipse cx="22" cy="21" rx="6" ry="5" fill="#fff"/><path d="M26 10c10-1 19 3 20 8-1 4-10 6-20 4z" fill="#ff8c00"/><path d="M26 17c8 1 15 0 19 0-3 3-11 5-19 3z" fill="#ffd23f"/><circle cx="22" cy="12" r="2.4" fill="#fff"/><circle cx="22.6" cy="12" r="1.1" fill="#111"/><path d="M13 36c2 5 7 5 9 5" stroke="#d64045" stroke-width="2.4" fill="none"/></svg>`,
  gralha: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 40l-6 4 14-4z" fill="#1a3a8f"/><ellipse cx="22" cy="29" rx="13" ry="11" fill="#2a56c7" transform="rotate(-15 22 29)"/><path d="M12 26c6-8 18-6 22 2-8-2-16-1-22-2z" fill="#1a3a8f"/><circle cx="31" cy="17" r="8" fill="#0f1a3d"/><path d="M26 10l2-8 5 8z" fill="#0f1a3d"/><path d="M37 16l8 3-8 2z" fill="#2b2b2b"/><circle cx="32" cy="15" r="1.8" fill="#fff"/><circle cx="32.4" cy="15" r=".9" fill="#000"/></svg>`,

  /* ---------- interface ---------- */
  leaf: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 3C10 3 4 8 4 15c0 1.3.3 2.5.8 3.6C7 15 10 12.5 14 11c-3 2.2-5.2 5-6.4 8.3C9.2 20.4 11 21 13 21c6 0 8-6 7-18z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="12" cy="12" r="7.9" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="3.1 3.1"/><circle cx="12" cy="12" r="2.4" fill="currentColor"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 5h2v14h-2z"/><path fill="currentColor" d="M5 11h14v2H5z"/></svg>`,
  minus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 11h14v2H5z"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  speed: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a9 9 0 0 0-9 9c0 2.1.7 4 2 5.5h14A9 9 0 0 0 12 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 13l4-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="13" r="1.8" fill="currentColor"/></svg>`,
  chevR: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevL: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

/* Dados das espécies: informações do card, quantidade inicial/máxima e tamanho da área clicável. */
const SPECIES = {
  lobo: { name:'Lobo', sci:'Canis lupus', diet:'Carnívoro', role:'Predador de topo',
    habitat:'Clareiras e bordas de mata, em grupo (alcateia).',
    desc:'Predador de topo da cadeia alimentar. Vive em alcateias e ajuda a manter as populações de herbívoros equilibradas.',
    fact:'Nesta simulação os lobos apenas patrulham, bebem água, descansam e uivam. Não caçam ninguém.',
    qty:5, max:20, color:'#ef5350', hit:1.3, hy:1.0, top:2.0, kind:'land' },
  cervo: { name:'Cervo', sci:'Família Cervidae', diet:'Herbívoro', role:'Consumidor primário',
    habitat:'Interior da mata e campos próximos a fontes de água.',
    desc:'Herbívoro de grande porte que se alimenta de folhas, brotos e frutos caídos. Fica sempre atento a predadores.',
    fact:'Os machos têm chifres ramificados que caem e crescem de novo a cada ano.',
    qty:6, max:24, color:'#ffa726', hit:1.5, hy:1.4, top:2.6, kind:'land' },
  coelho: { name:'Coelho', sci:'Sylvilagus brasiliensis', diet:'Herbívoro', role:'Consumidor primário',
    habitat:'Capoeiras, bordas de mata e campos com vegetação baixa.',
    desc:'Pequeno herbívoro que se alimenta de capim e brotos. Desloca-se aos saltos e foge rápido ao menor perigo.',
    fact:'Os dentes incisivos nunca param de crescer, por isso ele rói plantas o tempo todo.',
    qty:8, max:30, color:'#f06292', hit:.6, hy:.35, top:.9, kind:'land' },
  cutia: { name:'Cutia', sci:'Dasyprocta azarae', diet:'Herbívoro (frugívoro)', role:'Dispersora de sementes',
    habitat:'Chão da floresta, perto de árvores frutíferas.',
    desc:'Roedor que procura alimento no chão da mata. Enterra sementes e esquece parte delas, ajudando a floresta a se regenerar.',
    fact:'É uma das principais responsáveis por espalhar o pinhão da araucária.',
    qty:7, max:30, color:'#26c6da', hit:.65, hy:.4, top:.9, kind:'land' },
  bugio: { name:'Bugio', sci:'Alouatta guariba', diet:'Folívoro e frugívoro', role:'Primata arborícola',
    habitat:'Copas das árvores altas da Mata Atlântica.',
    desc:'Primata que passa quase todo o tempo nas copas, comendo folhas e frutos e saltando entre as árvores.',
    fact:'O rugido grave dos machos pode ser ouvido a grandes distâncias dentro da mata.',
    qty:6, max:20, color:'#d4e157', hit:.9, hy:.6, top:1.5, kind:'tree' },
  abelha: { name:'Abelha', sci:'Apis mellifera', diet:'Nectarívora', role:'Polinizadora',
    habitat:'Canteiros de flores e bordas de mata.',
    desc:'Coleta néctar e pólen e, nesse trabalho, poliniza as flores, essencial para a reprodução de muitas plantas.',
    fact:'Para produzir 1 kg de mel, uma colônia precisa visitar milhões de flores.',
    qty:10, max:40, color:'#ffee58', hit:.7, hy:0, top:.7, kind:'fly' },
  tucano: { name:'Tucano', sci:'Ramphastos toco', diet:'Frugívoro', role:'Dispersor de sementes',
    habitat:'Copas das árvores e bordas de floresta.',
    desc:'Ave de grande bico colorido que engole frutos inteiros e espalha as sementes por onde voa.',
    fact:'O bico é leve e ajuda a controlar a temperatura do corpo da ave.',
    qty:7, max:24, color:'#42a5f5', hit:.9, hy:0, top:1.1, kind:'fly' },
  gralha: { name:'Gralha-azul', sci:'Cyanocorax caeruleus', diet:'Onívora', role:'Dispersora de araucárias',
    habitat:'Matas com araucária do Sul do Brasil.',
    desc:'Ave símbolo do Paraná. Enterra pinhões no chão e, ao esquecer alguns, ajuda a espalhar as araucárias.',
    fact:'É considerada a principal dispersora das sementes de araucária.',
    qty:6, max:24, color:'#7e57c2', hit:.7, hy:0, top:.9, kind:'fly' }
};

/* Velocidades do menu de reprodução (estilo YouTube). */
const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];
