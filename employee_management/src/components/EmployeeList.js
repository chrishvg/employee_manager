import React from "react";
import EmployeeItem from "./EmployeeItem";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { PersonFill } from "react-bootstrap-icons";

function EmployeeList({ employees, onChange }) {
  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-primary text-white d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <PersonFill size={24} className="me-2" />
            <h4 className="mb-0">Lista de Empleados</h4>
          </div>
          <Badge bg="light" text="primary" className="fs-6">
            {employees.length} {employees.length === 1 ? 'empleado' : 'empleados'}
          </Badge>
        </Card.Header>
        
        <Card.Body className="p-0">
          {employees.length === 0 ? (
            <div className="text-center py-5">
              <PersonFill size={48} className="text-muted mb-3" />
              <h5 className="text-muted mb-2">No hay empleados registrados</h5>
              <p className="text-muted mb-0">Comienza agregando tu primer empleado usando el formulario de arriba</p>
            </div>
          ) : (
            <div className="p-3">
              <Row className="g-3">
                {employees.map((emp) => (
                  <Col key={emp.id} xs={12} lg={6} xl={4}>
                    <EmployeeItem employee={emp} onChange={onChange} />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EmployeeList;