import { AdapterInterface, AdapterOptions, AdapterResponse, QueryBuilder } from '../Fluentity';
export declare class DefaultAdapter implements AdapterInterface {
    options: AdapterOptions;
    call(_queryBuilder: QueryBuilder): Promise<AdapterResponse>;
    configure(_options: Partial<AdapterOptions>): void;
}
