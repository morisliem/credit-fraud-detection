import type { RiskLevel } from "../../types/document";

interface RiskBadgeProps {
    risk: RiskLevel
}

export function RiskBadge({ risk }: RiskBadgeProps) {
    if (!risk) {
        return (
            <span className="inline-flex items-center rounded-full bg-slate-700/40 px-2.5 py-0.5 text-xs text-slate-200">N/A</span>
        )
    }

    const colorClass =
        risk === 'HIGH'
            ? 'bg-red-500/15 text-red-300 border-red-500/40'
            : risk === 'MEDIUM'
                ? 'bg-amber-500/15 text-amber-200 border-amber-500/40'
                : 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40'

    return (
        <span className={
            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font medium ' + colorClass
        }>
            {risk} risk
        </span>
    )
}