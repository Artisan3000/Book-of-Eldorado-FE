export default function ProgressTracker() {
    const progress = [
      { course: "Beginner Barbering", completed: 6, total: 12 },
      { course: "Advanced Barbering", completed: 0, total: 18 },
    ]
  
    return (
      <div className="space-y-4">
        {progress.map((p) => (
          <div key={p.course}>
            <p className="text-sm font-medium mb-1">{p.course}</p>
            <div className="w-full bg-gray-200 h-3">
              <div
                className="bg-black h-3"
                style={{ width: `${(p.completed / p.total) * 100}%` }}
              />
            </div>
            <p className="text-xs mt-1">
              {p.completed} of {p.total} lessons completed
            </p>
          </div>
        ))}
      </div>
    )
  }
  