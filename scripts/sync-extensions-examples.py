"""Keep chapters 11–13 source, language variants, materials and downloads aligned."""
import copy
import json
import shutil
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]

for folder, prefix in [('11-skills', 'skill-'), ('12-workspace', 'workspace-'), ('13-sandbox', 'sandbox-')]:
    js_root = root / 'examples' / folder
    ts_root = root / 'examples' / (folder + '-ts')
    (ts_root / 'src').mkdir(parents=True, exist_ok=True)
    for source in sorted((js_root / 'src').glob('*.js')):
        (ts_root / 'src' / source.with_suffix('.ts').name).write_text(source.read_text().replace(".js'", ".ts'"))
    for name in ['package.json', 'pnpm-lock.yaml', '.env.example', '.gitignore']:
        (ts_root / name).write_bytes((js_root / name).read_bytes())
    (ts_root / 'README.md').write_text((js_root / 'README.md').read_text().replace('默认 JavaScript', '此包使用 TypeScript').replace('.js', '.ts'))
    if (js_root / 'materials').exists():
        shutil.copytree(js_root / 'materials', ts_root / 'materials', dirs_exist_ok=True)
    for path in sorted((root / 'src/locales/lessons').glob(prefix + '*.zh.json')):
        data = json.loads(path.read_text())
        data.pop('codeVariants', None)
        for section in data['sections']:
            for block in section.get('codeBlocks', []):
                source = js_root / block['label']
                if source.is_file():
                    block['code'] = source.read_text().rstrip()
        sections = copy.deepcopy(data['sections'])
        for section in sections:
            section['body'] = section['body'].replace('.js', '.ts').replace(folder + ' 文件夹', folder + '-ts 文件夹')
            for block in section.get('codeBlocks', []):
                block['label'] = block['label'].replace('.js', '.ts')
                if block['language'] == 'javascript':
                    block['language'] = 'typescript'
                    block['code'] = (ts_root / block['label']).read_text().rstrip()
                elif block['language'] == 'bash':
                    block['code'] = block['code'].replace('.js', '.ts')
            if 'download' in section:
                section['download'] = {'href': f'/downloads/{folder}-ts.zip', 'label': '下载 TypeScript 示例（ZIP）'}
        if sections != data['sections']:
            data['codeVariants'] = {'ts': {'sections': sections}}
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    for directory in [js_root, ts_root]:
        paths = list((directory / 'src').glob('*')) + [directory / n for n in ['README.md', 'package.json', 'pnpm-lock.yaml', '.env.example', '.gitignore']]
        if (directory / 'materials').exists():
            paths += list((directory / 'materials').rglob('*'))
        with zipfile.ZipFile(root / f'public/downloads/{directory.name}.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
            for path in sorted(paths):
                if path.is_file():
                    archive.write(path, str(path.relative_to(directory.parent)))
print('Chapters 11–13 JS/TS content, materials and downloads synchronized.')
