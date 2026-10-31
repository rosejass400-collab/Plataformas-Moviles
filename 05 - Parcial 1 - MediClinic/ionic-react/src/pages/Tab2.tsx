import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';

import { useEffect, useState } from 'react';

import './Tab2.css';

interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  cc: string;
  telefono: string;
}

const pacientesIniciales: Paciente[] = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    cc: '123456789',
    telefono: '3001234567'
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'López',
    cc: '987654321',
    telefono: '3159876543'
  },
  {
    id: 3,
    nombre: 'Carlos',
    apellido: 'Gómez',
    cc: '456789123',
    telefono: '3105555555'
  }
];

const Tab2: React.FC = () => {
  const [pacientes, setPacientes] =
    useState<Paciente[]>([]);

  useEffect(() => {
    const pacientesGuardados =
      localStorage.getItem('pacientes');

    if (pacientesGuardados) {
      setPacientes(JSON.parse(pacientesGuardados));
    } else {
      localStorage.setItem(
        'pacientes',
        JSON.stringify(pacientesIniciales)
      );

      setPacientes(pacientesIniciales);
    }
  }, []);

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Pacientes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <h2>Lista de pacientes</h2>

        <IonList>

          {pacientes.map((paciente) => (

            <IonItem key={paciente.id}>

              <IonLabel>

                <h2>
                  {paciente.nombre} {paciente.apellido}
                </h2>

                <p>
                  CC: {paciente.cc}
                </p>

                <p>
                  Teléfono: {paciente.telefono}
                </p>

              </IonLabel>

            </IonItem>

          ))}

        </IonList>

      </IonContent>

    </IonPage>
  );
};

export default Tab2;