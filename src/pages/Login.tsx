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
  const API = "https://infotic.up.railway.app";
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "pin") {
      setPin(value);
    }
  };
  const testSweerAlert = () => {
    setMessageCustom("Inicio de sesión exitoso");
    setIsOpen(true);
  };

  const mostrarAlertaPersonalizada = (
    title: any,
    text: any,
    icon: any,
    confirm: any
  ) => {};
  const handleLogin = async (event: any) => {
    event.preventDefault();
    if (email != null && pin != null) {
      try {
        const response = await axios.post(`${API}/login`, {
          email,
          pin,
        });
        const { user } = response.data;
        mostrarAlertaPersonalizada(
          "Inicio de sesión exitoso",
          response.data.message,
          "success",
          "Aceptar"
        );
        // Restablecer el formulario después de enviar
        setEmail("");
        setPin("");
        console.log(response.data);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error: any) {
        // Mostrar mensaje de error
        console.error(error);
        mostrarAlertaPersonalizada(
          "Inicio de sesión fallido",
          error.response.data.message,
          "error",
          "Aceptar"
        );
      }
    } else {
      mostrarAlertaPersonalizada(
        "Inicio de sesión fallido",
        "Rellene todo los campos faltantes.",
        "error",
        "Aceptar"
      );
    }
  };
  return (
    <IonPage style={{ backgroundColor: "#4A8ECC" }}>
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
        ></IonImg>
        <h1 className="text-center mb-4">Credenciales de acceso</h1>
        <form onSubmit={handleLogin} className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 mb-3">
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
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  name="pin"
                  className="form-control"
                  autoComplete="off"
                  placeholder="Digite su clave"
                  required
                  value={pin}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-7 d-flex justify-content-center">
              <button type="submit" className="btn btn-primary col-md-12 mb-3">
                Iniciar sesión
              </button>
            </div>
            <div className="col-md-7 d-flex justify-content-center">
              <p>
                <Link to="/recover-password" className="btn btn-link">
                  Olvide mi contraseña
                </Link>
              </p>
            </div>
          </div>
        </form>
        <IonToast
          isOpen={isOpen}
          message={messageCustom}
          onDidDismiss={() => setIsOpen(false)}
          duration={5000}
          position="bottom"
        ></IonToast>
      </IonContent>
    </IonPage>
  );
};

export default Login;
