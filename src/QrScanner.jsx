// src/QrScanner.jsx
import React, { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

function QrScanner({ onScan }) {
  useEffect(() => {
    const scannerId = "reader";
    const html5QrCode = new Html5Qrcode(scannerId);

    const init = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          console.error("❌ No se encontraron cámaras disponibles.");
          return;
        }

        const backCamera = devices.find((d) =>
          /back|rear|environment/i.test(d.label)
        ) || devices[0];

        await html5QrCode.start(
          backCamera.id,
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            onScan(decodedText);
            html5QrCode.stop().catch(() => {});
          },
          (errorMessage) => {
            console.warn("Escaneo fallido:", errorMessage);
          }
        );
      } catch (err) {
        console.error("❌ Error inicializando cámara:", err);
        alert("❌ No se pudo acceder a la cámara. Verifica los permisos.");
      }
    };

    init();

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, [onScan]);

  return (
    <div
      id="reader"
      style={{
        width: "100%",
        height: "300px",
        border: "1px solid #ccc",
        marginTop: "10px"
      }}
    />
  );
}

export default QrScanner;
