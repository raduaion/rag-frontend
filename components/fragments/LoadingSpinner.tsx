
interface LoadingSpinnerProps {
  text: string
}

export default function LoadingSpinner({ text }: LoadingSpinnerProps) {

  return (
    <div className="text-center my-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">{ text }</p>
    </div>
  )
}
