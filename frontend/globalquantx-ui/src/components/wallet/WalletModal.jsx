export default function WalletModal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl animate-fadeInUp">
        {children}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-200 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
