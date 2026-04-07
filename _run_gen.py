import subprocess, sys, os
os.chdir(r'd:\project\CoachingLanding')
result = subprocess.run([sys.executable, 'generate_data.py'], capture_output=True)
with open('_run_result.json', 'w', encoding='utf-8') as f:
    import json
    json.dump({
        'returncode': result.returncode,
        'stdout': result.stdout.decode('cp949', errors='replace'),
        'stderr': result.stderr.decode('cp949', errors='replace')[:500]
    }, f, ensure_ascii=False, indent=2)
print('done', result.returncode)
