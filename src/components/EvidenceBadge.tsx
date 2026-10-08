import { AlertTriangle, BookOpen, Compass } from './Icons'
import type { EvidenceKind } from '../types'

const styles: Record<EvidenceKind, string> = {
  文献证据: 'bg-blue-50 text-blue-800 border-blue-200',
  初步设计建议: 'bg-amber-50 text-amber-800 border-amber-200',
  待核实信息: 'bg-rose-50 text-rose-800 border-rose-200',
}

export default function EvidenceBadge({ kind }: { kind: EvidenceKind }) {
  const Icon = kind === '文献证据' ? BookOpen : kind === '初步设计建议' ? Compass : AlertTriangle
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${styles[kind]}`}><Icon size={13} />{kind}</span>
}

