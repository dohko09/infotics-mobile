import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options: any = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export function ChartLine(props: any) {
  const data = props.data;
  return (
    <Bar className="col-md-12 text-center" options={options} data={data} />
  );
}
