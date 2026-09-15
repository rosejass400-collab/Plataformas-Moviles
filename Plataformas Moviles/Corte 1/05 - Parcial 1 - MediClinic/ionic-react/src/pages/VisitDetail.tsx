import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface Visita {
  id: number;
  paciente: string;
  hora: string;
  estado: string;
}

const visitasIniciales: Visita[] = [
  {
    id: 1,
    paciente: 'Juan Pérez',
    hora: '08:00 AM',
    estado: 'pendiente'
  },
  {
    id: 2,
    paciente: 'María López',
    hora: '10:00 AM',
    estado: 'en_camino'
  },
  {
    id: 3,
    paciente: 'Carlos Gómez',
    hora: '02:00 PM',
    estado: 'finalizada'
  }
];

const VisitDetail: React.FC = () => {
  const params = useParams();
  const id = Number(params.id);

  const visitasGuardadas = localStorage.getItem('visitas');

  const visitas: Visita[] = visitasGuardadas
    ? JSON.parse(visitasGuardadas)
    : visitasIniciales;

  const visitaInicial =
    visitas.find((item) => item.id === id);

  const [visita, setVisita] =
    useState<Visita | undefined>(visitaInicial);

  const cambiarEstado = () => {
    if (!visita) return;

    let nuevoEstado = visita.estado;

    if (visita.estado === 'pendiente') {
      nuevoEstado = 'en_camino';
    } else if (visita.estado === 'en_camino') {
      nuevoEstado = 'finalizada';
    }

    const visitaActualizada = {
      ...visita,
      estado: nuevoEstado
    };

    const visitasActualizadas = visitas.map((item) =>
      item.id === visita.id
        ? visitaActualizada
        : item
    );

    localStorage.setItem(
      'visitas',
      JSON.stringify(visitasActualizadas)
    );

    setVisita(visitaActualizada);
  };

  if (!visita) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/visitas" />
            </IonButtons>

            <IonTitle>Detalle de visita</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <h2>Visita no encontrada</h2>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/visitas" />
          </IonButtons>

          <IonTitle>Detalle de visita</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>{visita.paciente}</h2>

        <p>
          <strong>Hora:</strong> {visita.hora}
        </p>

        <p>
          <strong>Estado:</strong> {visita.estado}
        </p>

        {visita.estado !== 'finalizada' && (
          <IonButton
            expand="block"
            onClick={cambiarEstado}
          >
            Cambiar estado
          </IonButton>
        )}

        {visita.estado === 'finalizada' && (
          <IonButton
            expand="block"
            color="success"
            disabled
          >
            Visita finalizada
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default VisitDetail;