import { useState } from 'react';

import {
  AreaChart,
  Card,
  List,
  ListItem,
  Icon,
  Text,
  Bold,
  Flex,
  Metric,
  Title,
  Subtitle,
  Button,
  Grid,
  Select,
  SelectItem
} from "@tremor/react";

import { addCommas } from '../lib/util';

const defaultReportType = 'all';

const DashboardYouTube = ({ title: dashboardTitle, reports }) => {
  const [reportType, setReportType] = useState(defaultReportType);

  const reportConfig = {
    all: {
      label: 'All Time'
    },
    lastMonth: {
      label: 'Last 4 Weeks'
    }
  }

  function handleOnTimeChange(value) {
    setReportType(value);
  }

  return (
    <>
      <Flex>
        <Metric>YouTube / <Bold>{ dashboardTitle }</Bold></Metric>
        <div className="max-w-sm">
          <Select onValueChange={handleOnTimeChange} defaultValue={reportType}>
            {Object.entries(reportConfig).map(([key, { label }]) => {
              return (
                <SelectItem key={key} value={key}>
                  { label }
                </SelectItem>
              )
            })}
          </Select>
        </div>
      </Flex>
      {Object.entries(reports).map(([id, report ]) => {
        if ( report.type === 'chart' ) {
          const { data, total } = report.reports[reportType];

          return (
            <DashboardChart
              key={id}
              title={report.title}
              subtitle={reportConfig[reportType].label}
              label={addCommas(total)}
              data={data}
              index="date"
              keys={report.keys}
              valueFormatter={(value) => addCommas(value)}
            />
          )
        }

        if ( report.type === 'list' ) {
          return (
            <div key={id}>
              <DashboardList
                title={report.title}
                subtitle={reportConfig[reportType].label}
                items={report.reports[reportType].data}
              />
            </div>
          )
        }
      })}
    </>
  )
}

export default DashboardYouTube;

const DashboardChart = ({ title, subtitle, label, data, index, keys, valueFormatter }) => {
  return (
    <Card className="my-8">
      <Flex>
        <div>
          <Title>{ title }</Title>
          <Subtitle>{ subtitle }</Subtitle>
        </div>
        <Text className="text-md font-normal">{ label }</Text>
      </Flex>
      <AreaChart
        className="mt-4 mb-8 h-60"
        data={data}
        index={index}
        categories={keys}
        colors={["indigo"]}
        valueFormatter={valueFormatter}
      />
    </Card>
  )
}

const DashboardList = ({ title, subtitle, items }) => {
  return (
    <Card className="my-8">
      <Title>{ title }</Title>
      <Subtitle>{ subtitle }</Subtitle>
      <List className="mt-4">
        {items.map(item => (
          <ListItem key={item.id}>
            <Flex justifyContent="start" className="truncate space-x-4">
              <div className="truncate">
                <Text className="truncate">
                  <Bold>{ item.title }</Bold>
                </Text>
                <Text className="truncate">
                  <a href={item.link} target="_blank">{ item.link }</a>
                </Text>
              </div>
            </Flex>
            <Text>{ item.value }</Text>
          </ListItem>
        ))}
      </List>
    </Card>
  )
}