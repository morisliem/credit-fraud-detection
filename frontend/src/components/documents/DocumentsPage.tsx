import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../lib/api";
import type { DocumentSummary } from "../../types/document";
import { DocumentUpload } from "./DocumentUpload";
import { RiskBadge } from "../common/RiskBadge";

export function DocumentsPage() {
    const [documents, setDocuments] = useState<DocumentSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiGet<DocumentSummary[]>("/documents");
            setDocuments(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleUploaded = () => {
        fetchDocuments();
    };

    const formatDate = (iso: string | null) =>
        iso ? new Date(iso).toLocaleString() : "-";

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="mt-1 text-3xl font-semibold text-slate-50">
                        Documents
                    </h1>
                    <p className="text-sm text-slate-400">
                        Upload statements, invoices or payslips to analyse for anomalies.
                    </p>
                </div>
                <div className="mt-3 sm:mt-0">
                    <DocumentUpload onUploaded={handleUploaded} />
                </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                    <p className="text-xs font-medium text-slate-300">
                        {loading
                            ? "Loading documents…"
                            : documents.length === 0
                                ? "No documents yet"
                                : `${documents.length} document${documents.length > 1 ? "s" : ""
                                }`}
                    </p>
                </div>

                {error && (
                    <div className="px-4 py-3 text-sm text-red-300 border-b border-slate-800">
                        {error}
                    </div>
                )}
                {!loading && documents.length === 0 && !error && (
                    <div className="px-4 py-6 text-sm text-slate-400">
                        Start by uploading a PDF bank statement, invoice or payslip.
                    </div>
                )}
                {documents.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border-t border-slate-800">
                            <thead className="bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-400">
                                <tr>
                                    <th className="px-4 py-3 font-medium border border-slate-800">
                                        Filename
                                    </th>
                                    <th className="px-4 py-3 font-medium border border-slate-800">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 font-medium border border-slate-800">
                                        Uploaded
                                    </th>
                                    <th className="px-4 py-3 font-medium border border-slate-800">
                                        Risk
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {documents.map((doc) => (
                                    <tr
                                        key={doc.id}
                                        className="hover:bg-slate-900/90 transition-colors"
                                    >
                                        <td className="px-4 py-2.5 border border-slate-800">
                                            <Link
                                                to={`/documents/${doc.id}`}
                                                className="text-[13px] font-medium text-blue-300 hover:text-blue-200 hover:underline"
                                            >
                                                {doc.title ?? doc.originalFilename}
                                            </Link>
                                            {doc.sourceDataset && (
                                                <div className="text-[11px] text-slate-500">
                                                    {doc.sourceDataset}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-2.5 text-xs text-slate-300 border border-slate-800">
                                            {doc.docType}
                                        </td>

                                        <td className="px-4 py-2.5 text-xs text-slate-300 border border-slate-800">
                                            {formatDate(doc.uploadedAt)}
                                        </td>

                                        <td className="px-4 py-2.5 border border-slate-800">
                                            <RiskBadge risk={doc.overallRisk} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}