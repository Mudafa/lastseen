#!/usr/bin/env bash
cd "$(dirname "$0")"
if [[ ! -d .venv ]]; then
  echo "Creating virtualenv..."
  python3 -m venv .venv
  .venv/bin/pip install -r requirements.txt
fi
exec .venv/bin/uvicorn main:app --reload --host 0.0.0.0 --port 8000
