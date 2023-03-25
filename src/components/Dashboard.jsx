import { Card, AreaChart, Title, Text, Metric, Icon, Flex, Grid } from "@tremor/react";
import { StarIcon, CubeIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";

import { formatDate } from '../lib/datetime';
import { sortByDateKey } from '../lib/util';

const Dashboard = ({ daily, weekly }) => {
  const dailySorted = sortByDateKey(daily, 'date');
  const latestDaily = dailySorted[dailySorted.length - 1];
  const { lastPublished, stars, latest } = latestDaily?.data || {};

  const weeklySorted = sortByDateKey(weekly, 'date');
  const latestWeekly = weeklySorted[weeklySorted.length - 1]

  const versions = latestWeekly?.data && Object.keys(latestWeekly.data.versions);

  const categories = [
    {
      title: 'Latest Version',
      metric: latest,
      icon: CubeIcon,
      color: 'purple',
    },
    {
      title: 'Last Published',
      metric: new Date(lastPublished).toLocaleDateString(),
      icon: CalendarDaysIcon,
      color: 'green',
    },
    {
      title: 'Stars',
      metric: stars,
      icon: StarIcon,
      color: 'yellow',
    },
  ];

  const dataDownloadsTotal = dailySorted.map(({ date, data }) => {
    return {
      Day: formatDate(date),
      Downloads: data.downloads
    }
  });

  const dataDownloadsByVersion = weeklySorted.map(({ date, data }) => {
    const versions = data?.versions && Object.keys(data.versions).reduce((prev, curr) => {
      prev[curr] = data.versions[curr].downloads;
      return prev;
    }, {})
    return {
      Day: formatDate(date),
      ...versions
    }
  });

  return (
    <>
      <Title>{ latestWeekly?.title }</Title>
      <Grid numColsSm={2} numColsLg={3} className="gap-6 mb-6">
        {categories.map((item) => (
          <Card key={item.title} decoration="top" decorationColor={item.color}>
            <Flex justifyContent="start" className="space-x-4">
              <Icon
                icon={item.icon}
                variant="light"
                size="xl"
                color={item.color}
              />
              <div className="truncate">
                <Text>{item.title}</Text>
                <Metric className="truncate">{item.metric}</Metric>
              </div>
            </Flex>
          </Card>
        ))}
      </Grid>
      <Card>
        <Text className="text-md font-semibold">Total Downloads</Text>
        <AreaChart
          className="mt-4 mb-8 h-80"
          data={dataDownloadsTotal}
          index="Day"
          categories={["Downloads"]}
          colors={["indigo"]}
        />
        <Text className="text-md font-semibold">Downloads by Version</Text>
        <AreaChart
          className="mt-4 h-80"
          data={dataDownloadsByVersion}
          index="Day"
          categories={versions}
          colors={["rose", "fuchsia", "violet", "blue", "teal", "green", "yellow", "orange", "red", "slate"]}
        />
      </Card>
    </>
  )
}

export default Dashboard;