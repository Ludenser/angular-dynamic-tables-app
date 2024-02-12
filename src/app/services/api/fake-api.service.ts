import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { ApiService } from './api.service';
import {
  ArticleData,
  ArticleNodeData,
  ArticleTypeData,
  ContractorData,
  DataSets,
  OrderData,
  StockData,
  StorageAreaData,
  TableDataSections
} from './data.models';

@Injectable({
  providedIn: 'root'
})
export class FakeApiService extends ApiService {

  getTableData(section: keyof TableDataSections): Observable<DataSets[]> {
    let fakeData: any[] = [];

    switch (section) {
      case 'ordersCompleted':
        fakeData = this.getOrdersData();
        break;
      case 'stock':
        fakeData = this.getStockData();
        break;
      case 'articles':
        fakeData = this.getArticlesData();
        break;
      case 'articlesNodes':
        fakeData = this.getArticlesNodesData();
        break;
      case 'articlesTypes':
        fakeData = this.getArticlesTypesData();
        break;
      case 'storageArea':
        fakeData = this.getStorageAreaData();
        break;
      case 'contractors':
        fakeData = this.getContractorsData();
        break;
      default:
        fakeData = [];
        break;
    }

    return of(fakeData).pipe(delay(500));
  }

  private getStorageAreaData(): StorageAreaData[] {
    return Array.from({ length: 300 }, (_, index) => ({
      id: `SA${index + 1}`,
      zoneId: `SA${index + 1}`,
      name: `Warehouse ${index + 1}`,
      capacity: 1000,
      occupied: Math.floor(Math.random() * 1000)
    }));
  }

  private getContractorsData(): ContractorData[] {
    return Array.from({ length: 300 }, (_, index) => ({
      id: `C${index + 1}`,
      name: `Contractor ${index + 1}`,
      type: index % 2 === 0 ? "Supplier" : "Buyer",
      address: `Address ${index + 1}, City N`,
      phone: `+7 800 555-0${index + 1}`
    }));
  }

  private getArticlesTypesData(): ArticleTypeData[] {
    return Array.from({ length: 300 }, (_, index) => ({
      id: `AT${index + 1}`,
      type: `Type ${index + 1}`,
      description: `Description of type ${index + 1}`
    }));
  }

  private getArticlesNodesData(): ArticleNodeData[] {
    return Array.from({ length: 300 }, (_, index) => ({
      id: `AN${index + 1}`,
      node: `Node ${index + 1}`,
      name: `Name of node ${index + 1}`,
      articleCount: index * 2 + 1
    }));
  }

  private getArticlesData(): ArticleData[] {
    return Array.from({ length: 300 }, (_, index) => ({
      id: `A${index + 1}`,
      articleType: "Metal",
      name: `Article ${index + 1}`,
      supplierArticle: `A00${index + 1}`,
      article: `B00${index + 1}`,
      ssiArticle: `C00${index + 1}`,
      supplier: `Supplier ${index + 1}`,
      cost: `${1000 * (index + 1)} Rubles`,
      delivery: `${index % 5 + 1} Weeks`,
      descriptionImages: ['/assets/img/1.jpg', '/assets/img/2.jpg', '/assets/img/3.jpg']
    }));
  }

  private getStockData(): StockData[] {
    return Array.from({ length: 300 }, (_, index) => ({
      id: `S${index + 1}`,
      name: `Stock item ${index + 1}`,
      quantity: 100 - index,
      price: `${500 * (index + 1)} Rubles`,
      warehouse: `Warehouse ${index % 3 + 1}`
    }));
  }

  private getOrdersData(): OrderData[] {
    return Array.from({ length: 300 }, (_, index) => ({
      id: `O${index + 1}`,
      orderNumber: `Order ${index + 1}`,
      date: new Date().toISOString(),
      status: index % 2 === 0 ? "Processed" : "Waiting",
      total: `${(index + 1) * 500} Rubles`
    }));
  }

}
