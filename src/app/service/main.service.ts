import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataFrame } from '../pages/home/home.component';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  API: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getData(date: string) : Observable<DataFrame> {
    return this.http.get<DataFrame>(this.API + '/get-data?date='+date);
  }
}

