// app.js — 탭 렌더링, 카드, 모달, 검색/필터
'use strict';

const TABS = [
  { id: '개별',      label: '개별',       group: '개별' },
  { id: '선배경영자', label: '선배경영자', group: '선배경영자' },
  { id: '코칭경영원', label: '코칭경영원', group: '코칭경영원' },
  { id: '한스코칭',   label: '한스코칭',   group: '한스코칭' },
  { id: 'CiT',       label: 'CiT',        group: 'CiT' },
  { id: 'pdf',       label: '26년 코칭',  group: '26년코칭' },
];

// ── 초기화 ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const session = AUTH.getSession();

  if (session) {
    initApp(session);
  } else {
    showLogin();
  }
});

function showLogin() {
  document.getElementById('login-overlay').classList.remove('hidden');
  document.getElementById('app-shell').classList.add('hidden');

  const form = document.getElementById('login-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const id  = document.getElementById('login-id').value;
    const pwd = document.getElementById('login-pwd').value;
    const errEl = document.getElementById('login-error');

    const session = AUTH.login(id, pwd);
    if (session) {
      errEl.classList.add('hidden');
      document.getElementById('login-overlay').classList.add('hidden');
      initApp(session);
    } else {
      errEl.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
      errEl.classList.remove('hidden');
    }
  });
}

function initApp(session) {
  document.getElementById('app-shell').classList.remove('hidden');

  // 사용자 배지
  const roleLabelMap = {
    superAdmin: 'Super Admin',
    admin: 'Admin',
    firm: '코칭사',
    coach: '코치',
  };
  const badge = document.getElementById('user-badge');
  badge.textContent = `${session.displayName} (${roleLabelMap[session.role] || session.role})`;

  // 계정 관리 버튼 (superAdmin만)
  const accountsBtn = document.getElementById('accounts-btn');
  if (session.canManageAccounts) {
    accountsBtn.classList.remove('hidden');
    accountsBtn.addEventListener('click', openAccountsModal);
  }

  // 로그아웃
  document.getElementById('logout-btn').addEventListener('click', AUTH.logout);

  // 접근 가능한 탭 필터링
  const allowedTabs = TABS.filter(t => session.allowedGroups.includes(t.group));
  buildTabs(allowedTabs, session);

  // 모달 닫기
  document.getElementById('modal-close-btn').addEventListener('click', closeCoachModal);
  document.getElementById('coach-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeCoachModal();
  });
  document.getElementById('accounts-modal-close').addEventListener('click', closeAccountsModal);
  document.getElementById('accounts-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAccountsModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeCoachModal(); closeAccountsModal(); }
  });
}

// ── 탭 구성 ──────────────────────────────────────────
const paneCache = {};

function buildTabs(allowedTabs, session) {
  const nav = document.getElementById('tab-nav');
  const main = document.getElementById('main-content');
  nav.innerHTML = '';

  if (allowedTabs.length === 0) {
    main.innerHTML = '<p style="padding:2rem;color:var(--color-text-muted)">접근 가능한 탭이 없습니다.</p>';
    return;
  }

  allowedTabs.forEach((tab, idx) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (idx === 0 ? ' active' : '');
    btn.setAttribute('role', 'tab');
    btn.textContent = tab.label;
    btn.dataset.tabId = tab.id;
    btn.addEventListener('click', () => activateTab(tab, btn, session));
    nav.appendChild(btn);
  });

  // 기본 탭: admin/superAdmin은 개별, 나머지는 첫 탭
  const defaultTab = ['admin', 'superAdmin'].includes(session.role)
    ? (allowedTabs.find(t => t.id === '개별') || allowedTabs[0])
    : allowedTabs[0];
  const defaultBtn = nav.querySelector(`[data-tab-id="${defaultTab.id}"]`);
  nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (defaultBtn) defaultBtn.classList.add('active');
  renderTabPane(defaultTab, session);
}

function activateTab(tab, clickedBtn, session) {
  // 탭 버튼 active 상태
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  clickedBtn.classList.add('active');
  renderTabPane(tab, session);
}

function renderTabPane(tab, session) {
  const main = document.getElementById('main-content');

  // 기존 탭 모두 숨기기
  main.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  if (paneCache[tab.id]) {
    paneCache[tab.id].classList.add('active');
    return;
  }

  let pane;
  if (tab.id === 'pdf') {
    pane = buildPdfPane();
  } else {
    const coaches = filterByGroup(tab.group, session);
    pane = buildCoachPane(tab.group, coaches, session);
  }

  pane.dataset.tabId = tab.id;
  paneCache[tab.id] = pane;
  main.appendChild(pane);
}

