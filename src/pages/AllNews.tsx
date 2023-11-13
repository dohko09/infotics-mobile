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
} from "@ionic/react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { formatearFecha } from "../functions/methods";

const AllNews: React.FC = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgBase64, setImgBase64] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  useEffect(() => {
    getNews();
  }, []);
  const API = "https://infotic.up.railway.app";
  const user: any | null = JSON.parse(localStorage.getItem("user") || "null");
  const getNews = async () => {
    let response;
    try {
      user?.category === "Administrador" || user?.category === "Miembro"
        ? (response = await axios.get(`${API}/news_all`))
        : (response = await axios.get(`${API}/news_public`));
      setNews(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las noticias:", error);
    }
  };
  const generateQR = async (url: string) => {
    try {
      const response = await axios.post(`${API}/qr`, { url });
      setImgBase64(response.data.qrCode);
      setShowModal(true);
    } catch (error) {
      console.error("Error generando código QR:", error);
    }
  };
  const mostrarDetalle = async (url: string) => {
    try {
      console.log(url);
      const response: any = await axios.get(url);
      console.log(response.data[0].image_src);
      setTitle(response.data[0].title);
      setDescription(response.data[0].content);
      setImage(response.data[0].image_src);
      setShowModalDetail(true);
    } catch (error) {}
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleCloseModalDetail = () => {
    setShowModalDetail(false);
  };
  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton slot="start" fill="clear" color="dark">
              <IonMenuButton />
            </IonButton>
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
                        <span
                          className="btn btn-outline-warning"
                          style={{ margin: "5px" }}
                          onClick={() => {
                            mostrarDetalle(`${API}/news/${item.id}`);
                          }}
                        >
                          <i className="fas fa-eye" /> Ver mas
                        </span>
                        <span
                          className="btn btn-outline-primary"
                          style={{ margin: "5px" }}
                          onClick={() => {
                            generateQR(
                              `https://infotics.vercel.app/#/${item.id}`
                            );
                          }}
                        >
                          <i className="fas fa-qrcode"></i> Código QR
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
      <Modal show={showModalDetail} onHide={handleCloseModalDetail} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de noticia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group text-center">
            <img
              src={`${image}`}
              alt="Imagen"
              style={{ borderRadius: "5px" }}
            />
          </div>
          <h5 style={{ textAlign: "justify", margin: "20px 0px" }}>{title}</h5>
          <IonText style={{ textAlign: "justify" }}>
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </IonText>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalDetail}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AllNews;
