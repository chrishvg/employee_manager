<?php

namespace App\Entity;

use App\Repository\EmployeeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: EmployeeRepository::class)]
#[ORM\Table(name: 'employees')]
#[Assert\UniqueEntity(fields: ['email'], message: 'Este correo ya está en uso.')]
class Employee
{
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'El nombre no puede estar vacío.')]
    #[Assert\Length(max: 255, maxMessage: 'El nombre no puede superar los {{ limit }} caracteres.')]
    private ?string $name = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank(message: 'El correo no puede estar vacío.')]
    #[Assert\Email(message: 'El correo {{ value }} no es válido.')]
    private ?string $email = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Assert\NotNull(message: 'La fecha de contratación es obligatoria.')]
    #[Assert\LessThanOrEqual('today', message: 'La fecha de contratación no puede ser futura.')]
    private ?\DateTimeInterface $birthDate = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'El cargo no puede estar vacío.')]
    #[Assert\Length(max: 100)]
    private ?string $position = null;

    // Getters y setters...

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate(\DateTimeInterface $birthDate): self
    {
        $this->birthDate = $birthDate;
        return $this;
    }

    public function getPosition(): ?string
    {
        return $this->position;
    }

    public function setPosition(string $position): self
    {
        $this->position = $position;
        return $this;
    }
}