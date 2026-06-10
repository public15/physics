#!/bin/bash
cd "$(dirname "$0")"
echo "正在启动 Python 本地静态服务..."
python3 -m http.server 8000
