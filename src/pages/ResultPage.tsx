import { useState } from 'react';
import { IonButton, IonContent, IonIcon, IonPage, IonToast } from '@ionic/react';
import { checkmarkOutline, refreshOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import BmiScale from '../components/BmiScale';
import PageHeading from '../components/PageHeading';
import { useAppData } from '../state/AppData';
import type { Measurements } from '../utils/bmi';
import { calculateBmi, formatWeight } from '../utils/bmi';

interface ResultState { measurements: Measurements }

const insights: Record<string, string> = {
  Underweight: 'A little context can help. Consider talking with a health professional about your nutrition and wellbeing.',
  'Normal weight': 'This falls within the adult reference range. Keep focusing on habits that help you feel your best.',
  Overweight: 'BMI is one small piece of the picture. A health professional can help interpret it alongside other factors.',
  Obesity: 'This result can be a starting point for a conversation with a health professional about your overall health.',
};

export default function ResultPage() {
  const location = useLocation<ResultState>();
  const history = useHistory();
  const { saveCalculation, profile } = useAppData();
  const [saved, setSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const measurements = location.state?.measurements;

  if (!measurements) { history.replace('/calculator'); return null; }
  const result = calculateBmi(measurements);

  const save = async () => {
    await saveCalculation({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(), age: measurements.age, gender: measurements.gender,
      heightMeters: result.heightMeters, weightKg: result.weightKg, bmi: result.bmi, category: result.category,
    });
    setSaved(true); setShowToast(true);
  };

  return (
    <IonPage>
      <PageHeading eyebrow="YOUR CHECK-IN" title="Your result" />
      <IonContent fullscreen className="page-content result-content">
        <div className="result-caption">BODY MASS INDEX</div>
        <div className="result-score"><strong>{result.bmi.toFixed(1)}</strong><span>BMI</span></div>
        <div className={`result-category category-${result.category.toLowerCase().replace(' ', '-')}`}>{result.category}</div>
        <BmiScale bmi={result.bmi} category={result.category} />

        <div className="insight-panel"><span className="insight-overline">A NOTE FOR YOU</span><p>{insights[result.category]}</p></div>

        <section className="healthy-range">
          <div className="section-heading"><h2>Healthy weight range</h2><span>AT YOUR HEIGHT</span></div>
          <div className="range-values"><strong>{formatWeight(result.healthyMinKg, profile.weightUnit)} <span>to</span> {formatWeight(result.healthyMaxKg, profile.weightUnit)}</strong><p>Based on the adult BMI reference of 18.5–24.9.</p></div>
        </section>

        {measurements.age < 20 && <p className="age-note">Adult BMI categories are intended for ages 20 and above. For children and teens, BMI should be interpreted using age- and sex-specific percentiles.</p>}
        <p className="medical-note">BMI is a screening measure, not a diagnosis. It does not directly measure body fat.</p>

        <div className="result-actions">
          <IonButton expand="block" className="primary-button" onClick={save} disabled={saved}>
            <IonIcon slot="start" icon={saved ? checkmarkOutline : undefined} />{saved ? 'Saved to history' : 'Save result'}
          </IonButton>
          <IonButton expand="block" fill="outline" className="secondary-button" onClick={() => history.push('/calculator')}><IonIcon slot="start" icon={refreshOutline} /> Recalculate</IonButton>
        </div>
        <IonToast isOpen={showToast} message="Saved to your history on this device." duration={2200} onDidDismiss={() => setShowToast(false)} position="bottom" />
      </IonContent>
    </IonPage>
  );
}