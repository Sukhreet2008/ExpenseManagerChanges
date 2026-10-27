import { useState } from "react";
import { ModalContext } from "./ModalContext.js";

export function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  function openAddTransaction() {
    setEditingTransaction(null);
    setIsOpen(true);
  }

  function openEditTransaction(transaction) {
    setEditingTransaction(transaction);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setEditingTransaction(null);
  }

  const value = {
    isOpen,
    editingTransaction,
    openAddTransaction,
    openEditTransaction,
    closeModal,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export default ModalProvider;

