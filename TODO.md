# TODO – Document QA + Fraud & Anomaly Detection Platform

## Phase 0 – Repo & Infra Skeleton

- [x] Create repo structure (`backend/`, `frontend/`, `infra/`, `datasets/`, `docs/`)
- [x] Initialize backend (NestJS + TypeScript)
- [ ] Initialize Prisma and add base `schema.prisma`
- [X] Initialize frontend (React + Vite + TS)
- [X] Create `infra/docker-compose.yml` with:
  - [X] PostgreSQL
  - [X] Kafka (and ZooKeeper or compatible)
- [ ] Add `.env.example` files (DB URL, Kafka config, AI API key placeholders)
- [X] Fill out `README.md` and this `TODO.md`
- [X] Create architecture documentation

---

## Phase 1 – Backend Core (NestJS + Prisma)

- [ ] Implement `PrismaModule` and `PrismaService`
- [ ] Implement `UsersModule` (minimal, just enough for ownership)
- [ ] Implement `DocumentsModule`:
  - [ ] `POST /documents/upload` (multipart file upload)
  - [ ] `GET /documents` – list documents with basic metadata
  - [ ] `GET /documents/:id` – fetch document + basic info
- [ ] Wire NestJS logging and basic error handling
- [ ] Run Prisma migrations and test DB connection

---

## Phase 2 – Frontend Basics

- [ ] Create layout (Navbar + basic layout component)
- [ ] Implement `DocumentsPage`:
  - [ ] Fetch and render documents list
  - [ ] Show basic fields (filename, type, upload date, risk)
- [ ] Implement `DocumentUpload` component:
  - [ ] File input + upload button
  - [ ] Call backend upload endpoint
  - [ ] Refresh document list on success
- [ ] Implement `DocumentDetailPage` (initial):
  - [ ] Route `/:documentId`
  - [ ] Fetch and display document details (no transactions yet)

---

## Phase 3 – Parsing PDFs into Transactions

- [ ] Add Kafka producer on backend after upload:
  - [ ] Send `documents_uploaded` event to Kafka
- [ ] Create `streaming/kafka` module:
  - [ ] `KafkaModule` & `KafkaService` for producing/consuming
- [ ] Implement `doc-parser.consumer`:
  - [ ] Consume `documents_uploaded`
  - [ ] Use `pdfplumber` (or similar) in a small worker (Node or Python) to parse sample statements
  - [ ] Normalise to transaction rows (`document_transactions` table)
- [ ] Extend `DocumentDetailPage`:
  - [ ] Show parsed transactions in a table
  - [ ] Basic filters (by date, amount)

---

## Phase 4 – Document-Based Anomaly Detection

- [ ] Implement `AnomaliesModule`:
  - [ ] Service that can compute anomalies for a document
  - [ ] `GET /documents/:id/anomalies`
- [ ] Add simple anomaly logic:
  - [ ] Rule-based detection: amount > K × median, abnormal patterns
  - [ ] Compute `DocumentRiskSummary` (LOW / MEDIUM / HIGH)
- [ ] Store anomalies in `anomaly_events` table (`sourceType = DOCUMENT`)
- [ ] Show anomalies in the UI:
  - [ ] Highlight flagged transactions (e.g. red row)
  - [ ] Show `overallRisk` badge on documents list

---

## Phase 5 – Streaming Transactions & Real-Time Fraud Alerts

- [ ] Add dataset in `datasets/transactions/` (e.g. credit card fraud CSV)
- [ ] Implement `txn-replay.producer`:
  - [ ] Read CSV and send events to `transactions_raw` topic
- [ ] Implement `stream-enricher.consumer`:
  - [ ] Consume `transactions_raw`
  - [ ] Compute simple rolling features per account
  - [ ] Persist `live_transactions`
- [ ] Extend `fraud.consumer`:
  - [ ] Run anomaly detection on live transactions
  - [ ] Write `anomaly_events` (`sourceType = LIVE_STREAM`)
- [ ] Frontend:
  - [ ] Implement `LiveAlertsPage`
  - [ ] List recent anomalies with filters (account, severity, time)

---

## Phase 6 – AI Assistant Integration

- [ ] Implement `AiAssistantModule`:
  - [ ] `POST /ai/explain-document/:documentId`
  - [ ] Load document + transactions + anomalies
  - [ ] Build structured prompt
  - [ ] Call LLM provider (abstracted behind simple interface)
- [ ] Frontend:
  - [ ] `AiExplanationPanel` on `DocumentDetailPage`
  - [ ] Button: “Explain anomalies” → show LLM response
- [ ] (Optional) Add basic chat history:
  - [ ] `AiConversation` + `AiMessage` tables
  - [ ] Conversation view in UI

---

## Phase 7 – Polish & Extras

- [ ] Improve UI styling (consistent spacing, typography, colors)
- [ ] Add loading and error states on frontend
- [ ] Add basic unit tests for services (backend)
- [ ] Add simple end-to-end flow test (upload → parse → anomalies)
- [ ] Capture final architecture diagrams:
  - [ ] High-level system diagram
  - [ ] Streaming dataflow diagram
- [ ] Update README with screenshots / GIF demo