'use client';

import { useState } from 'react';
import { PredictionResponse } from '../types/prediction';

// Maps disease label keywords to example descriptions and color hints
// Swap SVG placeholders for real images by adding /public/disease-examples/<key>-{1,2,3}.jpg
const DISEASE_INFO: Record<string, {
  about: string;
  examples: { caption: string }[];
  treatment: { title: string; detail: string }[];
}> = {
  default: {
    about: 'Our AI has identified a disease pattern in this leaf. Examine the affected areas closely — early intervention gives the best chance of recovery.',
    examples: [
      { caption: 'Early lesions' },
      { caption: 'Spreading stage' },
      { caption: 'Advanced stage' },
    ],
    treatment: [
      { title: 'Remove affected leaves', detail: 'Pick off and bag visibly diseased leaves — do not compost them.' },
      { title: 'Apply appropriate treatment', detail: 'Consult a nursery for the correct fungicide or pesticide for this specific condition.' },
      { title: 'Adjust watering', detail: 'Water at the base, not overhead. Wet foliage encourages spread.' },
      { title: 'Improve airflow', detail: 'Prune and space plants to reduce humidity around leaves.' },
      { title: 'Monitor weekly', detail: 'Check for new symptoms every few days and re-treat if needed.' },
    ],
  },
  'early blight': {
    about: 'Early blight is caused by the fungus Alternaria solani. Look for dark, bullseye-patterned spots — usually appearing on older lower leaves first. It spreads fast in warm, wet weather but is very treatable when caught early.',
    examples: [
      { caption: 'Bullseye rings' },
      { caption: 'Leaf spots' },
      { caption: 'Advanced stage' },
    ],
    treatment: [
      { title: 'Remove affected leaves', detail: 'Pick off and bag any visibly spotted leaves — do not compost them or the spores will spread.' },
      { title: 'Apply copper fungicide', detail: 'Use a copper-based fungicide every 7–10 days. Spray both sides of remaining leaves thoroughly.' },
      { title: 'Change how you water', detail: 'Water at the base only — wet leaves make it significantly worse. Morning watering gives leaves time to dry.' },
      { title: 'Improve airflow', detail: 'Prune lower foliage and give crowded plants more space — poor circulation lets blight take hold fast.' },
      { title: 'Monitor weekly', detail: 'Check for new spots every few days. If it persists after 2–3 treatments, consult a local nursery.' },
    ],
  },
  'late blight': {
    about: 'Late blight (Phytophthora infestans) is a serious disease causing water-soaked dark lesions on leaves and stems. It spreads extremely rapidly in cool, wet conditions and was responsible for the Irish potato famine.',
    examples: [
      { caption: 'Water-soaked spots' },
      { caption: 'Dark lesions' },
      { caption: 'White mold edge' },
    ],
    treatment: [
      { title: 'Act immediately', detail: 'Late blight spreads fast — begin treatment the same day you notice symptoms.' },
      { title: 'Apply systemic fungicide', detail: 'Use a fungicide containing chlorothalonil or mancozeb. Repeat every 5–7 days.' },
      { title: 'Remove severely infected plants', detail: 'If more than 30% of the plant is affected, remove it entirely to protect neighbors.' },
      { title: 'Avoid overhead watering', detail: 'Water at soil level in the morning so plants dry fully before evening.' },
      { title: 'Destroy debris', detail: 'Bag and dispose of all infected material — never compost it.' },
    ],
  },
  'leaf mold': {
    about: 'Leaf mold (Passalora fulva) causes pale green or yellow spots on the upper leaf surface, with olive-green to grayish-purple mold on the underside. It thrives in high-humidity greenhouse conditions.',
    examples: [
      { caption: 'Yellow upper spots' },
      { caption: 'Mold underside' },
      { caption: 'Yellowing spread' },
    ],
    treatment: [
      { title: 'Reduce humidity', detail: 'Improve ventilation in greenhouses. Target below 85% relative humidity.' },
      { title: 'Remove affected leaves', detail: 'Strip leaves showing yellow spots and dispose of them in sealed bags.' },
      { title: 'Apply fungicide', detail: 'Copper-based or chlorothalonil fungicide applied every 7 days works well.' },
      { title: 'Avoid leaf wetness', detail: 'Drip irrigation is preferable to overhead watering.' },
      { title: 'Space plants adequately', detail: 'Crowded plants trap moisture — prune and space for better airflow.' },
    ],
  },
  healthy: {
    about: 'Great news — your plant looks healthy! No signs of disease were detected in this leaf sample. Continue your current care routine and keep monitoring regularly.',
    examples: [
      { caption: 'Vibrant color' },
      { caption: 'Clean leaf surface' },
      { caption: 'Strong veins' },
    ],
    treatment: [
      { title: 'Maintain regular watering', detail: 'Keep a consistent watering schedule appropriate for your plant species.' },
      { title: 'Fertilize seasonally', detail: 'Feed during growing season with a balanced fertilizer.' },
      { title: 'Monitor monthly', detail: 'Scan a new leaf monthly to catch any early signs before they spread.' },
      { title: 'Ensure good drainage', detail: 'Root rot from waterlogging is a common hidden threat to healthy-looking plants.' },
      { title: 'Watch for pests', detail: 'Check the undersides of leaves periodically for aphids, spider mites, or whitefly.' },
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

// SVG placeholder leaf illustrations for the example grid
function ExampleLeafSVG({ variant }: { variant: 1 | 2 | 3 }) {
  const fills = [
    { bg: '#1e3018', leaf: '#3e6828', spot: '#7a2020', spot2: '#5a1010' },
    { bg: '#182814', leaf: '#2a5020', spot: '#3a1808', spot2: '#6a2a10' },
    { bg: '#1a2c16', leaf: '#284820', spot: '#2c1008', spot2: '#4a1a0c' },
  ][variant - 1];

  return (
    <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', aspectRatio: '1', display: 'block' }}>
      <rect width="80" height="80" fill={fills.bg}/>
      <path d={variant === 1
        ? "M40 12C40 12 56 24 56 44C56 58 50 68 40 68C30 68 24 58 24 44C24 24 40 12 40 12Z"
        : variant === 2
        ? "M14 40C14 40 22 26 40 26C58 26 66 40 66 40C66 40 58 54 40 54C22 54 14 40 14 40Z"
        : "M40 10C40 10 58 24 58 44C58 60 51 70 40 70C29 70 22 60 22 44C22 24 40 10 40 10Z"}
        fill={fills.leaf} opacity="0.8"/>
      <circle cx={variant === 1 ? 44 : variant === 2 ? 36 : 40} cy={variant === 1 ? 38 : variant === 2 ? 36 : 44} r={variant === 1 ? 9 : 7} fill={fills.spot} opacity="0.7"/>
      <circle cx={variant === 1 ? 44 : variant === 2 ? 36 : 40} cy={variant === 1 ? 38 : variant === 2 ? 36 : 44} r={variant === 1 ? 5 : 4} fill={fills.spot2} opacity="0.75"/>
      {variant !== 1 && (
        <circle cx={variant === 2 ? 50 : 48} cy={variant === 2 ? 44 : 54} r={5} fill={fills.spot} opacity="0.6"/>
      )}
    </svg>
  );
}

export default function PredictionResult({ result }: { result: PredictionResponse }) {
  const [activeTab, setActiveTab] = useState<'what' | 'treat'>('what');
  const info = getDiseaseInfo(result.label);
  const pct = (result.confidence * 100).toFixed(1);
  const isHealthy = result.label.toLowerCase().includes('healthy');

  const tabStyle = (tab: 'what' | 'treat') => ({
    flex: 1,
    fontSize: 12,
    fontWeight: 700 as const,
    padding: '12px 8px',
    cursor: 'pointer' as const,
    color: activeTab === tab ? 'var(--green-dark)' : 'var(--text-faint)',
    marginBottom: -1,
    textAlign: 'center' as const,
    background: 'none',
    border: 'none',
    borderBottom: activeTab === tab ? `2px solid var(--green-dark)` : '2px solid transparent',
    letterSpacing: '0.3px',
    fontFamily: "'Nunito', sans-serif",
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeUp 0.4s ease-out' }}>

      {/* Disease name + confidence pill */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 14,
        border: '1px solid var(--border-strong)',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 10,
      }}>
        <div>
          <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 22, color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.2 }}>
            {result.label}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Scanned just now
          </p>
        </div>
        <span style={{
          background: isHealthy ? '#e4f2d8' : parseFloat(pct) > 80 ? '#e4f2d8' : parseFloat(pct) > 60 ? '#fef3c7' : '#fee2e2',
          color: isHealthy ? 'var(--green-pill-text)' : parseFloat(pct) > 80 ? 'var(--green-pill-text)' : parseFloat(pct) > 60 ? '#92400e' : '#991b1b',
          fontSize: 12,
          fontWeight: 700,
          padding: '5px 12px',
          borderRadius: 20,
          whiteSpace: 'nowrap' as const,
          flexShrink: 0,
        }}>
          {pct}% sure
        </span>
      </div>

      {/* Confidence bar */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 12,
        border: '1px solid var(--border-strong)',
        padding: '14px 18px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--conf-label)', marginBottom: 8, letterSpacing: '0.3px' }}>
          <span>Confidence</span>
          <span>{pct} / 100</span>
        </div>
        <div style={{ height: 7, background: 'var(--bar-bg)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: parseFloat(pct) > 80 ? 'var(--green-mid)' : parseFloat(pct) > 60 ? '#d97706' : '#dc2626',
            borderRadius: 8,
            transition: 'width 1s ease-out',
          }} />
        </div>
      </div>

      {/* Tabs card */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 14,
        border: '1px solid var(--border-strong)',
        overflow: 'hidden',
        flex: 1,
      }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          <button style={tabStyle('what')} onClick={() => setActiveTab('what')}>What is it?</button>
          <button style={tabStyle('treat')} onClick={() => setActiveTab('treat')}>How to treat</button>
        </div>

        {/* What is it pane */}
        {activeTab === 'what' && (
          <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.7 }}>
              {info.about}
            </p>

            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '1.2px',
              color: 'var(--text-faint)', textTransform: 'uppercase',
            }}>
              What it looks like
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {([1, 2, 3] as const).map((v) => (
                <div key={v} style={{
                  borderRadius: 10,
                  overflow: 'hidden',
                  border: '1px solid var(--border-strong)',
                }}>
                  <ExampleLeafSVG variant={v} />
                  <div style={{
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    padding: '5px 7px',
                    fontWeight: 600,
                    background: 'var(--background)',
                  }}>
                    {info.examples[v - 1].caption}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How to treat pane */}
        {activeTab === 'treat' && (
          <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {info.treatment.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 24, height: 24, minWidth: 24,
                  background: 'var(--green-light)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: 'var(--green-dark)',
                  marginTop: 1,
                }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{step.title}. </strong>
                  {step.detail}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}