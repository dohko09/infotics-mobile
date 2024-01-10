import React, { useState } from "react";
import axios from "axios";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
  IonButton,
  IonMenuButton,
} from "@ionic/react";

const RecoverPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messageCustom, setMessageCustom] = useState("");
  const API = "https://infotic.up.railway.app/api/v1/auth";

  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/reset-password`, {
        email,
      });
      mostrarAlertaPersonalizada(response.data.message);
      window.location.href = "/login";
    } catch (error: any) {
      console.error(error);
      mostrarAlertaPersonalizada(error.message);
    }
  };

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
            <IonTitle>Recuperar contraseña</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="col-lg-12 col-md-12 col-sm-12 mt-5">
            <form onSubmit={handleResetPassword} className="container mt-4">
              <div className="row justify-content-center">
                <div className="col-md-6 mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      placeholder="Ingrese su correo electrónico"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-6 d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary col-12 mb-3">
                    <i className="fas fa-unlock"></i> Restablecer
                  </button>
                </div>
              </div>
            </form>
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

export default RecoverPassword;
