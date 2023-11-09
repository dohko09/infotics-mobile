import {
  IonApp,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
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
import { Redirect, Route } from "react-router";
import AllNews from "./pages/AllNews";
import ViewNews from "./pages/ViewNews";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {
  newspaperOutline,
  logInOutline,
  peopleOutline,
  personAddOutline,
  logOutOutline,
} from "ionicons/icons";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>         
            <IonTitle>InfoTICS App</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonMenuToggle>
              <IonItem routerLink="/all-news" lines="full">
                <IonIcon color="medium" icon={newspaperOutline} slot="start" />
                <IonLabel>Todas las noticias</IonLabel>
              </IonItem>
              <IonItem lines="full">
                <IonIcon color="medium" icon={peopleOutline} slot="start" />
                <IonLabel>Usuarios Registrados</IonLabel>
              </IonItem>
              <IonItem lines="full">
                <IonIcon color="medium" icon={logInOutline} slot="start" />
                <IonLabel>Iniciar Sesión</IonLabel>
              </IonItem>
              <IonItem lines="full">
                <IonIcon color="medium" icon={personAddOutline} slot="start" />
                <IonLabel>Registrarse</IonLabel>
              </IonItem>
              <IonItem lines="none">
                <IonIcon color="medium" icon={logOutOutline} slot="start" />
                <IonLabel>Cerrar Sesión</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
      <IonRouterOutlet id="main-content">
        <Route path="/login" component={Login} exact />
        <Route path="/register" component={Register} exact />
        <Route path="/all-news" component={AllNews} exact />
        <Route path="/view-news/:id" component={ViewNews} exact />
        <Redirect to="/all-news" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
