import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import ToastContainer from "../components/ToastContainer.jsx";
import TransactionForm from "../components/TransactionForm.jsx";
import { useModal } from "../context/ModalContext.js";
import { useToast } from "../context/ToastContext.js";
import {
  addTransaction,
  updateTransaction,
} from "../store/transactionsSlice.js";

// RootLayout: Primary React Navigation / React Router Layout shell.
// Hosts persistent Navbar, dynamic Outlet, global ToastContainer, and modal manager.
function RootLayout() {
  const dispatch = useDispatch();
  const { isOpen, editingTransaction, closeModal } = useModal();
  const { showToast } = useToast();

  function handleSaveTransaction(formData) {
    if (editingTransaction) {
      dispatch(
        updateTransaction({
          id: editingTransaction.id,
          ...formData,
        })
      );
      showToast("Transaction updated successfully!", "success");
    } else {
      dispatch(addTransaction(formData));
      showToast("New transaction added successfully!", "success");
    }
    closeModal();
  }

  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>

      <ToastContainer />

      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <TransactionForm
              editingTransaction={editingTransaction}
              onSave={handleSaveTransaction}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RootLayout;
