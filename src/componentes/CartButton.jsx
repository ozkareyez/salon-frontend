import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

const CartButton = () => {
  const { cart, setOpen } = useCart();

  const totalItems = cart.reduce((sum, p) => sum + p.cantidad, 0);

  if (totalItems === 0) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 20 }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setOpen(true)}
      className="fixed bottom-8 right-8 z-50 px-6 py-4 rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center gap-3 transition-all duration-300 bg-gradient-to-br from-indigo-600 to-violet-600 border border-indigo-400/20 group overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      <ShoppingCart size={24} className="text-white relative z-10" />
      <div className="w-px h-6 bg-white/20 relative z-10"></div>
      <motion.span
        key={totalItems}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-black text-white text-xl relative z-10 tabular-nums"
      >
        {totalItems}
      </motion.span>
    </motion.button>
  );
};

export default CartButton;
