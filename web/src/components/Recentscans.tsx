// recent scans heeee

'use client';

export interface ScanRecord {
  id: string;
  label: string;
  confidence: number;
  timestamp: Date;
  fileName: string;
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (diffDays === 1) return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function LeafThumb({ label }: { label: string }) {
  const isHealthy = label.toLowerCase().includes('healthy');
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
      <rect width="34" height="34" fill={isHealthy ? '#1e2a1e' : '#221810'}/>
      <path d="M17 7C17 7 25 13 25 21C25 27 22 30 17 30C12 30 9 27 9 21C9 13 17 7 17 7Z"
        fill={isHealthy ? '#4a8a30' : '#3e5a28'} opacity="0.8"/>
      <path d="M17 7L17 30" stroke={isHealthy ? '#6aaa3a' : '#5a8830'} strokeWidth="1" opacity="0.4"/>
      {!isHealthy && (
        <>
          <circle cx="20" cy="19" r="4" fill="#6a2010" opacity="0.7"/>
          <circle cx="14" cy="23" r="3" fill="#6a2010" opacity="0.6"/>
        </>
      )}
    </svg>
  );
}

interface Props {
  scans: ScanRecord[];
  onClear: () => void;
}

export default function RecentScans({ scans, onClear }: Props) {
  if (scans.length === 0) {
    return (
      <div style={{
        background: 'var(--surface)',
        borderRadius: 14,
        border: '1px solid var(--border-strong)',
        padding: '20px 18px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 12, color: 'var(--text-faint)' }}>No scans yet — your history will appear here.</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 14,
      border: '1px solid var(--border-strong)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 18px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, color: 'var(--text-primary)' }}>
          Recent scans
        </span>
        <button
          onClick={onClear}
          style={{
            fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer',
            background: 'none', border: 'none', fontFamily: 'inherit',
          }}
        >
          Clear all
        </button>
      </div>

      <div>
        {scans.map((scan, i) => {
          const pct = (scan.confidence * 100).toFixed(0);
          const isHealthy = scan.label.toLowerCase().includes('healthy');
          return (
            <div
              key={scan.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 18px',
                borderBottom: i < scans.length - 1 ? '1px solid var(--history-border)' : 'none',
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <LeafThumb label={scan.label} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {scan.label}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 1 }}>
                  {formatTime(scan.timestamp)}
                </p>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: isHealthy ? '#5a9e38' : parseFloat(pct) > 80 ? '#5a9e38' : parseFloat(pct) > 60 ? '#d97706' : '#dc2626',
                flexShrink: 0,
              }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}