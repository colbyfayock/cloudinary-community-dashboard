import {
  AreaChart,
  Card,
  List,
  ListItem,
  Icon,
  Text,
  Bold,
  Flex,
  Title,
  Button,
  Grid,
} from "@tremor/react";

import { formatDate } from '../lib/datetime';
import { sortByDateKey, addCommas } from '../lib/util';

const DashboardYouTube = ({ data }) => {
  const reportType = 'daily';

  return (
    <>
      {Object.entries(data).map(([id, report]) => {
        if ( report.type === 'chart' ) {
          const sortedData = {
            id: id,
            title: report.title,
            keys: report.keys,
            data: sortByDateKey(report[reportType], 'date').map(data => {
              return {
                ...data,
                date: formatDate(data.date)
              }
            })
          }
          return (
            <Card key={id} className="my-8">
              <Text className="text-md font-semibold">{ report.title }</Text>
              <AreaChart
                className="mt-4 mb-8 h-60"
                data={sortedData.data}
                index="date"
                categories={sortedData.keys}
                colors={["indigo"]}
                valueFormatter={(value) => addCommas(value)}
              />
            </Card>
          )
        }
        if ( report.type === 'list' ) {
          return (
            <div key={id}>
              <Card className="my-8">
                <Title>{ report.title }</Title>
                {/* <Text>{item.name}</Text> */}
                <List className="mt-4">
                  {report.all.map(({ video, count }) => (
                    <ListItem key={video.id}>
                      <Flex justifyContent="start" className="truncate space-x-4">
                        {/* <Icon
                          variant="light"
                          icon={transaction.icon}
                          size="md"
                          color={transaction.color}
                        /> */}
                        <div className="truncate">
                          <Text className="truncate">
                            <Bold>{video.title}</Bold>
                          </Text>
                          <Text className="truncate">
                            <a href={video.url} target="_blank">{ video.url }</a>
                          </Text>
                        </div>
                      </Flex>
                      <Text>{count}</Text>
                    </ListItem>
                  ))}
                </List>
              </Card>
            </div>
          )
        }
      })}
    </>
  )
}

export default DashboardYouTube;