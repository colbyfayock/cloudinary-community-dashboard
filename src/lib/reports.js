export async function getReportsFromModule(dataModules) {
  return await Promise.all(Object.keys(dataModules).map(async key => {
    const { default: data } = await dataModules[key]();
    const filePath = key.split('/');
    const date = filePath.pop().replace('.json', '');
    const type = filePath.pop();
    return {
      type,
      data,
      date
    }
  }));
}

export function collectProjectReports(projects, reports) {
  return projects.reduce((prev, curr) => {
    prev[curr.id] = curr;
    reports.forEach(({ id, reports: reportGroup }) => {
      prev[curr.id][id] = reportGroup.map(report => {
        return {
          date: report.date,
          data: report.data.find(({ id }) => id === curr.id),
        }
      })
    });
    return prev;
  }, {});
}

export function getTotalByType({ data, key, type }) {
	const dataOfType = data.filter(d => d.type === type);
	return dataOfType.map(({ date, data }) => {
		const counts = data.map((d) => d[key].count);
		const total = counts.reduce((prev, curr) => prev + curr)
		return {
			date,
			[key]: total
		}
	});
}

export function getTotalViewsByVideo({ data, type }) {
	if ( type === 'all' ) {
		const videos = data[data.length - 1].data.map((video) => {
			return {
				count: video.views.count,
				video
			}
		})

		const videoData = Object.keys(videos).map(id => {
			return {
				id,
				...videos[id]
			}
		});

		const sortedVideoData = sortByKey(videoData, 'count', 'desc');
		
		return sortedVideoData;
	}
}