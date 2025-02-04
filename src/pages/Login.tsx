import React, { useState } from "react";
import axios from "axios";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonToast,
  IonButton,
  IonMenuButton,
} from "@ionic/react";

import { Link } from "react-router-dom";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messageCustom, setMessageCustom] = useState("");
  const API = "https://infotic.up.railway.app/api/v1/auth";
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "pin") {
      setPin(value);
    }
  };

  const mostrarAlertaPersonalizada = (mensaje: string) => {
    setMessageCustom(mensaje);
    setIsOpen(true);
  };
  const handleLogin = async (event: any) => {
    event.preventDefault();
    if (email != null && pin != null) {
      try {
        const response = await axios.post(`${API}/login-no-password`, {
          email,
          pin,
        });
        const { user } = response.data;
        mostrarAlertaPersonalizada(response.data.message);
        // Restablecer el formulario después de enviar
        setEmail("");
        setPin("");
        localStorage.setItem("user", JSON.stringify(user));
        // Redireccionar a la página de inicio
        window.location.href = "/all-news";
        //usar history.push("/all-news");
      } catch (error: any) {
        // Mostrar mensaje de error
        console.error(error);
        mostrarAlertaPersonalizada(error.response.data.message);
      }
    } else {
      mostrarAlertaPersonalizada("Rellene todo los campos faltantes.");
    }
  };
  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton slot="start" fill="clear" color="dark">
              <IonMenuButton />
            </IonButton>
            <IonTitle>Inicio de Sesión</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonImg
            src="./logo-institucion.png"
            alt="Logo"
            style={{ height: "128px" }}
            className="mb-4"
          />
          <h1 className="text-center mb-4">Credenciales de acceso</h1>
          <form onSubmit={handleLogin}>
            <div className="col-md-12 mb-3">
              <label htmlFor="email" className="form-label">
                Correo Electrónico
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  autoComplete="off"
                  placeholder="Digite su correo electrónico"
                  required
                  value={email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-12 mb-3">
              <label htmlFor="pin" className="form-label">
                Contraseña
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  name="pin"
                  className="form-control"
                  autoComplete="off"
                  placeholder="Digite su contraseña"
                  required
                  value={pin}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Iniciar sesión
              </button>
            </div>
            <div className="text-center mt-3">
              <p>
                <Link to="/recover-password" className="btn btn-link">
                  Olvidé mi contraseña
                </Link>
              </p>
            </div>
          </form>
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

export default Login;
