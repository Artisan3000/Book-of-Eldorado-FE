export default function CourseList() {
    const courses = [
      { title: "Beginner Barbering", status: "In Progress", resources: 12 },
      { title: "Advanced Barbering", status: "Not Started", resources: 18 },
    ]
  
    return (
      <div className="border border-black divide-y divide-black">
        {courses.map((course) => (
          <div key={course.title} className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{course.title}</h3>
              <p className="text-sm">{course.status}</p>
            </div>
            <span className="text-xs uppercase">{course.resources} resources</span>
          </div>
        ))}
      </div>
    )
  }
  