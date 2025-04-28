import indicatorApiRequest from "@/apiRequests/indicator"
import { DashboardIndicatorQueryParamsType } from "@/schemaValidations/indicator.schema"
import { useQuery } from "@tanstack/react-query"


export const useDashboardIndicator = (queryParams: DashboardIndicatorQueryParamsType) => {
    return useQuery({
        queryKey: ['dashboardIndicator', queryParams],
        queryFn: () => indicatorApiRequest.getDashboardIndicators(queryParams),
        // select: (data) => DashboardIndicatorRes.parse(data)
    })
}