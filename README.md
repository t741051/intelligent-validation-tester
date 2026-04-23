# Intelligent Validation Tester (IVT)

O-RAN 架構資料與 AI 表現驗證儀表板。

對照設計文件：`/home/test/智慧驗證tester架構/` v2.0（2026-04-17）。

## Stack

- Frontend：Next.js 15 (App Router) + TypeScript + Tailwind + TanStack Query + Zustand
- Backend：Django 5 + DRF + Channels (Daphne) + Celery + django-filter + drf-spectacular
- Data：PostgreSQL 16 + TimescaleDB / Redis 7 / MinIO
- Media：MediaMTX（RTSP → HLS 轉流）
- Reverse Proxy：nginx

## 目錄結構

```
intelligent-validation-tester/
├── backend/            # Django 專案（apps/*、config/、core/）
├── frontend/           # Next.js 專案（src/app、components、services、hooks、stores）
├── deploy/             # docker-compose.yml、nginx.conf
├── media-server/       # mediamtx.yml
└── docs/               # 開發過程產出文件（可選）
```

## 快速開始（docker-compose）

```bash
# 1. 複製環境變數範本
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 2. 啟動全部服務
cd deploy && docker compose up -d --build

# 3. 初始化資料庫 & 建立管理員
docker compose exec backend-web python manage.py migrate
docker compose exec backend-web python manage.py createsuperuser

# 4. 開啟瀏覽器
#    前台：http://localhost:8080/           （經 nginx）
#    Django Admin：http://localhost:8080/admin/
#    API Docs：http://localhost:8080/api/docs/
```

本地開發（不經 docker）：

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
# 另開 terminal：daphne -p 8001 config.asgi:application
# 另開 terminal：celery -A config worker -l info

# Frontend
cd frontend
npm install
npm run dev
```

## Mock 雙軌制

前後端預設都走 Mock，可以在完全沒有 O-RAN 硬體的情況下跑完整功能。

- 前端：`NEXT_PUBLIC_USE_MOCK=true`（`frontend/.env.local`）
- 後端：`USE_MOCK_CONNECTORS=true`（`backend/.env`）

真連線時將兩者設為 `false`。

## 階段進度

- [x] Phase 0：骨架（本倉庫目前狀態）
- [ ] Phase 1：認證 + 總覽 + DUT 管理 MVP
- [ ] Phase 2：介面驗證（O1/A1/E2 Mock → 真連）
- [ ] Phase 3：資料驗證（策略 + Celery + WebSocket）
- [ ] Phase 4：智能驗證（Baseline / Benchmark / Score）
- [ ] Phase 5：測試情境 + 影像串流
- [ ] Phase 6：報告 + 匯出

## 文件

- 系統架構總覽：`../智慧驗證tester架構/01_系統架構總覽.md`
- 前端設計：`../智慧驗證tester架構/02_前端設計文件.md`
- 後端設計：`../智慧驗證tester架構/03_後端設計文件.md`
