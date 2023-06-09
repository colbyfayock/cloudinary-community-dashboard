import { useState } from 'react';
import { constructCloudinaryUrl } from '@cloudinary-util/url-loader';

import {
  AreaChart,
  Card,
  List,
  ListItem,
  Badge,
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
            <Grid key={id} numItemsSm={1} numItemsLg={2} className="gap-6">
              <DashboardList
                title={report.title}
                subtitle={reportConfig[reportType].label}
                items={report.reports[reportType].data}
              />
            </Grid>
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

const defaultSelectedTag = 'all';

const DashboardList = ({ title, subtitle, items }) => {
  const [selectedTag, setSelectedTag] = useState(defaultSelectedTag);

  const availableTags = Array.from(new Set(items.flatMap(({ tags }) => tags.map(tag => tag.name)))).sort();

  const activeItems = selectedTag === defaultSelectedTag ? items : items.filter(({ tags }) => {
    return tags.find(tag => tag.name === selectedTag);
  });

  function handleOnTagChange(value) {
    setSelectedTag(value);
  }

  return (
    <Card className="my-8">
      <Flex>
        <div>
          <Title>{ title }</Title>
          <Subtitle>{ subtitle }</Subtitle>
        </div>
        <div className="max-w-sm">
          <Select onValueChange={handleOnTagChange} defaultValue={selectedTag}>
            <SelectItem value={defaultSelectedTag}>
              All
            </SelectItem>
            {availableTags.map(tag => {
              return (
                <SelectItem key={tag} value={tag}>
                  { tag }
                </SelectItem>
              )
            })}
          </Select>
        </div>
      </Flex>
      <List className="mt-4">
        {activeItems.map(item => {
          const width = 160;
          const height = 90;
          const thumbnailUrl = constructCloudinaryUrl({
            options: {
              src: `community-dashboard-thumbnails/${item.thumbnail.url.replace('https://i.ytimg.com/vi/', '')}`,
              width: width * 2,
              height: height * 2
            },
            config: {
              cloud: {
                cloudName: import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME
              }
            }
          });
          return (
            <ListItem key={item.id}>
              <Flex alignItems="start">
                <Flex justifyContent="start" alignItems="start" className="truncate space-x-4">
                  <img className="rounded-sm" width={width} height={height} src={thumbnailUrl} alt="Video Cover" />
                  <div className="truncate">
                    <Text className="truncate mb-1">
                      <Bold>{ item.title }</Bold>
                    </Text>
                    <Subtitle className="truncate text-sm mb-3">
                      <a href={item.link} target="_blank">{ item.link }</a>
                    </Subtitle>
                    <Flex justifyContent="start" className="gap-1">
                      { item.tags.map(tag => {
                        return (
                          <Badge key={tag.name} color={ tag.color }>
                            { tag.name }
                          </Badge>
                        );
                      })}
                    </Flex>
                  </div>
                </Flex>
                <Text>{ item.value }</Text>
              </Flex>
            </ListItem>
          )
        })}
      </List>
    </Card>
  )
}