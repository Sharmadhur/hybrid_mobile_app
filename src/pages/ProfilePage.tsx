import { useState } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonPage, IonSelect, IonSelectOption, IonToggle, IonToast } from '@ionic/react';
import { informationCircleOutline, moonOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import PageHeading from '../components/PageHeading';
import { useAppData } from '../state/AppData';
import type { HeightUnit, WeightUnit } from '../utils/bmi';

export default function ProfilePage() {
  const { profile, saveProfile, darkMode, setDarkMode } = useAppData();
  const [draft, setDraft] = useState(profile);
  const [showToast, setShowToast] = useState(false);
  const update = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const save = async () => {
    await saveProfile({ ...draft, age: Number(draft.age) || 30, name: draft.name.trim() });
    setShowToast(true);
  };

  return (
    <IonPage>
      <PageHeading eyebrow="YOUR SETTINGS" title="Profile" />
      <IonContent fullscreen className="page-content">
        <div className="profile-intro"><div className="profile-monogram">{draft.name.trim().charAt(0).toUpperCase() || 'Y'}</div><div><p className="eyebrow">A SPACE THAT’S YOURS</p><h1>Your details</h1></div></div>

        <section className="profile-section">
          <div className="section-heading"><h2>About you</h2><span>OPTIONAL</span></div>
          <label className="profile-field"><span>Name</span><IonInput value={draft.name} maxlength={40} placeholder="What should we call you?" onIonInput={(event) => update('name', event.detail.value ?? '')} /></label>
          <label className="profile-field"><span>Age</span><IonInput type="number" inputMode="numeric" min="2" max="120" value={draft.age} onIonInput={(event) => update('age', Number(event.detail.value) || 0)} /></label>
          <label className="profile-field select-field"><span>Gender</span><IonSelect value={draft.gender} interface="popover" onIonChange={(event) => update('gender', event.detail.value)}>{['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => <IonSelectOption key={option} value={option}>{option}</IonSelectOption>)}</IonSelect></label>
        </section>

        <section className="profile-section preferences-section">
          <div className="section-heading"><h2>Preferences</h2><span>MEASUREMENTS</span></div>
          <label className="profile-field select-field"><span>Height unit</span><IonSelect value={draft.heightUnit} interface="popover" onIonChange={(event) => update('heightUnit', event.detail.value as HeightUnit)}><IonSelectOption value="cm">Centimeters (cm)</IonSelectOption><IonSelectOption value="m">Meters (m)</IonSelectOption><IonSelectOption value="ft">Feet & inches (ft + in)</IonSelectOption></IonSelect></label>
          <label className="profile-field select-field"><span>Weight unit</span><IonSelect value={draft.weightUnit} interface="popover" onIonChange={(event) => update('weightUnit', event.detail.value as WeightUnit)}><IonSelectOption value="kg">Kilograms (kg)</IonSelectOption><IonSelectOption value="lb">Pounds (lb)</IonSelectOption></IonSelect></label>
          <div className="theme-row"><div><IonIcon icon={moonOutline} /><span>Dark appearance</span></div><IonToggle checked={darkMode} onIonChange={(event) => void setDarkMode(event.detail.checked)} aria-label="Dark appearance" /></div>
        </section>

        <IonButton expand="block" className="primary-button save-profile" onClick={save}>Save profile</IonButton>
        <Link to="/about" className="about-row"><span><IonIcon icon={informationCircleOutline} /> About BMI Calculator</span><span>→</span></Link>
        <IonToast isOpen={showToast} message="Profile saved on this device." duration={2000} onDidDismiss={() => setShowToast(false)} position="bottom" />
      </IonContent>
    </IonPage>
  );
}