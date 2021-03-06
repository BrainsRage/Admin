import { JsonProperty } from 'json-object-mapper';
export class ListResult<T> {
  public data: T[];

  @JsonProperty()
  public totalItems: number;

  public constructor() {
    this.totalItems = undefined;
  }
}
