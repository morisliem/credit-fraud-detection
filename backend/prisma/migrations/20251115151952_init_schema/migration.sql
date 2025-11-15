-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('BANK_ACCOUNT', 'CREDIT_CARD', 'MOBILE_MONEY', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('BANK_STATEMENT', 'INVOICE', 'PAYSLIP', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentLineType" AS ENUM ('BANK_TRANSACTION', 'INVOICE_LINE', 'PAYSLIP_EARNING', 'PAYSLIP_DEDUCTION', 'OTHER');

-- CreateEnum
CREATE TYPE "SourceDataset" AS ENUM ('BANK_TEMPLATE', 'SROIE', 'FUNSD', 'SYNTHETIC', 'OTHER');

-- CreateEnum
CREATE TYPE "StreamDataset" AS ENUM ('PAYSIM', 'UCI_CCF', 'REAL');

-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('DEBIT', 'CREDIT', 'TRANSFER_IN', 'TRANSFER_OUT', 'OTHER');

-- CreateEnum
CREATE TYPE "AnomalySourceType" AS ENUM ('DOCUMENT_LINE', 'DOCUMENT_SUMMARY', 'LIVE_STREAM');

-- CreateEnum
CREATE TYPE "AnomalySeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "AiRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "externalRef" TEXT,
    "accountType" "AccountType" NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT,
    "originalFilename" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "docType" "DocumentType" NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parsedAt" TIMESTAMP(3),
    "sourceDataset" "SourceDataset",

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentTransaction" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "accountId" TEXT,
    "itemDate" TIMESTAMP(3),
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "balanceAfter" DOUBLE PRECISION,
    "lineType" "DocumentLineType" NOT NULL,
    "category" TEXT,
    "meta" JSONB,

    CONSTRAINT "DocumentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveTransaction" (
    "id" TEXT NOT NULL,
    "accountId" TEXT,
    "sourceDataset" "StreamDataset" NOT NULL,
    "externalId" TEXT,
    "txnTime" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "direction" "TransactionDirection" NOT NULL,
    "raw" JSONB,
    "features" JSONB,
    "labelIsFraud" BOOLEAN,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnomalyEvent" (
    "id" TEXT NOT NULL,
    "sourceType" "AnomalySourceType" NOT NULL,
    "documentId" TEXT,
    "documentTransactionId" TEXT,
    "liveTransactionId" TEXT,
    "accountId" TEXT,
    "anomalyScore" DOUBLE PRECISION NOT NULL,
    "severity" "AnomalySeverity" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnomalyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentRiskSummary" (
    "documentId" TEXT NOT NULL,
    "overallRisk" "RiskLevel" NOT NULL,
    "numAnomalies" INTEGER NOT NULL,
    "totalAmountFlagged" DOUBLE PRECISION NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentRiskSummary_pkey" PRIMARY KEY ("documentId")
);

-- CreateTable
CREATE TABLE "AiConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "AiRole" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Account_externalRef_idx" ON "Account"("externalRef");

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "Document"("userId");

-- CreateIndex
CREATE INDEX "Document_docType_idx" ON "Document"("docType");

-- CreateIndex
CREATE INDEX "DocumentTransaction_documentId_idx" ON "DocumentTransaction"("documentId");

-- CreateIndex
CREATE INDEX "DocumentTransaction_accountId_idx" ON "DocumentTransaction"("accountId");

-- CreateIndex
CREATE INDEX "DocumentTransaction_lineType_idx" ON "DocumentTransaction"("lineType");

-- CreateIndex
CREATE INDEX "LiveTransaction_accountId_idx" ON "LiveTransaction"("accountId");

-- CreateIndex
CREATE INDEX "LiveTransaction_sourceDataset_idx" ON "LiveTransaction"("sourceDataset");

-- CreateIndex
CREATE INDEX "LiveTransaction_txnTime_idx" ON "LiveTransaction"("txnTime");

-- CreateIndex
CREATE INDEX "AnomalyEvent_documentId_idx" ON "AnomalyEvent"("documentId");

-- CreateIndex
CREATE INDEX "AnomalyEvent_documentTransactionId_idx" ON "AnomalyEvent"("documentTransactionId");

-- CreateIndex
CREATE INDEX "AnomalyEvent_liveTransactionId_idx" ON "AnomalyEvent"("liveTransactionId");

-- CreateIndex
CREATE INDEX "AnomalyEvent_accountId_idx" ON "AnomalyEvent"("accountId");

-- CreateIndex
CREATE INDEX "AnomalyEvent_severity_idx" ON "AnomalyEvent"("severity");

-- CreateIndex
CREATE INDEX "AiMessage_conversationId_idx" ON "AiMessage"("conversationId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentTransaction" ADD CONSTRAINT "DocumentTransaction_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentTransaction" ADD CONSTRAINT "DocumentTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveTransaction" ADD CONSTRAINT "LiveTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomalyEvent" ADD CONSTRAINT "AnomalyEvent_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomalyEvent" ADD CONSTRAINT "AnomalyEvent_documentTransactionId_fkey" FOREIGN KEY ("documentTransactionId") REFERENCES "DocumentTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomalyEvent" ADD CONSTRAINT "AnomalyEvent_liveTransactionId_fkey" FOREIGN KEY ("liveTransactionId") REFERENCES "LiveTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRiskSummary" ADD CONSTRAINT "DocumentRiskSummary_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
