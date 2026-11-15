#!/usr/bin/env bash
# Prepara as mídias do site Dentalis a partir das pastas originais.
# Os arquivos originais NÃO são alterados: tudo é gerado dentro do site.
# Uso (Git Bash):  bash tools/preparar_midia.sh
set -euo pipefail

SITE="$(cd "$(dirname "$0")/.." && pwd)"
IMG_SRC="$SITE/midia-original/imagens"
VID_SRC="$SITE/midia-original/videos"
FF="ffmpeg -v error -y"

cd "$SITE"
mkdir -p img video frames/desktop frames/mobile

webp() { # entrada, largura, saída, [filtro extra antes da escala]
  local pre="${4:-}"; [ -n "$pre" ] && pre="$pre,"
  $FF -i "$1" -vf "${pre}scale=$2:-2:flags=lanczos" -c:v libwebp -quality 80 "$3"
}

# ---- Fotos -------------------------------------------------------------
if [ ! -d "$IMG_SRC" ]; then
  echo "AVISO: pasta '$IMG_SRC' não encontrada; fotos puladas."
else
webp "$IMG_SRC/imagem 1.jpeg" 1600 img/imagem-1-1600.webp
webp "$IMG_SRC/imagem 1.jpeg" 900  img/imagem-1-900.webp
webp "$IMG_SRC/imagem 2.jpeg" 900  img/imagem-2-900.webp
webp "$IMG_SRC/imagem 2.jpeg" 600  img/imagem-2-600.webp
# imagem 4: tira a faixa escura da esquerda e o brilho neon do canto direito
webp "$IMG_SRC/imagem 4.jpeg" 1340 img/imagem-4-1340.webp "crop=1340:900:40:0"
webp "$IMG_SRC/imagem 4.jpeg" 800  img/imagem-4-800.webp  "crop=1340:900:40:0"
FOTO6="$IMG_SRC/WhatsApp Image 2026-11-15 at 17.52.36.jpeg"
webp "$FOTO6" 1600 img/foto-nova-1600.webp
webp "$FOTO6" 900  img/foto-nova-900.webp "crop=1000:900:150:0"
# Imagem para compartilhamento (WhatsApp, redes): JPEG 1200x630
$FF -i "$IMG_SRC/imagem 1.jpeg" -vf "scale=1200:-2,crop=1200:630" -q:v 4 img/compartilhar.jpg
fi

# ---- Vídeos (sem áudio, prontos para web) ------------------------------
# video 2: usa o corte feito em "editado" (começa em 1,75 s, sem a fala)
$FF -i "$VID_SRC/editado/video 2 - corte.mp4" -an -c:v libx264 -preset slow -crf 24 \
    -pix_fmt yuv420p -movflags +faststart video/video-2.mp4
$FF -i "$VID_SRC/video 3.mp4" -an -c:v libx264 -preset slow -crf 24 \
    -pix_fmt yuv420p -movflags +faststart video/video-3.mp4
for v in 2 3; do
  $FF -i video/video-$v.mp4 -frames:v 1 -c:v libwebp -quality 82 video/video-$v-inicio.webp
  $FF -sseof -0.08 -i video/video-$v.mp4 -frames:v 1 -c:v libwebp -quality 82 video/video-$v-fim.webp
done

# ---- Quadros do video 1 (sequência guiada pela rolagem) ----------------
rm -f frames/desktop/*.webp frames/mobile/*.webp
# Computador: corta 70 px do topo (ar-condicionado do teto), 16 quadros/s
$FF -i "$VID_SRC/video 1.mp4" -vf "crop=1280:650:0:70,fps=16" \
    -c:v libwebp -quality 72 frames/desktop/q_%03d.webp
# Celular: recorte sobre o balcão, 12 quadros/s
# (enquadramento mais aberto, 6:5, para a metade de cima da tela do celular)
$FF -i "$VID_SRC/video 1.mp4" -vf "crop=792:640:420:80,scale=660:-2,fps=12" \
    -c:v libwebp -quality 66 frames/mobile/q_%03d.webp

echo "desktop: $(ls frames/desktop | wc -l) quadros, $(du -sh frames/desktop | cut -f1)"
echo "mobile:  $(ls frames/mobile | wc -l) quadros, $(du -sh frames/mobile | cut -f1)"
du -sh img video
