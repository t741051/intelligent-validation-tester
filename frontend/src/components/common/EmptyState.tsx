export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center text-white/40 py-12 border border-dashed rounded-item">
      {message}
    </div>
  );
}
