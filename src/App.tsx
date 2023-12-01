import {
  IonApp,
  IonAvatar,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { Redirect, Route } from "react-router-dom";
import AllNews from "./pages/AllNews";
import Login from "./pages/Login";
import EmailsRegistered from "./pages/EmailsRegistered";
import {
  newspaperOutline,
  logInOutline,
  peopleOutline,
  logOutOutline,
  personOutline,
  mailOutline,
  chatbubbleEllipsesOutline,
  barChartOutline,
} from "ionicons/icons";
import PrivateRoute from "./functions/PrivateRoute";
import React from "react";
import Footer from "./pages/Footer";
import Profile from "./pages/Profile";
import UsersRegistered from "./pages/UsersRegistered";
import Messages from "./pages/Messages";
import Dashboard from "./pages/Dashboard";
import { Plugins } from "@capacitor/core";
import Contact from "./pages/Contact";
import RecoverPassword from "./pages/RecoverPassword";
setupIonicReact();

const App: React.FC = () => {
  const { App } = Plugins;
  const user: any | null = JSON.parse(localStorage.getItem("user") || "null");
  const cerrarAplicacion = () => {
    App.exitApp();
  };
  return (
    <IonApp>
      <IonReactRouter>
        <IonMenu contentId="main-content">
          <IonHeader>
            <IonToolbar>
              <IonTitle>InfoTICS App</IonTitle>
              {user && (
                <IonChip disabled>
                  <IonAvatar>
                    <img
                      alt="Silhouette of a person's head"
                      src="https://ionicframework.com/docs/img/demos/avatar.svg"
                    />
                  </IonAvatar>
                  <IonLabel>{user.full_name}</IonLabel>
                </IonChip>
              )}
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonMenuToggle>
                <IonItem routerLink="/all-news" lines="full">
                  <IonIcon
                    color="medium"
                    icon={newspaperOutline}
                    slot="start"
                  />
                  <IonLabel>Ver noticias</IonLabel>
                </IonItem>
                {user?.category == "Administrador" && (
                  <IonItem routerLink="/emails-registered" lines="full">
                    <IonIcon color="medium" icon={mailOutline} slot="start" />
                    <IonLabel>Correos registrados</IonLabel>
                  </IonItem>
                )}
                {user && (
                  <IonItem routerLink="/profile" lines="full">
                    <IonIcon color="medium" icon={personOutline} slot="start" />
                    <IonLabel>Perfil</IonLabel>
                  </IonItem>
                )}
                {user?.category == "Administrador" && (
                  <IonItem routerLink="/users" lines="full">
                    <IonIcon color="medium" icon={peopleOutline} slot="start" />
                    <IonLabel>Usuarios registrados</IonLabel>
                  </IonItem>
                )}
                {user?.category == "Administrador" && (
                  <IonItem routerLink="/messages" lines="full">
                    <IonIcon
                      color="medium"
                      icon={chatbubbleEllipsesOutline}
                      slot="start"
                    />
                    <IonLabel>Recomendaciones</IonLabel>
                  </IonItem>
                )}
                {user?.category == "Administrador" && (
                  <IonItem routerLink="/dashboard" lines="full">
                    <IonIcon
                      color="medium"
                      icon={barChartOutline}
                      slot="start"
                    />
                    <IonLabel>Estadísticas</IonLabel>
                  </IonItem>
                )}
                {!user && (
                  <IonItem routerLink="/login" lines="full">
                    <IonIcon color="medium" icon={logInOutline} slot="start" />
                    <IonLabel>Iniciar Sesión</IonLabel>
                  </IonItem>
                )}

                {user?.category == "Miembro" && (
                  <IonItem routerLink="/contact-us" lines="full">
                    <IonIcon
                      color="medium"
                      icon={chatbubbleEllipsesOutline}
                      slot="start"
                    />
                    <IonLabel>Contáctanos</IonLabel>
                  </IonItem>
                )}

                {user && (
                  <IonItem
                    routerLink="/login"
                    lines="full"
                    onClick={() => {
                      localStorage.removeItem("user");
                      cerrarAplicacion();
                    }}
                  >
                    <IonIcon color="medium" icon={logOutOutline} slot="start" />
                    <IonLabel>Cerrar Sesión</IonLabel>
                  </IonItem>
                )}
              </IonMenuToggle>
            </IonList>
          </IonContent>
          <Footer />
        </IonMenu>
        <IonRouterOutlet id="main-content">
          <Route path="/login" component={Login} exact />
          <Route path="/recover-password" component={RecoverPassword} exact />
          <PrivateRoute
            path="/emails-registered"
            component={EmailsRegistered}
            exact
          />
          <PrivateRoute path="/profile" component={Profile} exact />
          <PrivateRoute path="/users" component={UsersRegistered} exact />
          <PrivateRoute path="/messages" component={Messages} exact />
          <PrivateRoute path="/dashboard" component={Dashboard} exact />
          <PrivateRoute path="/contact-us" component={Contact} exact />
          <Route path="/all-news" component={AllNews} exact />
          <Redirect to="/all-news" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
