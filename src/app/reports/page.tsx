"use client"

import { useState } from "react"
import { Line, Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from "chart.js"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement)

export default function ReportsAndAnalytics() {
  const [selectedChart, setSelectedChart] = useState("line")

  const lineData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        label: "Volumen de Transacciones",
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  const barData = {
    labels: ["USD", "EUR", "GBP", "JPY", "BTC", "ETH"],
    datasets: [
      {
        label: "Volumen por Moneda",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const pieData = {
    labels: ["Compras", "Ventas"],
    datasets: [
      {
        data: [300, 200],
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reportes y Analítica</h2>
      <div className="flex items-center space-x-4">
        <Label htmlFor="chartType">Tipo de Gráfico</Label>
        <Select id="chartType" value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)}>
          <option value="line">Línea</option>
          <option value="bar">Barras</option>
          <option value="pie">Circular</option>
        </Select>
      </div>
      <div className="h-[400px]">
        {selectedChart === "line" && <Line data={lineData} options={{ maintainAspectRatio: false }} />}
        {selectedChart === "bar" && <Bar data={barData} options={{ maintainAspectRatio: false }} />}
        {selectedChart === "pie" && <Pie data={pieData} options={{ maintainAspectRatio: false }} />}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Button>Descargar Reporte</Button>
        <Button>Compartir Gráfico</Button>
        <Button>Personalizar Análisis</Button>
      </div>
    </div>
  )
}