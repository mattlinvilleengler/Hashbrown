"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var singlevisualization_component_1 = require('../singlevisualization/singlevisualization.component');
var DataVisualizationComponent = (function () {
    function DataVisualizationComponent() {
        this.finance = 0;
        this.happiness = 0;
        this.exercise = 0;
        this.nutrition = 0;
        this.sleep = 0;
        this.alcohol = 0;
        this.loggedIn = false;
        this.financeSet = false;
        this.happinessSet = false;
        this.exerciseSet = false;
        this.nutritionSet = false;
        this.sleepSet = false;
        this.alcoholSet = false;
        this.mapping = [1, 1, 1];
        this.currentMin = 1;
        this.currentMax = 7;
        this.data = [];
        this.measurements = ["Exercise", "Sleep", "Happiness", "Nutrition", "Finance",];
        this.group = [];
        this.measurementsAvg = [];
        this.gColor = [];
        this.firstMili = 0;
        this.dataForTime = [];
    }
    DataVisualizationComponent.prototype.ngAfterViewInit = function () {
        componentHandler.upgradeDom();
    };
    DataVisualizationComponent.prototype.changeSet = function (x, d) {
        var min = 1, max = 7, step = 7, t = 0;
        x == 'week' ? (step = 7, t = 0) : false;
        x == 'month' ? (step = 30, t = 1) : false;
        x == 'year' ? (step = 365, t = 2) : false;
        d == 1 ? (this.mapping[t]--, max = this.currentMax + step, min = this.currentMin + step) : false;
        d == 2 ? (this.mapping[t]++, max = this.currentMax - step, min = this.currentMin - step) : false;
        this.currentMin = min;
        this.currentMax = max;
        d3.select("#visualisation").html(null);
        var maxData = this.dataForTime[max - 1] ? this.dataForTime[max - 1].time : this.dataForTime[(this.dataForTime.length - 1)].time;
        var minData = this.dataForTime[min - 1] ? this.dataForTime[min - 1].time : this.dataForTime[0].time;
        //var data = this.snagData(min, max);
        this.createGraph(this.data, minData, maxData);
    };
    DataVisualizationComponent.prototype.setTime = function (x) {
        var step;
        var min;
        x == 'week' ? (step = 7) : false;
        x == 'month' ? (step = 30) : false;
        x == 'year' ? (step = 365) : false;
        var max = (this.currentMin + step);
        this.currentMax = max;
        min = this.currentMin;
        d3.select("#visualisation").html(null);
        // var data = this.snagData(min, max);
        var maxData = this.dataForTime[max - 1] ? this.dataForTime[max - 1].time : this.dataForTime[(this.dataForTime.length - 1)].time;
        var minData = this.dataForTime[min - 1] ? this.dataForTime[min - 1].time : this.dataForTime[0].time;
        this.createGraph(this.data, minData, maxData);
        this.selectTimeButton(x);
    };
    DataVisualizationComponent.prototype.selectTimeButton = function (x) {
        d3.select("#weekButton").classed("selectedTime", false);
        d3.select("#monthButton").classed("selectedTime", false);
        d3.select("#yearButton").classed("selectedTime", false);
        d3.select("#" + x + "Button").classed("selectedTime", true);
    };
    DataVisualizationComponent.prototype.snagData = function (x, y) {
        var newData = [];
        this.data ? this.data.forEach(function (d) {
            if (d.Day >= x && d.Day <= y) {
                newData.push(d);
            }
        }) : false;
        return newData;
    };
    ;
    DataVisualizationComponent.prototype.toggleGraph = function (x) {
        var d = this.group.find(function (m) { return m.key == x; });
        var active = d.active ? false : true;
        var opacity = active ? 0 : 1;
        d3.select("#line_" + x).style("opacity", opacity);
        d.active = active;
    };
    DataVisualizationComponent.prototype.createData = function () {
        var d = [];
        this.measurements.forEach(function (x) {
            var day = 0;
            while (day < 366) {
                var dataPoint = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
                d.push({
                    Measurement: x,
                    Day: day,
                    Value: dataPoint
                });
                day++;
            }
        });
        this.data = d;
    };
    DataVisualizationComponent.prototype.createGraph = function (dataX, xMin, xMax) {
        var me = this;
        me.gColor = [];
        var width = window.innerWidth * .35;
        var height = window.innerHeight * .35;
        var svgLine = '<svg id="visualisation" height=' + height + ' width=' + width + ' ></svg>';
        d3.select("#graphBox").html(svgLine);
        var dataGroup = d3.nest()
            .key(function (d) {
            return d.Measurement;
        })
            .entries(dataX);
        this.group = dataGroup;
        var vis = d3.select("#visualisation"), WIDTH = width, HEIGHT = height, MARGINS = {
            top: 20,
            right: 40,
            bottom: 50,
            left: 40
        }, xScale = d3.time.scale().range([MARGINS.left, WIDTH - MARGINS.right]).domain([xMin, xMax]), yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 100]), xAxis = d3.svg.axis()
            .scale(xScale)
            .ticks(d3.time.days, 1)
            .tickFormat(d3.time.format('%m/%e')), yAxis = d3.svg.axis()
            .scale(yScale)
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
            .x(function (d) {
            return xScale(d.Day);
        })
            .y(function (d) {
            return yScale(d.Value);
        })
            .interpolate("basis");
        var lSpace = HEIGHT / dataGroup.length;
        var lineColor = "";
        dataGroup.forEach(function (d, i) {
            vis.append('svg:path')
                .attr('d', lineGen(d.values))
                .attr('stroke', function (d, j) {
                lineColor = "hsl(" + Math.random() * 360 + ",100%,50%)";
                return lineColor;
            })
                .attr('stroke-width', 2)
                .attr('id', 'line_' + d.key)
                .attr('fill', 'none');
            d ? me.gColor.push({
                mes: d.key,
                col: lineColor,
                active: true
            }) : false;
        });
        setTimeout(function () { componentHandler.upgradeDom(); }, 400);
    };
    ;
    DataVisualizationComponent.prototype.ngOnInit = function () {
        //this.createData();
        //this.changeSet("week");
        var me = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                me.loggedIn = true;
                me.userID = user.uid;
                me.getSettings();
                me.getData();
            }
            else {
                me.loggedIn = false;
            }
        });
    };
    DataVisualizationComponent.prototype.getSettings = function () {
        var me = this;
        database.ref('settings/' + this.userID).on('value', function (snapshot) {
            me.updateSettings(snapshot.val());
        });
    };
    DataVisualizationComponent.prototype.getData = function () {
        var me = this;
        database.ref('data/' + this.userID).on('value', function (snapshot) {
            me.updateData(snapshot.val());
        });
    };
    DataVisualizationComponent.prototype.updateData = function (data) {
        if (data) {
            var day = 1;
            for (var d in data) {
                if (this.firstMili > data[d].time || this.firstMili == 0) {
                    this.firstMili = data[d].time;
                }
                this.dataForTime.push(data[d]);
                for (var x in data[d]) {
                    if (x != "time" && this[x + "Set"]) {
                        this.data.push({
                            Measurement: x,
                            Day: (new Date(data[d].time)),
                            Mili: data[d].time,
                            Value: data[d][x]
                        });
                    }
                }
                day++;
            }
            this.changeSet("week");
            this.calculateAvg();
        }
    };
    DataVisualizationComponent.prototype.updateSettings = function (settings) {
        if (settings) {
            this.financeSet = settings.finance;
            this.happinessSet = settings.happiness;
            this.exerciseSet = settings.exercise;
            this.nutritionSet = settings.nutrition;
            this.sleepSet = settings.sleep;
            this.alcoholSet = settings.alcohol;
        }
    };
    DataVisualizationComponent.prototype.calculateAvg = function () {
        var measGroup = {};
        this.data.forEach(function (x) {
            measGroup[x.Measurement] ? false : measGroup[x.Measurement] = [];
            measGroup[x.Measurement].push(x.Value);
        });
        for (var m in measGroup) {
            var total = 0;
            measGroup[m].forEach(function (x) {
                total += +x;
            });
            var val = 565 - ((565 - 180) * ((total / measGroup[m].length) * .01));
            this.measurementsAvg.push({ name: m, value: val, valueV: (total / measGroup[m].length).toFixed(0) });
        }
        console.log(this.measurementsAvg);
    };
    DataVisualizationComponent = __decorate([
        core_1.Component({
            selector: 'my-datavisualization',
            templateUrl: 'app/datavisualization/datavisualization.component.html',
            styleUrls: ['app/datavisualization/datavisualization.component.css'],
            directives: [singlevisualization_component_1.SingleVisualizationComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], DataVisualizationComponent);
    return DataVisualizationComponent;
}());
exports.DataVisualizationComponent = DataVisualizationComponent;
//# sourceMappingURL=datavisualization.component.js.map