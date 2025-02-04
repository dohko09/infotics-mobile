const formatearFecha = (row:any) => {
    const fecha = new Date(row);
    fecha.setHours(fecha.getHours() + 5); // Suma 5 horas para corregir la diferencia
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");
    const hours = String(fecha.getHours()).padStart(2, "0");
    const minutes = String(fecha.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export { formatearFecha };