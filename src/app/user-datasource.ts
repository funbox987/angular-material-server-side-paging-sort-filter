import {DataSource} from '@angular/cdk/collections';
import {Observable, BehaviorSubject} from 'rxjs';
import {User, UserService} from "./user.service";
import {HttpResponse} from "@angular/common/http";

/**
 * Data source for the App view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class UserDataSource extends DataSource<User> {

  private userSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private totalRecordSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();
  public totalRecord$ : Observable<number> = this.totalRecordSubject.asObservable();

  constructor(private userService:UserService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<User[]> {
    return this.userSubject.asObservable();
    // return this.userSubject.asObservable();
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
    this.userSubject.complete();
    this.loadingSubject.complete();
  }

  public load(filter= [], pageIndex = 1, pageSize = 5,sortOnColumn='', sortDirection='asc'){

    this.loadingSubject.next(true);

    this.userService.getUsers(filter, pageIndex, pageSize,sortOnColumn,sortDirection)
      .subscribe( (response : HttpResponse<User[]>) =>
      {
        // json server mock api uses this header to give total count

        this.userSubject.next(response.body!);

        this.totalRecordSubject.next(Number(response.headers.get('X-Total-Count')!));

        this.loadingSubject.next(false);
      })
  }


}
