<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250720195605 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $json = @file_get_contents('https://ibillboard.com/api/positions');
        if ($json === false) {
            throw new \RuntimeException('No se pudo obtener la lista de posiciones.');
        }

        $data = json_decode($json, true);
        if (!isset($data['positions']) || !is_array($data['positions'])) {
            throw new \RuntimeException('El JSON recibido no contiene el campo "positions".');
        }

        foreach ($data['positions'] as $positionName) {
            $safeName = str_replace("'", "''", $positionName);
            $this->addSql("INSERT INTO positions (title) VALUES ('$safeName')");
        }
    }

    public function down(Schema $schema): void
    {
        $this->addSql('TRUNCATE TABLE positions');
    }
}
