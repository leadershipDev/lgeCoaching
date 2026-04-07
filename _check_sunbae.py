import openpyxl, sys
sys.stdout.reconfigure(encoding='utf-8')
wb = openpyxl.load_workbook("(all)`26년_LG전자_사외코치Pool_260325.xlsx", data_only=True)
ws = wb['선배경영자']
for row in ws.iter_rows(min_row=4, values_only=True):
    if row[1] and '김건우' in str(row[1]):
        for i, v in enumerate(row):
            if v is not None:
                print(f"col{i}: {repr(v)}")
        break
