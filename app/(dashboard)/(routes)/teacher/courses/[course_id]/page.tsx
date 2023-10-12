type Props = {
  params: {
    course_id: string;
  }
};
const CourseIdPage = ({ params: { course_id } }: Props) => {
  return (
    <div>
      Course Id: {course_id}
    </div>
  );
};

export default CourseIdPage;