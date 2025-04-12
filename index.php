<?php

// URL CSV-файла
$url = 'http://asterion.petrsu.ru/meteo/cache/meteo.csv';

// Функция для получения данных из CSV-файла
function getWeatherData($url) {
    $data = [];

    if (($handle = fopen($url, 'r')) !== FALSE) {
        while (($row = fgetcsv($handle, 1000, ';')) !== FALSE) {
            $data[] = [
                'local_time' => $row[0],
                'cloud_condition' => $row[1],
                'wind_condition' => $row[2],
                'rain_condition' => $row[3],
                'ir_sky_temperature' => $row[4] == 999.9 || $row[4] == -999.9 || $row[4] == -998.0 ? null : $row[4],
                'ambient_temperature' => $row[5],
                'wind_speed' => $row[6],
                'humidity' => $row[9],
                'dew_point_temperature' => $row[10],
                'daylight_condition' => $row[12],
                'daylight_photodiode_value' => $row[13],
                'timestamp' => $row[14]
            ];
        }
        fclose($handle);
    }

    return $data;
}

// Функция для вывода данных в виде таблицы
function displayWeatherData($data) {
    echo "<table border='1'>
            <tr>
                <th>Local Time</th>
                <th>Cloud Condition</th>
                <th>Wind Condition</th>
                <th>Rain Condition</th>
                <th>IR Sky Temperature</th>
                <th>Ambient Temperature</th>
                <th>Wind Speed</th>
                <th>Humidity</th>
                <th>Dew Point Temperature</th>
                <th>Daylight Condition</th>
                <th>Daylight Photodiode Value</th>
                <th>Timestamp</th>
            </tr>";

    foreach ($data as $row) {
        echo "<tr>
                <td>{$row['local_time']}</td>
                <td>{$row['cloud_condition']}</td>
                <td>{$row['wind_condition']}</td>
                <td>{$row['rain_condition']}</td>
                <td>" . ($row['ir_sky_temperature'] !== null ? $row['ir_sky_temperature'] : 'N/A') . "</td>
                <td>{$row['ambient_temperature']}</td>
                <td>{$row['wind_speed']}</td>
                <td>{$row['humidity']}</td>
                <td>{$row['dew_point_temperature']}</td>
                <td>{$row['daylight_condition']}</td>
                <td>{$row['daylight_photodiode_value']}</td>
                <td>" . date('Y-m-d H:i:s', $row['timestamp']) . "</td>
              </tr>";
    }

    echo "</table>";
}

// Получение данных
$weatherData = getWeatherData($url);

// Вывод данных
displayWeatherData($weatherData);

?>