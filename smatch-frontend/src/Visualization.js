import React, { useState, useEffect } from "react"
import { scaleOrdinal } from 'd3-scale';
import { schemeSpectral, schemeCategory10 } from 'd3-scale-chromatic';
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Label, LabelList, ResponsiveContainer, Cell } from "recharts";

import Title from "./components/Title";
import { useVisualization } from "./hooks";

const colorsCategory = scaleOrdinal(schemeCategory10).range();
const colors = schemeSpectral[10];

const categories = [
  "instructors",
  "providers",
  "categories",
  "duration",
  "price"
];

export default function Visualization() {
  // bar chart top 10
  // - instructors
  // - providers
  // - category
  //
  // pie chart
  // - duration grouped by level
  // - price grouped by level

  const [selectedTab, setSelectedTab] = useState(categories[0]);

  return (
    <div className="flex flex-col items-center flex-1">
      <Title>
        Visualizations
      </Title>

      <div className="flex flex-col mt-8 w-full items-stretch">
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <TabContent category={selectedTab} />
      </div>
    </div>
  );
}

function Tabs({ selectedTab, setSelectedTab }) {
  return (
    <ul className="bg-gray-600 flex items-center justify-center flex-wrap gap-2 rounded-full px-4 py-2">
      { categories.map((category) => (
        <TabItem key={category} value={category} isSelected={selectedTab == category} onClick={() => setSelectedTab(category)} />
      )) }
    </ul>
  );
}

function TabItem({ value, isSelected, onClick }) {
  return (
    <li className={`${isSelected ? 'bg-amber-700' : 'bg-gray-700'} transition transition-color duration-250 ease-in-out cursor-pointer text-white rounded-full px-4 py-2`} onClick={onClick}>
      { value.charAt(0).toUpperCase() + value.slice(1) }
    </li>
  );
}

function TabContent({ category }) {
  return (
    <div className="rounded-[50px] bg-gray-900 mt-8 p-8 flex justify-center">
      <TabVisualization category={category} />
    </div>
  );
}

function TabVisualization({ category }) {
  switch (category) {
    case "instructors":
      return <InstructorsVisualization />;
    case "providers":
      return <ProvidersVisualization />;
    case "categories":
      return <CategoriesVisualization />;
    case "duration":
      return <DurationVisualization />;
    case "price":
      return <PriceVisualization />;
    default:
      return <></>;
  }
}

function InstructorsVisualization() {
  const [dataCount, setDataCount] = useState(10);
  const data = useVisualization("instructors");

  return (
    <div>
      <div className="mb-8">
        <label for="dataCount" className="block text-sm font-medium text-gray-200">Data count</label>
        <select id="dataCount" name="dataCount" value={dataCount} onChange={(e) => setDataCount(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      { data ?
        <BarChart
          width={600}
          height={800}
          data={data?.slice(0, dataCount)}
          margin={{ top: 5, right: 5, left: 5, bottom: 200 }}
        >
          
          <XAxis dataKey="instructor" interval={0} tick={{ angle: 90, fill: '#E5E7EB' }} tickMargin={100} />
          <YAxis dataKey={(v)=>parseInt(v.count)} tick={{ fill: '#E5E7EB' }} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="count" fill="#F59E0B" name="# courses by instructor">
            {
              data.map((entry, index) => (
                <Cell
                  key={`slice-${index}`}
                  fill={colors[index % 10]}
                  //fillOpacity={this.state.activeIndex === index ? 1 : 0.25}
                />
              ))
            }
          </Bar>
        </BarChart>
        : <></>
      }
    </div>
  );
}

function ProvidersVisualization() {
  const data = useVisualization("providers");

  return (
    <div>
      { data ?
        <BarChart
          width={600}
          height={600}
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          
          <XAxis dataKey="provider" tick={{ fill: '#E5E7EB' }} />
          <YAxis dataKey={(v)=>parseInt(v.count)} tick={{ fill: '#E5E7EB' }} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="count" fill="#F59E0B" label={{ fill: '#E5E7EB' }} name="# courses by provider">
            {
              data.map((entry, index) => (
                <Cell
                  key={`slice-${index}`}
                  fill={colors[index % 10]}
                  //fillOpacity={this.state.activeIndex === index ? 1 : 0.25}
                />
              ))
            }
          </Bar>
        </BarChart>
        : <></>
      }
    </div>
  );
}

function CategoriesVisualization() {
  const data = useVisualization("categories");

  return (
    <div>
      { data ?
        <BarChart
          width={600}
          height={800}
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 200 }}
        >
          
          <XAxis dataKey="category" interval={0} tick={{ angle: 90, fill: '#E5E7EB' }} tickMargin={100} />
          <YAxis dataKey={(v)=>parseInt(v.count)} tick={{ fill: '#E5E7EB' }} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="count" fill="#F59E0B" name="# courses by category">
            {
              data.map((entry, index) => (
                <Cell
                  key={`slice-${index}`}
                  fill={colors[index % 10]}
                  //fillOpacity={this.state.activeIndex === index ? 1 : 0.25}
                />
              ))
            }
          </Bar>
        </BarChart>
        : <></>
      }
    </div>
  );
}

