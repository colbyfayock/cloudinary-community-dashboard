import { Card, AreaChart, Title, Text, Metric, Icon, Flex, Grid } from "@tremor/react";
import { StarIcon, CubeIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";


const Dashboard = ({ reports, }) => {
  const projectDataSorted = sortByDateKey(reports, 'date');

  const latestProjectData = projectDataSorted[projectDataSorted.length - 1];
// console.log('latestProjectData', latestProjectData)
  const categories = [
    {
      title: "Latest Version",
      metric: latestProjectData.data.latest,
      icon: CubeIcon,
      color: "indigo",
    },
    {
      title: "Last Published",
      metric: new Date(latestProjectData.data.lastPublished).toLocaleDateString(),
      icon: CalendarDaysIcon,
      color: "indigo",
    },
    {
      title: "Stars",
      metric: latestProjectData.data.stars,
      icon: StarIcon,
      color: "indigo",
    },
  ];

  const dataTotal = projectDataSorted.map(({ date: dateString, data }) => {
    const date = new Date(dateString);
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    return {
      Day: `${month}/${day}/${year}`,
      Downloads: data.downloadsTotal
    }
  });

  const dataByVersion = projectDataSorted.map(({ date: dateString, data }) => {
    const date = new Date(dateString);
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    return {
      Day: `${month}/${day}/${year}`,
      ...data.downloadsByVersion
    }
  });

  const versions = Object.keys(latestProjectData.data.downloadsByVersion);

  return (
    <>
      <Title>{ latestProjectData.title }</Title>
      <Grid numColsSm={2} numColsLg={3} className="gap-6">
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
        <Text>Total Downloads</Text>
        <AreaChart
          className="mt-4 h-80"
          data={dataTotal}
          index="Day"
          categories={["Downloads"]}
          colors={["indigo", "fuchsia"]}
        />
        {/* <Text>Downloads by Version</Text>
        <AreaChart
          className="mt-4 h-80"
          data={dataByVersion}
          categories={versions}
          index="Day"
          colors={["indigo", "fuchsia"]}
        /> */}
      </Card>
    </>
  )
}

export default Dashboard;

function sortByDateKey(arr, key) {
  return arr.sort((a, b) => new Date(a[key]) - new Date(b[key]));
}