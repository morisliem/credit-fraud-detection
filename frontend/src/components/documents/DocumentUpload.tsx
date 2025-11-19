import { useState, type ChangeEvent, type FormEvent } from "react";
import { apiUpload } from "../../lib/api";
import type { DocumentSummary } from "../../types/document";

interface DocumentUploadProps {
    onUploaded?: (doc: DocumentSummary) => void;
}

export function DocumentUpload({ onUploaded }: DocumentUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError("Please select a file first");
            return;
        }

        try {
            setIsUploading(true);
            setError(null);

            const uploaded = await apiUpload<DocumentSummary>(
                "/documents/upload",
                file
            );

            if (onUploaded) {
                onUploaded(uploaded);
            }

            (e.target as HTMLFormElement).reset();
            setFile(null);
        } catch (err: any) {
            console.error(err);
            setError(err.message ?? "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-3"
        >
            <label className="inline-flex items-center cursor-pointer">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <span className="px-3 py-2 rounded-md border border-slate-700 bg-slate-900 text-xs text-slate-200 hover:bg-slate-800 transition">
                    {file ? "Change file" : "Select PDF…"}
                </span>
            </label>

            <span className="text-xs text-slate-400 max-w-[200px] truncate">
                {file ? file.name : "No file selected"}
            </span>

            <button
                type="submit"
                disabled={isUploading}
                className="px-4 py-2 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isUploading ? "Uploading…" : "Upload"}
            </button>

            {error && (
                <p className="text-[11px] text-red-400 mt-1">{error}</p>
            )}
        </form>
    );
}