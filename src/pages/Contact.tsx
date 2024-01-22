import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import axios from "axios";

const Contact: React.FC = () => {
  const API = "https://infotic.up.railway.app/api/v1/users";
  const userData:any = JSON.parse(localStorage.getItem("user")||"null");
  const [user, setUser] = useState({
    id: 0,
    full_name: "",
    mail: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleSend = async (event: any) => {
    event.preventDefault();
    const id = user.id;
    try {
      const response = await axios.post(`${API}/message`, {
        id,
        message,
      },
      {
        headers: {
          Authorization: `${userData.token}`,
        },
      });
      mostrarAlertaPersonalizada(response.data.message);
      // Restablecer el formulario después de enviar
      setMessage("");
    } catch (error: any) {
      // Mostrar mensaje de error
      mostrarAlertaPersonalizada(error.message);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messageCustom, setMessageCustom] = useState("");

  const mostrarAlertaPersonalizada = (mensaje: string) => {
    setMessageCustom(mensaje);
    setIsOpen(true);
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton slot="start" fill="clear" color="dark">
              <IonMenuButton />
            </IonButton>
            <IonTitle>Recomendaciones/Sugerencias</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="container p-5">
            <div className="row justify-content-center">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSend}>
                    <div className="mb-3">
                      <label htmlFor="inputNombre" className="form-label">
                        Nombre
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputNombre"
                        value={user.full_name}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="inputEmail" className="form-label">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="inputEmail"
                        value={user.mail}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="inputMensaje" className="form-label">
                        Mensaje
                      </label>
                      <textarea
                        className="form-control"
                        id="inputMensaje"
                        rows={3}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                        }}
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="col-sm-12 text-center">
                        <button
                          className="btn btn-success col-12"
                          type="submit"
                        >
                          <i className="far fa-paper-plane"></i> Enviar
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
      <IonToast
        isOpen={isOpen}
        message={messageCustom}
        onDidDismiss={() => setIsOpen(false)}
        duration={5000}
        position="bottom"
      />
    </>
  );
};
export default Contact;
