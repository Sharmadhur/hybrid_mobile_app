import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';
import PageHeading from '../components/PageHeading';

const categories = [
  { range: 'Below 18.5', name: 'Underweight', className: 'low' },
  { range: '18.5 – 24.9', name: 'Normal weight', className: 'healthy' },
  { range: '25.0 – 29.9', name: 'Overweight', className: 'high' },
  { range: '30.0 and above', name: 'Obesity', className: 'very-high' },
];

export default function AboutPage() {
  return (
    <IonPage>
      <PageHeading eyebrow="A LITTLE CONTEXT" title="About BMI" />
      <IonContent fullscreen className="page-content about-content">
        <p className="about-lede">A quick reference point for your health journey, with room for the rest of the story.</p>

        <section className="about-section">
          <p className="eyebrow">THE FORMULA</p>
          <h2>Weight, in relation<br />to height.</h2>
          <div className="formula-block"><span>BMI</span><strong>weight (kg)<br /><i>height (m) × height (m)</i></strong></div>
          <p>For imperial measurements, BMI = (weight in pounds × 703) ÷ height in inches squared.</p>
        </section>

        <section className="about-section category-section">
          <p className="eyebrow">ADULT REFERENCE</p>
          <h2>Where the numbers sit.</h2>
          <p>These standard categories are intended for adults aged 20 and above.</p>
          <div className="about-categories">{categories.map((category) => <div className={`about-category ${category.className}`} key={category.name}><span>{category.range}</span><strong>{category.name}</strong></div>)}</div>
        </section>

        <section className="about-section limitations-section">
          <p className="eyebrow">WHAT BMI CAN’T TELL YOU</p>
          <h2>A starting point,<br />not a diagnosis.</h2>
          <p>BMI is a screening measure. It does not directly measure body fat, distinguish muscle from fat, or account for differences in body composition, age, or individual health.</p>
          <p>For children and teenagers, BMI must be interpreted using age- and sex-specific percentiles rather than adult categories.</p>
        </section>

        <div className="medical-disclaimer"><strong>A note on your health</strong><p>This app is for informational purposes only and is not medical advice. BMI does not diagnose medical conditions. Please talk with a qualified health professional about questions or concerns specific to you.</p></div>
        <Link to="/calculator" className="about-back">Back to your check-in <span>→</span></Link>
      </IonContent>
    </IonPage>
  );
}