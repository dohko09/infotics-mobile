import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonMenuButton,
} from "@ionic/react";
import { Modal, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { formatearFecha } from "../functions/methods";

const Messages: React.FC = () => {
  const [filtroTexto, setFiltroTexto] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [created_at, setCreated_at] = useState("");
  const userData: any = JSON.parse(localStorage.getItem("user") || "null");
  const API = "https://infotic.up.railway.app/api/v1/metrics";
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run this effect only once

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/messages`, {
        headers: {
          Authorization: `${userData.token}`,
        },
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const paginacionOpciones = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  const columns = [
    {
      name: "ID",
      selector: (row: any) => row.id,
      sortable: true,
      minWidth: "100px",
    },
    {
      name: "Usuario",
      selector: (row: any) => row.full_name,
      sortable: true,
      minWidth: "250px",
      wrap: true,
    },
    {
      name: "Mensaje",
      selector: (row: any) => row.message,
      sortable: true,
      minWidth: "400px",
      wrap: true,
    },
    {
      name: "Fecha creación",
      selector: (row: any) => {
        if (row.created_at) {
          return formatearFecha(row.created_at);
        } else {
          return null;
        }
      },
      sortable: true,
      minWidth: "200px",
    },

    {
      name: "Acciones",
      cell: (row: any) => (
        <span
          className="btn btn-outline-warning"
          onClick={() => handleShowModal(row)}
        >
          <i className="fas fa-eye"></i>
        </span>
      ),
      minWidth: "150px",
    },
  ];

  const filteredData = data.filter((item: any) =>
    item.full_name.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  const handleShowModal = (email: any) => {
    if (email) {
      setUser(email.full_name);
      setMessage(email.message);
      setCreated_at(email.created_at);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchData();
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton slot="start" fill="clear" color="dark">
              <IonMenuButton />
            </IonButton>
            <IonTitle>Buzón</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {loading ? (
            <p className="text-center">Cargando datos de los mensajes...</p>
          ) : (
            <div className="container mt-5 mb-5">
              <div className="row">
                <div className="col-12">
                  <div className="mb-2">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Filtrar por usuario"
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="table-responsive">
                    <DataTable
                      columns={columns}
                      data={filteredData}
                      striped
                      pagination
                      paginationComponentOptions={paginacionOpciones}
                      paginationPerPage={5}
                      paginationRowsPerPageOptions={[5, 10, 15, 20]}
                      noDataComponent={
                        <span>No se encontró ningún elemento</span>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </IonContent>
      </IonPage>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Visualizar detalle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Usuario:</label>
            <input
              type="text"
              className="form-control"
              value={user}
              readOnly
              onChange={(e) => {}}
            />
            <label>Mensaje:</label>
            <textarea
              className="form-control"
              value={message}
              readOnly
              onChange={(e) => {}}
              rows={4} // Puedes ajustar el número de filas según tus necesidades
            />
            <label>Creación:</label>
            <input
              type="text"
              className="form-control"
              value={formatearFecha(created_at)}
              readOnly
              onChange={(e) => {}}
            />
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

export default Messages;
