import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import moment from 'moment';
import { head, keys, omit, reduce, without } from 'ramda';
import { map } from 'rxjs/operators';
import { DataSets, TableDataSections } from '../../../services/api/data.models';
import { FakeApiService } from '../../../services/api/fake-api.service';
import { TableColumn, TableFilterService } from '../table-filter-service/table-filter.service';

export type ExtendedDataSets = DataSets & { checked?: boolean } & { [key: string]: any };

@Injectable({
  providedIn: 'root'
})
export class TableDataService {
  // Хранение списка данных таблицы.
  private tableDataSubject = new BehaviorSubject<DataSets[]>([]);
  // Хранение состояния загрузки данных.
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  // Хранение текущей страницы пагинации.
  private currentPageSubject = new BehaviorSubject<number>(1);
  // Хранение размера страницы для пагинации.
  private pageSizeSubject = new BehaviorSubject<number>(10);
  // Хранение отфильтрованных данных, отображаемых в таблице.
  private filteredDataSubject = new BehaviorSubject<ExtendedDataSets[]>([]);
  // Состояние выбранных строк для чекбоксов.
  private selectedRowsSubject = new BehaviorSubject<ExtendedDataSets[]>([]);
  // Состояние "выбрать все" чекбокс.
  private allCheckedSubject = new BehaviorSubject<boolean>(false);
  // Состояние, когда некоторые, но не все строки выбраны.
  private indeterminateSubject = new BehaviorSubject<boolean>(false);
  // Набор идентификаторов выбранных строк.
  private selectedIds: Set<string> = new Set();
  // Определение Observable для различных состояний.
  filteredData$ = this.filteredDataSubject.asObservable();
  currentPage$ = this.currentPageSubject.asObservable();
  pageSize$ = this.pageSizeSubject.asObservable();
  total = 0; // Общее количество строк после фильтрации.
  imagesByRowId: Record<string, string[]> = {}; // Хранение изображений по ID строки.
  tableStructure: string[] = []; // Структура колонок таблицы.
  tableData: DataSets[] = []; // Исходные данные таблицы.
  filters$ = this.filterService.filters$; // Фильтры для таблицы.
  isLoading$ = this.isLoadingSubject.asObservable(); // Состояние загрузки данных.
  tableData$ = this.tableDataSubject.asObservable(); // Данные таблицы как Observable.
  selectedRows$ = this.selectedRowsSubject.asObservable(); // Выбранные строки как Observable.
  allChecked$ = this.allCheckedSubject.asObservable(); // Состояние "выбрать все" как Observable.
  indeterminate$ = this.indeterminateSubject.asObservable(); // Состояние indeterminate как Observable.

  constructor(
    private apiService: FakeApiService,
    private filterService: TableFilterService,) {
    this.subscribeToFilterChanges(); // Подписка на изменения фильтров.
  }

  // Загрузка данных для указанного раздела и обновление состояний.
  getTableData(section: keyof TableDataSections): void {
    this.isLoadingSubject.next(true);
    this.apiService.getTableData(section).pipe(
      map(data => this.processData(data)), // Обработка полученных данных.
    ).subscribe({
      next: (data) => {
        this.tableData = data;
        this.buildTableStructure(data); // Построение структуры таблицы.
        this.imagesByRowId = this.buildImagesByRowId(data); // Сборка изображений по ID.
        this.updateFilteredData(); // Обновление отфильтрованных данных.
        this.initFilters(); // Инициализация фильтров.
        this.isLoadingSubject.next(false);
      },
      error: (error) => {
        console.error('Error loading table data:', error);
        this.isLoadingSubject.next(false);
      }
    });
  }

  // Обработка данных: форматирование даты и исключение ненужных полей.
  private processData(data: DataSets[]): ExtendedDataSets[] {
    return data.map(item => {
      const newItem: ExtendedDataSets = { ...item };

      // Если в элементе данных есть поле 'date', форматируем его.
      if ('date' in newItem && typeof newItem.date === 'string') {
        newItem.date = moment(newItem.date).format('DD.MM.YYYY HH:mm');
      }

      return {
        ...newItem,
        checked: this.selectedIds.has(newItem.id.toString()),
        ...('descriptionImages' in newItem ? omit(['descriptionImages'], newItem) : {})
      };
    });
  }

