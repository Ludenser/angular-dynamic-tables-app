import { Paths } from '../path-manager/path-manager.service';

export type TableDataSections = Omit<Paths, 'root' | 'login'>;

export type DataSets =
  { [key: string]: any }
  | StorageAreaData
  | ContractorData
  | ArticleTypeData
  | ArticleNodeData
  | ArticleData
  | StockData
  | OrderData

export interface StorageAreaData {
  id: string;
  zoneId: string;
  name: string;
  capacity: number;
  occupied: number;
}

export interface ContractorData {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
}

export interface ArticleTypeData {
  id: string;
  type: string;
  description: string;
}

export interface ArticleNodeData {
  id: string;
  node: string;
  name: string;
  articleCount: number;
}

export interface ArticleData {
  id: string;
  articleType: string;
  name: string;
  supplierArticle: string;
  article: string;
  ssiArticle: string;
  supplier: string;
  cost: string;
  delivery: string;
  descriptionImages: string[];
}

export interface StockData {
  id: string;
  name: string;
  quantity: number;
  price: string;
  warehouse: string;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: string;
}
