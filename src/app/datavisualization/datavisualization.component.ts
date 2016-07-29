import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var componentHandler: any;
declare var d3: any;
declare var database: any;
declare var firebase: any;

@Component({
    moduleId: module.id,
    selector: 'my-datavisualization',
    templateUrl: 'datavisualization.component.html',
    styleUrls: ['datavisualization.component.css']
})
export class DataVisualizationComponent implements OnInit, AfterViewInit {
    finance: number = 0;
    happiness: number = 0;
    exercise: number = 0;
    nutrition: number = 0;
    sleep: number = 0;
    alcohol: number = 0;
    loggedIn: boolean = false;
    userID: number;

    financeSet: boolean = false;
    happinessSet: boolean = false;
    exerciseSet: boolean = false;
    nutritionSet: boolean = false;
    sleepSet: boolean = false;
    alcoholSet: boolean = false;
    currentGraphTime: string = "week";
    mtGraph:number = 0;

    ngAfterViewInit(): any {
        var me = this;
        componentHandler.upgradeDom();
        window.onresize = function(){ me.setTime(me.currentGraphTime);};
    }
    mapping: any[] = [1, 1, 1]
    currentMin: number = 1;
    currentMax: number = 7;
    data: any[] = [];
    dataNumbers: any[] = [];    
    group: any[] = [];
    groupNumbers: any[] = [];
    gColor: any[] = [];
    firstMili: number = 0;
    dataForTime: any[] = [];
    settingsOrganized: any[]= [];
    settingsSelected: any[]=[];
    mainWidth: number = 200;

    changeSet(x: string, d?: number) {
        var min = 1,
            max = 7,
            step = 7,
            t = 0,
            xS = 1;
        this.currentGraphTime = x;

        x == 'week' ? (step = 7, t = 0, xS = 1) : false;
        x == 'month' ? (step = 30, t = 1, xS = 5) : false;
        x == 'year' ? (step = 365, t = 2, xS = 20) : false;
        d == 1 ? (this.mapping[t]-- , max = this.currentMax + step, min = this.currentMin + step) : false;
        d == 2 ? (this.mapping[t]++ , max = this.currentMax - step, min = this.currentMin - step) : false;
        this.currentMin = min;
        this.currentMax = max;
        d3.select("#visualisation").html(null);
        var maxData: number = this.dataForTime[max - 1] ? this.dataForTime[max - 1].time : this.dataForTime[(this.dataForTime.length - 1)].time;
        var minData: number = this.dataForTime[min - 1] ? this.dataForTime[min - 1].time : this.dataForTime[0].time;

        //var data = this.snagData(min, max);
        this.createGraph(this.data, minData, maxData, xS);

        var dataArray =[];
        this.dataNumbers.forEach(function(x){ dataArray.push(x.Value)});
        var yMax = Math.max.apply(Math, dataArray);
        this.createGraphNumbers(this.dataNumbers, minData, maxData, yMax, xS);
    }
    setTime(x: string) {
        var step: number;
        var min: number;
        var xS = 1;
        this.currentGraphTime = x;
        x == 'week' ? (step = 7, xS = 1) : false;
        x == 'month' ? (step = 30, xS = 5) : false;
        x == 'year' ? (step = 365, xS = 20) : false;
        var max = (this.currentMin + step);
        this.currentMax = max;
        min = this.currentMin;

        d3.select("#visualisation").html(null);
        // var data = this.snagData(min, max);
        var maxData: number = this.dataForTime[max - 1] ? this.dataForTime[max - 1].time : this.dataForTime[(this.dataForTime.length - 1)].time;
        var minData: number = this.dataForTime[min - 1] ? this.dataForTime[min - 1].time : this.dataForTime[0].time;
        this.createGraph(this.data, minData, maxData, xS);

        var dataArray =[];
        this.dataNumbers.forEach(function(x){ dataArray.push(x.Value)});
        var yMax = Math.max.apply(Math, dataArray);
        this.createGraphNumbers(this.dataNumbers, minData, maxData, yMax, xS);

        this.selectTimeButton(x);
    }
    selectTimeButton(x: string) {
        d3.select("#weekButton").classed("selectedTime", false);
        d3.select("#monthButton").classed("selectedTime", false);
        d3.select("#yearButton").classed("selectedTime", false);
        d3.select("#" + x + "Button").classed("selectedTime", true);
    }

