import React, { useState, useEffect } from "react";
import { getEmployees, searchEmployees } from "./api";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";
import { Row, Col, InputGroup, FormControl } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      fetchEmployees();
    } else {
      const results = await searchEmployees(query);
      setEmployees(results);
    }
  };

  return (
    <div className="App" style={{ padding: "2rem" }}>
      <h1>Gestión de Empleados</h1>

      <Row className="justify-content-center mb-4">
        <Col md={6} sm={8} xs={12}>
          <InputGroup>
            <InputGroup.Text id="search-icon">
              🔍
            </InputGroup.Text>
            <FormControl
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Buscar por nombre..."
              aria-label="Buscar"
              aria-describedby="search-icon"
            />
          </InputGroup>
        </Col>
      </Row>

      <EmployeeForm onSuccess={fetchEmployees} />

      <EmployeeList employees={employees} onChange={fetchEmployees} />
    </div>
  );
}

export default App;
