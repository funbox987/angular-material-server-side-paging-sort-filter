import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {UserDataSource} from "./user-datasource";
import {UserService} from "./user.service";
import {merge} from "rxjs";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit,OnInit {
  title = 'app3';

  // this is similar to jquery selector
  // @ViewChild(MatPaginator) will be applied to first dom element matching (mat paginator)
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // this is narrowed down to specific element in dom, as indicated by # sign
  @ViewChild('statusdropdown') status!: MatSelect;

  dataSource!: UserDataSource;

  options   :number[] = [0,1,2,3]
  selectedOptions : number[] = [];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'status'];

  constructor(private userService:UserService) {
  }

  ngOnInit() {
    this.dataSource = new UserDataSource(this.userService);
    this.dataSource.load();
  }

  ngAfterViewInit(): void {

    /**
     * This is rxjs way of subscribing to events.
     * similar to jquery (element).onchange( dosomething )
     *
     */
    // this.paginator.page
    //   .pipe(
    //     tap((data) => {
    //       console.log(`this.paginator : ${this.paginator.pageIndex} ${JSON.stringify(data)}`)
    //       this.loadTableData();
    //     })
    //   )
    //   .subscribe();

    /**
     * This is rxjs way of subscribing to events.
     * similar to jquery (element).onchange( dosomething )
     *
     */
    // this.sort.sortChange
    //   .pipe(
    //     tap((data) => {
    //       console.log(`this.sort : ${JSON.stringify(data)}`)
    //       this.loadTableData();
    //     })
    //   )
    //   .subscribe();

    /**
     * This is rxjs way of subscribing to events.
     * similar to jquery (element).onchange( dosomething )
     *
     */
    // this.status.selectionChange
    //   .pipe(
    //     tap((event) => {
    //       console.log(event.value)
    //       this.loadTableData();
    //     } )
    //   )
    //   .subscribe();

    /**
     * The above directives can be combined into one via merge
     */

    merge(
      this.paginator.page.pipe(),
      this.sort.sortChange.pipe(),
      this.status.selectionChange.pipe(),
      )
      .subscribe(() => this.loadTableData());
  }

  /**
   * This is angular way of handling event.
   * this binding is done in html component via (selectionChange)="onStatusFilter($event)"
   *
   */
  onStatusFilter(event:any) {
          this.loadTableData();
  }

  loadTableData() {

    //
    // NOTE:
    // > mat paginator pageindex starts at 0
    // > api pageindex starts at 1, hence pageIndex + 1

    console.log("in loadTableData " + this.status.value);

    this.dataSource.load(
      this.status.value,                      // filter status value
      this.paginator.pageIndex+1,   // pageindex
      this.paginator.pageSize,                // pagesize
      this.sort.active,                       // which column is active
      this.sort.direction                     // sort 'asc' or desc,
    );
  }

}
