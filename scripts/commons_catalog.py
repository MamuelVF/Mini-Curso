#!/usr/bin/env python3
"""Catálogo de imágenes de Wikimedia Commons para el curso.

Lee scripts/commons_lista.json, consulta la API de Commons (autor, licencia exacta y enlaces),
rechaza cualquier licencia que no sea dominio público, CC0, CC BY o CC BY-SA, descarga una
miniatura a public/img/commons/ y regenera src/content/imagenes.json (conservando las entradas
que no son de Commons, como las de NotebookLM o las generadas con IA).

Uso:  python3 scripts/commons_catalog.py           (consulta y descarga)
      python3 scripts/commons_catalog.py --sin-descargar
Solo usa la biblioteca estándar de Python.
"""
import json, os, re, sys, shutil, subprocess, tempfile, urllib.parse, urllib.request, datetime

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LISTA = os.path.join(RAIZ, 'scripts', 'commons_lista.json')
SALIDA = os.path.join(RAIZ, 'src', 'content', 'imagenes.json')
CARPETA = os.path.join(RAIZ, 'public', 'img', 'commons')
API = 'https://commons.wikimedia.org/w/api.php'
UA = 'CursoCorazonYCancer/1.0 (proyecto educativo; https://biovinces.com)'
PERMITIDAS = re.compile(r'^(Public domain|CC0|CC BY(-SA)? \d\.\d)', re.I)
ANCHO = 900
ANCHO_GIF = 480  # los GIF animados se piden a 480 px (Commons los sirve animados) y se pasan a WebP animado


def pedir(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def limpiar(html):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', html or '')).strip()


def consultar(titulos, ancho=ANCHO, lote=25):
    """Pide la información en lotes: la API de Commons acepta como mucho 50 títulos por consulta."""
    res = {}
    for i in range(0, len(titulos), lote):
        parte = titulos[i:i + lote]
        q = {'action': 'query', 'format': 'json', 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|mime',
             'iiurlwidth': str(ancho), 'iiextmetadatafilter': 'LicenseShortName|LicenseUrl|Artist',
             'titles': '|'.join('File:' + t for t in parte)}
        datos = json.loads(pedir(API + '?' + urllib.parse.urlencode(q)))
        if 'query' not in datos:
            raise RuntimeError('Commons respondió sin resultados: ' + json.dumps(datos.get('error', datos))[:300])
        norm = {n['to']: n['from'] for n in datos['query'].get('normalized', [])}
        for p in datos['query']['pages'].values():
            original = norm.get(p['title'], p['title']).replace('File:', '')
            res[original] = p.get('imageinfo', [None])[0]
    return res


def main():
    descargar = '--sin-descargar' not in sys.argv
    lista = json.load(open(LISTA, encoding='utf-8'))
    info = consultar([x['archivo_commons'] for x in lista if not x['archivo_commons'].lower().endswith('.gif')])
    gifs = [x['archivo_commons'] for x in lista if x['archivo_commons'].lower().endswith('.gif')]
    if gifs:
        info.update(consultar(gifs, ANCHO_GIF))
    hay_ffmpeg = shutil.which('ffmpeg') is not None
    hoy = datetime.date.today().isoformat()
    os.makedirs(CARPETA, exist_ok=True)
    nuevas, errores = [], []
    for x in lista:
        ii = info.get(x['archivo_commons'])
        if not ii:
            errores.append(f"{x['id']}: no existe en Commons"); continue
        m = ii['extmetadata']
        lic = m.get('LicenseShortName', {}).get('value', '')
        if not PERMITIDAS.match(lic):
            errores.append(f"{x['id']}: licencia no permitida ({lic})"); continue
        es_gif = ii['mime'] == 'image/gif'
        ext = ('.webp' if hay_ffmpeg else '.gif') if es_gif else '.png' if ii['mime'] in ('image/svg+xml', 'image/png') else '.jpg'
        archivo = f"img/commons/{x['id']}{ext}"
        if descargar:
            datos = pedir(ii.get('thumburl') or ii['url'])
            destino = os.path.join(RAIZ, 'public', archivo)
            if es_gif and hay_ffmpeg:
                with tempfile.NamedTemporaryFile(suffix='.gif') as t:
                    t.write(datos); t.flush()
                    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', t.name, '-loop', '0', '-quality', '70',
                                    '-c:v', 'libwebp_anim', destino], check=True)
            else:
                with open(destino, 'wb') as f:
                    f.write(datos)
        e = {'id': x['id'], 'archivo': archivo, 'titulo': x['titulo'], 'alt': x['alt'], 'origen': 'commons',
             'autor': limpiar(m.get('Artist', {}).get('value')) or 'Autor no indicado en Commons',
             'licencia': 'Dominio público' if lic.lower().startswith('public domain') else lic,
             'urlOrigen': ii['descriptionurl'], 'consultado': hoy}
        if m.get('LicenseUrl', {}).get('value'):
            e['urlLicencia'] = m['LicenseUrl']['value']
        nuevas.append(e)
    previas = json.load(open(SALIDA, encoding='utf-8')) if os.path.exists(SALIDA) else []
    otras = [i for i in previas if i.get('origen') != 'commons']
    json.dump(nuevas + otras, open(SALIDA, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'{len(nuevas)} imágenes de Commons catalogadas' + (' y descargadas' if descargar else ''))
    for e in errores:
        print('AVISO', e)
    return 1 if errores else 0


if __name__ == '__main__':
    sys.exit(main())
