<?php
namespace App\Controller;

use App\Entity\Employee;
use App\Form\EmployeeType;
use App\Repository\EmployeeRepository;
use App\Repository\DepartmentRepository;
use App\Repository\PositionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Annotation\IsGranted;

#[Route('/api/employee')]
class EmployeeController extends AbstractController
{
    #[Route('/list', name: 'app_employee_list', methods: ['GET'])]
    public function list(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $nameQuery = trim((string) $request->query->get('name'));
        $qb = $entityManager->createQueryBuilder();
        $qb->select('e')
            ->from(Employee::class, 'e');
    
        if ($nameQuery !== '') {
            $qb->where('LOWER(e.name) LIKE :name')
               ->setParameter('name', '%' . strtolower($nameQuery) . '%');
        }
    
        $employees = $qb->getQuery()->getResult();
    
        $data = array_map(function (Employee $employee) {
            return [
                'id' => $employee->getId(),
                'name' => $employee->getName(),
                'email' => $employee->getEmail(),
                'birth_date' => $employee->getBirthDate()->format('Y-m-d'),
                'position' => $employee->getPosition(),
            ];
        }, $employees);
    
        return $this->json($data);
    }

    #[Route('/new', name: 'app_employee_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $employee = new Employee();
        $employee->setName($data['name'] ?? null);
        $employee->setEmail($data['email'] ?? null);
        $employee->setBirthDate(new \DateTime($data['birth_date'] ?? 'now'));
        $employee->setPosition($data['position'] ?? null);

        $entityManager->persist($employee);
        $entityManager->flush();

        return $this->json(['success' => 'Empleado creado exitosamente.'], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'app_employee_show', methods: ['GET'])]
    public function show(Employee $employee): Response
    {
        return $this->json([
            'id' => $employee->getId(),
            'name' => $employee->getName(),
            'email' => $employee->getEmail(),
            'birth_date' => $employee->getBirthDate()->format('Y-m-d'),
            'position' => $employee->getPosition(),
        ]);
    }

    #[Route('/{id}/edit', name: 'app_employee_edit', methods: ['PUT'])]
    public function edit(Request $request, Employee $employee, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['name']) && $employee->getName() !== $data['name']) {
            $employee->setName($data['name']);
        }

        if (isset($data['email']) && $employee->getEmail() !== $data['email']) {
            $employee->setEmail($data['email']);
        }

        if (isset($data['birth_date']) && $employee->getBirthDate()->format('Y-m-d') !== $data['birth_date']) {
            $employee->setBirthDate(new \DateTime($data['birth_date']));
        }

        if (isset($data['position'])) {
            $employee->setPosition($data['position']);
        }

        $entityManager->flush();

        return $this->json(['success' => 'Empleado actualizado exitosamente.'], Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'app_employee_delete', methods: ['DELETE'])]
    public function delete(Employee $employee, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($employee);
        $entityManager->flush();

        return $this->json(['success' => 'Empleado eliminado exitosamente.'], Response::HTTP_OK);
    }
}