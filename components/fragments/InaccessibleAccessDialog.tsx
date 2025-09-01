
interface InaccessibleAccessDialogProps {
  retryNow: () => void
  retryTime: number
}

export default function InaccessibleAccessDialog({ retryNow, retryTime }: InaccessibleAccessDialogProps) {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-red-600 text-2xl font-bold mb-4">API Server Inaccessible</h2>
        <p className="mb-4">The API server is currently inaccessible. Retrying in { retryTime } seconds...</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={ retryNow }
        >
          Retry Now
        </button>
      </div>
    </div>
  )
}
