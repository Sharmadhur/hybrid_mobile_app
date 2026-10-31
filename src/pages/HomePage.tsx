import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowForwardOutline, informationCircleOutline, sparklesOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import PageHeading from '../components/PageHeading';
import { useAppData } from '../state/AppData';
import { formatWeight } from '../utils/bmi';

export default function HomePage() {
  const { history, profile } = useAppData();
  const latest = history[0];
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <IonPage>
      <PageHeading eyebrow="YOUR WELLNESS JOURNAL" title="Today" />
      <IonContent fullscreen className="page-content">
        <section className="welcome-row">
          <div><p className="eyebrow">{greeting}{profile.name ? `, ${profile.name}` : ''}</p><h1>A clearer picture<br />starts here.</h1></div>
          <div className="sun-stamp"><IonIcon icon={sparklesOutline} /></div>
        </section>

        <section className="feature-panel">
          <div className="feature-copy">
            <span className="feature-kicker">YOUR BODY, IN CONTEXT</span>
            <h2>{latest ? 'Your latest check-in' : 'Make space for a check-in'}</h2>
            <p>{latest ? `Recorded ${new Date(latest.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}` : 'A simple number. A useful place to begin.'}</p>
            <IonButton routerLink="/calculator" className="feature-button">
              {latest ? 'Calculate again' : 'Calculate BMI'} <IonIcon slot="end" icon={arrowForwardOutline} />
            </IonButton>
          </div>
          <div className="feature-result" aria-label={latest ? `BMI ${latest.bmi.toFixed(1)}` : 'No BMI recorded'}>
            <span>{latest ? latest.bmi.toFixed(1) : '--'}</span><small>BMI</small>
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          </div>
        </section>

        <div className="section-heading"><h2>At a glance</h2><span>ADULT GUIDELINES</span></div>
        <div className="category-grid">
          <div className="category-item low"><span>BELOW 18.5</span><strong>Underweight</strong></div>
          <div className="category-item healthy"><span>18.5–24.9</span><strong>Healthy range</strong></div>
          <div className="category-item high"><span>25–29.9</span><strong>Overweight</strong></div>
          <div className="category-item very-high"><span>30 AND ABOVE</span><strong>Obesity</strong></div>
        </div>

        <section className="latest-row">
          <div className="section-heading"><h2>Recent check-in</h2><Link to="/history">See all</Link></div>
          {latest ? (
            <div className="recent-entry">
              <div className="recent-date"><strong>{new Date(latest.createdAt).toLocaleDateString(undefined, { day: '2-digit' })}</strong><span>{new Date(latest.createdAt).toLocaleDateString(undefined, { month: 'short' })}</span></div>
              <div className="recent-details"><strong>{latest.category}</strong><span>{formatWeight(latest.weightKg, profile.weightUnit)} · {(latest.heightMeters * 100).toFixed(0)} cm</span></div>
              <strong className="recent-bmi">{latest.bmi.toFixed(1)}</strong>
            </div>
          ) : (
            <div className="empty-inline"><span className="empty-icon">01</span><p>Your saved measurements will appear here.</p></div>
          )}
        </section>

        <Link to="/about" className="disclaimer-link"><IonIcon icon={informationCircleOutline} /> BMI is one measure, not the whole story <IonIcon icon={arrowForwardOutline} /></Link>
      </IonContent>
    </IonPage>
  );
}