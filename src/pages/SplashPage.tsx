import { useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';

export default function SplashPage() {
  const history = useHistory();
  useEffect(() => {
    const timer = window.setTimeout(() => history.replace('/home'), 950);
    return () => window.clearTimeout(timer);
  }, [history]);

  return (
    <IonPage>
      <IonContent fullscreen className="splash-page">
        <div className="splash-content">
          <div className="splash-symbol">b<span>.</span></div>
          <h1>BMI Calculator</h1>
          <p>A little more in tune.</p>
          <div className="splash-loader" />
        </div>
      </IonContent>
    </IonPage>
  );
}