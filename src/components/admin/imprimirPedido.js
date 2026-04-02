export function imprimirPedido(pedido) {
  if (!pedido) return;

  const contenido = generarHTMLPedido(pedido);

  const ventana = window.open("", "_blank", "width=300,height=600");

  if (!ventana) return;

  ventana.document.write(`
    <html>
      <head>
        <title>Pedido #${pedido.id}</title>
        <style>
          body {
            font-family: monospace;
            padding: 10px;
          }

          h2 {
            text-align: center;
            margin-bottom: 10px;
          }

          .item {
            margin-bottom: 6px;
          }

          .total {
            margin-top: 10px;
            font-weight: bold;
            border-top: 1px dashed #000;
            padding-top: 6px;
          }
        </style>
      </head>
      <body>
        ${contenido}
        <script>
          window.onload = () => {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);

  ventana.document.close();
}

function generarHTMLPedido(pedido) {
  return `
    <h2>SALCHI PAISA</h2>
    <p><b>Pedido #:</b> ${pedido.id}</p>
    <p><b>Cliente:</b> ${pedido.nombre_cliente}</p>
    <p><b>Fecha:</b> ${new Date(pedido.created_at).toLocaleString()}</p>

    <hr />

    ${pedido.items
      .map(
        (item) => `
          <div class="item">
            ${item.cantidad}x ${item.nombre_producto} - $${item.precio_final}
          </div>
        `
      )
      .join("")}

    <div class="total">
      TOTAL: $${pedido.total}
    </div>
  `;
}