function DurationVisualization() {
  const [nData, setNData] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const levelData = useVisualization("levels");
  const data = useVisualization("duration");

  useEffect(() => {
    if (data) {
      const top = data.slice(0, 3).map((v) => {
        return { count: v.count, duration: `${v.duration} week${v.duration == '1' ? '' : 's'}` };
      });
      const rest = data.slice(3);
      const restSum = rest.reduce((acc, v) => acc + parseInt(v.count), 0);

      setNData([...top, { count: restSum, duration: "Other" }]);
    } else {
      setNData(null);
    }
  }, [data]);

  return (
    <div>
      { levelData ?
        <div className="mb-8">
          <label for="level" className="block text-sm font-medium text-gray-200">Level</label>
          <select id="level" name="level" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            { levelData.map((level) => (
              <option key={level.level} value={level.level}>{ level.level } ({ level.count } courses)</option>
            )) }
          </select>
        </div>
        :<></>
      }
      { nData ?
        <PieChart
          width={600}
          height={600}
        >
          <Pie
            data={nData}
            dataKey={(v) => parseInt(v.count)}
            nameKey="duration"
            innerRadius="25%"
            outerRadius="80%"
            label={v => v.duration}
          >
            {
              nData.map((entry, index) => (
                <Cell
                  key={`slice-${index}`}
                  fill={colors[index % 10]}
                  //fillOpacity={this.state.activeIndex === index ? 1 : 0.25}
                />
              ))
            }
          </Pie>
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
        </PieChart>
      : <></> }
    </div>
  );
}

function PriceVisualization() {
  const [nData, setNData] = useState(null);
  const [freeData, setFreeData] = useState(null);
  const data = useVisualization("price");

  useEffect(() => {
    if (data) {
      const top = data.slice(0, 15).map((v) => {
        return { count: v.count, price: v.price == 0 ? "Free" : `$${v.price}` };
      });
      const rest = data.slice(15);
      const restSum = rest.reduce((acc, v) => acc + parseInt(v.count), 0);

      setNData([...top, { count: restSum, price: "Other" }].filter(v => v.price != "Free"));

      setFreeData(data.reduce((acc, v) => {
        if (v.price == 0) return [{count: acc[0].count + parseInt(v.count), price: "Free"}, acc[1]];
        else return [acc[0], {count: acc[1].count + parseInt(v.count), price: "Paid"}];
      }, [ { count: 0, price: "Free" }, { count: 0, price: "Paid" } ]));
    } else {
      setNData(null);
    }
  }, [data]);

  return (
    <div>
      { nData && freeData ?
        <>
          <PieChart
            width={600}
            height={600}
          >
            <Pie
              data={freeData}
              dataKey={(v) => parseInt(v.count)}
              nameKey="price"
              innerRadius="10%"
              outerRadius="20%"
              label={v => v.price}
            >
              {
                freeData.map((entry, index) => (
                  <Cell
                    key={`slice-${index}`}
                    fill={colorsCategory[index % 10]}
                    //fillOpacity={this.state.activeIndex === index ? 1 : 0.25}
                  />
                ))
              }
            </Pie>

            <Pie
              data={nData}
              dataKey={(v) => parseInt(v.count)}
              nameKey="price"
              innerRadius="40%"
              outerRadius="75%"
              label={v => v.price}
            >
              {
                nData.map((entry, index) => (
                  <Cell
                    key={`slice-${index}`}
                    fill={colors[index % 10]}
                    //fillOpacity={this.state.activeIndex === index ? 1 : 0.25}
                  />
                ))
              }
            </Pie>
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
          </PieChart>
        </>
      : <></> }
    </div>
  );
}
