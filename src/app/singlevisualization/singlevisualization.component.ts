import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
declare var componentHandler: any;

@Component({
  moduleId: module.id,
  selector: 'my-singlevisualization',
  templateUrl: 'singlevisualization.component.html'
})
export class SingleVisualizationComponent implements AfterViewInit {
  // exercisePct: number = 330;
  exercisePct: number = 570;
  height: number = 0;
  avg: number = 0;
  high: number = 0;
  low: number = 0;

  ngAfterViewInit(): any {
    componentHandler.upgradeDom();
    var me = this;
    var t = Math.floor(Math.random() * 1500);
    setTimeout(function(){
      me.exercisePct = me.exercisePctReal;
      me.height = me.heightReal;
      me.addNumbersHigh( me.highReal);
      me.addNumbersAvg( me.avgReal);
      me.addNumbersLow( me.lowReal);    
      }, t);
  }
  addNumbersHigh(b){
    var me = this;
      me.high =b;
  }
    addNumbersAvg(b){
    var me = this;
      me.avg =b;
  }
    addNumbersLow(b){
    var me = this;
      me.low =b;
  }

  @Input('measurement') measurement: string;
  @Input('percent') exercisePctReal: number;
  @Input('percentV') exercisePctV: number;
  @Input('height') heightReal: number;
  @Input('avg') avgReal: number;
  @Input('high') highReal: number;
  @Input('low') lowReal: number;
  @Input('isRange') range: boolean;
   @Input('x') x: boolean;
  
  
}

