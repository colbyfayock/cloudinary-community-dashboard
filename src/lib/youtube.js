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
      value: video.views.count,
      thumbnail: video.thumbnails.maxres,
      tags: getEcosytemTagsFromVideoTags(video.tags)
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