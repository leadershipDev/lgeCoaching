import subprocess, sys, os
os.chdir(r'd:\project\CoachingLanding')
result = subprocess.run([sys.executable, '_test_openpyxl.py'], capture_output=True)
with open('_run_result.json', 'w', encoding='utf-8') as f:
    import json
    json.dump({
        'returncode': result.returncode,
        'stdout': result.stdout.decode('utf-8', errors='replace'),
        'stderr': result.stderr.decode('utf-8', errors='replace')[:300]
    }, f, ensure_ascii=False, indent=2)
