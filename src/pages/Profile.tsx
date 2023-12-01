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

const Profile: React.FC = () => {
  const API = "https://infotic.up.railway.app/api/v1/users";
  const [data, setData] = useState({
    id: 0,
    full_name: "",
    mail: "",
  });
  const [secret, setSecret] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messageCustom, setMessageCustom] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setData(JSON.parse(storedUser));
    }
  }, []);

  const handleInputChange = (e: any) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleSecretChange = (e: any) => {
    setSecret(e.target.value);
  };

  const mostrarAlertaPersonalizada = (mensaje: string) => {
    setMessageCustom(mensaje);
    setIsOpen(true);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const id = data.id;

    try {
      let response: any = "";
      const full_name = data.full_name;
      const pin = secret;

      if (pin.trim().length === 0) {
        response = await axios.put(`${API}/${id}/edit-profile-no-password`, {
          full_name,
        });
      } else {
        response = await axios.put(`${API}/${id}/edit-profile`, {
          full_name,
          pin,
        });
      }

      const { user } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setData(JSON.parse(storedUser));
      }
      setSecret("");
      mostrarAlertaPersonalizada(response.data.message);
    } catch (error: any) {
      // Mostrar mensaje de error
      mostrarAlertaPersonalizada(error.message);
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
            <IonTitle>Información de perfil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="container p-5">
            <div className="row justify-content-center">
              <div
                className="col-lg-4 col-md-8 border rounded"
                style={{ padding: "20px", backgroundColor: "white" }}
              >
                <form onSubmit={handleSubmit}>
                  <div className="col-12">
                    <p>Nombres</p>
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-user"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="full_name"
                          placeholder="Nombres"
                          value={data.full_name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <p>Correo electronico</p>
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          id="mail"
                          placeholder="Correo"
                          disabled
                          value={data.mail}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <p>Contraseña</p>
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          id="secret"
                          placeholder="Nueva Clave"
                          value={secret}
                          onChange={handleSecretChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 text-center">
                      <button className="btn btn-success col-12" type="submit">
                        <i className="fas fa-save"></i> Guardar cambios
                      </button>
                    </div>
                  </div>
                </form>
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
export default Profile;
