import React from "react";
import { useParams } from "react-router-dom";

import Title from "./components/Title";
import { useCourse } from "./hooks";

export default function Course() {
  const { id } = useParams();
  const course = useCourse(id);

  return course ? (
    <div className="flex flex-col flex-1">
      <Title subtitle={course.provider}>
        {course.name}
      </Title>

      <div className="grid grid-cols-2 lg:grid-cols-4 px-4 py-8 gap-4">
        <Card title="Level"><Level level={course.level} /></Card>
        <Card title="Instructor">{course.instructor}</Card>
        <Card title="Description" classes="col-span-2 lg:col-span-4 lg:row-start-2">
          <p>{course.description}</p>
        </Card>
        <Card title="Duration" classes="lg:col-start-3">
          <p>
            {course.duration} Weeks<br/>
          </p>
        </Card>
        <Card title="Price" classes="lg:col-start-4">
          <p>${course.price}</p>
        </Card>

        <a href={course.link} target="_blank" className="bg-amber-700 text-white text-center rounded-full col-span-2 lg:col-span-4 py-1">Click here to go to course</a>
      </div>
    </div>
  ) : <></>;
}

function Card({ title, classes, children }) {
  classes = classes || "";

  return (
    <div className={`flex flex-col gap-4 bg-gray-900 rounded-[30px] px-6 pb-6 pt-4 ${classes}` }>
      <h2 className="text-center text-lg text-amber-500">{title}</h2>
      <div className="text-white text-sm">{children}</div>
    </div>
  );
}

function Level({ level }) {
  return (
    <div className="flex items-end gap-2 h-16 px-4">
      <div className={`${level == "Begniner" || level == "Intermediate" || level == "Advanced" ? "bg-amber-400" : "bg-gray-400"} flex-1 h-1/3`}></div>
      <div className={`${level == "Begniner" || level == "Intermediate" ? "bg-amber-400" : "bg-gray-400"} flex-1 h-2/3`}></div>
      <div className={`${level == "Advanced" ? "bg-amber-400" : "bg-gray-400"} flex-1 h-full`}></div>
    </div>
  );
}
