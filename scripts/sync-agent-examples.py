"""Keep chapter 07 source listings, language variants, and downloads aligned."""
import copy
import json
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
js_root = root / 'examples/07-agents'
ts_root = root / 'examples/07-agents-ts'
(ts_root / 'src').mkdir(parents=True, exist_ok=True)

# All examples use shared syntax; only local import paths differ in TypeScript.
for source in sorted((js_root / 'src').glob('*.js')):
    target = ts_root / 'src' / source.with_suffix('.ts').name
    target.write_text(source.read_text().replace(".js'", ".ts'"))
for name in ['package.json', 'pnpm-lock.yaml', '.env.example', '.gitignore']:
    (ts_root / name).write_bytes((js_root / name).read_bytes())
(ts_root / 'README.md').write_text(js_root.joinpath('README.md').read_text()
    .replace('默认 JavaScript', '此包使用 TypeScript')
    .replace('.js', '.ts'))

# Refresh source listings and derive complete section variants from the JS text.
for file in sorted((root / 'src/locales/lessons').glob('agent-*.zh.json')):
    data = json.loads(file.read_text())
    data.pop('codeVariants', None)
    for section in data['sections']:
        for block in section.get('codeBlocks', []):
            source = js_root / block['label']
            if block['label'].startswith('src/') and source.is_file():
                block['code'] = source.read_text().rstrip()
    ts_sections = copy.deepcopy(data['sections'])
    for section in ts_sections:
        section['body'] = section['body'].replace('.js', '.ts').replace('07-agents 文件夹', '07-agents-ts 文件夹')
        for block in section.get('codeBlocks', []):
            block['label'] = block['label'].replace('.js', '.ts')
            if block['language'] == 'javascript':
                block['language'] = 'typescript'
                block['code'] = (ts_root / block['label']).read_text().rstrip()
            elif block['language'] == 'bash':
                block['code'] = block['code'].replace('.js', '.ts')
        if 'download' in section:
            section['download'] = {'href': '/downloads/07-agents-ts.zip', 'label': '下载 TypeScript 示例（ZIP）'}
    if ts_sections != data['sections']:
        data['codeVariants'] = {'ts': {'sections': ts_sections}}
    file.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

# Publish only the explicit source set, never credentials, databases or dependencies.
for directory in [js_root, ts_root]:
    with zipfile.ZipFile(root / f'public/downloads/{directory.name}.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
        paths = list((directory / 'src').glob('*')) + [directory / name for name in ['README.md', 'package.json', 'pnpm-lock.yaml', '.env.example', '.gitignore']]
        for path in sorted(paths):
            if path.is_file():
                archive.write(path, str(path.relative_to(directory.parent)))
print('Chapter 07 JS/TS listings and downloads synchronized.')
