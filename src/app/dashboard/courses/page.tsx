import { getCourses } from '@/lib/data';
import { cn } from '@/lib/utils';

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Courses</h1>
          <p className="text-sm text-gray-500 mt-0.5">{courses.length} courses in catalog</p>
        </div>
        <button className="px-4 py-2 bg-navy text-white text-sm font-semibold uppercase tracking-wider hover:bg-navy-dark transition-colors">
          + Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white overflow-hidden">
            {/* Color banner */}
            <div className="h-2" style={{ backgroundColor: course.color }} />

            <div className="p-5">
              {/* Category + status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-600">
                  {course.category}
                </span>
                <span className={cn(
                  'text-xs font-semibold uppercase tracking-wider px-2 py-0.5',
                  course.status === 'Active' ? 'bg-mas-success/10 text-green-700' : 'bg-gray-100 text-gray-400'
                )}>
                  {course.status}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-800 text-sm leading-snug mb-3">{course.title}</h3>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Duration</p>
                  <p className="text-sm font-semibold text-gray-700">{course.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Enrolled</p>
                  <p className="text-sm font-semibold text-gray-700">{course.enrolledCount} students</p>
                </div>
              </div>

              {/* Completion rate */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Completion</p>
                  <p className="text-xs font-bold text-gray-600">{course.completionRate}%</p>
                </div>
                <div className="h-1.5 bg-gray-100">
                  <div className="h-full transition-all" style={{ width: `${course.completionRate}%`, backgroundColor: course.color }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
