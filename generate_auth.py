# -*- coding: utf-8 -*-
"""
generate_auth.py — auth.md → auth.js 변환

사용법:
  python generate_auth.py

auth.md의 '고정 계정' 테이블을 읽어 auth.js의 FIXED_CREDENTIALS를 갱신합니다.
"""
import re, os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

AUTH_MD   = os.path.join(os.path.dirname(__file__), 'auth.md')
AUTH_JS   = os.path.join(os.path.dirname(__file__), 'auth.js')

ALL_GROUPS = ['26년코칭', '개별', '코칭경영원', '한스코칭', 'CiT']

def parse_table(md_text):
    """'고정 계정' 섹션의 마크다운 테이블 파싱 → 딕셔너리 리스트 반환"""
    # 고정 계정 섹션 추출
    section = re.search(r'## 고정 계정(.+?)(?=^##|\Z)', md_text, re.DOTALL | re.MULTILINE)
    if not section:
        raise ValueError("auth.md에서 '## 고정 계정' 섹션을 찾을 수 없습니다.")

    rows = []
    for line in section.group(1).splitlines():
        line = line.strip()
        if not line.startswith('|') or re.match(r'^\|[-| ]+\|$', line):
            continue
        cells = [c.strip() for c in line.strip('|').split('|')]
        if len(cells) < 4 or cells[0] == '아이디':  # 헤더 건너뜀
            continue
        rows.append(cells)
    return rows

def build_credentials_js(rows):
    lines = []
    for cells in rows:
        uid, pwd, role, tab = cells[0], cells[1], cells[2], cells[3]
        if tab.strip().lower() == 'all':
            groups = ALL_GROUPS
        elif tab.strip().lower() == 'me':
            groups = ['개별']
        else:
            groups = [t.strip() for t in tab.split(',') if t.strip()]
        groups_js = ', '.join(f"'{g}'" for g in groups)
        lines.append(
            f"    {{ id: '{uid}', password: '{pwd}', role: '{role}', allowedGroups: [{groups_js}] }},"
        )
    return '\n'.join(lines)

def update_auth_js(cred_js):
    with open(AUTH_JS, encoding='utf-8') as f:
        content = f.read()

    # FIXED_CREDENTIALS 배열 내용 교체
    new_content = re.sub(
        r'(const FIXED_CREDENTIALS\s*=\s*\[).*?(\s*\];)',
        lambda m: m.group(1) + '\n' + cred_js + '\n  ' + m.group(2).lstrip(),
        content,
        flags=re.DOTALL
    )

    if new_content == content:
        print("⚠ auth.js에서 FIXED_CREDENTIALS 블록을 찾지 못했습니다.")
        sys.exit(1)

    with open(AUTH_JS, 'w', encoding='utf-8') as f:
        f.write(new_content)

def main():
    with open(AUTH_MD, encoding='utf-8') as f:
        md = f.read()

    rows = parse_table(md)
    if not rows:
        print("⚠ 파싱된 계정이 없습니다. auth.md 테이블 형식을 확인하세요.")
        sys.exit(1)

    cred_js = build_credentials_js(rows)
    update_auth_js(cred_js)

    print(f"✅ auth.js 업데이트 완료 ({len(rows)}개 계정)")
    for r in rows:
        print(f"   {r[2]:12} | {r[0]} / {r[1]}  →  {r[3]}")

if __name__ == '__main__':
    main()
