import { getCourses } from '@/lib/data';
import CoursesClient from './CoursesClient';

export default async function CoursesPage() {
  const courses = await getCourses();
  return <CoursesClient courses={courses} />;
}
