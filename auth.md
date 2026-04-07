# 인증 계정 설정

> 이 파일을 수정한 뒤 `generate_auth.py`를 실행하면 `auth.js`에 자동 반영됩니다.

---

## 고정 계정

| 아이디 | 비밀번호 | 역할 | 접근탭 |
|---|---|---|---|
| superAdmin | lgelc12345!! | superAdmin | all |
| admin | lgelc12345!! | admin | all |
| a | a | admin | all |
| coachingFirm | indiCntract12! | firm | 개별 |
| jungeunsil67_coach | lgelc12345! | me | me |
| hayongho62_coach | lgelc12345! | me | me |
| choikangseok70_coach | lgelc12345! | me | me |
| jungjaewan60_coach | lgelc12345! | me | me |
| choidongha59_coach | lgelc12345! | me | me |
| kimmansoo59_coach | lgelc12345! | me | me |
| kimmuhwan60_coach | lgelc12345! | me | me |
| kimkwangil63_coach | lgelc12345! | me | me |
| leekwangho63_coach | lgelc12345! | me | me |
| imhyunhee77_coach | lgelc12345! | me | me |
| chosunkyung63_coach | lgelc12345! | me | me |
| kimdoyeon59_coach | lgelc12345! | me | me |
| parkjungmin71_coach | lgelc12345! | me | me |
| leejihyun69_coach | lgelc12345! | me | me |
| coaching44 | lgelc12345! | firm | 코칭경영원 |
| hans14 | lgelc12345! | firm | 한스코칭 |
| cit | lgelc12345! | firm | CiT |

### 역할 설명

| 역할 | 설명 |
|---|---|
| `superAdmin` | 전체 탭 접근 + 계정 관리 UI |
| `admin` | 전체 탭 접근 (읽기 전용) |
| `firm` | 지정된 탭만 접근 |

### 접근탭 값 규칙

- `all` → 모든 탭 (26년코칭, 개별, 코칭경영원, 한스코칭, CiT)
- 특정 탭만 지정 시 → `개별` / `코칭경영원` / `한스코칭` / `CiT` 중 하나

---

## 코치 계정 (자동 관리)

코치 계정은 이 파일에서 관리하지 않습니다.
엑셀 D열(alias)이 비밀번호로 사용되며, `generate_data.py` 실행 시 자동 반영됩니다.

- 아이디: `coach`
- 비밀번호: 각 코치의 alias (엑셀 D열)
