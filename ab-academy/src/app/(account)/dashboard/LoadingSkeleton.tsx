export default function LoadingSkeleton() {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500 animate-pulse">
        <div className="w-32 h-32 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }
  