# LG전자 사외코치 Pool — 로그인 안내

> 이 문서는 시스템 관리자 및 권한 부여 담당자용 가이드입니다.

---

## 접속 방법

웹 브라우저에서 서비스 URL로 접속 → 아이디 / 비밀번호 입력 후 로그인

---

## 권한별 로그인 정보

### 1. Super Admin (전체 관리자)

| 항목 | 값 |
|---|---|
| 아이디 | `superAdmin` |
| 비밀번호 | `lgelc12345!!` |
| 접근 가능 탭 | 26년 코칭 · 개별 · 코칭경영원 · 한스코칭 · CiT (전체) |
| 추가 기능 | **계정 관리** — 전체 계정 및 코치 alias 목록 조회 |

---

### 2. Admin (열람 관리자)

| 항목 | 값 |
|---|---|
| 아이디 | `admin` |
| 비밀번호 | `lgelc12345!!` |
| 접근 가능 탭 | 26년 코칭 · 개별 · 코칭경영원 · 한스코칭 · CiT (전체) |
| 추가 기능 | 없음 (읽기 전용) |

---

### 3. 코칭 회사 (coachingFirm)

회사별로 **아이디는 동일**, 비밀번호에 따라 해당 회사 탭만 표시됩니다.

| 회사 | 아이디 | 비밀번호 | 접근 가능 탭 |
|---|---|---|---|
| 개별 계약 코치 | `coachingFirm` | `indiCntract12!` | 개별 |
| 코칭경영원 | `coachingFirm` | `coContract12!` | 코칭경영원 |
| 한스코칭 | `coachingFirm` | `hansContract12!` | 한스코칭 |
| CiT | `coachingFirm` | `citContract12!` | CiT |

---

### 4. 개인 코치 (coach)

코치 본인이 자신의 프로필만 조회할 수 있습니다.

| 항목 | 값 |
|---|---|
| 아이디 | `coach` |
| 비밀번호 | 각 코치의 **alias** (아래 목록 참조) |
| 접근 가능 탭 | 본인 소속 탭 (본인 프로필 1건만 표시) |

#### 코치별 비밀번호 (alias) 목록

> 비밀번호는 엑셀 D열(alias)과 동일합니다.

**개별 코치 (No. 1–14)**

| No. | 이름 | 비밀번호(alias) |
|---|---|---|
| 1 | 정은실 | `jungeunsil67_coach` |
| 2 | 하용호 | `hayongho62_coach` |
| 3 | 최강석 | `choikangseok70_coach` |
| 4 | 정재완 | `jungjaewan60_coach` |
| 5 | 최동하 | `choidongha59_coach` |
| 6 | 김만수 | `kimmansoo59_coach` |
| 7 | 김무환 | `kimmuhwan60_coach` |
| 8 | 김광일 | `kimkwangil63_coach` |
| 9 | 이광호 | `leekwangho63_coach` |
| 10 | 임현희 | `imhyunhee77_coach` |
| 11 | 조선경 | `chosunkyung63_coach` |
| 12 | 김두연 | `kimdoyeon59_coach` |
| 13 | 박정민 | `parkjungmin71_coach` |
| 14 | 이지현(부산) | `leejihyun69_coach` |

**한스코칭 코치 (No. 15–26)**

| No. | 이름 | 비밀번호(alias) |
|---|---|---|
| 15 | 한숙기 | `hansookgi_coach` |
| 16 | 정형권 | `jeonghyeonggwon_coach` |
| 17 | 이미연 | `leemiyoun_coach` |
| 18 | 안상희 | `ansanghee_coach` |
| 19 | 조은현 | `joeunhyun_coach` |
| 20 | 양소영 | `yangsoyoung_coach` |
| 21 | 이정희 | `leejunghee_coach` |
| 22 | 김진영 | `kimjinyoung_coach` |
| 23 | 양흥열 | `yangheungyeol_coach` |
| 24 | 이문희 | `leemoonhee_coach` |
| 25 | 김현주 | `kimhyunjoo_coach` |
| 26 | 신해진 | `shinhaejin_coach` |

**CiT 코치 (No. 27–46)**

