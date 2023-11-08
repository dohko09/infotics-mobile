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
} from "@ionic/react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./AllNews.css";
import { Link } from "react-router-dom";
import { formatearFecha } from "../../functions/methods";
const AllNews: React.FC = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgBase64, setImgBase64] = useState("");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    getNews();
  }, []);
  const API = "https://infotic.up.railway.app";
  const getNews = async () => {
    try {
      const response = await axios.get(`${API}/news_all`);
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };
  const generateQR = async (url: any) => {
    const response = await axios.post(`${API}/qr`, {
      url: url,
    });
    setImgBase64(response.data.qrCode);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Todas las noticias</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                {loading ? (
                  <p className="text-center">Cargando noticias...</p>
                ) : (
                  news.map((item: any) => (
                    <IonCard key={item.id}>
                      <IonCardHeader>
                        <IonText
                          className="text-center"
                          style={{ fontSize: "1rem" }}
                        >
                          <b>{item.title}</b>
                        </IonText>
                      </IonCardHeader>
                      <IonImg src={item.image_src} />
                      <IonCardContent>
                        <IonText style={{ textAlign: "center" }}>
                          <p>
                            <b>Creado: </b> {formatearFecha(item.created_at)}
                          </p>
                          <p>
                            <b>Tipo:</b>{" "}
                            {item.isPrivate ? "Privado" : "Publico"}
                          </p>
                        </IonText>
                      </IonCardContent>
                      <div
                        style={{
                          textAlign: "center",
                          margin: "0px 0px 20px 0px",
                        }}
                      >
                        <Link
                          to={`/view-news/${item.id}`}
                          className="btn btn-outline-warning"
                          style={{ margin: "5px" }}
                        >
                          <i className="fas fa-eye" /> Ver mas
                        </Link>
                        <span
                          className="btn btn-outline-primary"
                          style={{ margin: "5px" }}
                          onClick={() => {
                            generateQR(
                              `https://infotics.vercel.app/#/${item.id}`
                            );
                          }}
                        >
                          <i className="fas fa-eye"></i> Código QR
                        </span>
                      </div>
                    </IonCard>
                  ))
                )}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
      <Modal show={showModal} onHide={handleCloseModal} size="sm" centered>
        <Modal.Header closeButton>
          <Modal.Title>Código QR - InfoTICs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group text-center">
            <img src={`${imgBase64}`} alt="Imagen" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AllNews;
