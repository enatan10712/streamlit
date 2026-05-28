export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0d0c1d] flex flex-col items-center justify-center">
      <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="text-xl font-bold text-white tracking-widest uppercase animate-pulse">StreamVault</h2>
    </div>
  );
}
