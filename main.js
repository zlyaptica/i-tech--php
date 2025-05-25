let meteoTable;
let tempChart;
let humidityChart;
let autoRefreshInterval;

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация DataTable
    meteoTable = $('#meteoTable').DataTable({
        "order": [[0, "desc"]],
        "pageLength": 10,
    });
    
    initCharts();
    
    loadData();
    
    setupAutoRefresh(5 * 60 * 1000);// автообновление раз в 5 мин
    
    document.getElementById('updateDataButton').addEventListener('click', function() {
        loadData();
    });
});

function initCharts() {
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    const humidityCtx = document.getElementById('humidityChart').getContext('2d');
    
    tempChart = new Chart(tempCtx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: getTempChartOptions()
    });
    
    humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: getHumidityChartOptions()
    });
}

// конфиг графика температуры
function getTempChartOptions() {
    return {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            title: { display: true, text: 'Температура и точка росы' }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Температура (°C)' }
            }
        }
    };
}

// конфиг графика влажности
function getHumidityChartOptions() {
    return {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            title: { display: true, text: 'Влажность и скорость ветра' }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Влажность (%)' },
                min: 0, max: 100
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Скорость ветра (м/с)' },
                grid: { drawOnChartArea: false }
            }
        }
    };
}

function loadData() {
    $.ajax({
        url: 'index.php?ajax=1',
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $('#updateDataButton').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Загрузка...');
        },
        success: function(data) {
            updateLastUpdatedTime();
            updateTable(data);
            updateCharts(data);
        },
        error: function(xhr, status, error) {
            alert('Произошла ошибка при загрузке данных.');
        },
        complete: function() {
            $('#updateDataButton').prop('disabled', false).text('Обновить данные');
        }
    });
}

function updateLastUpdatedTime() {
    const now = new Date();
    document.getElementById('lastUpdate').textContent = 
        `Последнее обновление: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
}

function updateTable(data) {
    meteoTable.clear();
    
    data.forEach(item => {
        meteoTable.row.add([
            item.local_time,
            getCloudConditionText(item.cloud_condition),
            getRainConditionText(item.rain_condition),
            item.ir_sky_temp ?? 'Н/Д',
            item.ambient_temp,
            item.wind_speed >= 0 ? item.wind_speed : 'Прогрев',
            item.humidity,
            item.dew_point,
            item.daylight_value
        ]).draw(false);
    });
    
    // Сортируем по времени
    meteoTable.order([0, 'desc']).draw();
}

function updateCharts(data) {
    const labels = data.map(item => item.local_time);
    
    // график температуры
    tempChart.data.labels = labels;
    tempChart.data.datasets = [
        {
            label: 'Температура воздуха (°C)',
            data: data.map(item => item.ambient_temp),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.1,
            yAxisID: 'y'
        },
        {
            label: 'Температура неба (°C)',
            data: data.map(item => item.ir_sky_temp),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            tension: 0.1,
            yAxisID: 'y'
        },
        {
            label: 'Точка росы (°C)',
            data: data.map(item => item.dew_point),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.1,
            yAxisID: 'y'
        }
    ];
    tempChart.update();
    
    // график влажности
    humidityChart.data.labels = labels;
    humidityChart.data.datasets = [
        {
            label: 'Влажность (%)',
            data: data.map(item => item.humidity),
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.1)',
            tension: 0.1,
            yAxisID: 'y'
        },
        {
            label: 'Скорость ветра (м/с)',
            data: data.map(item => item.wind_speed >= 0 ? item.wind_speed : null),
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.1)',
            tension: 0.1,
            yAxisID: 'y1'
        }
    ];
    humidityChart.update();
}

function setupAutoRefresh(interval) {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(loadData, interval);
}

function getCloudConditionText(code) {
    switch (code) {
        case 0: return 'Неизвестно';
        case 1: return 'Ясно';
        case 2: return 'Переменная';
        case 3: return 'Облачно';
        default: return code;
    }
}

function getRainConditionText(code) {
    switch (code) {
        case 0: return 'Неизвестно';
        case 1: return 'Нет';
        case 2: return 'Умеренный';
        case 3: return 'Дождь';
        default: return code;
    }
}

function loadData() {
    $.ajax({
        url: 'index.php?ajax=1',
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $('#updateDataButton').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Загрузка...');
        },
        success: function(data) {
            if (data.error && data.error === 'Unauthorized') {
                window.location.href = 'login.php';
                return;
            }
            updateLastUpdatedTime();
            updateTable(data);
            updateCharts(data);
        },
        error: function(xhr, status, error) {
            if (xhr.status === 401) {
                window.location.href = 'login.php';
            } else {
                alert('Произошла ошибка при загрузке данных.');
            }
        },
        complete: function() {
            $('#updateDataButton').prop('disabled', false).text('Обновить данные');
        }
    });
}

// COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
// COPY index.php .
// COPY login.php .
// COPY style.css .
// COPY main.js .
// COPY users.json .