    snagData(x: number, y: number) {
        var newData: any[] = [];
        this.data ? this.data.forEach(function (d) {
            if (d.Day >= x && d.Day <= y) {
                newData.push(d);
            }
        }) : false;
        return newData;
    };

    toggleGraph(x: string) {
        var d = this.group.find(function (m) { return m.key == x });
        var d = d ? d : this.groupNumbers.find(function (m) { return m.key == x });
        var active = d.active ? false : true;
        var opacity = active ? 0 : 1;
        d3.select("#line_" + x.replace(" ","")).transition().style("opacity", opacity);
        d.active = active;
    }
    createGraph(dataX: any[], xMin: any, xMax: any, xS:any) {
        var me = this;
        me.gColor = [];
        var width = window.innerWidth < 800 ? window.innerWidth * .9 : (window.innerWidth * .55); 
        var height = window.innerWidth < 800 ? window.innerHeight * .55 : (window.innerHeight * .50); 
        this.mainWidth = width + 5;
        me.mtGraph = -10 - height;
        var svgLine = '<svg id="visualisation" height=' + height + ' width=' + width + ' ></svg>';
        d3.select("#graphBox").html(svgLine);
        var dataGroup = d3.nest()
            .key(function (d: any) {
                return d.Measurement;
            })
            .entries(dataX);

        this.group = dataGroup;

        var vis = d3.select("#visualisation"),
            WIDTH = width,
            HEIGHT = height,
            MARGINS = {
                top: 40,
                right: 10,
                bottom: 40,
                left: 40
            },
            xScale = d3.time.scale().range([MARGINS.left, WIDTH - MARGINS.right]).domain([xMin, xMax]),
            yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 100]),

            xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(d3.time.days, xS)
                .outerTickSize(0)
                .innerTickSize(-HEIGHT +75)
                .tickFormat(d3.time.format('%b %e')),

            yAxis = d3.svg.axis()
                .scale(yScale)
                .outerTickSize(0)
                .innerTickSize(-WIDTH)
                .orient("left");

        vis.append("svg:g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);

        vis.append("svg:g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(yAxis);

        var lineGen = d3.svg.line()
            .x(function (d: any) {
                return xScale(d.Day);
            })
            .y(function (d: any) {
                return yScale(d.Value);
            })
            .interpolate("basis");

        var lSpace = HEIGHT / dataGroup.length;
        var lineColor = "";

        dataGroup.forEach(function (d: any, i: any) {
            vis.append('svg:path')
                .attr('d', lineGen(d.values))
                .attr('stroke', function (d: any, j: any) {
                    lineColor = "hsl(" + Math.random() * 360 + ",85%,50%)";
                    return lineColor;
                })
                .attr('stroke-width', 2)
                .attr('id', 'line_' + d.key.replace(" ",""))
                .attr('fill', 'none');
            d ? me.gColor.push({
                mes: d.key,
                col: lineColor,
                active: true
            }) : false;
        });
        setTimeout(function () { componentHandler.upgradeDom() }, 400);

    };
     createGraphNumbers(dataX: any[], xMin: any, xMax: any, yMax: any, xS:any) {
        var me = this;
        var mt = window.innerWidth < 800 ? 5 : 35;
        var xT = window.innerWidth < 900 ? -10 : 5;
        var width = window.innerWidth < 800 ? window.innerWidth * .9 : (window.innerWidth * .55); 
        var height = window.innerWidth < 800 ? window.innerHeight * .55 : (window.innerHeight * .50);  

        var svgLine = '<svg id="visualisationNumbers" height=' + height + ' width=' + width + ' ></svg>'
        +'<svg id="visualisationAxis" height=' + height + ' width=' + 45 + ' style="position:absolute;right:'+ xT +'px;' +'top:'+ mt +'px;" ></svg>';

        d3.select("#graphBox2").html(svgLine);
        var dataGroup = d3.nest()
            .key(function (d: any) {
                return d.Measurement;
            })
            .entries(dataX);

        this.groupNumbers = dataGroup;

        var vis = d3.select("#visualisationNumbers"),
            WIDTH = width,
            HEIGHT = height,
            MARGINS = {
                top: 40,
                right: 10,
                bottom: 50,
                left: 40
            },
            xScale = d3.time.scale().range([MARGINS.left, WIDTH - MARGINS.right]).domain([xMin, xMax]),
            yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, yMax]),

            xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(d3.time.days, xS)
                .outerTickSize(0)
                .innerTickSize(-HEIGHT)
                .tickFormat(d3.time.format('%b %e')),

            yAxis = d3.svg.axis()
                .scale(yScale)
                .ticks(4)
                .innerTickSize(-WIDTH)
                .outerTickSize(0)
                .orient("right");

        d3.select("#visualisationAxis").html("svg:g")
            .attr("class", "axis")
            .call(yAxis);

        var lineGen = d3.svg.line()
            .x(function (d: any) {
                return xScale(d.Day);
            })
            .y(function (d: any) {
                return yScale(d.Value);
            })
            .interpolate("basis");

        var lSpace = HEIGHT / dataGroup.length;
        var lineColor = "";

        dataGroup.forEach(function (d: any, i: any) {
            vis.append('svg:path')
                .attr('d', lineGen(d.values))
                .attr('stroke', function (d: any, j: any) {
                    lineColor = "hsl(" + Math.random() * 360 + ",75%,35%)";
                    return lineColor;
                })
                .attr('stroke-width', 2)
                .attr('id', 'line_' + d.key.replace(" ",""))
                .attr('fill', 'none');
            d ? me.gColor.push({
                mes: d.key,
                col: lineColor,
                active: true
            }) : false;
        });
        setTimeout(function () { componentHandler.upgradeDom() }, 400);

    };
    ngOnInit() {
        //this.createData();
        //this.changeSet("week");
        var me = this;
        firebase.auth().onAuthStateChanged(function (user: any) {
            if (user) {
                me.loggedIn = true;
                me.userID = user.uid;
                me.getSettings();
                me.getData();
            } else {
                me.loggedIn = false;
            }
        });
    }
    getSettings() {
        var me = this;
        database.ref('settings/' + this.userID).on('value', function (snapshot: any) {
            me.updateSettings(snapshot.val());
        });
    }
    getData() {
        var me = this;
        database.ref('data/' + this.userID).on('value', function (snapshot: any) {
            me.updateData(snapshot.val());
        });
    }
    updateData(data: any) {
        if (data) {
            var day = 1;
            for (var d in data) {
                if (this.firstMili > data[d].data.time || this.firstMili == 0) {
                    this.firstMili = data[d].data.time;
                }
                this.dataForTime.push(data[d].data);
                for (var x in data[d].data) {
                    if (x != "time" && this.settingsSelected[x.toLowerCase()]) {
                        if(this.settingsSelected[x.toLowerCase()].valueType == "range"){
                        this.data.push({
                            Measurement: x,
                            Day: (new Date(data[d].data.time)),
                            Mili: data[d].data.time,
                            Value: data[d].data[x]
                        })
                        } else {
                            this.dataNumbers.push({
                            Measurement: x,
                            Day: (new Date(data[d].data.time)),
                            Mili: data[d].data.time,
                            Value: data[d].data[x]
                        })
                        }
                        }
                    }
                }
                day++;
            }
            this.changeSet("week");
        }
    updateSettings(settings: any) {
  if (settings) {
             var me = this;
    me.settingsOrganized = [];
    var settings = settings.settings ? settings.settings : [];
    settings.forEach(function(x){
      var selectedArray = false;
      x.forEach(function(a){
        var selected = false;
        a.selected ? selected = true : false;
        selected ? me.settingsSelected[a.measurement.toLowerCase()] = a : false;
      });
      selectedArray ? me.settingsOrganized.push(x) : false;
    });
    }
    setTimeout(function(){componentHandler.upgradeDom();}, 500)
  }
}


