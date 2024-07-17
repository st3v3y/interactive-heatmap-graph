import { z } from 'zod';

export const uniqueVisitorsParamsSchema = z.object({
    limit: z.number({ required_error: 'Limit is required' }),
	from: z.coerce.date({ required_error: 'From date is required' }),
    until: z.coerce.date({ required_error: 'To date is required' })
});

export const uniqueVisitorsResponseSchema = z.object({
    country: z.string(),
    hour: z.number(),
    value: z.number(),
});

export type UniqueVisitorsParams = z.infer<typeof uniqueVisitorsParamsSchema>;
export type UniqueVisitorsResponse = z.infer<typeof uniqueVisitorsResponseSchema>;
