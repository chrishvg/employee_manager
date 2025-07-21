<?php
namespace App\Repository;

use App\Entity\Employee;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class EmployeeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Employee::class);
    }

    public function save(Employee $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Employee $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Buscar empleados por diferentes criterios
     */
    public function findBySearchCriteria(?string $searchTerm, ?int $departmentId = null, ?int $positionId = null): array
    {
        $qb = $this->createQueryBuilder('e')
            ->leftJoin('e.department', 'd')
            ->leftJoin('e.position', 'p')
            ->addSelect('d', 'p');

        if ($searchTerm) {
            $qb->andWhere('e.name LIKE :searchTerm OR e.lastName LIKE :searchTerm OR e.email LIKE :searchTerm')
               ->setParameter('searchTerm', '%' . $searchTerm . '%');
        }

        if ($departmentId) {
            $qb->andWhere('e.department = :departmentId')
               ->setParameter('departmentId', $departmentId);
        }

        if ($positionId) {
            $qb->andWhere('e.position = :positionId')
               ->setParameter('positionId', $positionId);
        }

        return $qb->orderBy('e.lastName', 'ASC')
                  ->addOrderBy('e.name', 'ASC')
                  ->getQuery()
                  ->getResult();
    }

    /**
     * Obtener estadísticas de empleados por departamento
     */
    public function getEmployeeStatsByDepartment(): array
    {
        return $this->createQueryBuilder('e')
            ->select('d.name as department_name, COUNT(e.id) as employee_count, AVG(e.salary) as avg_salary')
            ->leftJoin('e.department', 'd')
            ->groupBy('d.id')
            ->getQuery()
            ->getResult();
    }
}