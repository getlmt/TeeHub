## Phân công công việc Backend (Spring) và ML (Python) cho 4 người

### Nhân sự và phạm vi
- Person A — Spring Core 1 (Auth/Users, Contracts, Files, Designs CRUD)
- Person B — Spring Core 2 (Catalog/Cart/Orders, Jobs, AI Gateway)
- Person C — Python ML Services (Render/Try-on, model stub, workers)
- Person D — Infra/Observability/CI-CD + QA Integration

---

### Person A (Spring Core 1)
- Auth & Users
  - JWT access/refresh, rotation, RBAC
  - Endpoints: POST `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, GET `/users/me`, Admin CRUD `/users`
  - Deliverables: Security config, token service, refresh store (Redis)
- Common contracts
  - Response envelope `{ data, pagination?, error? }`, error codes, exception handlers
  - springdoc OpenAPI base, example schemas
- Files
  - Presigned URLs S3/MinIO: POST `/files/presign-upload`, GET `/files/{id}`
  - Metadata entity/repo, permission checks
- Designs CRUD & Templates (base)
  - CRUD `Design`, `Template` (chưa bao gồm export)
- Shared DTOs
  - Định nghĩa DTOs chung cho jobs và webhooks

### Person B (Spring Core 2)
- Catalog
  - Entities: `Product`, `Variant`, `Category`, `Asset`
  - GET `/products`, `/products/{id}`, filters, pagination; Admin CRUD; liên kết ảnh qua presign
- Cart & Checkout & Orders
  - Guest cart via cookie, merge-on-login
  - POST `/checkout` → tạo `Order` trạng thái pending; GET `/orders`, `/orders/{id}`
- Jobs Service
  - Persist job states, GET `/jobs/{id}`, enums: queued/processing/succeeded/failed
  - Webhook handlers: POST `/webhooks/render`, POST `/webhooks/ai/try-on`
- AI Gateway
  - POST `/ai/try-on` validate inputs, enqueue payload cho Python
  - Rate limit + input validation

### Person C (Python ML Services)
- Render Service (FastAPI + worker)
  - POST `/internal/render` (nhận design JSON, assets), trả 202 `{ jobId }`
  - Worker render → upload S3 → callback Spring webhook
  - Stub renderer (Pillow/OpenCV) giai đoạn đầu
- Try-on Service (FastAPI + worker)
  - POST `/internal/try-on` (personImageUrl, designExportUrl|designJson, options), 202 `{ jobId }`
  - Worker pipeline stub (segmentation/warping/composite), upload S3, callback
- Shared components
  - Auth middleware: xác thực JWT nội bộ từ Spring
  - Pydantic models, retries/timeouts, structured logging

### Person D (Infra/Observability/CI-CD + QA)
- Infra
  - Docker Compose: Postgres, Redis, MinIO, các services
  - Env/config management, secrets, local profiles
- Observability
  - Correlation-ID filter, JSON logs, Prometheus metrics, health checks
  - Dashboards (Grafana tuỳ chọn)
- Queue/Redis setup
  - Tên queue, retry policy, idempotency keys, dead-letter strategy
- CI/CD
  - Pipelines build/test/lint cho Java/Python; multi-env deploy stubs
- QA Integration
  - E2E flow: Export Design job và AI Try-on; Postman/Insomnia collection, mock data

---

### Kế hoạch Sprint (2 tuần mỗi sprint)
Sprint 1
- A: Auth/Users, Common contracts, OpenAPI base
- B: Catalog (read endpoints), Cart skeleton, Jobs entity + GET `/jobs/{id}`
- C: FastAPI skeletons, `/internal/render` 202 stub, worker loop, S3 upload mock
- D: Docker compose (PG/Redis/MinIO), logging, health checks, basic CI

Sprint 2
- A: Files presign, Designs CRUD, Templates read
- B: Cart full + Checkout pending Order, Webhook handlers wired to Jobs
- C: Render worker lưu S3 và webhook Spring; basic composition
- D: Queue config, idempotency, metrics dashboards, E2E test Export flow

Sprint 3
- A: RBAC admin endpoints, refine validations/errors
- B: Orders list/mine/admin, AI Gateway POST `/ai/try-on`
- C: Try-on worker stub, webhook integration
- D: CI cho Python workers, load tests nhẹ, Postman tests for try-on

Sprint 4
- A: Hardening security, rate limiting, polish OpenAPI
- B: Catalog admin CRUD, filters/sorts, edge cases
- C: Cải thiện chất lượng try-on, timeouts/retries
- D: Release pipeline, staging smoke tests, incident playbooks

---

### Phụ thuộc chính
- B phụ thuộc A: Contracts + Security hoàn tất trước khi mở webhooks/public APIs
- C phụ thuộc D: Redis/S3 + JWT nội bộ; phụ thuộc B: Job/webhook URLs
- D chạy song song nhưng cần A/B cung cấp OpenAPI và env requirements

### Deliverables mỗi module
- Source + unit tests
- OpenAPI cập nhật
- Postman collection + example payloads
- Env sample `.env.example` và hướng dẫn Docker
- README module với runbook


