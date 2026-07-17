'use client';

import { useState } from 'react';
import { PredictionResponse, ScanFeedback } from '../types/prediction';

/* ── Label formatting ── */
const LABEL_MAP: Record<string, string> = {
  'Pepper__bell___Bacterial_spot': 'Bell Pepper · Bacterial Spot',
  'Pepper__bell___healthy': 'Bell Pepper · Healthy',
  'Potato___Early_blight': 'Potato · Early Blight',
  'Potato___Late_blight': 'Potato · Late Blight',
  'Potato___healthy': 'Potato · Healthy',
  'Tomato_Bacterial_spot': 'Tomato · Bacterial Spot',
  'Tomato_Early_blight': 'Tomato · Early Blight',
  'Tomato_Late_blight': 'Tomato · Late Blight',
  'Tomato_Leaf_Mold': 'Tomato · Leaf Mold',
  'Tomato_Septoria_leaf_spot': 'Tomato · Septoria Leaf Spot',
  'Tomato_Spider_mites_Two_spotted_spider_mite': 'Tomato · Spider Mites',
  'Tomato__Target_Spot': 'Tomato · Target Spot',
  'Tomato__Tomato_YellowLeaf__Curl_Virus': 'Tomato · Yellow Leaf Curl Virus',
  'Tomato__Tomato_mosaic_virus': 'Tomato · Mosaic Virus',
  'Tomato_healthy': 'Tomato · Healthy',
};

export function formatLabel(raw: string): string {
  return LABEL_MAP[raw] || raw.replace(/_{2,}/g, ' · ').replace(/_/g, ' ');
}

/* ── Disease info database ── */
const DISEASE_INFO: Record<string, {
  about: string;
  treatment: string[];
}> = {
  default: {
    about: 'Our AI has identified a condition in this leaf specimen. Examine the affected areas closely; early intervention gives the best chance of recovery.',
    treatment: [
      'Remove and dispose of affected foliage immediately',
      'Apply appropriate fungicide or pesticide as recommended',
      'Avoid overhead watering; water at soil level',
      'Ensure adequate plant spacing for airflow',
      'Monitor weekly and re-treat if symptoms persist',
    ],
  },
  'early blight': {
    about: 'Alternaria solani: fungal infection causing concentric ring lesions. Commonly appears on lower, older leaves first and spreads upward under warm, humid conditions.',
    treatment: [
      'Remove and dispose of affected foliage immediately',
      'Apply copper-based fungicide every 7–10 days',
      'Avoid overhead watering; water at soil level',
      'Ensure adequate plant spacing for airflow',
      'Monitor weekly and re-treat if symptoms persist',
    ],
  },
  'late blight': {
    about: 'Phytophthora infestans: aggressive oomycete causing water-soaked dark lesions on leaves and stems. Spreads extremely rapidly in cool, wet conditions and can destroy crops within days.',
    treatment: [
      'Act immediately: late blight spreads fast',
      'Apply systemic fungicide (chlorothalonil or mancozeb) every 5–7 days',
      'Remove severely infected plants entirely to protect neighbors',
      'Avoid overhead watering; water at soil level in the morning',
      'Bag and destroy all infected material; never compost it',
    ],
  },
  'leaf mold': {
    about: 'Passalora fulva: causes pale green or yellow spots on the upper leaf surface with olive-green to grayish-purple mold underneath. Thrives in high-humidity greenhouse conditions.',
    treatment: [
      'Reduce greenhouse humidity below 85%',
      'Remove affected leaves and dispose in sealed bags',
      'Apply copper-based or chlorothalonil fungicide every 7 days',
      'Switch to drip irrigation to avoid leaf wetness',
      'Prune and space plants for better airflow',
    ],
  },
  'bacterial spot': {
    about: 'Xanthomonas species: causes small, dark, water-soaked lesions on leaves that may develop yellow halos. Spreads through splashing water, contaminated tools, and infected seed.',
    treatment: [
      'Remove and destroy infected plant material',
      'Apply copper-based bactericide as a preventive spray',
      'Avoid working with plants when foliage is wet',
      'Sanitize tools between plants to prevent spread',
      'Use disease-free seed and resistant varieties when available',
    ],
  },
  'septoria': {
    about: 'Septoria lycopersici: fungal leaf spot disease producing small circular spots with dark borders and gray centers. Tiny black fruiting bodies may be visible with magnification.',
    treatment: [
      'Remove lower infected leaves to slow spread',
      'Apply fungicide (chlorothalonil or copper-based) every 7–10 days',
      'Mulch around plants to prevent soil splash',
      'Avoid overhead watering; water at soil level',
      'Rotate crops; do not plant tomatoes in the same spot annually',
    ],
  },
  'spider mite': {
    about: 'Tetranychus urticae: tiny arachnids that cause stippled, yellowing leaves with fine webbing on the underside. They thrive in hot, dry conditions and reproduce rapidly.',
    treatment: [
      'Spray plants with a strong stream of water to dislodge mites',
      'Apply insecticidal soap or neem oil to both sides of leaves',
      'Introduce predatory mites (Phytoseiulus persimilis) as biocontrol',
      'Increase humidity around plants; mites prefer dry conditions',
      'Remove heavily infested leaves and dispose of them',
    ],
  },
  'target spot': {
    about: 'Corynespora cassiicola: fungal disease causing brown lesions with concentric rings resembling a target. Can affect leaves, stems, and fruit in warm humid conditions.',
    treatment: [
      'Remove and destroy affected plant parts',
      'Apply fungicide (chlorothalonil or mancozeb) preventively',
      'Improve air circulation through pruning and spacing',
      'Avoid overhead irrigation; water at soil level',
      'Practice crop rotation with non-solanaceous crops',
    ],
  },
  'curl virus': {
    about: 'Tomato Yellow Leaf Curl Virus (TYLCV): transmitted by whiteflies, causing severe leaf curling, yellowing, and stunted growth. Infected plants rarely recover and yield drops significantly.',
    treatment: [
      'Remove and destroy infected plants promptly',
      'Control whitefly populations with insecticidal soap or neem oil',
      'Use reflective mulch to deter whiteflies',
      'Install fine mesh netting to exclude whitefly vectors',
      'Plant resistant varieties when available',
    ],
  },
  'mosaic virus': {
    about: 'Tomato Mosaic Virus (ToMV): causes mottled light and dark green patterns on leaves, leaf distortion, and reduced fruit quality. Highly contagious through mechanical contact.',
    treatment: [
      'Remove and destroy infected plants; do not compost',
      'Sanitize all tools, stakes, and hands with 10% bleach solution',
      'Avoid tobacco products near plants (cross-contamination risk)',
      'Use virus-free seed and resistant cultivars',
      'Control aphid vectors with insecticidal soap',
    ],
  },
  healthy: {
    about: 'Great news: your plant looks healthy! No signs of disease were detected in this leaf sample. Continue your current care routine and keep monitoring regularly.',
    treatment: [
      'Maintain regular watering appropriate for your plant species',
      'Fertilize seasonally with a balanced fertilizer',
      'Monitor monthly; scan a new leaf to catch early signs',
      'Ensure good drainage to prevent root rot',
      'Check leaf undersides periodically for pests',
    ],
  },
};