function filterByGroup(group, session) {
  let list = COACHES.filter(c => c.group === group);
  if (session.role === 'coach' && session.coachNo !== null) {
    list = list.filter(c => c.no === session.coachNo);
  }
  if (session.role === 'me' && session.loginId) {
    list = list.filter(c => c.alias === session.loginId);
  }
  list = list.slice().sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  return list;
}

// ── PDF 탭 ──────────────────────────────────────────
function buildPdfPane() {
  const pane = document.createElement('section');
  pane.className = 'tab-pane pdf-pane active';
  const PDF_URL = 'coaching-2026.pdf';
  pane.innerHTML = `
    <div class="pdf-toolbar">
      <a href="${PDF_URL}" target="_blank" rel="noopener" class="btn-pdf-open">↗ PDF 열기</a>
    </div>
    <object class="pdf-iframe" data="${PDF_URL}" type="application/pdf">
      <div class="pdf-object-fallback">
        <p>PDF를 표시할 수 없습니다.</p>
        <a href="${PDF_URL}" target="_blank" rel="noopener" class="btn-pdf-open">PDF 열기</a>
      </div>
    </object>
    <div class="pdf-mobile-fallback">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
      <p>2026 온디맨드 코칭</p>
      <a href="${PDF_URL}" target="_blank" rel="noopener" class="btn-pdf-open">PDF 열기</a>
    </div>`;
  return pane;
}

// ── 코치 탭 ──────────────────────────────────────────
function buildCoachPane(group, coaches, session) {
  const pane = document.createElement('section');
  pane.className = 'tab-pane coach-pane active';

  // 툴바 (superAdmin / admin 권한만 검색·필터 노출)
  const canSearch = ['superAdmin', 'admin'].includes(session.role)
    || (session.role === 'firm' && group === '선배경영자');
  const toolbar = document.createElement('div');
  toolbar.className = 'pane-toolbar';
  const isSunbae = group === '선배경영자';
  const companyOptions = isSunbae
    ? [...new Set(coaches.map(c => c.company).filter(Boolean))].sort()
        .map(v => `<option value="${v}">${v}</option>`).join('')
    : '';

  toolbar.innerHTML = canSearch ? `
    <input class="search-input" type="search" placeholder="이름 검색…" autocomplete="off">
    <select class="filter-select" data-filter="certKca">
      <option value="">KCA 자격 전체</option>
      <option value="KAC">KAC</option>
      <option value="KPC">KPC</option>
      <option value="KSC">KSC</option>
    </select>
    ${!isSunbae ? `
    <select class="filter-select" data-filter="certIcf">
      <option value="">ICF 자격 전체</option>
      <option value="ACC">ACC</option>
      <option value="PCC">PCC</option>
      <option value="MCC">MCC</option>
    </select>
    <select class="filter-select" data-filter="gender">
      <option value="">성별 전체</option>
      <option value="남">남성</option>
      <option value="여">여성</option>
    </select>` : ''}
    ${isSunbae ? `
    <select class="filter-select" data-filter="company">
      <option value="">퇴임회사 전체</option>
      ${companyOptions}
    </select>` : ''}
    <button class="filter-reset">초기화</button>
    <span class="coach-count"><strong>${coaches.length}</strong>명</span>
  ` : `<span class="coach-count"><strong>${coaches.length}</strong>명</span>`;
  pane.appendChild(toolbar);

  // 카드 그리드
  const grid = document.createElement('div');
  grid.className = 'coach-grid';
  renderCards(grid, coaches);
  pane.appendChild(grid);

  // 검색/필터 상태
  const filterState = { query: '', certKca: '', certIcf: '', gender: '', company: '' };

  if (canSearch) {
    // 검색 이벤트
    let debounceTimer;
    toolbar.querySelector('.search-input').addEventListener('input', e => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        filterState.query = e.target.value;
        applyFilter(grid, coaches, filterState, toolbar);
      }, 150);
    });

    // 드롭다운 필터
    toolbar.querySelectorAll('.filter-select').forEach(sel => {
      sel.addEventListener('change', () => {
        filterState[sel.dataset.filter] = sel.value;
        applyFilter(grid, coaches, filterState, toolbar);
      });
    });

    // 초기화
    toolbar.querySelector('.filter-reset').addEventListener('click', () => {
      Object.keys(filterState).forEach(k => filterState[k] = '');
      toolbar.querySelector('.search-input').value = '';
      toolbar.querySelectorAll('.filter-select').forEach(s => s.value = '');
      applyFilter(grid, coaches, filterState, toolbar);
    });
  }

  return pane;
}

function applyFilter(grid, coaches, state, toolbar) {
  const q = state.query.toLowerCase().trim();

  const filtered = coaches.filter(c => {
    if (q && !c.name.toLowerCase().includes(q) && !(c.alias || '').toLowerCase().includes(q)) return false;
    if (state.certKca && !(c.certKca || '').includes(state.certKca)) return false;
    if (state.certIcf && !(c.certIcf || '').includes(state.certIcf)) return false;
    if (state.gender && c.gender !== state.gender) return false;
    if (state.company && c.company !== state.company) return false;
    return true;
  });

  renderCards(grid, filtered);
  const countEl = toolbar.querySelector('.coach-count');
  countEl.innerHTML = `<strong>${filtered.length}</strong>명`;
}

