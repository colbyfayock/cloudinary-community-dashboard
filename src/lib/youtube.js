import { sortByKey, sortByDateKey, addCommas } from '../lib/util';
import { formatDate } from '../lib/datetime';

const ECOSYSTEM_TAGS = [
  {
    name: 'Flutter',
    variants: ['flutter'],
    color: 'cyan'
  },
  {
    name: 'Next.js',
    variants: ['next', 'nextjs', 'next.js'],
    color: 'slate'
  },
  {
    name: 'Node.js',
    variants: ['node', 'nodejs', 'node.js'],
    color: 'lime'
  },
  {
    name: 'Python',
    variants: ['python'],
    color: 'yellow'
  },
  {
    name: 'React.js',
    variants: ['react', 'reactjs', 'react.js'],
    color: 'blue'
  },
  {
    name: 'Remix',
    variants: ['remix', 'remixjs', 'remix.js'],
    color: 'fuchsia'
  },
  {
    name: 'SolidJS',
    variants: ['solid', 'solidjs', 'solid.js'],
    color: 'indigo'
  },
  {
    name: 'Svelte',
    variants: ['svelte', 'sveltekit'],
    color: 'red'
  },
  {
    name: 'Vue',
    variants: ['vue', 'vuejs', 'vue.js', 'nuxt'],
    color: 'emerald'
  },
  {
    name: 'WordPress',
    variants: ['wordpress'],
    color: 'sky'
  },
]

/**
 * getTotalViews
 */

function getTotalViews(videos) {
  return videos.reduce((prev, curr) => {
    return prev + curr.views.count;
  }, 0);
}

/**
 * getTotalViewsByDate
 */

function getTotalViewsByDate(videos) {
  return videos.map(({ date, data }) => {
		const counts = data.map((d) => d.views.count);
		const total = counts.reduce((prev, curr) => prev + curr)
		return {
			date: formatDate(date),
			views: total
		}
	});
}

/**
 * getTotalsByType
 */

export function getTotalsByType({ data, type, intervalType }) {
	const dataOfType = data.filter(d => d.type === intervalType);
  const lastMonthIndex = dataOfType.length - 1 - 28;
  const dataLastMonth = dataOfType[lastMonthIndex];

  // const groupedTotals = dataOfType.map(item => {
  //   return {
  //     data: groupVideosByEcosystemTag(item.data),
  //     date: item.date
  //   }
  // });
  
  let totals = getTotalViewsByDate(dataOfType);

  const totalsByDate = Object.entries(test).reduce((prev, [key, value]) => {
    value.forEach(item => {
      if ( !prev[item.date] ) {
        prev[item.date] = 0;
      }

      prev[item.date] = prev[item.date] + item.views;
    })

    return prev;
  }, {});

  let totals = Object.keys(totalsByDate).map(key => ({
    date: key,
    views: totalsByDate[key]
  }))

  // With the totals broken down by date, the last entry
  // will have the total alltime views

  const allTimeViews = totals[totals.length - 1].views;

  let total = allTimeViews;

  // If we're not dealing with alltime values, we need to modify
  // the dataset and recalculate the total number we're returning

  if ( type === 'lastMonth' ) {
    totals = totals.slice(lastMonthIndex, dataOfType.length);
    const lastMonthViews = getTotalViews(dataLastMonth.data);
    total = allTimeViews - lastMonthViews;
  }

	return {
    total,
    data: totals
  }
}

/**
 * getViewsByVideo
 */

export function getViewsByVideo({ data, type }) {
  let videos;

	if ( type === 'all' ) {
		videos = data[data.length - 1].data.map((video) => {
			return {
				count: video.views.count,
				video
			}
		})
	} else if ( type === 'lastMonth' ) {
    const lastMonthIndex = data.length - 28;
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
      value: video.views.count,
      thumbnail: video.thumbnails.maxres,
      tags: getEcosytemTagsFromVideoTags(video.tags)
    }
  });

  const sortedData = sortByKey(videoData, 'value', 'desc');

  const formattedData = sortedData.map(data => {
    return {
      ...data,
      value: data.value
      // value: addCommas(data.value)
    }
  });
		
	return formattedData;
}

/**
 * getEcosytemTagsFromVideoTags
 */

function getEcosytemTagsFromVideoTags(videoTags) {
  const tags = [];

  ECOSYSTEM_TAGS.forEach(({ name, variants }) => {
    variants.forEach(variant => {
      videoTags.forEach(tag => {
        if ( tag.toLowerCase().includes(variant.toLowerCase()) ) {
          tags.push(name);
        }
      })
    })
  });

  return Array.from(new Set(tags)).map(tag => {
    return ECOSYSTEM_TAGS.find(({ name }) => name === tag)
  });
}

/**
 * groupVideosByEcosystemTag
 */

function groupVideosByEcosystemTag(videos) {
  const tagGroups = {};

  videos.forEach(video => {
    const ecosystemTags = getEcosytemTagsFromVideoTags(video.tags);
    ecosystemTags.forEach(tag => {
      if ( !tagGroups[tag.name] ) {
        tagGroups[tag.name] = {};
      }
      tagGroups[tag.name][video.id] = video;
    })
  });

  return tagGroups;
}