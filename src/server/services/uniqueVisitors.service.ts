import { ELASTIC_SEARCH_INDEX } from '$env/static/private';
import { elasticClient as elastic } from '$lib/elastic';
import type { UniqueVisitorData } from '$lib/types/unique-vistors';
import type { UniqueVisitorsParams, UniqueVisitorsResponse } from '../validations/uniqueVisitors.schema';

export class UniqueVisitorsService {
	async getUniqueVisitors(param: UniqueVisitorsParams): Promise<UniqueVisitorsResponse[]> {

		// We first need to get the top 25 countries, unfortunately it's not (yet) possible 
		// to do it with ESQL in one query. JOINS or Subqueries are required, but only 
		// limited or not at all available by ES.
		// But it could be anyways an interesting feature for future versions to let the user choose the countries.
		const { records: countries } = await elastic.helpers.esql({ 
			query: `FROM ${ELASTIC_SEARCH_INDEX}
			| STATS
				value = COUNT_DISTINCT(clientip)
				BY country = geo.dest
			| SORT value DESC
			| KEEP country
			| LIMIT ${param.limit}`
		}).toRecords<{ country: string }>();

		// First, I used DSL to receive the required data (see previous commits). 
		// Then I used ESQL to get the results, as it is easier to read and to maintain, because its syntax is similar to SQL.
		// Also, the result is typed and does not require processing.
		const { records: uniqueVisitorData } = await elastic.helpers.esql({ 
			query: `FROM ${ELASTIC_SEARCH_INDEX}
			| WHERE @timestamp >= to_datetime("${param.from.toISOString()}") 
				AND @timestamp <= to_datetime("${param.until.toISOString()}")
				AND geo.dest IN ("${countries.map((c) => c.country).join('","')}")
			| EVAL 
				hour = date_extract("hour_of_day", @timestamp),
				country = geo.dest
			| KEEP country, hour, clientip
			| STATS
				value = COUNT_DISTINCT(clientip)
				BY country, hour
			| SORT value DESC
			| KEEP country, hour, value`,
		}).toRecords<UniqueVisitorData>();

		// We need to set the 0 hour result to 24 in the results, because
		// we need it like this in the chart and ESQL does not return it like this by default.
		for (let i = 0; i < uniqueVisitorData.length; i++) {
			const data = uniqueVisitorData[i];
			if (data.hour == 0) {
				data.hour = 24;
			}
		}

		return uniqueVisitorData;
	}
}
