import { Card, AreaChart, Text } from "@tremor/react";

import { formatDate } from '../lib/datetime';
import { sortByDateKey, addCommas } from '../lib/util';

const DashboardYouTube = ({ data }) => {
  const reportType = 'daily';

  const reports = Object.keys(data).map(key => {
    const sortedData = sortByDateKey(data[key][reportType], 'date');
    return {
      id: key,
      title: data[key].title,
      keys: data[key].keys,
      data: sortedData.map(data => {
        return {
          ...data,
          date: formatDate(data.date)
        }
      })
    }
  });

  return (
    <>
      <Card>
        {reports.map(report => {
          return (
            <div key={report.id}>
              <Text className="text-md font-semibold">{ report.title }</Text>
              <AreaChart
                className="mt-4 mb-8 h-60"
                data={report.data}
                index="date"
                categories={report.keys}
                colors={["indigo"]}
                valueFormatter={(value) => addCommas(value)}
              />
            </div>
          )
        })}
      </Card>
    </>
  )
}

export default DashboardYouTube;