function getDiseaseInfo(label: string) {
  const lower = label.toLowerCase();
  for (const key of Object.keys(DISEASE_INFO)) {
    if (key !== 'default' && lower.includes(key)) return DISEASE_INFO[key];
  }
  return DISEASE_INFO.default;
}

/* ── Feedback row ── */
function FeedbackRow({ feedback, onFeedback }: {
  feedback?: ScanFeedback;
  onFeedback?: (feedback: ScanFeedback) => void;
}) {
  const [showCorrection, setShowCorrection] = useState(false);

  if (feedback) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '14px 22px',
        fontSize: 13,
        color: 'var(--text-muted)',
      }}>
        <span style={{ fontSize: 14 }}>{feedback.status === 'correct' ? '✓' : '🌱'}</span>
        {feedback.status === 'correct'
          ? 'Thanks for confirming.'
          : 'Thanks — this helps it learn.'}
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 14,
      border: '1px solid var(--border-strong)',
      padding: '16px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
          Was this diagnosis right?
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onFeedback?.({ status: 'correct' })}
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid var(--border-strong)',
              background: 'var(--surface-subtle)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            Looks right
          </button>
          <button
            onClick={() => setShowCorrection(true)}
            aria-expanded={showCorrection}
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid var(--border-strong)',
              background: 'var(--surface-subtle)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            Not quite
          </button>
        </div>
      </div>

      {showCorrection && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label htmlFor="feedback-correction" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            What was it actually?
          </label>
          <select
            id="feedback-correction"
            defaultValue=""
            onChange={(e) => {
              if (!e.target.value) return;
              onFeedback?.({ status: 'incorrect', correctedLabel: e.target.value });
            }}
            style={{
              fontSize: 13,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid var(--border-strong)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="" disabled>Select the correct condition</option>
            {Object.entries(LABEL_MAP).map(([raw, label]) => (
              <option key={raw} value={raw}>{label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

/* ── Component ── */
interface Props {
  result: PredictionResponse;
  feedback?: ScanFeedback;
  onFeedback?: (feedback: ScanFeedback) => void;
  scanHistory?: { label: string; confidence: number; timestamp: Date; fileName: string; feedback?: ScanFeedback }[];
}

export default function PredictionResult({ result, feedback, onFeedback, scanHistory = [] }: Props) {
  const [activeTab, setActiveTab] = useState<'result' | 'history'>('result');
  const info = getDiseaseInfo(result.label);
  const pct = (result.confidence * 100).toFixed(1);
  const isHealthy = result.label.toLowerCase().includes('healthy');
  const displayLabel = formatLabel(result.label);

  const tabStyle = (tab: 'result' | 'history') => ({
    fontSize: 14,
    fontWeight: 600 as const,
    padding: '12px 4px',
    cursor: 'pointer' as const,
    color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-faint)',
    background: 'none',
    border: 'none',
    borderBottom: activeTab === tab ? '2px solid var(--text-primary)' : '2px solid transparent',
    marginRight: 20,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, animation: 'fadeUp 0.4s ease-out' }}>

      {/* Tab bar */}
      <div role="tablist" aria-label="Diagnosis tabs" style={{ borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        <button
          role="tab"
          aria-selected={activeTab === 'result'}
          style={tabStyle('result')}
          onClick={() => setActiveTab('result')}
        >
          Result
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'history'}
          style={tabStyle('history')}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      {activeTab === 'result' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Diagnosis header zone — health status drives color */}
          <div style={{
            borderRadius: 16,
            padding: '20px 22px',
            background: isHealthy ? 'var(--green-light)' : 'var(--disease-header-bg)',
            border: `1.5px solid ${isHealthy ? 'var(--border-strong)' : 'var(--disease-header-border)'}`,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.5px',
                padding: '4px 12px',
                borderRadius: 20,
                background: isHealthy ? 'var(--green-dark)' : '#92400e',
                color: '#fff',
                textTransform: 'uppercase' as const,
              }}>
                {isHealthy ? 'Healthy' : 'Disease detected'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                {pct}% confidence
              </span>
            </div>
            <h3 style={{
              fontFamily: "'Faustina', Georgia, serif",
              fontSize: 26,
              color: 'var(--text-primary)',
              fontWeight: 600,
              lineHeight: 1.25,
              margin: 0,
            }}>
              {displayLabel}
            </h3>
          </div>

          {/* Confidence row — inline, not a card */}
          <div style={{ padding: '0 4px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                AI confidence
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 4,
                background: 'var(--bar-bg)',
                color: 'var(--text-body)',
              }}>
                {parseFloat(pct) > 80 ? 'High' : parseFloat(pct) > 60 ? 'Medium' : 'Low'}
              </span>
            </div>
            <div
              role="meter"
              aria-valuenow={parseFloat(pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Confidence: ${pct}%`}
              style={{ height: 6, background: 'var(--bar-bg)', borderRadius: 8, overflow: 'hidden' }}
            >
              <div style={{
                height: '100%',
                width: '100%',
                transform: `scaleX(${parseFloat(pct) / 100})`,
                transformOrigin: 'left',
                background: isHealthy ? 'var(--green-mid)' : 'var(--disease-bar)',
                borderRadius: 8,
                transition: 'transform 1s ease-out',
              }} />
            </div>
          </div>

          {/* About card */}
          <div style={{
            background: 'var(--surface)',
            borderRadius: 14,
            border: '1px solid var(--border-strong)',
            padding: '20px 22px',
          }}>
            <p style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.4px',
              color: 'var(--green-dark)',
              margin: '0 0 10px',
            }}>
              About this condition
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.7, margin: 0 }}>
              {info.about}
            </p>
          </div>

          {/* Treatment card — visually distinct from About */}
          <div style={{
            background: 'var(--surface-subtle)',
            borderRadius: 14,
            border: '1px solid var(--border)',
            padding: '20px 22px',
          }}>
            <p style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.4px',
              color: 'var(--green-dark)',
              margin: '0 0 14px',
            }}>
              What to do
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {info.treatment.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'var(--green-dark)',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <FeedbackRow feedback={feedback} onFeedback={onFeedback} />
        </div>
      ) : (
        /* History tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scanHistory.length === 0 ? (
            <div style={{
              background: 'var(--surface)',
              borderRadius: 14,
              border: '1px solid var(--border-strong)',
              padding: '40px 20px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>
                Your scan history will appear here.
              </p>
            </div>
          ) : (
            scanHistory.map((scan, i) => {
              const scanPct = (scan.confidence * 100).toFixed(1);
              return (
                <div key={i} style={{
                  background: 'var(--surface)',
                  borderRadius: 12,
                  border: '1px solid var(--border-strong)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <p style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}>
                      {formatLabel(scan.label)}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-faint)', margin: '2px 0 0' }}>
                      {scan.fileName} · {scan.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {scan.feedback && (
                      <span style={{ fontSize: 13 }} title={scan.feedback.status === 'correct' ? 'Marked correct' : 'Marked incorrect'}>
                        {scan.feedback.status === 'correct' ? '✓' : '🌱'}
                      </span>
                    )}
                    <span style={{
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      color: 'var(--text-primary)',
                    }}>
                      {scanPct}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}