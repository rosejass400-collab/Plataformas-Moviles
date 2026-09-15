import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonBadge
} from '@ionic/react';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Tab1.css';

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

const Tab1: React.FC = () => {
  const [visitas, setVisitas] = useState<Visita[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const visitasGuardadas = localStorage.getItem('visitas');

    if (visitasGuardadas) {
      setVisitas(JSON.parse(visitasGuardadas));
    } else {
      localStorage.setItem(
        'visitas',
        JSON.stringify(visitasIniciales)
      );

      setVisitas(visitasIniciales);
    }
  }, []);

  const abrirDetalle = (id: number) => {
    navigate(`/visitas/${id}`);
  };

  const obtenerColor = (estado: string) => {
    if (estado === 'pendiente') {
      return 'warning';
    }

    if (estado === 'en_camino') {
      return 'primary';
    }

    return 'success';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Visitas del día</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <h2>Mis visitas</h2>

        <IonList>

          {visitas.map((visita) => (
            <IonItem
              key={visita.id}
              button
              detail
              onClick={() => abrirDetalle(visita.id)}
            >
              <IonLabel>

                <h2>
                  {visita.paciente}
                </h2>

                <p>
                  Hora: {visita.hora}
                </p>

              </IonLabel>

              <IonBadge
                color={obtenerColor(visita.estado)}
              >
                {visita.estado}
              </IonBadge>

            </IonItem>
          ))}

        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;