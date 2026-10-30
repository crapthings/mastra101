"""Keep chapters 11–22 source, language variants, materials and downloads aligned."""
import copy
import json
import re
import shutil
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]


def typescript_text(text):
    """Convert exact .js extensions while preserving JSON files and the Node.js name."""
    return re.sub(r'\.js\b', '.ts', text).replace('Node.ts', 'Node.js')

for folder, prefix in [('11-skills', 'skill-'), ('12-workspace', 'workspace-'), ('13-sandbox', 'sandbox-'), ('14-subagents', 'subagent-'), ('15-connections', 'connection-'), ('16-observability', 'observe-'), ('17-evals', 'eval-'), ('18-server', 'server-'), ('19-auth', 'auth-'), ('20-deployment', 'deploy-'), ('21-rag', 'rag-'), ('22-harness', 'harness-')]:
    js_root = root / 'examples' / folder
    ts_root = root / 'examples' / (folder + '-ts')
    (ts_root / 'src').mkdir(parents=True, exist_ok=True)
    for source in sorted((js_root / 'src').glob('*.js')):
        (ts_root / 'src' / source.with_suffix('.ts').name).write_text(source.read_text().replace(".js'", ".ts'"))
    metadata = ['README.md', 'package.json', 'pnpm-lock.yaml', '.env.example', '.gitignore']
    for optional in ['pnpm-workspace.yaml', 'Dockerfile', '.dockerignore']:
        if (js_root / optional).exists():
            metadata.append(optional)
    for name in [name for name in metadata if name != 'README.md']:
        if name == 'Dockerfile':
            (ts_root / name).write_text(typescript_text((js_root / name).read_text()))
        else:
            (ts_root / name).write_bytes((js_root / name).read_bytes())
    (ts_root / 'README.md').write_text(typescript_text((js_root / 'README.md').read_text().replace('默认 JavaScript', '此包使用 TypeScript')))
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
            section['body'] = typescript_text(section['body']).replace(folder + ' 文件夹', folder + '-ts 文件夹')
            for block in section.get('codeBlocks', []):
                block['label'] = typescript_text(block['label'])
                if block['language'] == 'javascript':
                    block['language'] = 'typescript'
                    block['code'] = (ts_root / block['label']).read_text().rstrip()
                elif block['language'] == 'dockerfile':
                    block['code'] = (ts_root / block['label']).read_text().rstrip()
                elif block['language'] == 'bash':
                    block['code'] = typescript_text(block['code'])
            if 'download' in section:
                section['download'] = {'href': f'/downloads/{folder}-ts.zip', 'label': '下载 TypeScript 示例（ZIP）'}
        if sections != data['sections']:
            data['codeVariants'] = {'ts': {'sections': sections}}
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    for directory in [js_root, ts_root]:
        paths = list((directory / 'src').glob('*')) + [directory / name for name in metadata]
        if (directory / 'materials').exists():
            paths += list((directory / 'materials').rglob('*'))
        archive_path = root / f'public/downloads/{directory.name}.zip'
        contents = {str(path.relative_to(directory.parent)): path.read_bytes() for path in sorted(paths) if path.is_file()}
        if archive_path.exists():
            with zipfile.ZipFile(archive_path) as archive:
                if set(archive.namelist()) == set(contents) and all(archive.read(name) == data for name, data in contents.items()):
                    continue
        with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as archive:
            for path in sorted(paths):
                if path.is_file():
                    archive.write(path, str(path.relative_to(directory.parent)))
print('Chapters 11–22 JS/TS content, materials and downloads synchronized.')
