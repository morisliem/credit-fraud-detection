# Document QA + Fraud & Anomaly Detection Platform

A portfolio project that combines **backend engineering**, **streaming data**, and **AI/ML**:

- Upload **financial documents** (e.g. bank statements) and automatically:
  - parse transactions
  - detect suspicious / anomalous entries
  - compute a document-level risk score
- Ingest **real-time transaction streams** (simulated from a public fraud dataset) and flag fraud-like behaviour as it happens.
- Provide an **AI assistant** that explains *why* certain transactions or documents are suspicious, in natural language.

The goal is to showcase:
- Node.js backend (NestJS + Prisma + PostgreSQL)
- Real-time streaming with Kafka
- Basic ML for anomaly detection (rules + IsolationForest-style logic)
- Clean full-stack architecture with a React frontend
- System design thinking (scalability, streaming, decoupling)

---

## High-Level Features

- 📄 **Document Upload & Parsing**
  - Upload PDF bank statements
  - Parse them into structured transactions
  - Store documents and transactions in PostgreSQL

- 🚨 **Fraud / Anomaly Detection**
  - Rule-based and ML-based anomaly scoring
  - Per-transaction anomaly events
  - Document-level risk summaries (LOW / MEDIUM / HIGH)

- ⚡ **Real-Time Transaction Stream**
  - Replay a public fraud dataset into Kafka
  - Enrich live transactions with rolling features
  - Detect anomalies on the stream and surface alerts in the UI

- 🤖 **AI Assistant for Explanations**
  - API endpoint to “explain this document”
  - Combines parsed data + anomalies into a prompt
  - Returns an explanation of what looks risky and why

---

## Architecture Overview

**Core components:**

- **Frontend (React + Vite)**
  - Documents list and upload page
  - Document detail view with transactions & anomaly flags
  - Live Alerts page for streaming fraud events
  - AI explanation panel on the document detail page

- **Backend (Node.js + NestJS + TypeScript)**
  - REST APIs for documents, transactions, anomalies, and AI assistant
  - Business logic services for parsing, risk scoring, and aggregation

- **Database (PostgreSQL via Prisma)**
  - `users`, `documents`, `document_transactions`
  - `live_transactions`, `anomaly_events`, `document_risk_summary`
  - Stracth goal `ai_conversation` and `ai_message` for chat history

- **Streaming (Kafka)**
  - Topics:
    - `documents_uploaded`
    - `transactions_raw`
    - `transactions_features`
    - `fraud_alerts` (optional)
  - Consumers:
    - `doc-parser` – parse PDFs into transactions
    - `stream-enricher` – compute rolling features
    - `fraud-engine` – anomaly detection, writes `anomaly_events`

- **AI/ML**
  - Transaction-level anomaly scoring
  - Document-level risk aggregation
  - LLM-based assistant to explain anomalies

A more detailed architecture diagram lives in [`docs/architecture`](./docs/architecture).

---

## Tech Stack

**Backend**

- Node.js, TypeScript
- NestJS
- Prisma ORM
- PostgreSQL
- Kafka (or compatible, e.g. Redpanda)
- Jest (tests – later)

**Frontend**

- React + TypeScript
- Vite
- Lightweight component structure (no heavy UI lib yet)

**AI/ML**

- Python or Node-based anomaly logic (TBD in `ml` folder)
- Simple models (rules + IsolationForest-style approach)
- LLM integration via HTTP API

---

## Project Structure

```text
backend/      NestJS API, streaming consumers, Prisma models
frontend/     React frontend (Vite)
infra/        Docker Compose (Postgres, Kafka, etc.)
datasets/     Static datasets for simulation (fraud, sample PDFs)
docs/         Architecture diagrams, ML notes, design decisions
README.md     This file
TODO.md       Roadmap and detailed tasks