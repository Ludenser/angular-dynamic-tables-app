// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataSets, TableDataSections } from './data.models';

@Injectable({
  providedIn: 'root',
})
export abstract class ApiService {
  abstract getTableData(section: keyof TableDataSections): Observable<DataSets[]>;
}
