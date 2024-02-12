import { Injectable } from '@angular/core';
import { TableDataSections } from '../api/data.models';

export type Paths = {
  [K in keyof typeof initialPaths]: string;
};

interface PathMapping {
  [key: string]: keyof TableDataSections;
}

export const pathMapping: PathMapping = {
  '/home/orders/completed': 'ordersCompleted',
  '/home/stock/': 'stock',
  '/home/articles/nodes': 'articlesNodes',
  '/home/articles/articles': 'articles',
  '/home/articles/article-types': 'articlesTypes',
  '/home/storage-area/': 'storageArea',
  '/home/contractors/': 'contractors'
};

const initialPaths = {
  root: '/',
  login: '/login',
  ordersCompleted: '/home/orders/completed',
  stock: '/home/stock',
  articlesNodes: '/home/articles/nodes',
  articles: '/home/articles/articles',
  articlesTypes: '/home/articles/article-types',
  storageArea: '/home/storage-area',
  contractors: '/home/contractors',
} as const;

@Injectable({
  providedIn: 'root',
})
export class PathManagementService {
  private paths!: Paths;

  constructor() {
    this.definePaths();
  }

  private definePaths() {
    this.paths = { ...initialPaths };
  }

  getPath(key: keyof Paths): string {
    return this.paths[key];
  }

  getAllPaths(): Paths {
    return this.paths;
  }
}
