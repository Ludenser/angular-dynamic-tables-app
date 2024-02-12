import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { omit } from 'ramda';
import { DataSets, TableDataSections } from '../../services/api/data.models';
import { pathMapping } from '../../services/path-manager/path-manager.service';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { ModalInfoComponent } from './modal-info/modal-info.component';
import { ExtendedDataSets, TableDataService } from './table-data-service/table-data.service';

@Component({
  selector: 'showcase-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  standalone: true,
  imports: [NzTableModule, NzButtonModule, NzIconModule, NzDropDownModule, NzCarouselModule, NzPopconfirmModule, NzModalModule, CommonModule]
})
export class DynamicTableComponent implements OnInit {
  filters$ = this.tableDataService.filters$;
  isLoading$ = this.tableDataService.isLoading$;
  allChecked$ = this.tableDataService.allChecked$;
  indeterminate$ = this.tableDataService.indeterminate$;
  selectedRows$ = this.tableDataService.selectedRows$;

  constructor(
    private route: ActivatedRoute,
    private modalService: NzModalService,
    public tableDataService: TableDataService,
  ) { }

  ngOnInit(): void {
    this.subscribeToRouteParams();
    this.subscribeToFilterChanges();
    this.isLoading$ = this.tableDataService.isLoading$;
  }

  private subscribeToRouteParams(): void {
    this.route.params.subscribe(params => {
      const pathKey = this.getPathKeyFromParams(params);
      this.tableDataService.getTableData(pathKey);
    });
  }

  private getPathKeyFromParams(params: any): keyof TableDataSections {
    const { section, subsection } = params;
    const pathForMapping = `/home/${section}/${subsection || ''}`.trim();
    return pathMapping[pathForMapping] || section;
  }

  subscribeToFilterChanges(): void {

    this.tableDataService.filters$.subscribe(() => this.tableDataService.updateFilteredData());
  }

  loadTableData(section: keyof TableDataSections): void {
    this.tableDataService.getTableData(section);
  }

  reloadCurrentData(): void {
    const currentPathKey = this.getPathKeyFromParams(this.route.snapshot.params);
    this.tableDataService.getTableData(currentPathKey);
  }

  onOpenInfo(row: DataSets): void {
    this.modalService.create({
      nzTitle: this.getRowTitle(row),
      nzContent: ModalInfoComponent,
      nzData: { row, images: this.tableDataService.imagesByRowId[row.id] },
      nzFooter: null,
      nzMaskClosable: true,
      nzCentered: true,
      nzBodyStyle: { "padding": '10px 40px' }
    });
  }

  private getRowTitle(row: DataSets): string {
    switch (true) {
      case 'articleType' in row:
        return row.articleType
      case 'name' in row:
        return row.name
      case 'orderNumber' in row:
        return row.orderNumber
      case 'id' in row:
        return row.id
      default:
        return 'Нет заголовка'
    }
  }

  onEdit(row: DataSets): void {
    this.openEditModal(row);
  }

  private openEditModal(row: DataSets): void {
    const modal = this.modalService.create({
      nzTitle: 'Редактирование строки',
      nzContent: DynamicFormComponent,
      nzData: { mode: 'edit', row },
      nzFooter: null,
      nzCentered: true,
      nzMaskClosable: true
    });

    modal.afterClose.subscribe(result => {
      if (result) this.tableDataService.updateRowData(row, result);
    });
  }

  onCopy(row: DataSets): void {
    this.tableDataService.onCopy(row);
  }

  onAdd(): void {
    this.openAddModal();
  }

  private openAddModal(): void {
    const defaultStructure = this.tableDataService.getTableStructure().reduce((acc: { [key: string]: string }, key) => {
      if (key === 'id') {
        acc[key] = this.tableDataService.generateNewId();
      } else {
        acc[key] = '';
      }
      return acc;
    }, {});

    this.modalService.create({
      nzTitle: 'Добавление строки',
      nzContent: DynamicFormComponent,
      nzData: {
        mode: 'add',
        defaultStructure: omit(['checked'], defaultStructure),
      },
      nzFooter: null,
      nzCentered: true,
      nzMaskClosable: true
    });

    // modal.afterClose.subscribe(result => {
    //   if (result) this.updateRowData(row, result);
    // });
  }


  onDelete(index: number): void {
    this.confirmDeletion(() => this.tableDataService.removeRow(index));
  }

  private confirmDeletion(onConfirm: () => void): void {
    this.modalService.confirm({
      nzTitle: 'Вы уверены, что хотите удалить эту запись?',
      nzOkText: 'Удалить',
      nzCancelText: 'Отменить',
      nzCentered: true,
      nzOnOk: onConfirm,
    });
  }

  onAllChecked(checked: boolean): void {
    this.tableDataService.onAllChecked(checked);
  }

  onItemChecked(row: ExtendedDataSets, checked: boolean): void {
    this.tableDataService.onItemChecked(row, checked);
  }
}
