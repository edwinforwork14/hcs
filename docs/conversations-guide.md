# Guía de productos y tipos de conversaciones — Soporte HCS

Investigación para planificar las conversaciones del servicio al cliente en el chat
(widget del cliente + panel `/admin/support`).

Contexto del negocio: **distribución de electrónica, redes, CCTV/seguridad y
soluciones de suministro global** en las Américas (B2B, mayorista).

---

## 1. Categorías de productos

| Categoría | Productos típicos | Ejemplo de consulta real |
|---|---|---|
| **CCTV y Seguridad** | Cámaras IP (dome/bullet), DVR/NVR, kits 4/8/16 canales, fuentes PoE | "¿Tienen cámaras dome 2MP con visión nocturna a color?" |
| **Networking** | Switches 8/24/48 puertos, routers, access points, cables/fibra, racks | "¿Cuál es el precio por mayor de los switches gigabit de 24 puertos?" |
| **Electrónica** | Componentes, pantallas, accesorios de marcas globales | "¿Distribuyen la marca X en América Latina?" |
| **Suministro global** | Sourcing de productos, MOQ, logística internacional | "¿Pueden conseguirme este modelo en volumen y enviarlo a Panamá?" |

---

## 2. Tipos de conversaciones por etapa

### Pre-venta (las más comunes en distribución)
1. **Disponibilidad / stock** — "¿Tienen stock del modelo X? ¿Cuántas unidades hay?"
2. **Cotización / precio mayorista** — "¿Me pueden cotizar 50 cámaras con DVR?" → el adjunto es clave: **enviar la cotización en PDF** 📎
3. **MOQ (cantidad mínima)** — "¿Cuál es el mínimo de compra para precio de distribuidor?"
4. **Compatibilidad** — "¿Estas cámaras son ONVIF? ¿Funcionan con mi NVR actual?"
5. **Logística / envío internacional** — "¿Hacen envíos a Colombia? ¿Qué incoterms manejan?"
6. **Ser distribuidor / revendedor** — "¿Cómo me registro como revendedor autorizado?"

### Venta / pedido
7. **Estado de pedido** — "¿En qué va mi orden #1234?"
8. **Pago / facturación** — "¿Aceptan transferencia internacional? ¿Pueden enviarme la factura?"

### Post-venta
9. **Soporte técnico de instalación** — "¿Cómo configuro el acceso remoto de mi NVR?" (patrón clásico en CCTV)
10. **Garantía / RMA / devolución** — "Una cámara llegó dañada, ¿cómo hago el reemplazo?" → **adjuntar foto de la unidad dañada** 📎
11. **Soporte de cuenta/plataforma** — "No puedo iniciar sesión en mi cuenta de distribuidor"

### Relacional
12. **Seguimiento de cotización** — "¿Revisaron mi cotización de la semana pasada?"
13. **Reclamo / escalamiento** — "Llevo 3 días esperando actualización de mi envío"

---

## 3. Conversaciones de prueba recomendadas

1. **Cotización con PDF** 📎 — Cliente pide 30 cámaras + NVR; el admin **sube el PDF de la cotización** (prueba el adjunto lado admin).
2. **Cliente sube foto de unidad dañada** 📎 — prueba RMA y el adjunto lado cliente (miniatura de imagen).
3. **Compatibilidad técnica** — cámara vs NVR ONVIF (prueba soporte técnico).
4. **MOQ / precio de distribuidor** — prueba la conversación de "ser revendedor".
5. **Envío internacional a un país** — prueba logística.
6. **Pedido con número de orden** — prueba post-venta.
7. **Cierre de conversación** — prueba el flujo Close/Reopen con una ya resuelta.

**Nota:** al menos una conversación de prueba debe incluir un **PDF** (cotización o
ficha técnica) para validar el flujo completo de adjuntos (subida → apertura desde
el panel admin).
