import { Injectable } from '@angular/core';
import { flatten, pluck, uniq } from 'ramda';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TableColumn {
  key: string;
  title: string;
  filterType: 'default' | 'text';
  filterList?: Array<{ text: string; value: any }>;
  filterFn?: (list: Array<{ text: string; value: any }>, item: any) => boolean;
  filterValue?: any;
}


@Injectable({
  providedIn: 'root'
})
export class TableFilterService {
  // BehaviorSubject для хранения и обновления списка фильтров таблицы.
  public filters$ = new BehaviorSubject<TableColumn[]>([]);
  // BehaviorSubject для отслеживания состояния загрузки данных.
  private isLoading$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  // Getter для получения текущих фильтров как Observable.
  get filters(): Observable<TableColumn[]> {
    return this.filters$.asObservable();
  }

  // Getter для получения состояния загрузки как Observable.
  get isLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  // Метод для установки состояния загрузки.
  setLoading(isLoading: boolean): void {
    this.isLoading$.next(isLoading);
  }

  // Метод для инициализации фильтров таблицы.
  setFilters(columns: TableColumn[], data: any[]) {
    this.setLoading(true); // Включаем индикатор загрузки
    const updatedColumns = columns.map(col => {
      // Установка функции фильтрации для текстовых фильтров
      if (col.filterType === 'text') {
        col.filterFn = (list, item) => item[col.key]?.toString().toLowerCase().includes(col.filterValue?.toLowerCase());
      } else {
        // Для остальных типов фильтров формируем список уникальных значений
        const allValues = uniq(flatten(pluck(col.key, data))).filter(value => value !== undefined);
        col.filterList = allValues.map(value => ({ text: value.toString(), value }));
        col.filterFn = (list, item) => list.some(filter => filter.value === item[col.key]);
      }
      return col;
    });
    this.setLoading(false); // Выключаем индикатор загрузки

    this.filters$.next(updatedColumns); // Обновляем список фильтров
  }

  // Метод для обновления значения конкретного фильтра.
  updateFilterValue(key: string, value: any) {
    this.setLoading(true); // Включаем индикатор загрузки
    const filters = this.filters$.getValue();
    const index = filters.findIndex(filter => filter.key === key);

    if (index !== -1) {
      filters[index].filterValue = value;
      this.filters$.next(filters); // Обновляем список фильтров
    }

    this.setLoading(false); // Выключаем индикатор загрузки
  }

  // Метод применения фильтров к данным.
  applyFilters(data: any[]): any[] {
    this.setLoading(true); // Включаем индикатор загрузки
    const filters = this.filters$.getValue();
    // Фильтрация данных на основе активных фильтров
    const filteredData = data.filter(row => {
      return filters.every(filter => {
        if (!filter.filterValue || filter.filterValue.length === 0) return true;
        if (filter.filterType === 'text') {
          return row[filter.key]?.toString().toLowerCase().includes(filter.filterValue.toLowerCase());
        } else {
          return Array.isArray(filter.filterValue)
            ? filter.filterValue.includes(row[filter.key])
            : row[filter.key] === filter.filterValue;
        }
      });
    });
    this.setLoading(false); // Выключаем индикатор загрузки

    return filteredData; // Возвращаем отфильтрованные данные
  }
}
