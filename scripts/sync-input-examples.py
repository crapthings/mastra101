"""Keep chapters 05 and 06's shared language variants, materials and download archives aligned."""
import copy
import json
import re
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
ts_root = root / 'examples/05-travel-lab'
js_root = root / 'examples/05-travel-lab-js'
js_root.mkdir(exist_ok=True)

# These files use shared JavaScript syntax; only the local import extensions differ.
for source in (ts_root / 'src').rglob('*.ts'):
    target = js_root / source.relative_to(ts_root).with_suffix('.js')
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(re.sub(r"(from ['\"][^'\"]+)\.ts(['\"])", r'\1.js\2', source.read_text()))

package = json.loads((ts_root / 'package.json').read_text())
package['name'] = 'mastra-travel-lab-js'
package['scripts']['image'] = 'node --env-file=.env src/image.js'
package['scripts']['frames'] = 'node --env-file=.env src/video-frames.js'
package['devDependencies'].pop('tsx', None)
(js_root / 'package.json').write_text(json.dumps(package, ensure_ascii=False, indent=2) + '\n')
for name in ['.env.example', '.gitignore']:
    (js_root / name).write_bytes((ts_root / name).read_bytes())
(js_root / 'README.md').write_text((ts_root / 'README.md').read_text().replace('05-travel-lab', '05-travel-lab-js').replace('TypeScript', 'JavaScript').replace('.ts', '.js'))

# Publish the same authored materials in each project and at the lesson download links.
for source in (ts_root / 'materials').iterdir():
    if not source.is_file():
        continue
    for target in [js_root / 'materials' / source.name, root / 'public/downloads/05-materials' / source.name, root / 'public/learning-materials' / source.name]:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(source.read_bytes())

for path in (root / 'src/locales/lessons').glob('input-*.zh.json'):
    base = json.loads(path.read_text())
    base.pop('codeVariants', None)
    for section in base['sections']:
        for block in section.get('codeBlocks', []):
            source = ts_root / block['label']
            if source.is_file() and block['label'].startswith('src/'):
                block['code'] = source.read_text().rstrip()
    js = copy.deepcopy(base)
    for section in js['sections']:
        section['body'] = section['body'].replace('05-travel-lab', '05-travel-lab-js').replace('.ts', '.js')
        if 'table' in section:
            section['table']['rows'] = [[cell.replace('.ts', '.js') for cell in row] for row in section['table']['rows']]
        if section.get('download', {}).get('href') == '/downloads/05-travel-lab.zip':
            section['download'] = {'href': '/downloads/05-travel-lab-js.zip', 'label': '下载 JavaScript 实验项目（ZIP）'}
        for block in section.get('codeBlocks', []):
            if block['label'].endswith('.ts'):
                block['label'] = block['label'].replace('.ts', '.js')
                block['language'] = 'javascript'
                block['code'] = (js_root / block['label']).read_text().rstrip()
    if js['sections'] != base['sections']:
        base['codeVariants'] = {'js': {'sections': js['sections']}}
    path.write_text(json.dumps(base, ensure_ascii=False, indent=2) + '\n')

for folder in [ts_root, js_root]:
    with zipfile.ZipFile(root / f'public/downloads/{folder.name}.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(folder.rglob('*')):
            relative = path.relative_to(folder)
            if not path.is_file() or any(part in ['node_modules', '.mastra', '.env'] for part in relative.parts):
                continue
            if relative.parts[0] in ['src', 'materials'] or relative.as_posix() in ['README.md', 'package.json', 'pnpm-lock.yaml', '.env.example', '.gitignore']:
                archive.write(path, str(path.relative_to(folder.parent)))
print('05／06 JS／TS 正文、共享项目与下载包已同步。')
