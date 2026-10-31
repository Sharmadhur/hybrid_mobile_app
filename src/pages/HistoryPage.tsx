import { useState } from 'react';
import { IonAlert, IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import PageHeading from '../components/PageHeading';
import { useAppData } from '../state/AppData';
import { formatWeight } from '../utils/bmi';

export default function HistoryPage() {
  const { history, deleteCalculation, clearHistory, profile } = useAppData();
  const [confirmClear, setConfirmClear] = useState(false);
  const chartEntries = [...history].slice(0, 8).reverse();
  const chartPoints = chartEntries.map((entry, index) => {
    const x = chartEntries.length === 1 ? 160 : 12 + (index * 296) / (chartEntries.length - 1);
    const y = 116 - (Math.max(14, Math.min(36, entry.bmi)) - 14) * (92 / 22);
    return { x, y, bmi: entry.bmi, id: entry.id };
  });

  return (
    <IonPage>
      <PageHeading eyebrow="YOUR PERSONAL LOG" title="History" action={history.length > 0 ? <IonButton fill="clear" className="toolbar-action" onClick={() => setConfirmClear(true)}>Clear</IonButton> : undefined} />
      <IonContent fullscreen className="page-content">
        {history.length === 0 ? (
          <div className="empty-state"><div className="empty-graphic"><span>—</span><i /><i /><i /></div><p className="eyebrow">A RECORD, JUST FOR YOU</p><h1>Your journey<br />starts with one.</h1><p>Your saved BMI check-ins will appear here. They’re stored only on this device.</p><IonButton routerLink="/calculator" className="primary-button">Make your first check-in</IonButton></div>
        ) : (
          <>
            <section className="chart-section">
              <div className="section-heading"><h2>Your progress</h2><span>LAST {chartEntries.length} CHECK-INS</span></div>
              <div className="chart-frame">
                <div className="chart-guides"><span>35</span><span>25</span><span>15</span></div>
                <svg className="history-chart" viewBox="0 0 320 132" role="img" aria-label="BMI values over time">
                  <line x1="8" y1="24" x2="312" y2="24" className="chart-grid" />
                  <line x1="8" y1="66" x2="312" y2="66" className="chart-grid" />
                  <line x1="8" y1="108" x2="312" y2="108" className="chart-grid" />
                  {chartPoints.length > 1 && <polyline points={chartPoints.map(({ x, y }) => `${x},${y}`).join(' ')} className="chart-line" />}
                  {chartPoints.map((point) => <circle key={point.id} cx={point.x} cy={point.y} r="4.5" className="chart-point"><title>BMI {point.bmi.toFixed(1)}</title></circle>)}
                </svg>
              </div>
              <div className="chart-footnote"><span><i /> BMI check-ins</span><span>Latest on left</span></div>
            </section>

            <div className="section-heading history-list-heading"><h2>All check-ins</h2><span>{history.length} TOTAL</span></div>
            <div className="history-list">
              {history.map((entry) => (
                <article className="history-entry" key={entry.id}>
                  <div className="history-date"><strong>{new Date(entry.createdAt).toLocaleDateString(undefined, { day: '2-digit' })}</strong><span>{new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}</span></div>
                  <div className="history-info"><strong>{entry.category}</strong><span>{new Date(entry.createdAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} · {formatWeight(entry.weightKg, profile.weightUnit)}</span></div>
                  <strong className="history-bmi">{entry.bmi.toFixed(1)}</strong>
                  <button className="delete-entry" onClick={() => void deleteCalculation(entry.id)} aria-label={`Delete BMI record from ${new Date(entry.createdAt).toLocaleDateString()}`}><IonIcon icon={trashOutline} /></button>
                </article>
              ))}
            </div>
          </>
        )}
        <IonAlert isOpen={confirmClear} header="Clear all history?" message="This removes all saved BMI check-ins from this device." buttons={[{ text: 'Cancel', role: 'cancel' }, { text: 'Clear history', role: 'destructive', handler: () => void clearHistory() }]} onDidDismiss={() => setConfirmClear(false)} />
      </IonContent>
    </IonPage>
  );
}