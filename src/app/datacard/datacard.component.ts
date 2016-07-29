import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var componentHandler: any;

@Component({
  moduleId: module.id,
  selector: 'my-datacard',
  templateUrl: 'datacard.component.html'
})
export class DataCardComponent implements AfterViewInit {
  ngAfterViewInit(): any {
    componentHandler.upgradeDom();
  }
}
