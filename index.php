<?php
// Функция для загрузки и парсинга CSV данных
function loadMeteoData()
{
    $url = 'http://asterion.petrsu.ru/meteo/cache/meteo.csv';
    $data = file_get_contents($url);
    $lines = explode("\n", $data);

    $result = array();
    foreach ($lines as $line) {
        if (empty(trim($line)))
            continue;
        $fields = explode(";", $line);

        // Пропускаем некорректные строки
        if (count($fields) < 15)
            continue;

        $record = array(
            'local_time' => $fields[0],
            'cloud_condition' => intval($fields[1]),
            'wind_condition' => intval($fields[2]),
            'rain_condition' => intval($fields[3]),
            'ir_sky_temp' => ($fields[4] == '999.9' || $fields[4] == '-999.9' || $fields[4] == '-998.0') ? null : floatval($fields[4]),
            'ambient_temp' => floatval($fields[5]),
            'wind_speed' => floatval($fields[6]),
            'wet_state' => $fields[7],
            'rain_state' => $fields[8],
            'humidity' => floatval($fields[9]),
            'dew_point' => floatval($fields[10]),
            'case_temp' => $fields[11],
            'daylight_condition' => intval($fields[12]),
            'daylight_value' => floatval($fields[13]),
            'timestamp' => intval($fields[14])
        );

        $result[] = $record;
    }

    return $result;
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 1) {
    header('Content-Type: application/json');
    echo json_encode(loadMeteoData());
    exit;
}

$meteoData = loadMeteoData();
?>

<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Метеорологические данные</title>

    <link rel="stylesheet" href="style.css">

    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.css">
    <script type="text/javascript" charset="utf8" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="text/javascript" charset="utf8"
        src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
    <div class="container">
        <h1>Метеорологические данные</h1>

        <div>
            <button id="updateDataButton">Обновить данные</button>
            <span id="lastUpdate">Последнее обновление: <?= date('Y-m-d H:i:s') ?></span>
        </div>

        <div class="chart-container">
            <canvas id="tempChart"></canvas>
        </div>

        <div class="chart-container">
            <canvas id="humidityChart"></canvas>
        </div>

        <table id="meteoTable" class="display">
            <thead>
                <tr>
                    <th>Время</th>
                    <th>Облачность</th>
                    <th>Дождь</th>
                    <th>Темп. неба</th>
                    <th>Темп. воздуха</th>
                    <th>Скорость ветра</th>
                    <th>Влажность</th>
                    <th>Точка росы</th>
                    <th>Освещенность</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($meteoData as $row): ?>
                    <tr>
                        <td><?= htmlspecialchars($row['local_time']) ?></td>
                        <td class="cloud-<?= $row['cloud_condition'] ?>">
                            <?php
                            switch ($row['cloud_condition']) {
                                case 0:
                                    echo 'Неизвестно';
                                    break;
                                case 1:
                                    echo 'Ясно';
                                    break;
                                case 2:
                                    echo 'Переменная';
                                    break;
                                case 3:
                                    echo 'Облачно';
                                    break;
                                default:
                                    echo $row['cloud_condition'];
                            }
                            ?>
                        </td>
                        <td class="rain-<?= $row['rain_condition'] ?>">
                            <?php
                            switch ($row['rain_condition']) {
                                case 0:
                                    echo 'Неизвестно';
                                    break;
                                case 1:
                                    echo 'Нет';
                                    break;
                                case 2:
                                    echo 'Умеренный';
                                    break;
                                case 3:
                                    echo 'Дождь';
                                    break;
                                default:
                                    echo $row['rain_condition'];
                            }
                            ?>
                        </td>
                        <td><?= $row['ir_sky_temp'] ?? 'Н/Д' ?></td>
                        <td><?= $row['ambient_temp'] ?></td>
                        <td><?= $row['wind_speed'] >= 0 ? $row['wind_speed'] : 'Прогрев' ?></td>
                        <td><?= $row['humidity'] ?></td>
                        <td><?= $row['dew_point'] ?></td>
                        <td><?= $row['daylight_value'] ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <script src="main.js"></script>
</body>

</html>