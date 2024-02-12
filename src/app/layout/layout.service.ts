import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private isCollapsedSource = new BehaviorSubject<boolean>(false);
  isCollapsed$ = this.isCollapsedSource.asObservable();



  toggleCollapse() {
    this.isCollapsedSource.next(!this.isCollapsedSource.value);
  }
}
