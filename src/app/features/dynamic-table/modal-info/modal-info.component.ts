import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { pick, toPairs } from 'ramda';
import { DataSets } from '../../../services/api/data.models';

interface ModalData {
  row: DataSets;
  images: string[];
}

@Component({
  selector: 'showcase-modal-info',
  standalone: true,
  imports: [NzCarouselModule, NzImageModule, CommonModule],
  templateUrl: './modal-info.component.html',
  styleUrl: './modal-info.component.scss'
})
export class ModalInfoComponent implements OnInit {

  constructor(
    @Inject(NZ_MODAL_DATA) public data: ModalData
  ) { }

  row: { [key: string]: any } = {}; // предполагаем, что row - это объект
  images: string[] = [];
  details: { key: string; value: any }[] = [];
  headerTitle: string = '';
  fallback: string = '/assets/img/not_found.jpg';

  ngOnInit(): void {
    this.row = this.data.row;
    this.images = this.data.images;

    const filteredRow = pick([
      'name',
      'article',
      'type',
      'articleCount',
      'date',
      'status',
      'total',
      'capacity',
      'occupied',
      'warehouse',
      'quantity',
      'phone'
    ], this.row);

    this.details = toPairs(filteredRow).map(([key, value]) => ({ key: String(key), value: value as any }));
  }
}
