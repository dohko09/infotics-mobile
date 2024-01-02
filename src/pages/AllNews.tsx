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
import * as timeago from "timeago.js";
import es from "timeago.js/lib/lang/es";
import { Plugins } from "@capacitor/core";
const { Share } = Plugins;

const AllNews: React.FC = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgBase64, setImgBase64] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);

  timeago.register("es", es);
  useEffect(() => {
    getNews();
  }, []);
  const API = "https://infotic.up.railway.app/api/v1";
  const user: any | null = JSON.parse(localStorage.getItem("user") || "null");
  const getNews = async () => {
    let response;
    try {
      user?.category === "Administrador" || user?.category === "Miembro"
        ? (response = await axios.get(`${API}/news/all`))
        : (response = await axios.get(`${API}/news/public`));
      setNews(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las noticias:", error);
    }
  };
  const shareNews = async (row: any) => {
    try {
      await Share.share({
        title: "Compartir noticia",
        text: `📢 Ve esta publicación titulada "${row.title}" en:\n\n`,
        url: `https://infotics.vercel.app/#/news/${row.id}`,
        dialogTitle: "Compartir en:",
      });
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };

  const generateQR = async (url: string) => {
    try {
      const response = await axios.post(`${API}/others/qr`, { url });
      setImgBase64(response.data.qrCode);
      setShowModal(true);
    } catch (error) {
      console.error("Error generando código QR:", error);
    }
  };
  const mostrarDetalle = async (url: string) => {
    try {
      const response: any = await axios.get(url);
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

  const registerVisualization = async (news_id: any) => {
    try {
      const response = await axios.post(`${API}/users/view`, {
        user: user ? user.id : 6,
        news: news_id,
      });
    } catch (error) {
      console.error("Error al registrar la visualización:", error);
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
                            <b>Creado: </b> {formatearFecha(item.created_at)} |{" "}
                            {timeago.format(item.created_at, "es")}
                          </p>

                          <p>
                            <b>Tipo: </b>
                            {item.isPrivate ? "Privado" : "Público"}
                          </p>
                          <p>
                            {item.isAnchored ? (
                              <>
                                <i
                                  className="fas fa-thumbtack"
                                  id="isAnchored"
                                  style={{ marginRight: "5px" }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="isAnchored"
                                >
                                  Anclada
                                </label>
                              </>
                            ) : (
                              ""
                            )}
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
                          className="btn btn-outline-warning col-3"
                          style={{ margin: "5px" }}
                          onClick={() => {
                            mostrarDetalle(`${API}/news/get/${item.id}`);
                            registerVisualization(item.id);
                          }}
                        >
                          <i className="fas fa-info-circle" />
                        </span>
                        <span
                          className="btn btn-outline-primary col-3"
                          style={{ margin: "5px" }}
                          onClick={() => {
                            generateQR(
                              `https://infotics.vercel.app/#/news/${item.id}`
                            );
                          }}
                        >
                          <i className="fas fa-qrcode" />
                        </span>
                        <span
                          className="btn btn-outline-success col-3"
                          style={{ margin: "5px" }}
                          onClick={() => {
                            shareNews(item);
                          }}
                        >
                          <i className="fas fa-share-from-square" />
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
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="sm"
        backdrop="static"
        centered
      >
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
      <Modal
        show={showModalDetail}
        onHide={handleCloseModalDetail}
        backdrop="static"
        centered
      >
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
