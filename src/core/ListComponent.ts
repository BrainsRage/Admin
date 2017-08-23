import {BaseService} from './BaseService';
import {OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppState} from './AppState';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export class ListComponent<T> implements OnInit {
  public currentPage = 1;
  public itemsPerPage = 10;
  public totalItems = 0;
  public dataLoaded = false;
  public items: Subject<T[]>;
  protected sort = '-id';
  protected title = 'Список';
  protected cardTitle = '';
  protected cardIcon = '';
  protected columns: ListTableColumn<T>[];
  protected sortDirection = SortDirection;
  protected columnTypes = ListTableColumnType;
  protected actionTypes = ListTableColumnActionType;

  constructor(private service: BaseService<T>, private router: Router, private route: ActivatedRoute, private _appState: AppState) {
  }

  private static getSortKey(column: string, desc: boolean = false): string {
    let sortKey = column;
    if (desc) {
      sortKey = '-' + sortKey;
    }
    return sortKey;
  }

  private reload() {
    this.router.navigate([], {queryParams: {page: this.currentPage, sort: this.sort}, relativeTo: this.route});
  }


  ngOnInit() {
    this.items = new BehaviorSubject<T[]>([]);
    this.route.queryParamMap.subscribe(params => {
      const pageNumber = parseInt(params.get('page'), 10);
      if (pageNumber >= 1) {
        this.currentPage = pageNumber;
      }
      const sort = params.get('sort');
      if (sort != null) {
        this.sort = sort;
        const key = this.sort.replace('-', '');
        const sortDirection = this.sort.indexOf('-') > -1 ? SortDirection.Desc : SortDirection.Asc;
        this.columns.forEach(col => {
          col.setSorted(col.Key === key ? sortDirection : null);
        });
      }
      this.load(this.currentPage);
    });
    this._appState.notifyDataChanged('title', this.title);
  }

  public applySort(column: string) {
    let sortKey;
    if (this.sort === column) {
      sortKey = ListComponent.getSortKey(column, true);
    } else {
      sortKey = ListComponent.getSortKey(column);
    }
    this.sort = sortKey;
    this.reload();
  }

  public changePage(page: number) {
    this.currentPage = page;
    this.reload();
  }

  public load(page: number) {
    this.service.getList(page, this.itemsPerPage, this.sort).subscribe((res) => {
      this.items.next(res.data);
      this.totalItems = res.totalItems;
      this.currentPage = page;
      this.dataLoaded = true;
    });
  }

  public deleteItem(id: number) {
    this.service.delete(id).subscribe((res: boolean) => {
      if (res) {
        this.load(this.currentPage);
      }
    });
  }

  public getRowClass(model: T): { [key: string]: boolean } {
    return {};
  }
}

export class ListTableColumn<T> {
  public Title: string;
  public Key: string;
  public Sortable: boolean;
  public Sorted: SortDirection;
  public Type: ListTableColumnType;
  public Actions: ListTableColumnAction<T>[] = [];

  private getter: (model: T) => {};
  private linkGetter: (model: T) => {};

  protected getValue(model: T) {
    console.log('get value');
    if (this.getter) {
      return this.getter(model);
    }
    return model.hasOwnProperty(this.Key) ? model[this.Key] : null;
  }

  protected getLink(model: T) {
    if (this.linkGetter) {
      return this.linkGetter(model);
    }
    return null;
  }

  constructor(key: string, title: string, type: ListTableColumnType = ListTableColumnType.Text) {
    this.Key = key;
    this.Title = title;
    this.Type = type;
  }

  public setSortable(sortable: boolean = true): ListTableColumn<T> {
    this.Sortable = sortable;
    return this;
  }

  public setSorted(direction: SortDirection): ListTableColumn<T> {
    this.Sorted = direction;
    return this;
  }

  public setCustomGetter(getter: (model: T) => {}): ListTableColumn<T> {
    this.getter = getter;
    return this;
  }

  public setLinkGetter(linkGetter: (model: T) => {}): ListTableColumn<T> {
    this.Type = ListTableColumnType.Link;
    this.linkGetter = linkGetter;
    return this;
  }

  public AddAction(action: ListTableColumnAction<T>): ListTableColumn<T> {
    this.Type = ListTableColumnType.Actions;
    this.Actions.push(action);
    return this;
  }
}

export class ListTableColumnAction<T> {
  public Icon: string;
  public Title: string;
  public Type: ListTableColumnActionType;
  public GenerateUrl: (model: T) => string;
  public DoClick: (model: T) => any;

  constructor(title: string, icon: string, type: ListTableColumnActionType = ListTableColumnActionType.Click) {
    this.Title = title;
    this.Icon = icon;
    this.Type = type;
  }

  public setClick(click: (model: T) => any): ListTableColumnAction<T> {
    this.Type = ListTableColumnActionType.Click;
    this.DoClick = click;
    return this;
  }

  public setExternal(externalLinkGenerator: (model: T) => string): ListTableColumnAction<T> {
    this.Type = ListTableColumnActionType.ExternalLink;
    this.GenerateUrl = externalLinkGenerator;
    return this;
  }

  public Click(model: T) {
    this.DoClick(model);
  }
}

export enum ListTableColumnActionType {
  Click, ExternalLink
}

export enum ListTableColumnType {
  Text, Link, Date, TimeAgo, Actions
}

export enum SortDirection {
  Asc, Desc
}
