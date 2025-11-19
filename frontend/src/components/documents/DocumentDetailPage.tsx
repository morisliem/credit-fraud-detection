import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet } from "../../lib/api";
import type { DocumentSummary } from "../../types/document";
import { RiskBadge } from "../common/RiskBadge";

export function DocumentDetailPage() {
    const { documentId } = useParams()
    const [document, setDocument] = useState<DocumentSummary | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!documentId) return

        const fetchDoc = async () => {
            try {
                setLoading(true)
                setError(null)
                const doc = await apiGet<DocumentSummary>(`/documents/${documentId}`)
                setDocument(doc)
            } catch (err: any) {
                console.error(err)
                setError(`Failed to load document`)
            } finally {
                setLoading(false)
            }
        }
        fetchDoc()
    }, [documentId])

    const formatDate = (iso: string | null) => iso ? new Date(iso).toLocaleString() : '-'
    if (!documentId) {
        return <p className="text-sm text-red-600">Missing document ID</p>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <Link
                        to='/documents'
                        className="text-xs text-blue-300 hover:text-blue-200 hover:underline"
                    > ← Back to documents
                    </Link>
                    <h1 className="mt-2 text-2xl font-semibold text-slate-50">Document Detail</h1>
                    <p className="text-xs text-slate-500 mt-1">ID: {documentId}</p>
                </div>
                {document && <RiskBadge risk={document.overallRisk} />}
            </div>

            {loading && (
                <p className="text-sm text-slate-400">Loading document details...</p>
            )}

            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}

            {!loading && !document && !error && (
                <p className="text-sm text-slate-400">Document  not found</p>
            )}

            {document && (
                <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,fr)]">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-slate-100 mb-3">Basic Info</h2>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-slate-500">Filename</dt>
                                <dd className="mt-0.5 text-slate-100">{document.originalFilename}</dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-slate-500">Type</dt>
                                <dd className="mt-0.5 text-slate-100">{document.docType}</dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-slate-500">Uploaded</dt>
                                <dd className="mt-0.5 text-slate-100">{formatDate(document.uploadedAt)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-slate-500">Parsed</dt>
                                <dd className="mt-0.5 text-slate-100">{formatDate(document.parsedAt)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-slate-500">Source Dataset</dt>
                                <dd className="mt-0.5 text-slate-100">{document.sourceDataset ?? 'N/A'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            )}
        </div>
    )
}