export default function Certificates() {
    const certificates = [
      { title: "Beginner Barbering", date: "June 2025" },
      // Advanced locked
    ]
  
    return (
      <div className="border border-black p-4 space-y-3">
        {certificates.map((c) => (
          <div key={c.title} className="flex justify-between">
            <span>{c.title}</span>
            <span className="text-sm">Issued {c.date}</span>
          </div>
        ))}
  
        <div className="text-sm text-gray-600">
          Complete more courses to unlock additional certificates.
        </div>
      </div>
    )
  }
  