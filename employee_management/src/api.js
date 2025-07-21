const API_BASE = "http://localhost:8001/api";

export async function getEmployees() {
  const res = await fetch(`${API_BASE}/employee/list`);
  return res.json();
}

export async function searchEmployees(query) {
  const res = await fetch(`${API_BASE}/employee/list?name=${encodeURIComponent(query)}`);
  return res.json();
}

export async function createEmployee(data) {
  const res = await fetch(`${API_BASE}/employee/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateEmployeeName(id, name) {
  const res = await fetch(`${API_BASE}/employee/${id}/edit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function updateEmployeeJob(id, position) {
  const res = await fetch(`${API_BASE}/employee/${id}/edit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ position: position }),
  });
  return res.json();
}

export async function deleteEmployee(id) {
  const res = await fetch(`${API_BASE}/employee/${id}`, {
    method: "DELETE",
  });
  return res.ok;
}

export async function getPositions() {
  const res = await fetch(`${API_BASE}/positions`);
  return res.json();
}
