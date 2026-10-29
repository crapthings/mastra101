"""Synchronize this tutorial's explicit JS alternative and its downloadable files."""
import copy
import json
import re
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
ts_root = root / 'examples/03-time-assistant'
js_root = root / 'examples/03-time-assistant-js'
js_root.mkdir(exist_ok=True)

# The only TypeScript-only syntax in this small example is a parameter type and literal assertions.
for source in sorted((ts_root / 'src').rglob('*.ts')):
    relative = source.relative_to(ts_root).with_suffix('.js')
    target = js_root / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    code = source.read_text().replace('(timeZone: string)', '(timeZone)').replace(' as const', '')
    code = re.sub(r"(from ['\"][^'\"]+)\.ts(['\"])", r'\1.js\2', code)
    target.write_text(code)

package = json.loads((ts_root / 'package.json').read_text())
package['name'] = 'mastra-time-assistant-js'
package['scripts'] = {
    'basic': 'node --env-file=.env src/basic.js',
    'start': 'node --env-file=.env src/run.js',
    'clock': 'node src/clock.js'
}
package.pop('devDependencies', None)
(js_root / 'package.json').write_text(json.dumps(package, ensure_ascii=False, indent=2) + '\n')
for name in ['.gitignore', '.env.example']:
    (js_root / name).write_bytes((ts_root / name).read_bytes())
readme = (ts_root / 'README.md').read_text().replace('03-time-assistant', '03-time-assistant-js')
readme = readme.replace('.ts', '.js').replace('TypeScript', 'JavaScript')
readme = readme.replace('# 旅行时间助手', '# 旅行时间助手（JavaScript）', 1)
(js_root / 'README.md').write_text(readme)

keys = ['understanding', 'providers', 'setup', 'first', 'time-tool', 'execution', 'troubleshooting']
for key in keys:
    file = root / f'src/locales/lessons/{key}.zh.json'
    base = json.loads(file.read_text())
    base.pop('codeVariants', None)
    js = copy.deepcopy(base)
    for section in js['sections']:
        section['title'] = section['title'].replace('.ts', '.js')
        section['body'] = section['body'].replace('.ts', '.js')
        section['body'] = section['body'].replace('03-time-assistant', '03-time-assistant-js')
        section['body'] = section['body'].replace('，tsx 运行 TypeScript', '，JavaScript 文件由 Node.js 直接运行')
        if 'table' in section:
            section['table']['rows'] = [[cell.replace('.ts', '.js') for cell in row] for row in section['table']['rows']]
        if 'download' in section:
            section['download'] = {'href': '/downloads/03-time-assistant-js.zip', 'label': '下载 JavaScript 示例（ZIP）'}
        for block in section.get('codeBlocks', []):
            if block['label'] == '终端':
                block['language'] = 'bash'
                continue
            original = '.env.example' if block['label'].startswith('.env') else block['label']
            relative = original.replace('.ts', '.js')
            target = js_root / relative
            if target.is_file():
                block['label'] = block['label'].replace('.ts', '.js')
                block['code'] = target.read_text().rstrip()
                block['language'] = 'javascript' if relative.endswith('.js') else ('json' if relative.endswith('.json') else 'bash')
    js['note'] = js['note'].replace('.ts', '.js')
    for section in base['sections']:
        if 'download' in section:
            section['download']['label'] = '下载 TypeScript 示例（ZIP）'
        for block in section.get('codeBlocks', []):
            original = '.env.example' if block['label'].startswith('.env') else block['label']
            target = ts_root / original
            if target.is_file():
                block['code'] = target.read_text().rstrip()
            block['language'] = 'typescript' if original.endswith('.ts') else ('json' if original.endswith('.json') else 'bash')
    changes = {field: js[field] for field in ['sections', 'note'] if js[field] != base[field]}
    if changes:
        base['codeVariants'] = {'js': changes}
    file.write_text(json.dumps(base, ensure_ascii=False, indent=2) + '\n')

# Only public source files, environment templates and locks belong in the archives.
for directory in [ts_root, js_root]:
    with zipfile.ZipFile(root / f'public/downloads/{directory.name}.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(directory.rglob('*')):
            relative = path.relative_to(directory)
            if not path.is_file() or 'node_modules' in relative.parts or path.name == '.env':
                continue
            if relative.parts[0] == 'src' or relative.as_posix() in ['README.md', 'package.json', 'pnpm-lock.yaml', '.env.example', '.gitignore']:
                archive.write(path, str(path.relative_to(directory.parent)))
print('JavaScript files, lesson variants and both archives synchronized.')
