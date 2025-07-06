import { useEffect, useState } from 'react'
import './App.css'
import { db } from './Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import QrScanner from './QrScanner';

function App() {
 const [cliente, setCliente] = useState(null);
  const [puntos, setPuntos] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [escaneando, setEscaneando] = useState(true);

  const onScan = async (telefonoQR) => {
    setEscaneando(false);
    try {
      const ref = doc(db, 'clientes', telefonoQR.trim());
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCliente(snap.data());
        setMensaje('');
      } else {
        setMensaje('Cliente no encontrado');
        setEscaneando(true); // vuelve a escanear
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error buscando cliente');
      setEscaneando(true);
    }
  };

  const sumarPuntos = async () => {
    if (!cliente) return;
    const nuevosPuntos = (cliente.puntos || 0) + parseInt(puntos, 10);
    await updateDoc(doc(db, 'clientes', cliente.telefono), {
      puntos: nuevosPuntos,
    });
    setCliente({ ...cliente, puntos: nuevosPuntos });
    setPuntos('');
    setMensaje(`✅ Se sumaron ${puntos} puntos. Total: ${nuevosPuntos}`);
  };

  return (
    <div>
      <h2>Escanea el QR del cliente</h2>

      {escaneando && <QrScanner onScan={onScan} />}

      {cliente && (
        <div>
          <p><strong>Nombre:</strong> {cliente.nombre}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          <p><strong>Puntos actuales:</strong> {cliente.puntos}</p>

          <input
            type="number"
            placeholder="Puntos a agregar"
            value={puntos}
            onChange={(e) => setPuntos(e.target.value)}
          />
          <button onClick={sumarPuntos}>Agregar Puntos</button>
          <button onClick={() => {
            setCliente(null);
            setMensaje('');
            setEscaneando(true);
          }}>Escanear otro</button>
        </div>
      )}

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
export default App
