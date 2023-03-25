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