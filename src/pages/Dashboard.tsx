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
import { Card } from "react-bootstrap";
import { ChartLine } from "./ChartLine";

const Dashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [logsToday, setLogsToday] = useState(0);
  const [totalNews, setTotalNews] = useState(0);
  const [logsLast, setLogsLast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user: any | null = JSON.parse(localStorage.getItem("user") || "null");
  const API = "https://infotic.up.railway.app/api/v1/metrics";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalUsersResponse = await axios.get(`${API}/total-users`, {
          headers: {
            Authorization: `${user.token}`,
          },
        });
        const logsTodayResponse = await axios.get(`${API}/total-income-today`, {
          headers: {
            Authorization: `${user.token}`,
          },
        });
        const logsLastResponse = await axios.get(`${API}/income-logs-last-7-days`, {
          headers: {
            Authorization: `${user.token}`,
          },
        });
        const totalNewsResponse = await axios.get(`${API}/total-published-news`, {
          headers: {
            Authorization: `${user.token}`,
          },
        });
        const totalUsersData = totalUsersResponse.data;
        const logsTodayData = logsTodayResponse.data;
        const totalNewsData = totalNewsResponse.data;
        setTotalUsers(totalUsersData[0].total);
        setLogsToday(logsTodayData[0].total);
        setLogsLast(logsLastResponse.data);
        setTotalNews(totalNewsData[0].total);
      } catch (error: any) {
        setError("Error al obtener datos: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

  const labels: any = [];
  const values: any = [];
  logsLast.forEach((log: any) => {
    labels.push(log.fecha);
    values.push(log.total);
  });
  const data = {
    labels,
    datasets: [
      {
        label: "Ingresos",
        data: values,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" fill="clear" color="dark">
            <IonMenuButton />
          </IonButton>
          <IonTitle>Estadisticas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? (
          <p className="text-center">Cargando datos del gráfico...</p>
        ) : (
          <div className="container p-4">
            <div className="row justify-content-center">
              <div className="col-12 col-md-3 col-sm-12 m-1  rounded">
                <Card className="text-center">
                  <Card.Body>
                    <Card.Text className="text-center">
                      Total usuarios
                    </Card.Text>
                    <Card.Text style={{ fontSize: "2rem" }}>
                      {totalUsers}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-12 col-md-3 col-sm-12 m-1  rounded">
                <Card className="text-center">
                  <Card.Body>
                    <Card.Text className="text-center">
                      Accesos del día
                    </Card.Text>
                    <Card.Text style={{ fontSize: "2rem" }}>
                      {logsToday}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-12 col-md-3 col-sm-12 m-1 rounded">
                <Card className="text-center">
                  <Card.Body>
                    <Card.Text className="text-center">
                      Noticias publicadas
                    </Card.Text>
                    <Card.Text style={{ fontSize: "2rem" }}>
                      {totalNews}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-12 col-md-6 col-sm-12 m-1 rounded">
                <Card className="text-center">
                  <Card.Body>
                    <p className="text-center">Ingresos últimos siete días</p>
                    <ChartLine data={data} />
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
