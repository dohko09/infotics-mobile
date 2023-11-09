import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonCheckbox,
  IonLabel,
  IonFooter,
} from "@ionic/react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import { formatearFecha } from "../functions/methods";
const AllNews: React.FC = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews();
  }, []);
  const API = "https://infotic.up.railway.app";
  const id = useParams<{ id: string }>().id;
  const getNews = async () => {
    try {
      const response = await axios.get(`${API}/news/${id}`);
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" fill="clear" color="dark">
            <IonMenuButton />
          </IonButton>
          <IonTitle>Detalle de noticia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              {loading ? (
                <p className="text-center">Cargando noticia...</p>
              ) : (
                news.map((item: any) => (
                  <IonCard key={item.id}>
                    <IonImg src={item.image_src} />
                    <IonCardHeader>
                      <IonText
                        className="text-center"
                        style={{ fontSize: "1rem" }}
                      >
                        <b>{item.title}</b>
                      </IonText>
                    </IonCardHeader>

                    <IonCardContent>
                      <IonText style={{ textAlign: "justify" }}>
                        <div
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      </IonText>
                      <IonFooter
                        style={{
                          border: "1px solid",
                          borderRadius: "5px",
                          marginTop: "10px",
                        }}
                      >
                        <IonText style={{ textAlign: "center" }}>
                          <p className="mt-2">
                            <b>Creado: </b> {formatearFecha(item.created_at)}
                          </p>
                        </IonText>
                        <IonText style={{ textAlign: "center" }}>
                          <p>
                            <b>Categoría: </b> {item.category}
                          </p>
                        </IonText>
                        <div className="form-group text-center mt-2 mb-2">
                          <IonCheckbox
                            slot="start"
                            checked={item.isPrivate}
                            disabled={true}
                            style={{ margin: "0px 5px 0px 10px" }}
                          />
                          <IonLabel position="floating"> Privado</IonLabel>
                          <IonCheckbox
                            slot="start"
                            checked={item.isAnchored}
                            disabled={true}
                            style={{ margin: "0px 5px 0px 10px" }}
                          />
                          <IonLabel position="floating"> Anclado</IonLabel>
                        </div>
                      </IonFooter>
                    </IonCardContent>
                  </IonCard>
                ))
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AllNews;
