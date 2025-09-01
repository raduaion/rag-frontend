
interface ConfirmationDialogProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-md text-center">
      <p className="mb-4">{ message }</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={ onConfirm }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Confirm
        </button>
        <button
          onClick={ onCancel }
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)

export default ConfirmationDialog
