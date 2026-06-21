#!/bin/bash
# generate-voice.sh — Generate voiceover cho clip bằng giọng GoldenSea chuẩn
#
# USAGE:
#   ./scripts/generate-voice.sh "Nội dung cần đọc" output-name.wav [duration_seconds]
#
# EXAMPLES:
#   ./scripts/generate-voice.sh "Vàng giảm 57 đô trong 48 tiếng." gold-news-voice.wav 40
#   ./scripts/generate-voice.sh "Bitcoin vừa phá đỉnh 100k đô." btc-news-voice.wav 40
#
# Output sẽ được lưu vào public/<output-name>.wav và sẵn sàng dùng trong Remotion.

set -e

OMNI_INFER="/Users/uyentruongtu/Library/Application Support/com.debpalash.omnivoice-studio/project/.venv/bin/omnivoice-infer"
VOICE_REF="$(dirname "$0")/../public/voices/goldensea-voice.mp3"
PUBLIC_DIR="$(dirname "$0")/../public"

TEXT="$1"
OUTPUT_NAME="$2"
DURATION="${3:-}"

if [ -z "$TEXT" ] || [ -z "$OUTPUT_NAME" ]; then
  echo "Usage: $0 \"text to speak\" output-name.wav [duration_seconds]"
  exit 1
fi

OUTPUT_PATH="$PUBLIC_DIR/$OUTPUT_NAME"

echo "Voice ref : $VOICE_REF"
echo "Output    : $OUTPUT_PATH"
echo "Text      : ${TEXT:0:80}..."
echo ""

DURATION_ARG=""
if [ -n "$DURATION" ]; then
  DURATION_ARG="--duration $DURATION"
fi

"$OMNI_INFER" \
  --text "$TEXT" \
  --ref_audio "$VOICE_REF" \
  --language "Vietnamese" \
  $DURATION_ARG \
  --output "$OUTPUT_PATH"

echo ""
echo "Done: $OUTPUT_PATH"
echo "Use in Remotion: staticFile('$OUTPUT_NAME')"