| No. | 이름 | 비밀번호(alias) |
|---|---|---|
| 27 | 백열승 | `baekyeolseung_coach` |
| 28 | 안병균 | `anbyeonggyun_coach` |
| 29 | 이은영 | `leeeunyoung_coach` |
| 30 | 마정수 | `majungsu_coach` |
| 31 | 이지현 | `leeyijhyun_coach_cit` |
| 32 | 위장원 | `wijangwon_coach` |
| 33 | 조정화 | `jojunghwa_coach` |
| 34 | 고정연 | `gojeongyeon_coach` |
| 35 | 안창준 | `anchangjun_coach` |
| 36 | 김지연 | `kimjeeyeon_coach` |
| 37 | 나윤숙 | `nayunsuk_coach` |
| 38 | 박선영 | `parkseonyoung_coach` |
| 39 | 박찬웅 | `parkchanwoong_coach` |
| 40 | 박선민 | `parkseonmin_coach` |
| 41 | 나영신 | `nayoungshin_coach` |
| 42 | 이재경 | `leejaekyung_coach` |
| 43 | 백운남 | `baekwoonnam_coach` |
| 44 | 김상범 | `kimshangbum_coach` |
| 45 | 정혜선 | `jeonghyeseon_coach` |
| 46 | 박윤정 | `parkyeonjeong_coach` |

**코칭경영원 코치 (No. 47–90)**

| No. | 이름 | 비밀번호(alias) |
|---|---|---|
| 47 | 강사윤 | `kangsayoon_coach` |
| 48 | 고경일 | `gogyeongil_coach` |
| 49 | 구자호 | `goojaho_coach` |
| 50 | 김병헌 | `kimbyeongheon_coach` |
| 51 | 김숙경 | `kimsookkyung_coach` |
| 52 | 김정원 | `kimjeongwon_coach` |
| 53 | 김정환 | `kimjeonghwan_coach` |
| 54 | 김종철 | `kimjongcheol_coach` |
| 55 | 김혜경 | `kimhyekyung_coach` |
| 56 | 남관희 | `namgwanhee_coach` |
| 57 | 류지성 | `ryujiseong_coach` |
| 58 | 민병우 | `minbyeongwoo_coach` |
| 59 | 박기태 | `parkgitae_coach` |
| 60 | 박명길 | `parkmyeonggil_coach` |
| 61 | 선현주 | `seonhyeonju_coach` |
| 62 | 성영목 | `seongyeongmok_coach` |
| 63 | 손태경 | `sontaekyung_coach` |
| 64 | 송명림 | `songmyeongrim_coach` |
| 65 | 양혜연 | `yanghyeyeon_coach` |
| 66 | 유성희 | `yooseonghee_coach` |
| 67 | 윤경희 | `yoonkyeonghee_coach` |
| 68 | 윤동준 | `yoondongjun_coach` |
| 69 | 윤여순 | `yoonyeseon_coach` |
| 70 | 윤장효 | `yoonjanghyo_coach` |
| 71 | 윤정열 | `yoonjeongyeol_coach` |
| 72 | 윤한근 | `yoonhangeun_coach` |
| 73 | 이인홍 | `leeyinhong_coach` |
| 74 | 이정수 | `leejeongsu_coach` |
| 75 | 임태조 | `limtaejo_coach` |
| 76 | 정홍길 | `jeonghonggil_coach` |
| 77 | 조남철 | `jonamcheol_coach` |
| 78 | 조원민 | `jowonmin_coach` |
| 79 | 조은정 | `joeunjeong_coach` |
| 80 | 최인녕 | `choeinyong_coach` |
| 81 | 현미정 | `hyeonmijeong_coach` |
| 82 | 김대희 | `kimdaehui_coach` |
| 83 | 김미나 | `kimmina_coach` |
| 84 | 김성혜 | `kimseonghye_coach` |
| 85 | 박선나 | `parksunna_coach` |
| 86 | 서지영 | `seojiyoung_coach` |
| 87 | 윤지영 | `yoonjiyoung_coach` |
| 88 | 정지현 | `jeongjihyeon_coach` |
| 89 | 차국환 | `chakukhwan_coach` |
| 90 | 한상욱 | `hansanguk_coach` |

---

## 탭별 접근 권한 요약

| 탭 | superAdmin | admin | coachingFirm | coach |
|---|:---:|:---:|:---:|:---:|
| 26년 코칭 (PDF) | ✅ | ✅ | ❌ | ❌ |
| 개별 | ✅ | ✅ | 개별 비번만 ✅ | 본인만 ✅ |
| 코칭경영원 | ✅ | ✅ | 코경원 비번만 ✅ | 본인만 ✅ |
| 한스코칭 | ✅ | ✅ | 한스 비번만 ✅ | 본인만 ✅ |
| CiT | ✅ | ✅ | CiT 비번만 ✅ | 본인만 ✅ |
| 계정 관리 | ✅ | ❌ | ❌ | ❌ |

---

## 주의 사항

- 비밀번호는 **대소문자를 구분**합니다.
- 세션은 **브라우저 탭을 닫으면 자동 만료**됩니다 (재로그인 필요).
- 코치 alias 비밀번호 변경이 필요한 경우 → 엑셀 D열 수정 후 `generate_data.py` 재실행.
- 계정 추가/변경이 필요한 경우 → `auth.js` 파일의 `FIXED_CREDENTIALS` 배열을 수정하세요.
