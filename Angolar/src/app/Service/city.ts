import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface City {
  שם_ישוב: string; 
}

interface ApiResponse {
  success: boolean;
  result: {
    records: City[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class getCity {
  
constructor(private http :HttpClient){}
  getCities():Observable<ApiResponse>{
    return this.http.get<ApiResponse>('https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba')
  }
  

}


