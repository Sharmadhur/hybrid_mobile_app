import { IonButtons, IonIcon, IonTitle, IonToolbar } from '@ionic/react';
import { leafOutline } from 'ionicons/icons';
import type { ReactNode } from 'react';

interface PageHeadingProps {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}

export default function PageHeading({ eyebrow, title, action }: PageHeadingProps) {
  return (
    <IonToolbar className="page-toolbar">
      <div slot="start" className="brand-mark small"><IonIcon icon={leafOutline} /></div>
      <IonTitle>
        {eyebrow && <span className="toolbar-eyebrow">{eyebrow}</span>}
        <span className="toolbar-title">{title}</span>
      </IonTitle>
      {action && <IonButtons slot="end">{action}</IonButtons>}
    </IonToolbar>
  );
}