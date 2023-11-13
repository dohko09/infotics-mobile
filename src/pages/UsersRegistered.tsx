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
import { Modal, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";

const UsersRegistered: React.FC = () => {
  const [filtroTexto, setFiltroTexto] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(0);
  const [fullName, setFullName] = useState("");
  const [rol, setRol] = useState("");
  const [pin, setPin] = useState("");
  const API = "https://infotic.up.railway.app";
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenToast, setIsOpenToast] = useState(false);
  const [messageCustom, setMessageCustom] = useState("");
  const [register, setRegister] = useState([]);
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run this effect only once
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/users`);
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
      name: "Nombres completos",
      selector: (row: any) => row.full_name,
      sortable: true,
    },
    {
      name: "Correo electrónico",
      selector: (row: any) => row.mail,
      sortable: true,
    },
    {
      name: "Rol",
      selector: (row: any) => row.category,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row: any) => (row.status === 1 ? "Activo" : "Inactivo"),
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
  const mostrarAlertaPersonalizada = (mensaje: string) => {
    setMessageCustom(mensaje);
    setIsOpen(true);
  };

  const handleDeleteEmail = async (user: any) => {
    try {
      const response = await axios.delete(`${API}/user/${user.id}`);
      mostrarAlertaPersonalizada(response.data.message);

      fetchData();
    } catch (error: any) {
      console.error(error);
      mostrarAlertaPersonalizada(error.message);
    }
  };

  const handleShowModal = (user: any) => {
    setId(user.id);
    console.log(user.full_name);
    setFullName(user.full_name);
    setRol(user.category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFullName("");
    setRol("");
    setPin("");
    fetchData();
  };

  const filteredData = data.filter((item: any) =>
    item.full_name.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  if (loading) {
    return <p className="text-center">Cargando datos de los usuarios...</p>;
  }

  const handleUpdateUser = async () => {
    try {
      let response: any = "";
      if (pin.trim().length === 0) {
        response = await axios.put(`${API}/user_sc/${id}`, {
          full_name: fullName,
          category: rol,
        });
      } else {
        response = await axios.put(`${API}/user/${id}`, {
          full_name: fullName,
          category: rol,
          pin: pin,
        });
      }
      handleCloseModal();
      mostrarAlertaPersonalizada(response.data.message);
      fetchData();
    } catch (error: any) {
      console.error(error);
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
            <IonTitle>Usuarios registrados</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="container mt-5 mb-5">
            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Filtrar por nombre"
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
        </IonContent>
      </IonPage>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modificar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              className="form-control"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
            />
            <label>Rol:</label>
            <select
              className="form-control"
              value={rol}
              onChange={(e) => {
                setRol(e.target.value);
              }}
            >
              <option value="Miembro">Miembro</option>
              <option value="Administrador">Administrador</option>
            </select>

            <label>Contraseña:</label>
            <input
              type="password"
              className="form-control"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      <IonToast
        isOpen={isOpenToast}
        message={messageCustom}
        onDidDismiss={() => setIsOpen(false)}
        duration={5000}
        position="bottom"
      />
      <IonAlert
        isOpen={isOpen}
        header="Alerta de eliminación de usuario"
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
      />
    </>
  );
};
export default UsersRegistered;
