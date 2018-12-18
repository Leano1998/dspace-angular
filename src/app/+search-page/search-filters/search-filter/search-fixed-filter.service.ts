import { Injectable } from '@angular/core';
import { flatMap, map } from 'rxjs/operators';
import { Observable ,  of as observableOf } from 'rxjs';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { GetRequest, RestRequest } from '../../../core/data/request.models';
import { FilteredDiscoveryQueryResponse } from '../../../core/cache/response-cache.models';
import { ResponseCacheEntry } from '../../../core/cache/response-cache.reducer';
import { RequestService } from '../../../core/data/request.service';
import { ResponseCacheService } from '../../../core/cache/response-cache.service';
import { ResponseParsingService } from '../../../core/data/parsing.service';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { FilteredDiscoveryPageResponseParsingService } from '../../../core/data/filtered-discovery-page-response-parsing.service';
import { hasValue } from '../../../shared/empty.util';
import { configureRequest } from '../../../core/shared/operators';
import { RouteService } from '../../../shared/services/route.service';

/**
 * Service for performing actions on the filtered-discovery-pages REST endpoint
 */
@Injectable()
export class SearchFixedFilterService {
  private queryByFilterPath = 'filtered-discovery-pages';

  constructor(private routeService: RouteService,
              protected requestService: RequestService,
              protected responseCache: ResponseCacheService,
              private halService: HALEndpointService) {

  }

  /**
   * Get the filter query for a certain filter by name
   * @param {string} filterName     Name of the filter
   * @returns {Observable<string>}  Filter query
   */
  getQueryByFilterName(filterName: string): Observable<string> {
    if (hasValue(filterName)) {
      const requestObs = this.halService.getEndpoint(this.queryByFilterPath).pipe(
        map((url: string) => {
          url += ('/' + filterName);
          const request = new GetRequest(this.requestService.generateRequestId(), url);
          return Object.assign(request, {
            getResponseParser(): GenericConstructor<ResponseParsingService> {
              return FilteredDiscoveryPageResponseParsingService;
            }
          });
        }),
        configureRequest(this.requestService)
      );

      const responseCacheObs = requestObs.pipe(
        flatMap((request: RestRequest) => this.responseCache.get(request.href))
      );

      // get search results from response cache
      const filterQuery: Observable<string> = responseCacheObs.pipe(
        map((entry: ResponseCacheEntry) => entry.response),
        map((response: FilteredDiscoveryQueryResponse) =>
          response.filterQuery
        ));
      return filterQuery;
    }
    return observableOf(undefined);
  }

  /**
   * Get the query for looking up items by relation type
   * @param {string} relationType   Relation type
   * @param {string} itemUUID       Item UUID
   * @returns {string}              Query
   */
  getQueryByRelations(relationType: string, itemUUID: string): string {
    return `query=relation.${relationType}:${itemUUID}`;
  }

}
