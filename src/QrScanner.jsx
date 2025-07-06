import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

function QrScanner({ onScan }) {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const initScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!isMounted) return;

        if (devices && devices.length) {
          // Usa la primera cámara disponible
          const cameraId = devices[0].id;
          html5QrCodeRef.current = new Html5Qrcode(scannerRef.current.id);

          await html5QrCodeRef.current.start(
            cameraId,
            { fps: 10, qrbox: 250 },
            (decodedText) => {
              onScan(decodedText);
              html5QrCodeRef.current
                .stop()
                .catch(() => {}); // evita error si ya está parado
            },
            (error) => {
              // Errores de escaneo menores, se pueden ignorar
            }
          );
        } else {
          console.error("No se encontraron cámaras disponibles.");
        }
      } catch (err) {
        console.error("Error inicializando cámara:", err);
      }
    };

    initScanner();

    return () => {
      isMounted = false;
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return <div id="reader" ref={scannerRef} style={{ width: "100%" }} />;
}

export default QrScanner;
