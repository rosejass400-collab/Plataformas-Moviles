import { useEffect, useState } from "react";

import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { useNavigate } from "react-router-dom";

import {
  deleteFruit,
  getFruits,
  newFunction,
} from "../dexie/db";

function FruitsPage() {
  const navigate = useNavigate();

  const [fruits, setFruits] = useState([]);
  const [fruitName, setFruitName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFruits = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFruits();

      setFruits(data);
    } catch (error) {
      console.error(
        "Error al cargar las frutas:",
        error
      );

      setError(
        "No fue posible cargar las frutas."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFruits();
  }, []);

  const handleAddFruit = async () => {
    const name = fruitName.trim();

    if (!name) {
      setError(
        "Escribe el nombre de una fruta."
      );

      return;
    }

    try {
      setError("");

      const newFruit = await newFunction(name);

      setFruits((currentFruits) => [
        ...currentFruits,
        newFruit,
      ]);

      setFruitName("");
    } catch (error) {
      console.error(
        "Error al agregar fruta:",
        error
      );

      setError(
        "No fue posible guardar la fruta."
      );
    }
  };

  const handleDeleteFruit = async (id) => {
    try {
      setError("");

      await deleteFruit(id);

      setFruits((currentFruits) =>
        currentFruits.filter(
          (fruit) => fruit.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Error al eliminar fruta:",
        error
      );

      setError(
        "No fue posible eliminar la fruta."
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Frutas - Dexie</IonTitle>

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
            onClick={() =>
              navigate("/contacts")
            }
          >
            Contactos
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            label="Nueva fruta"
            labelPlacement="floating"
            placeholder="Ejemplo: Manzana"
            value={fruitName}
            onIonInput={(event) =>
              setFruitName(
                event.detail.value || ""
              )
            }
          />
        </IonItem>

        <IonButton
          expand="block"
          onClick={handleAddFruit}
        >
          Agregar fruta
        </IonButton>

        {error && (
          <p
            style={{
              color: "red",
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            {error}
          </p>
        )}

        {loading ? (
          <p
            style={{
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            Cargando frutas...
          </p>
        ) : (
          <IonList>
            {fruits.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "30px",
                }}
              >
                No hay frutas registradas.
              </p>
            ) : (
              fruits.map((fruit) => (
                <IonItem key={fruit.id}>
                  <span
                    style={{
                      flex: 1,
                    }}
                  >
                    {fruit.name}
                  </span>

                  <IonButton
                    color="danger"
                    slot="end"
                    onClick={() =>
                      handleDeleteFruit(
                        fruit.id
                      )
                    }
                  >
                    Eliminar
                  </IonButton>
                </IonItem>
              ))
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
}

export default FruitsPage;