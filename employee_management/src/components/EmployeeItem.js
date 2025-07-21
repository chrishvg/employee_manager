import React, { useState, useEffect } from "react";
import {
  updateEmployeeName,
  updateEmployeeJob,
  deleteEmployee,
  getPositions,
} from "../api";
import { 
  Card, 
  Form, 
  Button, 
  Modal, 
  Alert,
  Spinner,
  Badge 
} from "react-bootstrap";
import { 
  PencilSquare, 
  TrashFill, 
  CheckLg, 
  XLg, 
  PersonBadge,
  CalendarEvent,
  BriefcaseFill
} from "react-bootstrap-icons";

function EmployeeItem({ employee, onChange }) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(employee.name);
  const [newJob, setNewJob] = useState(employee.position);
  const [positions, setPositions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editing) {
      setLoading(true);
      getPositions()
        .then((data) => {
          setPositions(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Error al cargar los puestos disponibles");
          setLoading(false);
        });
    }
  }, [editing]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (newName !== employee.name) {
        await updateEmployeeName(employee.id, newName);
      }
      if (newJob !== employee.position) {
        await updateEmployeeJob(employee.id, newJob);
      }
      setEditing(false);
      onChange();
    } catch (err) {
      setError("Error al actualizar el empleado");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewName(employee.name);
    setNewJob(employee.position);
    setEditing(false);
    setError(null);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteEmployee(employee.id);
      onChange();
      setShowDeleteModal(false);
    } catch (err) {
      setError("Error al eliminar el empleado");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Card className={`h-100 shadow-sm border-0 ${editing ? 'border-primary' : ''}`} 
            style={{ transition: 'all 0.2s ease-in-out' }}>
        <Card.Body className="p-3">
          {error && (
            <Alert variant="danger" className="mb-3 py-2" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              {editing ? (
                <Form.Group className="mb-0">
                  <Form.Label className="text-muted small mb-1">
                    <PersonBadge className="me-1" />
                    Nombre del empleado
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border-primary"
                    placeholder="Ingrese el nombre completo"
                  />
                </Form.Group>
              ) : (
                <div>
                  <h5 className="mb-1 text-primary d-flex align-items-center">
                    <PersonBadge className="me-2" />
                    {employee.name}
                  </h5>
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            {editing ? (
              <Form.Group>
                <Form.Label className="text-muted small mb-1">
                  <BriefcaseFill className="me-1" />
                  Puesto de trabajo
                </Form.Label>
                {loading ? (
                  <div className="d-flex align-items-center">
                    <Spinner size="sm" className="me-2" />
                    <span className="text-muted">Cargando puestos...</span>
                  </div>
                ) : (
                  <Form.Select
                    value={newJob}
                    onChange={(e) => setNewJob(e.target.value)}
                    className="border-primary"
                  >
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.title}>
                        {pos.title}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
            ) : (
              <div className="d-flex align-items-center mb-2">
                <BriefcaseFill className="me-2 text-muted" />
                <Badge bg="secondary" className="px-3 py-2">
                  {employee.position}
                </Badge>
              </div>
            )}
          </div>

          <div className="mb-3">
            <div className="d-flex align-items-center text-muted">
              <CalendarEvent className="me-2" />
              <small>
                <strong>Fecha de nacimiento:</strong> {formatDate(employee.birth_date)}
              </small>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            {editing ? (
              <>
                <Button 
                  variant="success" 
                  size="sm" 
                  onClick={handleSave}
                  disabled={loading || !newName.trim()}
                  className="d-flex align-items-center"
                >
                  {loading ? (
                    <Spinner size="sm" className="me-1" />
                  ) : (
                    <CheckLg className="me-1" />
                  )}
                  Guardar
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={handleCancel}
                  disabled={loading}
                  className="d-flex align-items-center"
                >
                  <XLg className="me-1" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => setEditing(true)}
                className="d-flex align-items-center"
              >
                <PencilSquare className="me-1" />
                Editar
              </Button>
            )}
            
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
              className="d-flex align-items-center ms-auto"
            >
              <TrashFill className="me-1" />
              Eliminar
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de confirmación para eliminar */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-danger">
            <TrashFill className="me-2" />
            Confirmar eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            ¿Estás seguro de que deseas eliminar a <strong>{employee.name}</strong>?
          </p>
          <Alert variant="warning" className="py-2">
            <small>Esta acción no se puede deshacer.</small>
          </Alert>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={loading}
            className="d-flex align-items-center"
          >
            {loading ? (
              <Spinner size="sm" className="me-1" />
            ) : (
              <TrashFill className="me-1" />
            )}
            Eliminar empleado
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EmployeeItem;