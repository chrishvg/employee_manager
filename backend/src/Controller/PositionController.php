<?php

namespace App\Controller;

use App\Entity\Position;
use App\Repository\PositionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class PositionController extends AbstractController
{
    #[Route('/api/positions', name: 'get_positions', methods: ['GET'])]
    public function index(PositionRepository $positionRepository): JsonResponse
    {
        $positions = $positionRepository->findAll();

        $data = array_map(fn(Position $position) => [
            'id' => $position->getId(),
            'title' => $position->getTitle(),
        ], $positions);

        return $this->json($data, Response::HTTP_OK);
    }
}
