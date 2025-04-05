export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium">Generating your course...</p>
        <p className="text-sm text-gray-500">This might take a minute or two</p>
      </div>
    </div>
  );
}