  private buildImagesByRowId(data: DataSets[]): Record<string, string[]> {
    return reduce<DataSets, typeof this.imagesByRowId>((acc, value) => {
      let id;
      let descriptionImages;
      if ('descriptionImages' in value) {
        id = value.id;
        descriptionImages = value.descriptionImages
        acc[id] = descriptionImages;
      }
      return acc;
    }, {}, data);
  }

  getTableStructure(): string[] {
    return this.tableStructure
  }

  // Построение структуры таблицы из ключей данных.
  private buildTableStructure(data: DataSets[]): void {
    const headers = keys(head(data) || {})
    this.tableStructure = without(['checked', 'descriptionImages'], headers);
  }

  initFilters() {
    const columns = this.tableStructure.reduce<TableColumn[]>((acc, key) => {
      const filterType = 'default';
      acc.push({ key, title: key, filterType });
      return acc;
    }, []);
    this.filterService.setFilters(columns, this.tableData);

  }

  // Применение фильтров и обновление данных.
  applyFilters(): void {
    this.currentPageSubject.next(1);
    this.updateFilteredData();
  }

  // Сброс фильтров и обновление данных.
  resetFilters(): void {
    this.applyFilters();
  }

  // Обновление отфильтрованных данных с учетом пагинации.
  updateFilteredData(): void {
    const filtered = this.filterService.applyFilters(this.tableData);
    this.total = filtered.length;

    const currentPage = this.currentPageSubject.getValue();
    const pageSize = this.pageSizeSubject.getValue();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedData = filtered.slice(startIndex, endIndex);

    this.filteredDataSubject.next(paginatedData);
    this.updateSelectionState();
  }

  // Обработчики изменений страницы и размера страницы.
  onPageChange(pageIndex: number): void {
    this.currentPageSubject.next(pageIndex);
    this.updateFilteredData();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSizeSubject.next(pageSize);
    this.updateFilteredData();
  }

  // Подписка на изменения фильтров.
  subscribeToFilterChanges() {
    this.filterService.filters.subscribe(() => {
      this.currentPageSubject.next(1);
      this.updateFilteredData();
    });
  }

  // Обновление значения фильтра.
  onFilterChange(key: string, value: any) {
    this.filterService.updateFilterValue(key, value);
  }

  // Удаление строки по абсолютному индексу.
  removeRow(absoluteIndex: number): void {
    this.selectedIds.delete(this.tableData[absoluteIndex].id); // Удалить ID из выбранных, если он там есть
    this.tableData = [
      ...this.tableData.slice(0, absoluteIndex),
      ...this.tableData.slice(absoluteIndex + 1),
    ];

    this.updateFilteredData();
  }

  // Обновление данных строки.
  updateRowData(originalRow: DataSets, updatedRow: DataSets): void {
    this.tableData = this.tableData.map(item => item.id === originalRow.id ? { ...item, ...updatedRow } : item);
    this.updateFilteredData();
  }

  // Добавление копии строки.
  onCopy(row: DataSets): void {
    this.tableData = [...this.tableData, { ...row, id: this.generateNewId() }];
    this.updateFilteredData();
  }

  // Генерация нового уникального ID.
  generateNewId(): string {
    if (this.tableData.length === 0) {
      return 'ID1';
    }

    const maxDigit = this.tableData
      .map(row => {
        const match = row.id.match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .reduce((max, curr) => Math.max(max, curr), 0);

    return `ID${maxDigit + 1}`;
  }

  // Обработка события "выбрать все".
  onAllChecked(checked: boolean): void {
    const currentPageData = this.filteredDataSubject.getValue();
    currentPageData.forEach(row => {
      checked ? this.selectedIds.add(row.id) : this.selectedIds.delete(row.id);
      row.checked = checked;
    });

    this.updateFilteredData();
  }

  // Обработка выбора конкретной строки.
  onItemChecked(row: ExtendedDataSets, checked: boolean): void {
    checked ? this.selectedIds.add(row.id) : this.selectedIds.delete(row.id);
    row.checked = checked;
    this.updateFilteredData();
  }

  // Обновление состояния выбора строк.
  updateSelectionState(): void {
    const currentPageData = this.filteredDataSubject.getValue();
    this.allCheckedSubject.next(currentPageData.every(row => row.checked));
    this.indeterminateSubject.next(currentPageData.some(row => row.checked) && !currentPageData.every(row => row.checked));
  }
}
