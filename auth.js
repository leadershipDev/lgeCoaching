// auth.js — 인증 및 세션 관리
'use strict';

const AUTH = (() => {
  const SESSION_KEY = 'lg_coach_session';

  // 고정 계정 (coach는 data.js의 alias로 동적 매칭)
  const FIXED_CREDENTIALS = [
    { id: 'ondemand', password: 'lgelc12345!!', role: 'admin', allowedGroups: ['26년코칭', '개별', '선배경영자', '코칭경영원', '한스코칭', 'CiT'] },
    { id: 'admin', password: 'lgelc12345!!', role: 'admin', allowedGroups: ['26년코칭', '개별', '선배경영자', '코칭경영원', '한스코칭', 'CiT'] },
    { id: 'z', password: 'z', role: 'admin', allowedGroups: ['26년코칭', '개별', '선배경영자', '코칭경영원', '한스코칭', 'CiT'] },
    //{ id: 'inhwawon', password: 'lgelc12345!', role: 'firm', allowedGroups: ['선배경영자'] },
    //{ id: 'coachingFirm', password: 'indiCntract12!', role: 'firm', allowedGroups: ['개별'] },
    //{ id: 'jungeunsil67_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    //{ id: 'hayongho62_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    //{ id: 'choikangseok70_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    //{ id: 'jungjaewan60_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    //{ id: 'choidongha59_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    //{ id: 'kimmansoo59_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    //{ id: 'kimmuhwan60_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    //{ id: 'kimkwangil63_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    //{ id: 'leekwangho63_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    //{ id: 'imhyunhee77_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    //{ id: 'chosunkyung63_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    //{ id: 'kimdoyeon59_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    //{ id: 'parkjungmin71_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    //{ id: 'leejihyun69_coach', password: 'lgelc12345!', role: 'me', allowedGroups: ['개별'] },
    { id: 'coaching44', password: 'lgelc12345!', role: 'firm', allowedGroups: ['코칭경영원'] },
    //{ id: 'hans14', password: 'lgelc12345!', role: 'firm', allowedGroups: ['한스코칭'] },
    //{ id: 'cit22', password: 'lgelc12345!', role: 'firm', allowedGroups: ['CiT'] },
  ];

  function login(id, password) {
    const trimId = (id || '').trim();
    const trimPwd = (password || '').trim();

    // 1. 고정 계정 체크
    const fixed = FIXED_CREDENTIALS.find(
      c => c.id === trimId && c.password === trimPwd
    );
    if (fixed) {
      const session = {
        role: fixed.role,
        allowedGroups: fixed.allowedGroups,
        canManageAccounts: fixed.role === 'superAdmin',
        displayName: fixed.id,
        coachNo: null,
        loginId: fixed.role === 'me' ? trimId : null,
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    }

    // 2. coach 계정 — alias를 비밀번호로 사용
    if (trimId === 'coach') {
      const coach = (typeof COACHES !== 'undefined' ? COACHES : [])
        .find(c => c.alias === trimPwd);
      if (coach) {
        const session = {
          role: 'coach',
          allowedGroups: [coach.group],
          canManageAccounts: false,
          displayName: coach.name,
          coachNo: coach.no,
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
      }
    }

    return null;
  }

  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  }

  return { login, getSession, logout, FIXED_CREDENTIALS };
})();
