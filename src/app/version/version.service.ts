import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(private http: HttpClient)
  {
  }

  getVersion(): Observable<ArrayBuffer> {
    return this.http.get('assets/version.txt', {responseType: 'arraybuffer'}).pipe(
      tap(),
      catchError((err: HttpErrorResponse) => throwError(err)));
  }
}
