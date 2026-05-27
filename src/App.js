import {useState, useEffect} from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://projectuniversity-med-core.onrender.com';

function App() {

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [titulo, setTitulo] = useState("");
  const [areaAcademica, setAreaAcademica] = useState("");
  const [dedicacion, setDedicacion] = useState("");
  const [aniosExperiencia, setAniosExperiencia] = useState("");

  const [registros, setRegistros] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    cargarDocentes();
  }, []);

  const cargarDocentes = async () => {
    try {
      const response = await fetch(`${API_URL}/docentes`);
      const data = await response.json();
      setRegistros(data);
    } catch (error) {
      alert('Error al cargar los docentes');
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setCorreo('');
    setTelefono('');
    setTitulo('');
    setAreaAcademica('');
    setDedicacion('');
    setAniosExperiencia('');
  };

  const registrarDatos = async (e) => {
    e.preventDefault();

    const payload = {
      nombre,
      correo,
      telefono,
      titulo,
      area_academica: areaAcademica,
      dedicacion,
      anios_experiencia: String(aniosExperiencia),
    };

    if (editIndex !== null) {
      try {
        const docente = registros[editIndex];
        const response = await fetch(`${API_URL}/docentes/${docente.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const nuevosRegistros = [...registros];
          nuevosRegistros[editIndex] = {
            ...docente,
            nombre,
            correo,
            telefono,
            titulo,
            area_academica: areaAcademica,
            dedicacion,
            anios_experiencia: aniosExperiencia,
          };
          setRegistros(nuevosRegistros);
          setEditIndex(null);
          alert('Docente actualizado correctamente');
        } else {
          const err = await response.json().catch(() => ({}));
          alert(err.error || 'Error al actualizar el docente');
        }
      } catch (error) {
        alert('Error de conexion al actualizar un docente');
      }

    } else {
      try {
        const response = await fetch(`${API_URL}/docentes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok) {
          setRegistros([...registros, data]);
          alert('Docente guardado correctamente');
        } else {
          alert(data.error || 'Error al guardar el docente');
        }
      } catch (error) {
        alert('Error de conexion al guardar');
      }
    }
    limpiarFormulario();
  };

  const eliminarRegistro = async (idx) => {
    const docente = registros[idx];

    try {
      const response = await fetch(`${API_URL}/docentes/${docente.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegistros(registros.filter((_, i) => i !== idx));
        if (editIndex === idx) {
          setEditIndex(null);
          limpiarFormulario();
        }
        alert('Docente eliminado');
      } else {
        alert('Error al eliminar el docente');
      }
    } catch (error) {
      alert('Error de conexion');
    }
  };

  const editarRegistro = (idx) => {
    const reg = registros[idx];
    setNombre(reg.nombre);
    setCorreo(reg.correo);
    setTelefono(reg.telefono);
    setTitulo(reg.titulo);
    setAreaAcademica(reg.area_academica);
    setDedicacion(reg.dedicacion);
    setAniosExperiencia(String(reg.anios_experiencia));
    setEditIndex(idx);
  };

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>

      {/* FORMULARIO */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem", paddingBottom: "1rem", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
            {editIndex !== null ? "Editar docente" : "Registro de docente"}
          </h2>
        </div>

        <form onSubmit={registrarDatos}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Nombre completo</label>
              <input type="text" placeholder="Ej. Juan García" value={nombre} onChange={(e) => setNombre(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "8px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Correo electrónico</label>
              <input type="email" placeholder="correo@universidad.edu" value={correo} onChange={(e) => setCorreo(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "8px" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Teléfono</label>
              <input type="text" placeholder="300 000 0000" value={telefono} onChange={(e) => setTelefono(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "8px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Título académico</label>
              <input type="text" placeholder="Ej. Magíster en Educación" value={titulo} onChange={(e) => setTitulo(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "8px" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Área académica</label>
              <input type="text" placeholder="Ej. Ingeniería" value={areaAcademica} onChange={(e) => setAreaAcademica(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "8px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Dedicación</label>
              <select value={dedicacion} onChange={(e) => setDedicacion(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "8px" }}>
                <option value="">Seleccionar...</option>
                <option value="Tiempo completo">Tiempo completo</option>
                <option value="Medio tiempo">Medio tiempo</option>
                <option value="Cátedra">Cátedra</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Años de experiencia</label>
              <input type="number" min="0" placeholder="0" value={aniosExperiencia} onChange={(e) => setAniosExperiencia(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "8px" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            {editIndex !== null && (
              <button type="button" onClick={() => { setEditIndex(null); limpiarFormulario(); }}
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #d1d5db", background: "#f3f4f6", cursor: "pointer" }}>
                Cancelar
              </button>
            )}
            <button type="submit"
              style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #93c5fd", background: "#eff6ff", color: "#1d4ed8", cursor: "pointer", fontWeight: 500 }}>
              {editIndex !== null ? "Actualizar docente" : "Guardar docente"}
            </button>
          </div>
        </form>
      </div>

      {/* TABLA */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>Docentes registrados</h2>
          <span style={{ fontSize: "12px", background: "#f3f4f6", padding: "3px 10px", borderRadius: "8px", color: "#6b7280" }}>
            {registros.length} registros
          </span>
        </div>

        {registros.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "14px", padding: "2rem 0" }}>No hay docentes registrados.</p>
        ) : (
          <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ color: "#6b7280", fontSize: "11px" }}>
                <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500, width: "18%" }}>Nombre</th>
                <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500, width: "22%" }}>Correo</th>
                <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500, width: "13%" }}>Teléfono</th>
                <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500, width: "15%" }}>Área</th>
                <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500, width: "14%" }}>Dedicación</th>
                <th style={{ textAlign: "center", padding: "6px 8px", fontWeight: 500, width: "8%" }}>Exp.</th>
                <th style={{ textAlign: "center", padding: "6px 8px", fontWeight: 500, width: "10%" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((reg, idx) => (
                <tr key={reg.id} style={{ borderTop: "1px solid #e5e7eb", background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{reg.nombre}</td>
                  <td style={{ padding: "10px 8px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{reg.correo}</td>
                  <td style={{ padding: "10px 8px", color: "#6b7280" }}>{reg.telefono}</td>
                  <td style={{ padding: "10px 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{reg.area_academica}</td>
                  <td style={{ padding: "10px 8px" }}>
                    <span style={{
                      fontSize: "11px", padding: "2px 8px", borderRadius: "8px",
                      background: reg.dedicacion === "Tiempo completo" ? "#f0fdf4" : reg.dedicacion === "Medio tiempo" ? "#fffbeb" : "#f3f4f6",
                      color: reg.dedicacion === "Tiempo completo" ? "#15803d" : reg.dedicacion === "Medio tiempo" ? "#b45309" : "#6b7280"
                    }}>
                      {reg.dedicacion}
                    </span>
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "center", color: "#6b7280" }}>{reg.anios_experiencia} años</td>
                  <td style={{ padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                      <button onClick={() => editarRegistro(idx)}
                        style={{ padding: "4px 8px", fontSize: "12px", borderRadius: "6px", border: "1px solid #d1d5db", background: "#fff", cursor: "pointer" }}>
                        ✏️
                      </button>
                      <button onClick={() => eliminarRegistro(idx)}
                        style={{ padding: "4px 8px", fontSize: "12px", borderRadius: "6px", border: "1px solid #fca5a5", background: "#fff", color: "#dc2626", cursor: "pointer" }}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export default App;

