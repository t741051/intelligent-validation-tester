export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center text-gray-400 py-12 border border-dashed rounded-lg">
      {message}
    </div>
  );
}