function renderCards(grid, coaches) {
  grid.innerHTML = '';
  if (coaches.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p>검색 결과가 없습니다.</p>
      </div>`;
    return;
  }
  coaches.forEach(coach => {
    grid.appendChild(buildCard(coach));
  });
}

// ── 코치 카드 ──────────────────────────────────────────
function buildCard(coach) {
  const card = document.createElement('article');
  card.className = 'coach-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `${coach.name} 코치 상세 보기`);

  // 배지 칩 — AE(KCA), AG(ICF) 우선, AF(국내기타) 최대 4개
  const chips = [];
  if (coach.certKca) chips.push(`<span class="chip chip-kca">${escHtml(coach.certKca)}</span>`);
  if (coach.certIcf) chips.push(`<span class="chip chip-icf">${escHtml(coach.certIcf)}</span>`);
  if (coach.certDomesticOther) {
    const others = coach.certDomesticOther.split('\n').map(s => s.trim()).filter(Boolean);
    const MAX = 2;
    others.slice(0, MAX).forEach(cert => {
      chips.push(`<span class="chip chip-other-cert">${escHtml(cert)}</span>`);
    });
    if (others.length > MAX) {
      chips.push(`<span class="chip chip-more">+${others.length - MAX}개 더보기</span>`);
    }
  }

  // 출신업종/배경 + 활용 진단도구
  const bgLines = coach.background
    ? coach.background.split('\n').map(s => s.trim()).filter(Boolean)
    : [];
  const diagItemsCard = coach.diagnosticTools
    ? coach.diagnosticTools.split(/[\n,、]+/).map(s => s.trim()).filter(Boolean)
    : [];
  const diagChipsCard = (() => {
    if (!diagItemsCard.length) return '';
    const visible = diagItemsCard.slice(0, 5).map(t => `<span class="chip chip-diag">${escHtml(t)}</span>`).join('');
    const rest = diagItemsCard.length - 5;
    const more = rest > 0 ? `<span class="chip chip-more">+${rest}개 더</span>` : '';
    return visible + more;
  })();

  // 링크 버튼
  const linkBtns = [];
  const profileFolder = {'개별':'indi','한스코칭':'hans','CiT':'cit','선배경영자':'senior'}[coach.group];
  const profileExt = coach.group === '선배경영자' ? 'pdf' : 'jpg';
  if (coach.alias && profileFolder) {
    if (coach.group === 'CiT') {
      linkBtns.push(`<a class="btn-link" href="#" onclick="event.preventDefault();event.stopPropagation();openProfileImages('cit/${escHtml(coach.alias)}_1.jpg','cit/${escHtml(coach.alias)}_2.jpg')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>프로필
      </a>`);
    } else {
      linkBtns.push(`<a class="btn-link" href="${profileFolder}/${escHtml(coach.alias)}.${profileExt}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>프로필
      </a>`);
    }
  } else if (coach.profileUrl) {
    linkBtns.push(`<a class="btn-link" href="${escHtml(coach.profileUrl)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>프로필
    </a>`);
  }
  if (coach.youtubeUrl) {
    const isMp4Url = /\.mp4(\?|$)/i.test(coach.youtubeUrl) && !coach.youtubeUrl.match(/(?:youtu\.be\/|v=)/);
    if (isMp4Url) {
      linkBtns.push(`<a class="btn-link" href="#" onclick="event.preventDefault();event.stopPropagation();openCoachModal(COACHES.find(c=>c.no===${coach.no}))">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>영상
      </a>`);
    } else {
      linkBtns.push(`<a class="btn-link" href="${escHtml(coach.youtubeUrl)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>영상
      </a>`);
    }
  }

  card.innerHTML = `
    <div class="card-body">
      <div class="card-name-row">
        <span class="card-name">${escHtml(coach.name)} <span class="card-name-suffix">코치</span></span>
        <span class="card-meta">${coach.birthYear ? coach.birthYear + '년' : ''} ${ coach.gender === '남' || coach.gender === '남성' ? '남' : coach.gender === '여' || coach.gender === '여성' ? '여' : ''}</span>
      </div>
      ${chips.length ? `<div class="card-badges">${chips.join('')}</div>` : ''}
      <div class="card-info-rows">
        ${coach.group === '선배경영자' ? (() => {
          const retireParts = [
            coach.company,
            coach.dept ? `(${coach.dept})` : null,
            coach.position,
            coach.title ? `/ ${coach.title}` : null,
          ].filter(Boolean).join(' ');
          return retireParts ? `<div class="card-info-row"><span class="card-info-label">퇴임시 정보</span><span class="card-info-val">${escHtml(retireParts)}</span></div>` : '';
        })() : ''}
        ${bgLines.length ? `<div class="card-info-row"><span class="card-info-label">주요경력</span><span class="card-info-val">${bgLines.map(s => escHtml(s)).join(' · ')}</span></div>` : ''}
        ${coach.group !== '선배경영자' ? `<div class="card-info-row"><span class="card-info-label">진단도구</span><span class="card-info-val${diagChipsCard ? '' : ' card-info-none'}">${diagChipsCard ? `<span class="flag-chips">${diagChipsCard}</span>` : '없음'}</span></div>` : ''}
      </div>
    </div>
    ${linkBtns.length ? `<div class="card-footer">${linkBtns.join('')}</div>` : ''}
  `;

  const openModal = () => openCoachModal(coach);
  card.addEventListener('click', openModal);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(); });

  return card;
}

// ── 코치 상세 모달 ──────────────────────────────────────
function openCoachModal(coach) {
  const modal = document.getElementById('coach-modal');
  const body  = document.getElementById('modal-body');
  body.innerHTML = buildModalHTML(coach);
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-container')?.scrollTo(0, 0);
  modal.querySelector('.modal-close') && modal.querySelector('#modal-close-btn').focus();
}

function closeCoachModal() {
  document.getElementById('coach-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

function buildModalHTML(c) {
  if (c.group === '선배경영자') return buildSunbaeModalHTML(c);

  // ── 헬퍼 ──
  const fmtMoney = v => typeof v === 'number'
    ? '₩' + v.toLocaleString('ko-KR')
    : (v || '-');

  const picSrc = (c.alias && c.group !== 'CiT') ? `pic/${escHtml(c.alias)}.jpg` : null;
  const avatar = picSrc
    ? `<img src="${picSrc}" alt="${escHtml(c.name)}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
       <div class="avatar-fallback" style="display:none">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
           <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
         </svg>
       </div>`
    : `<div class="avatar-fallback">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
           <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
         </svg>
       </div>`;

  // ── 자격 인증 칩 ──
  const certChips = [];
  if (c.certKca) certChips.push(`<span class="chip chip-kca">${escHtml(c.certKca)}</span>`);
  if (c.certIcf) certChips.push(`<span class="chip chip-icf">${escHtml(c.certIcf)}</span>`);
  if (c.certDomesticOther)
    c.certDomesticOther.split('\n').map(s=>s.trim()).filter(Boolean)
      .forEach(cert => certChips.push(`<span class="chip chip-other-cert">${escHtml(cert)}</span>`));

  // ── 연락처 ──
  const contactHTML = c.contact || c.email ? `
    ${c.contact ? `<div class="contact-row">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
      </svg>
      <a href="tel:${c.contact.replace(/[^0-9+]/g,'')}">${escHtml(c.contact)}</a>
    </div>` : ''}
    ${c.email ? `<div class="contact-row">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
      <a href="mailto:${escHtml(c.email)}">${escHtml(c.email)}</a>
    </div>` : ''}` : '<span class="muted-text">계약사를 통해 연락</span>';

  // ── 소개 영상 ──
  const ytId = c.youtubeUrl ? (c.youtubeUrl.match(/(?:youtu\.be\/|[?&]v=|shorts\/)([^&\n?#]+)/) || [])[1] : null;
  const isMp4 = c.youtubeUrl && !ytId && /\.mp4(\?|$)/i.test(c.youtubeUrl);
  const videoHTML = ytId ? `
    <a href="${escHtml(c.youtubeUrl)}" target="_blank" rel="noopener" class="yt-facade">
      <div class="yt-facade-inner">
        <img src="https://img.youtube.com/vi/${ytId}/hqdefault.jpg"
             alt="소개 영상 썸네일"
             onerror="this.src='https://img.youtube.com/vi/${ytId}/mqdefault.jpg'">
        <div class="yt-play-btn">
          <svg viewBox="0 0 68 48" width="68" height="48">
            <path d="M66.5 7.7a8.5 8.5 0 0 0-6-6C56.2 0 34 0 34 0S11.8 0 7.5 1.7a8.5 8.5 0 0 0-6 6C0 12 0 24 0 24s0 12 1.5 16.3a8.5 8.5 0 0 0 6 6C11.8 48 34 48 34 48s22.2 0 26.5-1.7a8.5 8.5 0 0 0 6-6C68 36 68 24 68 24s0-12-1.5-16.3z" fill="#ff0000"/>
            <path d="M45 24 27 14v20" fill="#fff"/>
          </svg>
        </div>
      </div>
    </a>`
  : isMp4 ? (() => {
    const isBlocked = location.protocol === 'https:' && c.youtubeUrl.startsWith('http:');
    if (isBlocked) return `
      <div class="mp4-blocked">
        <p>사내 PC에서만 재생 가능한 영상입니다.</p>
        <a href="${escHtml(c.youtubeUrl)}" target="_blank" rel="noopener">사내망에서 열기 ↗</a>
      </div>`;
    return `
      <div class="mp4-video-wrap">
        <video controls preload="metadata">
          <source src="${escHtml(c.youtubeUrl)}" type="video/mp4">
        </video>
      </div>`;
  })()
  : '';

  // ── 진단 도구 칩 ──
  const diagChips = c.diagnosticTools
    ? c.diagnosticTools.split(/[\n,、]+/).map(s=>s.trim()).filter(Boolean)
        .map(t => `<span class="chip chip-diag">${escHtml(t)}</span>`).join('')
    : '';

  // ── 코칭 가격 테이블 ──
  const prices = (c.prices || []).filter(p => p.category !== '계약기간');
  const hasSub = prices.some(p => p.sub);

  // 구분(category) rowspan 계산
  const catRowspan = prices.map((_, i) => {
    if (i > 0 && prices[i].category === prices[i-1].category) return 0;
    let span = 1;
    while (i + span < prices.length && prices[i + span].category === prices[i].category) span++;
    return span;
  });

  // 비고(note) rowspan 계산: 같은 category 내에서 연속으로 동일한 note일 때 병합
  const noteRowspan = prices.map((_, i) => {
    if (i > 0 && prices[i].category === prices[i-1].category && prices[i].note === prices[i-1].note) return 0;
    let span = 1;
    while (
      i + span < prices.length &&
      prices[i + span].category === prices[i].category &&
      prices[i + span].note === prices[i].note
    ) span++;
    return span;
  });

  let priceRows = '';
  for (let i = 0; i < prices.length; i++) {
    const p = prices[i];
    const cs = catRowspan[i];
    const ns = noteRowspan[i];
    const catCell = cs > 0
      ? `<td class="price-cat"${cs > 1 ? ` rowspan="${cs}"` : ''}>${escHtml(p.category || '')}</td>`
      : '';
    const amt = (p.amount === null || p.amount === undefined) ? '-'
      : typeof p.amount === 'number' ? '₩' + p.amount.toLocaleString('ko-KR')
      : escHtml(String(p.amount));
    const noteCell = ns > 0
      ? `<td class="price-note"${ns > 1 ? ` rowspan="${ns}"` : ''}>${escHtml(p.note || '')}</td>`
      : '';
    if (hasSub) {
      priceRows += `<tr>${catCell}<td class="price-sub">${escHtml(p.sub || '')}</td><td>${escHtml(p.type || '')}</td><td class="price-amount${p.amount === '해당없음' ? ' price-na' : ''}">${amt}</td>${noteCell}</tr>`;
    } else {
      priceRows += `<tr>${catCell}<td>${escHtml(p.type || '')}</td><td class="price-amount${p.amount === '해당없음' ? ' price-na' : ''}">${amt}</td>${noteCell}</tr>`;
    }
  }

  const hasNote = prices.some(p => p.note);

  const priceTable = priceRows ? `
    <table class="price-table">
      <thead>
        <tr>
          <th>구분</th>
          ${hasSub ? '<th>그룹</th>' : ''}
          <th>유형</th>
          <th class="price-amount-th">1회 단가</th>
          ${hasNote ? '<th class="price-note-th">비고</th>' : ''}
        </tr>
      </thead>
      <tbody>${priceRows}</tbody>
    </table>` : '<p class="muted-text">가격 정보 없음</p>';

  // ── 코칭 영역 플래그 ──
  const areaMap = [
    [c.visionStrategy,  '비전/전략'],
    [c.performanceExec, '성과 창출'],
    [c.talentOrg,       '잠재력 확장'],
    [c.selfDev,         '자기 개발'],
  ];
  const areaChips = areaMap.filter(([v])=>v)
    .map(([v,l])=>`<span class="chip chip-exec">${l}${v==='△'?' △':''}</span>`).join('');

  // ── 코칭 대상 ──
  const targetChips = [
    c.cLevel==='O'      && '<span class="chip chip-clevel">C-Level</span>',
    c.execCoaching==='O'&& '<span class="chip chip-exec">임원</span>',
    c.midManager==='O'  && '<span class="chip chip-exec">중간관리자</span>',
    c.groupCoaching==='O'&&'<span class="chip chip-group">그룹코칭</span>',
    c.regionalTravel==='O'&&'<span class="chip chip-group">지방출장</span>',
  ].filter(Boolean).join('');

  const hasStrengths  = c.strengths || c.coachingDomain;
  const hasLg         = true;
  const hasSuccess    = c.successCases;

  return `
  <!-- 헤더: 아바타 + 이름 -->
  <div class="modal-coach-header">
    <div class="modal-coach-avatar">${avatar}</div>
    <div class="modal-coach-info">
      <div id="modal-coach-name" class="modal-coach-name">${escHtml(c.name)} <span class="modal-name-suffix">코치</span></div>
      <div class="modal-coach-meta">
        <span class="card-group-badge ${escHtml(c.group)}">${escHtml(c.group)}</span>
        ${c.birthYear ? `<span>${c.birthYear}년</span>` : ''}
        ${c.gender === '남' || c.gender === '남성' ? `<span>남성</span>` : c.gender === '여' || c.gender === '여성' ? `<span>여성</span>` : ''}
        ${c.no === 13 && c.group === '개별' ? `<span class="chip chip-nononsite">#비대면only</span>` : ''}
      </div>
    </div>
  </div>

  <div class="modal-sections">

    <!-- ① 연락처 + 자격 인증 (2열) -->
    <div class="modal-top-grid">
      <div class="modal-info-card">
        <div class="modal-info-card-title">연락처</div>
        <div class="contact-list">${contactHTML}</div>
      </div>
      <div class="modal-info-card">
        <div class="modal-info-card-title">보유 자격</div>
        ${certChips.length ? `<div class="flag-chips">${certChips.join('')}</div>` : `<p class="field-text" style="color:var(--color-text-muted);font-style:italic">없음</p>`}
      </div>
    </div>

    <!-- ① -2 코칭대상 + 코칭주제 -->
    <div class="modal-top-grid">
      <div class="modal-info-card">
        <div class="modal-info-card-title">코칭 대상</div>
        <ul class="check-list">
          <li class="${c.cLevel ? 'checked' : 'unchecked'}">
            ${c.cLevel ? '✅' : '⬜'} C-Level
          </li>
          <li class="${c.execCoaching ? 'checked' : 'unchecked'}">
            ${c.execCoaching ? '✅' : '⬜'} 임원
          </li>
          <li class="${c.midManager ? 'checked' : 'unchecked'}">
            ${c.midManager ? '✅' : '⬜'} 실/팀장
          </li>
        </ul>
      </div>
      <div class="modal-info-card">
        <div class="modal-info-card-title">코칭 주제</div>
        <ul class="check-list">
          <li class="${c.visionStrategy ? 'checked' : 'unchecked'}">
            ${c.visionStrategy ? '✅' : '⬜'} 비전과 전략 제시
          </li>
          <li class="${c.performanceExec ? 'checked' : 'unchecked'}">
            ${c.performanceExec ? '✅' : '⬜'} 실행을 통한 성과창출
          </li>
          <li class="${c.talentOrg ? 'checked' : 'unchecked'}">
            ${c.talentOrg ? '✅' : '⬜'} 인재 및 조직문화 구축
          </li>
          <li class="${c.selfDev ? 'checked' : 'unchecked'}">
            ${c.selfDev ? '✅' : '⬜'} 자기개발 및 관리
          </li>
        </ul>
      </div>
    </div>

    <!-- 출신업종/배경 + 활용 진단도구 -->
    <div class="modal-top-grid">
      ${c.background ? `
      <div class="modal-info-card">
        <div class="modal-info-card-title">주요경력</div>
        <div class="modal-bg-lines">${c.background.split('\n').map(s=>s.trim()).filter(Boolean).map(s=>`<span>${escHtml(s)}</span>`).join('')}</div>
      </div>` : ''}
      <div class="modal-info-card">
        <div class="modal-info-card-title">활용 진단도구</div>
        ${diagChips ? `<div class="flag-chips">${diagChips}</div>` : `<p class="field-text" style="color:var(--color-text-muted);font-style:italic">없음</p>`}
      </div>
    </div>

    <!-- ② 소개 영상 -->
    ${videoHTML ? `
    <div class="modal-section-plain">
      <div class="modal-section-plain-title">소개 영상 <em class="muted-text" style="font-weight:normal;">※사내PC 접속 시 문제없이 보입니다</em></div>
      ${videoHTML}
    </div>` : ''}

    <!-- ③ 코치로서의 강점 -->
    ${hasStrengths ? `
    <details class="modal-section" open>
      <summary>코치로서의 강점</summary>
      <div class="modal-section-body">${formatStrengths(c.strengths || c.coachingDomain || '')}</div>
    </details>` : ''}

    <!-- ④ LG 코칭 실적 -->
    ${hasLg ? `
    <details class="modal-section" open>
      <summary>LG 코칭 실적</summary>
      <div class="modal-section-body">
        ${c.group !== 'CiT' && c.recentLgActivity ? `<p class="pre-wrap field-text">${escHtml(c.recentLgActivity)}</p>` : ''}
        ${c.lgExperience ? `<p class="pre-wrap field-text">${escHtml(c.lgExperience)}</p>`
          : (!c.recentLgActivity || c.group === 'CiT') ? `<p class="field-text" style="color:var(--color-text-muted);font-style:italic">없음</p>` : ''}
      </div>
    </details>` : ''}

    <!-- ⑤ 주요 코칭 사례 -->
    ${hasSuccess ? `
    <details class="modal-section">
      <summary>주요 코칭 사례</summary>
      <div class="modal-section-body pre-wrap">${escHtml(c.successCases)}</div>
    </details>` : ''}



    <!-- ⑧ 코칭 가격 -->
    <details class="modal-section">
      <summary>코칭 비용</summary>
      <div class="modal-section-body">${priceTable}</div>
    </details>

  </div>`;
}

// ── 계정 관리 모달 ──────────────────────────────────────
function openAccountsModal() {
  const modal = document.getElementById('accounts-modal');
  const wrap  = document.getElementById('accounts-table-wrap');

  const rows = AUTH.FIXED_CREDENTIALS.map(c => `
    <tr>
      <td>${escHtml(c.id)}</td>
      <td>${escHtml(c.password)}</td>
      <td>${c.role === 'firm' ? `${c.role} (${c.allowedGroups.join(', ')})` : escHtml(c.role)}</td>
    </tr>`).join('');

  wrap.innerHTML = `
    <table class="accounts-table">
      <thead><tr><th>아이디</th><th>비밀번호</th><th>역할</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;

  // 코치 alias 목록
  const coachSection = document.createElement('div');
  coachSection.className = 'coach-accounts-section';
  coachSection.innerHTML = `
    <h3>코치 개인 비밀번호 (alias)</h3>
    <div class="coach-alias-list">
      ${COACHES.map(c => `
        <div class="coach-alias-item">
          <span>${escHtml(c.name)} (No.${c.no})</span>
          <span class="alias-pwd">${escHtml(c.alias)}</span>
        </div>`).join('')}
    </div>`;
  wrap.appendChild(coachSection);

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeAccountsModal() {
  document.getElementById('accounts-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

// ── 코치 강점 섹션 포맷터 ──────────────────────────────
function formatStrengths(text) {
  if (!text) return '';

  const reStyle    = /코칭\s*스타일\s*[：:]/i;
  const reTopic    = /선호하는?\s*코칭\s*주제\s*[：:]/i;
  const reFeedback = /코치로서\s*들었던\s*피드백\s*[：:]?/i;

  const hasStructure = reStyle.test(text) || reTopic.test(text) || reFeedback.test(text);
  if (!hasStructure) {
    return `<p class="pre-wrap field-text">${escHtml(text)}</p>`;
  }

  // 전체 텍스트를 분리
  let full = text;
  const parts = { style: '', topic: '', feedback: '' };

  const fbMatch = reFeedback.exec(full);
  if (fbMatch) { parts.feedback = full.slice(fbMatch.index + fbMatch[0].length).trim(); full = full.slice(0, fbMatch.index); }
  const tpMatch = reTopic.exec(full);
  if (tpMatch) { parts.topic   = full.slice(tpMatch.index + tpMatch[0].length).trim();  full = full.slice(0, tpMatch.index); }
  const stMatch = reStyle.exec(full);
  if (stMatch) { parts.style   = full.slice(stMatch.index + stMatch[0].length).trim();   full = full.slice(0, stMatch.index); }

  let html = '';

  if (parts.style) {
    html += `<div class="strength-block">
      <div class="strength-block-title">🎯 코칭 스타일</div>
      <p class="field-text">${escHtml(parts.style)}</p>
    </div>`;
  }

  if (parts.topic) {
    html += `<div class="strength-block">
      <div class="strength-block-title">✨ 선호하는 코칭 주제</div>
      <p class="field-text">${escHtml(parts.topic)}</p>
    </div>`;
  }

  if (parts.feedback) {
    const lines = parts.feedback.split(/\n+/).map(l => l.trim()).filter(Boolean);
    const isQuoteLine = l => /^["""''"]/.test(l) || /["""''"]$/.test(l) || l.startsWith('"');
    const quotes = lines.filter(isQuoteLine);
    const rest2  = lines.filter(l => !isQuoteLine(l)).join('\n');

    html += `<div class="strength-block">
      <div class="strength-block-title">💬 코치로서 들었던 피드백</div>
      ${quotes.length ? quotes.map(q => `<blockquote class="feedback-quote">${escHtml(q.replace(/^["""''"]+|["""''"]+$/g,'').trim())}</blockquote>`).join('') : ''}
      ${rest2 ? `<p class="field-text">${escHtml(rest2)}</p>` : ''}
    </div>`;
  }

  return html || `<p class="pre-wrap field-text">${escHtml(text)}</p>`;
}

// ── 유틸리티 ──────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── 프로필 이미지 오버레이 ────────────────────────────────
function openProfileImages(...srcs) {
  const overlay = document.createElement('div');
  overlay.className = 'profile-img-overlay';
  overlay.innerHTML = `
    <div class="profile-img-box">
      <button class="profile-img-close" onclick="this.closest('.profile-img-overlay').remove();document.body.style.overflow=''">&times;</button>
      <div class="profile-img-grid">
        ${srcs.map(s => `<img src="${s}" alt="프로필">`).join('')}
      </div>
    </div>`;
  overlay.addEventListener('click', e => {
    if (e.target === overlay) { overlay.remove(); document.body.style.overflow = ''; }
  });
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

// ── 선배경영자 전용 모달 ──────────────────────────────────
function buildSunbaeModalHTML(c) {
  const picSrc = c.alias ? `sunbae/${escHtml(c.alias)}.jpg` : null;
  const avatar = picSrc
    ? `<img src="${picSrc}" alt="${escHtml(c.name)}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
       <div class="avatar-fallback" style="display:none">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
           <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
         </svg>
       </div>`
    : `<div class="avatar-fallback">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
           <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
         </svg>
       </div>`;

  const certChips = [c.certKca, c.certDomesticOther, c.certIcf]
    .filter(Boolean).map(v => `<span class="chip chip-kca">${escHtml(v)}</span>`).join('');

  const areaEntries = [
    [c.areaBusiness,   '사업가'],
    [c.areaFL,         'Function Leader'],
    [c.areaLeadership, '리더십'],
  ].map(([v, label]) => {
    const checked = !!v;
    const isSimple = !v || /^[Oo○●△▲]$/.test((v || '').trim());
    const extra = (!isSimple && v) ? ` <span class="area-desc">${escHtml(v.trim())}</span>` : '';
    return { html: `<li class="${checked ? 'checked' : 'unchecked'}">${checked ? '✅' : '⬜'} ${label}${extra}</li>`, hasDesc: !isSimple && !!v };
  });
  const areaList = areaEntries.map(e => e.html).join('');
  const areaWide = areaEntries.some(e => e.hasDesc);

  const bgLines = c.background
    ? c.background.split('\n').map(s => s.trim()).filter(Boolean)
        .map(s => `<li>${escHtml(s)}</li>`).join('')
    : '';

  const retireDate = c.retireDate ? String(c.retireDate).replace(/\s.*$/, '') : null;

  return `
  <div class="modal-coach-header">
    <div class="modal-coach-avatar">${avatar}</div>
    <div class="modal-coach-info">
      <div id="modal-coach-name" class="modal-coach-name">${escHtml(c.name)} <span class="modal-name-suffix">코치</span></div>
      <div class="modal-coach-meta">
        <span class="card-group-badge 선배경영자">선배경영자</span>
        ${c.title ? `<span>${escHtml(c.title)}</span>` : ''}
      </div>
    </div>
  </div>

  <div class="modal-sections">

    <!-- 퇴임 시 정보 -->
    <details class="modal-section" open>
      <summary>퇴임 시 정보</summary>
      <div class="modal-section-body">
        <table class="sunbae-info-table">
          ${c.company  ? `<tr><th>회사</th><td>${escHtml(c.company)}</td></tr>` : ''}
          ${c.dept     ? `<tr><th>부서</th><td>${escHtml(c.dept)}</td></tr>` : ''}
          ${(c.position || c.title) ? `<tr><th>직책/직위</th><td>${[c.position, c.title].filter(Boolean).map(escHtml).join(' / ')}</td></tr>` : ''}
        </table>
      </div>
    </details>

    <!-- 주요 경력 -->
    ${bgLines ? `
    <details class="modal-section" open>
      <summary>주요 경력</summary>
      <div class="modal-section-body">
        <ul class="sunbae-bg-list">${bgLines}</ul>
      </div>
    </details>` : ''}

    <!-- 코칭 가능 영역 + 코치 자격 -->
    <div class="modal-top-grid${areaWide ? ' sunbae-area-wide' : ''}">
      <div class="modal-info-card">
        <div class="modal-info-card-title">코칭 가능 영역</div>
        <ul class="check-list">${areaList}</ul>
      </div>
      <div class="modal-info-card">
        <div class="modal-info-card-title">코치 자격</div>
        ${certChips ? `<div class="flag-chips">${certChips}</div>` : `<p class="field-text" style="color:var(--color-text-muted);font-style:italic">없음</p>`}
      </div>
    </div>

    ${c.note ? `
    <div class="modal-info-card">
      <div class="modal-info-card-title">비고</div>
      <p class="field-text pre-wrap">${escHtml(c.note)}</p>
    </div>` : ''}

  </div>`;
}
