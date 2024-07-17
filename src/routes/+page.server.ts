import { COUNTRY_LIMIT_PARAM, DATE_RANGE_PARAM } from '$lib/const/searchParams';
import { trpcServer } from '$lib/trpc';
import { DateRange } from '$lib/types/date-range';
import { dateRangeFromMap } from '$lib/utils/date';
import type { PageServerLoad } from './$types';

export const load = (async ({fetch, url}) => {
	const defaultCountryLimit = 10;
	const defaultDateRange = DateRange.LastWeek;

	const dateRangeType: DateRange = url.searchParams.get(DATE_RANGE_PARAM) as DateRange ?? defaultDateRange;
	const countryLimitParam: string = url.searchParams.get(COUNTRY_LIMIT_PARAM) as string ?? defaultCountryLimit;
	const dateRangeFrom = dateRangeFromMap[dateRangeType] ?? dateRangeFromMap[defaultDateRange];

	dateRangeFrom.setHours(0, 0, 0, 0);

	const uniqueVisitorsResponse = await trpcServer(fetch).heatmap.getUniqueVisitors.query({
		limit: isNaN(+countryLimitParam) ? defaultCountryLimit : parseInt(countryLimitParam),
		from: dateRangeFrom,
		until: new Date()
	});
	
	return {
		uniqueVisitors: uniqueVisitorsResponse,
		dateRange: dateRangeType,
		countryLimit: countryLimitParam
	};
}) satisfies PageServerLoad;