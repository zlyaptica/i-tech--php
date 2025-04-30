document.addEventListener('DOMContentLoaded', function() {
    // Инициализация DataTable
    $('#meteoTable').DataTable({
        "order": [[0, "desc"]],
        "pageLength": 10,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/ru.json"
        }
    });

    const labels = meteoData.map(item => item.local_time); // берем у каждого элемента даты

    // График температуры
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Температура воздуха (°C)',
                    data: meteoData.map(item => item.ambient_temp),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.1,
                    yAxisID: 'y'
                },
                {
                    label: 'Температура неба (°C)',
                    data: meteoData.map(item => item.ir_sky_temp),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.1,
                    yAxisID: 'y'
                },
                {
                    label: 'Точка росы (°C)',
                    data: meteoData.map(item => item.dew_point),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.1,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Температура (°C)'
                    }
                }
            }
        }
    });

    // График влажности
    const humidityCtx = document.getElementById('humidityChart').getContext('2d');
    new Chart(humidityCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Влажность (%)',
                    data: meteoData.map(item => item.humidity),
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.1)',
                    tension: 0.1,
                    yAxisID: 'y'
                },
                {
                    label: 'Скорость ветра (м/с)',
                    data: meteoData.map(item => item.wind_speed >= 0 ? item.wind_speed : null),
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    tension: 0.1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Влажность (%)'
                    },
                    min: 0,
                    max: 100
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Скорость ветра (м/с)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
});