import { useState } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonLabel, IonPage, IonSelect, IonSelectOption, IonSegment, IonSegmentButton } from '@ionic/react';
import { addOutline, removeOutline, refreshOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeading from '../components/PageHeading';
import { useAppData } from '../state/AppData';
import { heightToMeters, kgToWeight, validateMeasurements, type HeightUnit, type Measurements, type WeightUnit } from '../utils/bmi';

const numberValue = (value: string) => value.trim() === '' ? Number.NaN : Number(value);

export default function CalculatorPage() {
  const appHistory = useHistory();
  const { profile } = useAppData();
  const [age, setAge] = useState(String(profile.age));
  const [gender, setGender] = useState(profile.gender);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(profile.heightUnit);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(profile.weightUnit);
  const [height, setHeight] = useState(profile.heightUnit === 'ft' ? '5' : profile.heightUnit === 'm' ? '1.70' : '170');
  const [inches, setInches] = useState(profile.heightUnit === 'ft' ? '7' : '0');
  const [weight, setWeight] = useState(profile.weightUnit === 'lb' ? '154' : '70');
  const [error, setError] = useState('');

  const step = (value: string, change: number, setter: (next: string) => void, decimals = 0) => {
    const current = Number(value) || 0;
    setter(Math.max(0, current + change).toFixed(decimals));
    setError('');
  };

  const changeHeightUnit = (nextUnit: HeightUnit) => {
    const currentMeters = heightToMeters(numberValue(height), heightUnit, numberValue(inches) || 0);
    setHeightUnit(nextUnit);
    if (Number.isFinite(currentMeters) && currentMeters > 0) {
      if (nextUnit === 'ft') {
        const totalInches = currentMeters / 0.0254;
        setHeight(String(Math.floor(totalInches / 12)));
        setInches((totalInches % 12).toFixed(1));
      } else if (nextUnit === 'cm') {
        setHeight((currentMeters * 100).toFixed(1));
        setInches('0');
      } else {
        setHeight(currentMeters.toFixed(2));
        setInches('0');
      }
    }
  };

  const changeWeightUnit = (nextUnit: WeightUnit) => {
    const current = numberValue(weight);
    if (Number.isFinite(current) && current > 0) {
      const kg = weightUnit === 'lb' ? current * 0.45359237 : current;
      setWeight((nextUnit === 'lb' ? kgToWeight(kg, 'lb') : kg).toFixed(1));
    }
    setWeightUnit(nextUnit);
  };

  const reset = () => {
    setAge(String(profile.age)); setGender(profile.gender); setError('');
    setHeightUnit(profile.heightUnit); setWeightUnit(profile.weightUnit);
    setHeight(profile.heightUnit === 'ft' ? '5' : profile.heightUnit === 'm' ? '1.70' : '170');
    setInches(profile.heightUnit === 'ft' ? '7' : '0');
    setWeight(profile.weightUnit === 'lb' ? '154' : '70');
  };

  const calculate = () => {
    const measurements: Measurements = {
      age: numberValue(age), gender, height: numberValue(height), heightInches: numberValue(inches),
      heightUnit, weight: numberValue(weight), weightUnit,
    };
    const validation = validateMeasurements(measurements);
    if (validation) { setError(validation); return; }
    setError('');
    appHistory.push('/result', { measurements });
  };

  return (
    <IonPage>
      <PageHeading eyebrow="A MOMENT FOR YOU" title="Calculator" />
      <IonContent fullscreen className="page-content">
        <div className="form-intro"><p>Small steps, useful insight.</p><button className="icon-button" onClick={reset} aria-label="Reset calculator"><IonIcon icon={refreshOutline} /></button></div>

        <div className="input-card compact-card">
          <div className="field-label"><span>Age</span><span className="unit-note">YEARS</span></div>
          <div className="stepper-row">
            <button className="stepper-button" onClick={() => step(age, -1, setAge)} aria-label="Decrease age"><IonIcon icon={removeOutline} /></button>
            <IonInput className="measure-input centered" type="number" inputMode="numeric" min="2" max="120" value={age} onIonInput={(event) => setAge(event.detail.value ?? '')} aria-label="Age in years" />
            <button className="stepper-button" onClick={() => step(age, 1, setAge)} aria-label="Increase age"><IonIcon icon={addOutline} /></button>
          </div>
        </div>

        <div className="input-card compact-card gender-card">
          <div className="field-label"><span>Gender</span><span className="unit-note">OPTIONAL</span></div>
          <IonSelect className="form-select" value={gender} interface="popover" onIonChange={(event) => setGender(event.detail.value)} aria-label="Gender">
            {['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => <IonSelectOption key={option} value={option}>{option}</IonSelectOption>)}
          </IonSelect>
        </div>

        <section className="measure-section">
          <div className="section-heading measure-heading"><h2>Height</h2><span>YOUR HEIGHT</span></div>
          <IonSegment className="unit-segment" value={heightUnit} onIonChange={(event) => changeHeightUnit(event.detail.value as HeightUnit)}>
            <IonSegmentButton value="cm"><IonLabel>cm</IonLabel></IonSegmentButton>
            <IonSegmentButton value="m"><IonLabel>m</IonLabel></IonSegmentButton>
            <IonSegmentButton value="ft"><IonLabel>ft + in</IonLabel></IonSegmentButton>
          </IonSegment>
          <div className={`input-card measurement-card ${heightUnit === 'ft' ? 'feet-card' : ''}`}>
            <div className="measure-field">
              <span className="unit-note">{heightUnit === 'ft' ? 'FEET' : heightUnit.toUpperCase()}</span>
              <div className="measure-control"><button className="stepper-button" onClick={() => step(height, heightUnit === 'm' ? -0.01 : -1, setHeight, heightUnit === 'm' ? 2 : 0)} aria-label="Decrease height"><IonIcon icon={removeOutline} /></button><IonInput className="measure-input" type="number" inputMode="decimal" value={height} onIonInput={(event) => setHeight(event.detail.value ?? '')} aria-label={`Height in ${heightUnit}`} /><button className="stepper-button" onClick={() => step(height, heightUnit === 'm' ? 0.01 : 1, setHeight, heightUnit === 'm' ? 2 : 0)} aria-label="Increase height"><IonIcon icon={addOutline} /></button></div>
            </div>
            {heightUnit === 'ft' && <div className="measure-field"><span className="unit-note">INCHES</span><div className="measure-control"><button className="stepper-button" onClick={() => step(inches, -1, setInches)} aria-label="Decrease inches"><IonIcon icon={removeOutline} /></button><IonInput className="measure-input" type="number" inputMode="decimal" value={inches} onIonInput={(event) => setInches(event.detail.value ?? '')} aria-label="Additional inches" /><button className="stepper-button" onClick={() => step(inches, 1, setInches)} aria-label="Increase inches"><IonIcon icon={addOutline} /></button></div></div>}
          </div>
        </section>

        <section className="measure-section">
          <div className="section-heading measure-heading"><h2>Weight</h2><span>YOUR WEIGHT</span></div>
          <IonSegment className="unit-segment short-segment" value={weightUnit} onIonChange={(event) => changeWeightUnit(event.detail.value as WeightUnit)}>
            <IonSegmentButton value="kg"><IonLabel>kg</IonLabel></IonSegmentButton>
            <IonSegmentButton value="lb"><IonLabel>lb</IonLabel></IonSegmentButton>
          </IonSegment>
          <div className="input-card measurement-card">
            <div className="measure-field full-measure"><span className="unit-note">{weightUnit === 'kg' ? 'KILOGRAMS' : 'POUNDS'}</span><div className="measure-control"><button className="stepper-button" onClick={() => step(weight, -0.1, setWeight, 1)} aria-label="Decrease weight"><IonIcon icon={removeOutline} /></button><IonInput className="measure-input" type="number" inputMode="decimal" value={weight} onIonInput={(event) => setWeight(event.detail.value ?? '')} aria-label={`Weight in ${weightUnit}`} /><button className="stepper-button" onClick={() => step(weight, 0.1, setWeight, 1)} aria-label="Increase weight"><IonIcon icon={addOutline} /></button></div></div>
          </div>
        </section>

        {error && <div className="form-error" role="alert">{error}</div>}
        <IonButton expand="block" className="primary-button calculate-button" onClick={calculate}>Calculate my BMI <span className="button-arrow">→</span></IonButton>
        <p className="privacy-note">Your measurements stay on this device.</p>
      </IonContent>
    </IonPage>
  );
}