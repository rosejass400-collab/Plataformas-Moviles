import { useEffect, useState } from "react";

import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { useNavigate } from "react-router-dom";

import ContactForm from "../components/ContactForm";
import ContactList from "../components/ContactList";

import {
  createContact,
  getContacts,
  removeContact,
} from "../firebase/contacts";

import useNetworkStatus from "../hooks/useNetworkStatus";

function ContactsPage() {
  const navigate = useNavigate();

  const isOnline = useNetworkStatus();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContacts = async () => {
      if (!navigator.onLine) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const contactsFromFirebase =
          await getContacts();

        setContacts(contactsFromFirebase);
      } catch (error) {
        console.error(
          "Error al cargar contactos:",
          error
        );

        setError(
          "No fue posible cargar los contactos."
        );
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  const addContact = async (contact) => {
    if (!isOnline) {
      return;
    }

    try {
      setError("");

      const savedContact =
        await createContact(contact);

      setContacts((currentContacts) => [
        ...currentContacts,
        savedContact,
      ]);
    } catch (error) {
      console.error(
        "Error al agregar contacto:",
        error
      );

      setError(
        "No fue posible guardar el contacto."
      );

      throw error;
    }
  };

  const deleteContact = async (id) => {
    if (!isOnline) {
      return;
    }

    try {
      setError("");

      await removeContact(id);

      setContacts((currentContacts) =>
        currentContacts.filter(
          (contact) => contact.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Error al eliminar contacto:",
        error
      );

      setError(
        "No fue posible eliminar el contacto."
      );

      throw error;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Contactos</IonTitle>

          <IonButton
            slot="end"
            fill="clear"
            onClick={() => navigate("/tasks")}
          >
            Tareas
          </IonButton>

          <IonButton
            slot="end"
            fill="clear"
            onClick={() => navigate("/fruits")}
          >
            Frutas
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {!isOnline && (
          <IonText color="danger">
            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
                margin: "10px",
              }}
            >
              Sin conexión a Internet. Las acciones de
              contactos están deshabilitadas.
            </p>
          </IonText>
        )}

        <ContactForm
          onAddContact={addContact}
          disabled={!isOnline}
        />

        {loading && (
          <div
            style={{
              textAlign: "center",
              margin: "30px",
            }}
          >
            <IonSpinner name="crescent" />

            <IonText>
              <p>Cargando contactos...</p>
            </IonText>
          </div>
        )}

        {!loading && error && (
          <IonText color="danger">
            <p
              style={{
                textAlign: "center",
                margin: "20px",
              }}
            >
              {error}
            </p>
          </IonText>
        )}

        {!loading && !error && (
          <ContactList
            contacts={contacts}
            onDeleteContact={deleteContact}
            disabled={!isOnline}
          />
        )}
      </IonContent>
    </IonPage>
  );
}

export default ContactsPage;