// src/App.jsx
import { useState } from 'react';
import './App.css';
import { db } from './Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import QrScanner from './QrScanner';

function App() {
  const [cliente, setCliente] = useState(null);
  const [puntos, setPuntos] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [escaneando, setEscaneando] = useState(true);

  const onScan = async (codigoQR) => {
    setEscaneando(false);

    const partes = codigoQR.split('|');
    if (partes.length !== 2) {
      setMensaje("❌ QR inválido. Formato esperado: telefono|token");
      setEscaneando(true);
      return;
    }

    const [telefono, token] = partes.map(p => p.trim());

    try {
      const ref = doc(db, 'clientes', telefono);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setMensaje("❌ Cliente no encontrado");
        setEscaneando(true);
        return;
      }

      const data = snap.data();
      if (data.token !== token) {
        setMensaje("❌ Token inválido");
        setEscaneando(true);
        return;
      }

      setCliente(data);
      setMensaje('');
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error consultando cliente");
      setEscaneando(true);
    }
  };

  const sumarPuntos = async () => {
    if (!cliente) return;
    const pts = parseInt(puntos, 10);
    if (isNaN(pts) || pts <= 0) {
      setMensaje("❌ Ingresa un número válido de puntos.");
      return;
    }

    const nuevosPuntos = (cliente.puntos || 0) + pts;

    try {
      await updateDoc(doc(db, 'clientes', cliente.telefono), {
        puntos: nuevosPuntos,
        token: cliente.token,
      });

      setCliente({ ...cliente, puntos: nuevosPuntos });
      setPuntos('');
      setMensaje(`✅ Se sumaron ${pts} puntos. Total: ${nuevosPuntos}`);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al actualizar puntos");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', fontFamily: 'Arial' }}>
      <h2>🎯 Escanea el QR del cliente</h2>

      {escaneando && <QrScanner onScan={onScan} />}

      {cliente && (
        <div>
          <p><strong>Nombre:</strong> {cliente.nombre}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          <p><strong>Puntos:</strong> {cliente.puntos}</p>

          <input
            type="number"
            value={puntos}
            onChange={(e) => setPuntos(e.target.value)}
            placeholder="Puntos a agregar"
          />
          <button onClick={sumarPuntos}>Agregar Puntos</button>
          <button onClick={() => {
            setCliente(null);
            setEscaneando(true);
            setPuntos('');
            setMensaje('');
          }}>
            Escanear otro
          </button>
        </div>
      )}

      {mensaje && <p style={{ marginTop: 10 }}>{mensaje}</p>}
    </div>
  );
}

export default App;
