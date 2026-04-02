import React from 'react';
// context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Cargar desde localStorage al inicio
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error cargando carrito:", error);
      return [];
    }
  });

  const [open, setOpen] = useState(false);

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error guardando carrito:", error);
    }
  }, [cart]);

  /* ===== FUNCIÓN PARA COMPARAR ITEMS ===== */
  const areItemsEqual = (item1, item2) => {
    // 1. Mismo producto
    if (item1.producto_id !== item2.producto_id) return false;

    // 2. Mismos extras (mismos IDs)
    const extras1 = item1.extras || [];
    const extras2 = item2.extras || [];

    if (extras1.length !== extras2.length) return false;

    // Ordenar extras por ID para comparación
    const sortedExtras1 = [...extras1].sort((a, b) =>
      (a.id || a.nombre).localeCompare(b.id || b.nombre)
    );
    const sortedExtras2 = [...extras2].sort((a, b) =>
      (a.id || a.nombre).localeCompare(b.id || b.nombre)
    );

    for (let i = 0; i < sortedExtras1.length; i++) {
      const e1 = sortedExtras1[i];
      const e2 = sortedExtras2[i];
      if ((e1.id || e1.nombre) !== (e2.id || e2.nombre)) return false;
    }

    // 3. Mismos ingredientes quitados
    const ingred1 = item1.ingredientes_quitados || [];
    const ingred2 = item2.ingredientes_quitados || [];

    if (ingred1.length !== ingred2.length) return false;

    const sortedIngred1 = [...ingred1].sort();
    const sortedIngred2 = [...ingred2].sort();

    for (let i = 0; i < sortedIngred1.length; i++) {
      if (sortedIngred1[i] !== sortedIngred2[i]) return false;
    }

    // 4. Mismo sabor (para gaseosas)
    if (item1.sabor !== item2.sabor) return false;

    return true;
  };

  /* ===== AGREGAR AL CARRITO MEJORADO ===== */
  const addToCart = (item) => {
    console.log("🛒 Agregando al carrito:", item);

    setCart((prev) => {
      // Buscar si ya existe un item idéntico
      const existingIndex = prev.findIndex((existingItem) =>
        areItemsEqual(existingItem, item)
      );

      if (existingIndex >= 0) {
        // Si existe, incrementar cantidad
        console.log("✅ Item ya existe, incrementando cantidad");
        return prev.map((existingItem, index) => {
          if (index === existingIndex) {
            return {
              ...existingItem,
              cantidad: existingItem.cantidad + (item.cantidad || 1),
              // Actualizar precio_final por si cambia
              precio_final: item.precio_final || existingItem.precio_final,
            };
          }
          return existingItem;
        });
      } else {
        // Si no existe, agregar nuevo con ID único
        console.log("🆕 Nuevo item, agregando al carrito");
        const newItem = {
          cartItemId: `item_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          ...item,
          cantidad: item.cantidad || 1,
        };
        return [...prev, newItem];
      }
    });

    setOpen(true);
  };

  /* ===== ELIMINAR ===== */
  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((p) => p.cartItemId !== cartItemId));
  };

  /* ===== ACTUALIZAR CANTIDAD ===== */
  const updateQty = (cartItemId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((p) => (p.cartItemId === cartItemId ? { ...p, cantidad } : p))
    );
  };

  /* ===== VACIAR CARRITO ===== */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  /* ===== CONTAR ITEMS ===== */
  const itemCount = cart.reduce(
    (total, item) => total + (item.cantidad || 1),
    0
  );

  /* ===== TOTAL ===== */
  const total = cart.reduce(
    (sum, p) => sum + Number(p.precio_final || 0) * (p.cantidad || 1),
    0
  );

  /* ===== OBTENER CANTIDAD DE UN PRODUCTO ESPECÍFICO ===== */
  const getProductQuantity = (productoId) => {
    return cart
      .filter((item) => item.producto_id === productoId)
      .reduce((total, item) => total + (item.cantidad || 1), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        open,
        setOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        total,
        itemCount,
        getProductQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
// import { createContext, useContext, useEffect, useState } from "react";

// const CartContext = createContext();
// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [open, setOpen] = useState(false);

//   /* ===== PERSISTENCIA ===== */
//   useEffect(() => {
//     const saved = localStorage.getItem("cart");
//     if (saved) setCart(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   /* ===== AGREGAR ===== */
//   const addToCart = (item) => {
//     setCart((prev) => [
//       ...prev,
//       {
//         cartItemId: crypto.randomUUID(),
//         cantidad: 1,
//         ...item,
//       },
//     ]);
//     setOpen(true);
//   };

//   /* ===== ELIMINAR ===== */
//   const removeFromCart = (cartItemId) => {
//     setCart((prev) => prev.filter((p) => p.cartItemId !== cartItemId));
//   };

//   /* ===== CANTIDAD ===== */
//   const updateQty = (cartItemId, cantidad) => {
//     if (cantidad <= 0) return removeFromCart(cartItemId);

//     setCart((prev) =>
//       prev.map((p) => (p.cartItemId === cartItemId ? { ...p, cantidad } : p))
//     );
//   };

//   /* ===== TOTAL (YA NO NaN) ===== */
//   const total = cart.reduce(
//     (sum, p) => sum + Number(p.precio_final || 0) * p.cantidad,
//     0
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         open,
//         setOpen,
//         addToCart,
//         removeFromCart,
//         updateQty,
//         total,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };
