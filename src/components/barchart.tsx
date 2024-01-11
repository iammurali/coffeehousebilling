import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RouterOutputs } from '~/utils/api';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

type MenuItemType = RouterOutputs["menu"]["getAll"][number];

type BillCountType = {
    count: number | undefined;
    item: MenuItemType;
}

export default function ReportBarChart({bills}: {bills: BillCountType[]}) {

    

    console.log(bills, 'chart bills')

    return (<ResponsiveContainer width="100%" height="100%">
    <BarChart
      width={500}
      height={300}
      data={bills}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis interval={0} dataKey="item.title" />
      <YAxis dataKey={"count"}  />
      <Tooltip />
      <Legend />
      <Bar dataKey="count"  fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
      <Bar dataKey="item.title" name='itemname'  fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
    </BarChart>
  </ResponsiveContainer>)

}
