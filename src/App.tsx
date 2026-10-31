import { useEffect } from 'react';
import { Redirect, Route, useHistory, useLocation } from 'react-router-dom';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { barChartOutline, calculatorOutline, homeOutline, personOutline } from 'ionicons/icons';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AppDataProvider, useAppData } from './state/AppData';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import SplashPage from './pages/SplashPage';

function AppRoutes() {
  const { ready, darkMode } = useAppData();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (!isPlatform('hybrid')) return;
    const listener = CapacitorApp.addListener('backButton', () => {
      if (location.pathname === '/home') return;
      if (location.pathname === '/calculator' || location.pathname === '/history' || location.pathname === '/profile') {
        history.replace('/home');
      } else {
        history.goBack();
      }
    });
    return () => { void listener.then((handle) => handle.remove()); };
  }, [history, location.pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (isPlatform('hybrid')) {
      void StatusBar.setStyle({ style: Style.Dark });
      void StatusBar.setBackgroundColor({ color: darkMode ? '#182722' : '#f5f7f1' });
    }
  }, [darkMode]);

  if (!ready) return <IonApp><div className="boot-screen"><div className="brand-mark">b.</div></div></IonApp>;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/splash" component={SplashPage} />
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/calculator" component={CalculatorPage} />
        <Route exact path="/result" component={ResultPage} />
        <Route exact path="/history" component={HistoryPage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path="/" render={() => <Redirect to="/splash" />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className="app-tab-bar">
        <IonTabButton tab="home" href="/home"><IonIcon icon={homeOutline} /><IonLabel>Home</IonLabel></IonTabButton>
        <IonTabButton tab="calculator" href="/calculator"><IonIcon icon={calculatorOutline} /><IonLabel>Calculate</IonLabel></IonTabButton>
        <IonTabButton tab="history" href="/history"><IonIcon icon={barChartOutline} /><IonLabel>History</IonLabel></IonTabButton>
        <IonTabButton tab="profile" href="/profile"><IonIcon icon={personOutline} /><IonLabel>Profile</IonLabel></IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

export default function App() {
  return <IonApp><IonReactRouter><AppDataProvider><AppRoutes /></AppDataProvider></IonReactRouter></IonApp>;
}