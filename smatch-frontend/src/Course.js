import React from "react"

import Title from "./components/Title";

const course = {
  title: "Russian for Beginners",
  source: "Coursera",
  level: 1,
  instructor: "St. Petersburg State University",
  description: "This specialization is aimed at learners who are interested in exploring the Russian language, and provdies everything you need to start this journey. This soecialization contains four courses, and begins with an introduction to the basics of the Russian alphabet and phonetics, which will be...",
  durationInMonths: 4,
  hoursPerWeek: 3,
  pricePerMonthEur: 39
};

export default function Course() {
  return (
    <div className="flex flex-col flex-1">
      <Title subtitle={course.source}>
        {course.title}
      </Title>

      <div className="grid grid-cols-2 lg:grid-cols-4 px-4 py-8 gap-4">
        <Card title="Level"><Level level={course.level} /></Card>
        <Card title="Instructor">{course.instructor}</Card>
        <Card title="Description" classes="col-span-2 lg:col-span-4 lg:row-start-2">
          <p>{course.description}</p>
          <span className="text-gray-600 block mt-2">More</span>
        </Card>
        <Card title="Duration" classes="lg:col-start-3">
          <p>
            {course.durationInMonths} Months<br/>
            {course.hoursPerWeek} Hour/Week
          </p>
        </Card>
        <Card title="Price" classes="lg:col-start-4">
          <p>€{course.pricePerMonthEur} per Month</p>
        </Card>

        <div className="bg-amber-700 text-white text-center rounded-full col-span-2 lg:col-span-4 py-1">Click here to go to course</div>
      </div>
    </div>
  )
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
      <div className={`${level >= 1 ? "bg-amber-400" : "bg-gray-400"} flex-1 h-1/3`}></div>
      <div className={`${level >= 2 ? "bg-amber-400" : "bg-gray-400"} flex-1 h-2/3`}></div>
      <div className={`${level >= 3 ? "bg-amber-400" : "bg-gray-400"} flex-1 h-full`}></div>
    </div>
  );
}
