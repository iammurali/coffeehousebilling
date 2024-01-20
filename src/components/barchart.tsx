import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type RouterOutputs } from '~/utils/api';


type SalesPerMonthType = { month: string; totalSales: number | undefined };


export default function ReportBarChart({bills}: {bills: SalesPerMonthType[]}) {
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
      <XAxis dataKey="month" />
      <YAxis dataKey={"totalSales"}  />
      <Tooltip />
      <Legend />
      <Bar dataKey="totalSales"  fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
      <Bar dataKey="month" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
    </BarChart>
  </ResponsiveContainer>)

}
