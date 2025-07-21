import React, { useState, useEffect } from "react";
import { createEmployee, getPositions } from "../api";
import { 
  Form, 
  Button, 
  Card, 
  Row, 
  Col, 
  Alert,
  Spinner,
  InputGroup
} from "react-bootstrap";
import { 
  PersonPlusFill, 
  PersonFill, 
  EnvelopeFill, 
  BriefcaseFill, 
  CalendarEventFill,
  CheckCircleFill
} from "react-bootstrap-icons";

function EmployeeForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    birth_date: "",
  });

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    async function fetchPositions() {
      try {
        setPositionsLoading(true);
        const data = await getPositions();
        setPositions(data);
      } catch (err) {
        setError("Error al cargar los puestos disponibles");
      } finally {
        setPositionsLoading(false);
      }
    }
    fetchPositions();
  }, []);

  const validateForm = () => {
    const errors = {};
    
    if (!form.name.trim()) {
      errors.name = "El nombre es obligatorio";
    } else if (form.name.trim().length < 2) {
      errors.name = "El nombre debe tener al menos 2 caracteres";
    }
    
    if (!form.email.trim()) {
      errors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Ingrese un email válido";
    }
    
    if (!form.position) {
      errors.position = "Debe seleccionar un puesto";
    }
    
    if (!form.birth_date) {
      errors.birth_date = "La fecha de nacimiento es obligatoria";
    } else {
      const today = new Date();
      const birthDate = new Date(form.birth_date);
      
      if (birthDate > today) {
        errors.birth_date = "La fecha de nacimiento no puede ser futura";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Limpiar error de validación específico al escribir
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
    
    // Limpiar mensajes globales
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await createEmployee(form);
      setForm({ name: "", email: "", position: "", birth_date: "" });
      setSuccess(true);
      onSuccess();
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      setError("Error al registrar el empleado. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", position: "", birth_date: "" });
    setValidationErrors({});
    setError(null);
    setSuccess(false);
  };

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Header className="bg-success text-white d-flex align-items-center">
        <PersonPlusFill size={24} className="me-2" />
        <h4 className="mb-0">Registrar Nuevo Empleado</h4>
      </Card.Header>
      
      <Card.Body className="p-4">
        {error && (
          <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-4 d-flex align-items-center">
            <CheckCircleFill className="me-2" />
            ¡Empleado registrado exitosamente!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold mb-2">
                  <PersonFill className="me-1" />
                  Nombre completo *
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez García"
                    isInvalid={!!validationErrors.name}
                    className={form.name ? "is-valid" : ""}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.name}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold mb-2">
                  <EnvelopeFill className="me-1" />
                  Correo electrónico *
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="empleado@empresa.com"
                    isInvalid={!!validationErrors.email}
                    className={form.email && !validationErrors.email ? "is-valid" : ""}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.email}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold mb-2">
                  <BriefcaseFill className="me-1" />
                  Puesto de trabajo *
                </Form.Label>
                {positionsLoading ? (
                  <div className="d-flex align-items-center p-2 border rounded">
                    <Spinner size="sm" className="me-2" />
                    <span className="text-muted">Cargando puestos disponibles...</span>
                  </div>
                ) : (
                  <Form.Select
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    isInvalid={!!validationErrors.position}
                    className={form.position ? "is-valid" : ""}
                  >
                    <option value="">Seleccione un puesto de trabajo</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.title}>
                        {pos.title}
                      </option>
                    ))}
                  </Form.Select>
                )}
                <Form.Control.Feedback type="invalid">
                  {validationErrors.position}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold mb-2">
                  <CalendarEventFill className="me-1" />
                  Fecha de nacimiento *
                </Form.Label>
                <Form.Control
                  type="date"
                  name="birth_date"
                  value={form.birth_date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  isInvalid={!!validationErrors.birth_date}
                  className={form.birth_date && !validationErrors.birth_date ? "is-valid" : ""}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.birth_date}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex gap-3 mt-4">
            <Button 
              variant="success" 
              type="submit" 
              disabled={loading || positionsLoading}
              className="d-flex align-items-center px-4"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Registrando...
                </>
              ) : (
                <>
                  <PersonPlusFill className="me-2" />
                  Registrar Empleado
                </>
              )}
            </Button>
            
            <Button 
              variant="outline-secondary" 
              type="button" 
              onClick={resetForm}
              disabled={loading}
            >
              Limpiar formulario
            </Button>
          </div>
          
          <div className="mt-3">
            <small className="text-muted">
              * Campos obligatorios
            </small>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default EmployeeForm;