<?php
$host = 'mysql';
$port = 3306;
$maxAttempts = 30;
$attempt = 0;

while ($attempt < $maxAttempts) {
    $connection = @fsockopen($host, $port);
    if ($connection) {
        fclose($connection);
        echo "$host:$port está disponible\n";
        exit(0);
    }

    echo "Esperando a $host:$port...\n";
    $attempt++;
    sleep(1);
}

echo "Tiempo de espera agotado para $host:$port\n";
exit(1);