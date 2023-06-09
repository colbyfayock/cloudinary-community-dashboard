import { sortByKey, sortByDateKey, addCommas } from '../lib/util';
import { formatDate } from '../lib/datetime';

/**
 * getTotalByType
 */

export function getTotalByType({ data, key, type, intervalType }) {
	const dataOfType = data.filter(d => d.type === intervalType);
  const lastMonthIndex = dataOfType.length - 1 - 28;
  const dataCurrent = dataOfType[dataOfType.length - 1];
  const dataLastMonth = dataOfType[lastMonthIndex];

  const totalViews = dataCurrent.data.reduce((prev, curr) => {
    return prev + curr.views.count;
  }, 0);

  let videos;
  let total = '';

  if ( type === 'all' ) {
    videos = dataOfType;
    total = totalViews;
  } else if ( type === 'lastMonth' ) {
    videos = dataOfType.slice(lastMonthIndex, dataOfType.length - 1)

    const lastMonthViews = dataLastMonth.data.reduce((prev, curr) => {
      return prev + curr.views.count;
    }, 0);

    total = totalViews - lastMonthViews;
  }

  const totals = videos.map(({ date, data }) => {
		const counts = data.map((d) => d[key].count);
		const total = counts.reduce((prev, curr) => prev + curr)
		return {
			date: formatDate(date),
			[key]: total
		}
	});

	return {
    total,
    data: totals
  }
}

/**
 * getTotalViewsByVideo
 */

export function getTotalViewsByVideo({ data, type }) {
  let videos;

	if ( type === 'all' ) {
		videos = data[data.length - 1].data.map((video) => {
			return {
				count: video.views.count,
				video
			}
		})
	} else if ( type === 'lastMonth' ) {
    const lastMonthIndex = data.length - 1 - 28;
    const dataLastMonth = data[lastMonthIndex];
    const dataCurrent = data[data.length - 1];

    videos = dataCurrent.data.map(data => {
      const lastMonth = dataLastMonth.data.find(({ id }) => data.id === id);
      if ( !lastMonth ) return data;
      return {
        ...data,
        views: {
          ...data.views,
          count: data.views.count - lastMonth.views.count
        }
      }
    })

    videos = videos.map((video) => {
			return {
				count: video.views.count,
				video
			}
		})
  }

  const videoData = Object.keys(videos).map(id => {
    const { video } = videos[id];
    return {
      id: video.id,
      title: video.title,
      link: video.url,
      value: videos[id].count
    }
  });

  const sortedData = sortByKey(videoData, 'value', 'desc');

  const formattedData = sortedData.map(data => {
    return {
      ...data,
      value: addCommas(data.value)
    }
  });
		
	return formattedData;
}