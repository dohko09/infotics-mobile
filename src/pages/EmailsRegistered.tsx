import React, { useState, useEffect } from "react";
import {
  IonAlert,
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
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DataTable from "react-data-table-component";
import { formatearFecha } from "../functions/methods";

const EmailsRegistered: React.FC = () => {
  const [filtroTexto, setFiltroTexto] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRol, setNewRol] = useState("");
  const [operacion, setOperacion] = useState("");
  const [editingEmail, setEditingEmail] = useState("");
  const [editingRol, setEditingRol] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [emailIdInEdit, setEmailIdInEdit] = useState(null);
  const [isOpenToast, setIsOpenToast] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Alerta de eliminación de correo
  const [messageCustom, setMessageCustom] = useState("");
  const [register, setRegister] = useState([]);
  const API = "https://infotic.up.railway.app/api/v1/emails";
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run this effect only once

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/all`);
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
      width: "15%",
    },
    {
      name: "Correo electrónico",
      selector: (row: any) => row.mail,
      sortable: true,
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
    },
    {
      name: "Acciones",
      cell: (row: any) => (
        <>
          <span
            className="btn btn-outline-warning me-2"
            onClick={() => handleShowModal(row)}
          >
            <i className="fas fa-pencil-alt"></i>
          </span>
          <span
            className="btn btn-outline-danger"
            onClick={() => {
              setRegister(row);
              setIsOpen(true);
            }}
          >
            <i className="fas fa-trash-alt"></i>
          </span>
        </>
      ),
    },
  ];
  const filteredData = data.filter((item: any) =>
    item.mail.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  const handleShowModal = (email: any | undefined | null) => {
    if (email) {
      console.log(email.mail);
      setIsEditing(true);
      setOperacion("Modificar");
      setEditingEmail(email.mail);
      setEditingRol(email.role);
      setEmailIdInEdit(email.id);
    } else {
      setIsEditing(false);
      setOperacion("Agregar nuevo");
      setEditingEmail("");
      setEditingRol("");
      setEmailIdInEdit(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmail("");
    setEmailIdInEdit(null);
    fetchData();
  };

  const handleAddEmail = async () => {
    try {
      const response = await axios.post(`${API}/create`, {
        mail: newEmail,
        role: newRol,
      });
      setMessageCustom(response.data.message);
      handleCloseModal();
      setNewEmail("");
      fetchData();
    } catch (error: any) {
      console.error(error);
      setMessageCustom(error.message);
    }
    setIsOpenToast(true);
  };

  const handleUpdateEmail = async () => {
    try {
      const response = await axios.put(`${API}/update/${emailIdInEdit}`, {
        mail: editingEmail,
        role: editingRol,
      });
      setMessageCustom(response.data.message);
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      console.error(error);
      setMessageCustom(error.message);
    }
    setIsOpenToast(true);
  };

  const handleDeleteEmail = async (email: any) => {
    try {
      const response = await axios.delete(`${API}/delete/${email.id}`);
      setMessageCustom(response.data.message);
      fetchData();
    } catch (error: any) {
      console.error(error);
      setMessageCustom(error.message);
    }
    setIsOpenToast(true);
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton slot="start" fill="clear" color="dark">
              <IonMenuButton />
            </IonButton>
            <IonTitle>Correos Registrados</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {loading ? (
            <p className="text-center">Cargando datos de los correos...</p>
          ) : (
            <div className="container mt-5 mb-5">
              <div className="row">
                <div className="col-12">
                  <span
                    className="btn btn-primary mb-2 float-right col-12"
                    onClick={() => handleShowModal(null)}
                  >
                    <i className="fa-solid fa-plus"></i> Agregar nuevo
                  </span>
                  <div className="mb-2">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Filtrar por correo"
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="table-responsive table ">
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
          <Modal.Title>{operacion} correo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Correo electrónico:</label>
            <input
              type="email"
              className="form-control"
              value={isEditing ? editingEmail : newEmail}
              onChange={(e) => {
                if (isEditing) {
                  setEditingEmail(e.target.value);
                } else {
                  setNewEmail(e.target.value);
                }
              }}
            />
            <label>Tipo:</label>
            <select
              className="form-select"
              id="category"
              value={isEditing ? editingRol : newRol}
              onChange={(e) => {
                if (isEditing) {
                  setEditingRol(e.target.value);
                } else {
                  setNewRol(e.target.value);
                }
              }}
              required
            >
              <option value="">Selecciona el tipo</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Estudiante">Estudiante</option>
              <option value="Docente">Docente</option>
              <option value="Seguridad">Seguridad</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={isEditing ? handleUpdateEmail : handleAddEmail}
          >
            {isEditing ? "Guardar" : "Agregar"}
          </Button>
        </Modal.Footer>
      </Modal>
      <IonToast
        isOpen={isOpenToast}
        message={messageCustom}
        onDidDismiss={() => setIsOpenToast(false)}
        duration={5000}
      ></IonToast>
      <IonAlert
        isOpen={isOpen}
        header="Alerta de eliminación de correo"
        message="¿Estás seguro de eliminarlo?"
        buttons={[
          {
            text: "Si, eliminar",
            role: "confirm",
            handler: () => {
              handleDeleteEmail(register);
            },
          },
          {
            text: "Cancelar",
            role: "cancel",
            handler: () => {
              setIsOpenToast(true);
              setMessageCustom("Eliminación cancelada por el usuario");
            },
          },
        ]}
        onDidDismiss={() => setIsOpen(false)}
      ></IonAlert>
    </>
  );
};
export default EmailsRegistered;
