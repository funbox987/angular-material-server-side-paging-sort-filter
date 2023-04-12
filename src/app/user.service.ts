import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {environment} from "../environments/environment";


export interface UserList {
  page:        number;
  per_page:    number;
  total:       number;
  data:        User[];
}

export interface User {
  id:         number;
  name:       string;
  email:      string;
  status:     number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private http: HttpClient) {
  }

  /**
   *  Uses HttpResponse<User> as return type to access response headers.
   */
  getUsers(filterstatus : number[] = [],
           pageIndex: number = 1,
           pageSize: number = 5,
           sort:string = '',
           order:string = 'asc') : Observable<HttpResponse<User[]>> {

    let headers : HttpHeaders = new HttpHeaders({
      'Content-Type':  'application/json'
    });

    // Add safe, URL encoded search parameter if there is a search term
    let params :HttpParams = new HttpParams()
      .set('_page', pageIndex)
      .set('_limit', pageSize)

    if (sort && sort.length > 0) {
      params = params.append('_sort', sort);
    }

    if (order && order.length > 0) {
      params = params.append('_order', order);
    }

    if (filterstatus && filterstatus.length > 0) {
      filterstatus.forEach((element)=> {
        params = params.append('status', element);
      })
    }

    const url = environment.apiUrl +'/users'

    return this.http.get<User[]>(url, {
      headers: headers,
      observe: 'response',
      params: params
    })
      .pipe(
        tap(
          _ => console.debug(
            `UserService.getUsers() received response [${JSON.stringify(_)}] from ${url}`)),
        catchError(this.handleError<any>('getUsers', []))
      )
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(`${operation} failed: ${error.message}`)

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
