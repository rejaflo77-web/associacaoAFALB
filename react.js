import { useEffect, useState } from "react";

function App() {
  const [membros, setMembros] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/membros")
      .then(res => res.json())
      .then(data => setMembros(data));
  }, []);

  return (
    <div>
      <h1>Membros cadastrados</h1>
      <ul>
        {membros.map(m => (
          <li key={m._id}>{m.nome} — {m.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
