'use client';

import { useState } from 'react';
import { getPrediction } from '../lib/api';
import { PredictionResponse } from '../types/prediction';
import DiagnoseForm from '../components/DiagnoseForm';
import PredictionResult from '../components/PredictionResult';
import RecentScans, { ScanRecord } from '../components/RecentScans';

export default function DiagnosePage() {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scans, setScans] = useState<ScanRecord[]>([]);

  const handleDiagnose = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const prediction = await getPrediction(file);
      setResult(prediction);
      setScans((prev) => [
        {
          id: Date.now().toString(),
          label: prediction.label,
          confidence: prediction.confidence,
          timestamp: new Date(),
          fileName: file.name,
        },
        ...prev.slice(0, 9),
      ]);
    } catch {
      setError('Diagnosis failed. Please try a clearer photo.');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--background)' }}>

      {/* Nav */}
      <nav style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/logo-icon.png"
            alt="Green Guardian"
            width={32}
            height={32}
            style={{ objectFit: 'contain' }}
          />
          <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 17, color: 'var(--text-primary)', fontWeight: 600 }}>
            Green Guardian
          </span>
        </div>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--green-dark)',
          border: '1px solid var(--border-strong)',
          borderRadius: 6,
          padding: '5px 14px',
          letterSpacing: '0.5px',
          fontFamily: "'Nunito', sans-serif",
        }}>
          AI &mdash; Plant Diagnostics
        </span>
      </nav>

      {/* Split body */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: 0,
        overflow: 'hidden',
      }}>

        {/* Left panel */}
        <div style={{
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          overflowY: 'auto',
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '1.4px',
            color: 'var(--text-faint)', textTransform: 'uppercase',
          }}>
            01 &mdash; Upload specimen
          </span>

          <DiagnoseForm onDiagnose={handleDiagnose} loading={loading} />

          {/* Recent scans divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '1.2px',
              color: 'var(--text-faint)', textTransform: 'uppercase',
            }}>Recent scans</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <RecentScans scans={scans} onClear={() => setScans([])} />
        </div>

        {/* Right panel */}
        <div style={{
          background: 'var(--background)',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflowY: 'auto',
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '1.4px',
            color: 'var(--text-faint)', textTransform: 'uppercase',
          }}>
            02 &mdash; Diagnosis
          </span>

          {error && (
            <div style={{
              background: '#fff5f5',
              border: '1px solid #fecaca',
              borderRadius: 12,
              padding: '14px 18px',
              fontSize: 13,
              color: '#b91c1c',
              fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          {!result && !error && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              opacity: 0.4,
              padding: '60px 20px',
              textAlign: 'center',
            }}>
              <div style={{
                width: 52, height: 52,
                border: '1.5px solid var(--green-dark)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green-dark)" strokeWidth="1.5">
                  <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                </svg>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.6 }}>
                Upload a leaf photo and hit<br /><strong>Analyze specimen</strong> to see your diagnosis here.
              </p>
            </div>
          )}

          {result && <PredictionResult result={result} scanHistory={scans.map(s => ({
            label: s.label,
            confidence: s.confidence,
            timestamp: s.timestamp,
            fileName: s.fileName,
          }))} />}
        </div>

      </div>
    </div>
  );
}