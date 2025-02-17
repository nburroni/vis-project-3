(function () {

    const purposeKeys = {
        HW: 'Home to Work',
        WH: 'Work to Home',
        HO: 'Home to Other',
        OH: 'Other to Home',
        OW: 'Other to Work',
        WO: 'Work to Other',
        HH: 'Home to Home',
        OO: 'Other to Other',
        WW: 'Work to Work'
    };
    const zoneMax = 4000;

    /**
     *
     */
    d3.json("./data/json/zones-geo.json", function (err, zonesGeo) {
        const loader = d3.select('#loader');
        if (err) {
            console.log("Error on zone-geo.json load.");
            console.log(err);
            return;
        }
        let zoneCounties = {};
        zonesGeo.features.forEach(f => zoneCounties[f.properties.TAZ_ID] = f.properties.COUNTY.charAt(0) + f.properties.COUNTY.substring(1).toLowerCase());
        d3.json("./data/json/holidays.json", function (err, holidays) {
            let daysOfMonth = d3.map(holidays, h => h.dayOfMonth).keys().map(d => parseInt(d));

            var loadCsv = function (num, loaded, loadFilters, filters) {
                loader.classed('hidden', false);

                d3.json("./data/json/zone-centers.json", function (err, centers) {
                    d3.json("./data/json/zones-geo.json", function (err, GEO_JSON) {
                        d3.csv(`./data/csv/${num}.csv`, function (err, data) {
                            if (err) {
                                console.log(`Error on ${num}.csv load.`);
                                console.log(err);
                                return;
                            }

                            let mapped = data.map(d => {
                                let timeRangeArray = d.Time_of_Day.split(':').map(t => t.substring(1));
                                let originStr = d.Origin_Zone.substring(11);
                                originStr = originStr == "" ? d.Origin_Zone : originStr;
                                let destStr = d.Destination_Zone.substring(11);
                                destStr = destStr == "" ? d.Destination_Zone : destStr;
                                let hourFrom = parseInt(timeRangeArray[0]);
                                let year = parseInt(d.Start_Date.substring(0, 4));
                                let month = parseInt(d.Start_Date.substring(4, 6)) - 1;
                                let day = parseInt(d.Start_Date.substring(6, 8));
                                return Object.assign({
                                    Day_Of_Month: num,
                                    Origin_Zone_Clean: originStr,
                                    Destination_Zone_Clean: destStr,
                                    Origin_Zone_Num: parseInt(originStr),
                                    Destination_Zone_Num: parseInt(destStr),
                                    Origin_County: zoneCounties[originStr],
                                    Destination_County: zoneCounties[destStr],
                                    Count_Num: parseFloat(d.Count),
                                    Date: new Date(year, month, day, hourFrom),
                                    Time_Range_Str: {from: timeRangeArray[0], to: timeRangeArray[1]},
                                    Time_Range: {from: hourFrom, to: parseInt(timeRangeArray[1])},
                                    Time_Range_Date: {
                                        from: new Date(year, month, day, hourFrom),
                                        to: new Date(year, month, day, parseInt(timeRangeArray[1]))
                                    }
                                }, d);
                            }).filter(d =>
                                d.Origin_Zone_Num < zoneMax &&
                                d.Destination_Zone_Num < zoneMax &&
                                d.Purpose != 'WW'
                            );

                            const partsOfDay = {
                                Morning: {from: 5, to: 12},
                                Afternoon: {from: 12, to: 17},
                                Evening: {from: 17, to: 21},
                                Night: {from: 21, to: 4}
                            };
                            let partOfDayMap = {};
                            let summarized = [];
                            Object.keys(partsOfDay).forEach(p => {
                                const part = partsOfDay[p];
                                let trips = {};
                                partOfDayMap[p] = (part.from < part.to ?
                                    mapped.filter(d => d.Time_Range.from >= part.from && d.Time_Range.to <= part.to) :
                                    mapped.filter(d => d.Time_Range.from >= part.from || d.Time_Range.to <= part.to))
                                    .sort((a, b) => a.Time_Range.from - b.Time_Range.to)
                                    .forEach(d => {
                                        d.Part_Of_Day = p;
                                        let key = `${d.Origin_Zone_Clean}-${d.Destination_Zone_Clean}`/*-${d.Subscriber_Class}`*/;
                                        const trip = trips[key];
                                        if (!trip) trips[key] = Object.assign({Avg: {count: 1, total: d.Count_Num}}, d);
                                        else {
                                            trip.Avg.count++;
                                            trip.Avg.total += d.Count_Num;
                                        }
                                    });
                                Object.keys(trips).forEach(k => {
                                    let t = trips[k];
                                    t.Count_Num = t.Avg.total / t.Avg.count;
                                    summarized.push(t);
                                })
                            });


                            if (loadFilters) {
                                let ranges = [];
                                mapped.forEach(d => ranges[d.Time_Range.from] = Object.assign({ str: `${d.Time_Range_Str.from} to ${d.Time_Range_Str.to}` }, d.Time_Range));
                                while (!ranges[0]) ranges.shift();
                                d3.select('#hour-range').selectAll('option').remove()
                                    .data(ranges).enter()
                                    .append('option')
                                    .attr('value', d => d.from)
                                    .html(d => d.str);
                                $('#hour-range').multiselect({
                                    nonSelectedText: 'All Hour Ranges',
                                    allSelectedText: 'All Hour Ranges',
                                    numberDisplayed: 1,
                                    nSelectedText: ' Hour Ranges'
                                });

                                let subscribers = {};
                                mapped.forEach(d => subscribers[d.Subscriber_Class] = d.Subscriber_Class);
                                d3.select('#subscriber').selectAll('option').remove()
                                    .data(Object.keys(subscribers)).enter()
                                    .append('option')
                                    .attr('value', d => d)
                                    .html(d => d);
                                $('#subscriber').multiselect({
                                    nonSelectedText: 'All Subscribers',
                                    allSelectedText: 'All Subscribers',
                                    numberDisplayed: 1,
                                    nSelectedText: ' Subscribers'
                                });

                                let purposes = {};
                                mapped.forEach(d => purposes[d.Purpose] = d.Purpose);
                                d3.select('#purpose').selectAll('option').remove()
                                    .data(Object.keys(purposes)).enter()
                                    .append('option')
                                    .attr('value', d => d)
                                    .html(d => purposeKeys[d]);
                                $('#purpose').multiselect({
                                    nonSelectedText: 'All Purposes',
                                    allSelectedText: 'All Purposes',
                                    numberDisplayed: 1,
                                    nSelectedText: ' Purposes'
                                });

                                let counties = {};
                                mapped.forEach(d => {
                                    counties[d.Origin_County] = d.Origin_County;
                                    counties[d.Destination_County] = d.Destination_County;
                                });
                                d3.select('#county').selectAll('option').remove()
                                    .data(Object.keys(counties)).enter()
                                    .append('option')
                                    .attr('value', d => d)
                                    .html(d => d);
                                $('#county').multiselect({
                                    nonSelectedText: 'All Counties',
                                    allSelectedText: 'All Counties',
                                    numberDisplayed: 1,
                                    nSelectedText: ' Counties'
                                });

                                const holidaySelect = d3.select('select#holiday');
                                holidaySelect.selectAll('option')
                                    .data(holidays)
                                    .enter()
                                    .append('option')
                                    .attr('value', d => d.name)
                                    .html(d => `Apr ${d.dayOfMonth} - ${d.name}`);
                                holidaySelect.on('change', function(event) {
                                    const selectedName = this.value;
                                    const holiday = holidays.find(h => h.name == selectedName);
                                    loadCsv(holiday.dayOfMonth);
                                });

                                const markerSelect = d3.select('select#markers');
                                markerSelect.selectAll('option')
                                    .data(['none'].concat(places))
                                    .enter()
                                    .append('option')
                                    .attr('value', d => d)
                                    .html(d => d.charAt(0).toUpperCase() + d.substring(1));
                                markerSelect.on('change', function(event) {
                                    if (this.value == 'none') hideMarkers();
                                    else showMarkers(this.value);
                                });

                                d3.select('select#day-of-month').selectAll('option')
                                    .data(d3.range(1, 31))
                                    .enter()
                                    .append('option')
                                    .attr('value', d => d)
                                    .html(d => d);
                                d3.select(`select#day-of-month option[value="${num}"]`).attr("selected", "");

                                d3.select('#filters .apply').on('click', function () {
                                    var getValues = function (id) {
                                        return $(`#${id} option:selected`).toArray().map(o => o.value);
                                    };

                                    loadCsv(parseInt(document.getElementById('day-of-month').value), loaded, false, {
                                        hours: getValues('hour-range').map(h => parseInt(h)),
                                        subscribers: getValues('subscriber'),
                                        purposes: getValues('purpose'),
                                        counties: getValues('county')
                                    })
                                })

                            }

                            let filtered = mapped;
                            let filteredGJ = GEO_JSON;
                            let filteredCenters = centers;

                            filteredGJ.features = filteredGJ.features.filter(f => f.properties.TAZ_ID < zoneMax);
                            filteredCenters = filteredCenters.filter(c => c.TAZ_ID < zoneMax);

                            if (filters) {
                                if (filters.hours.length > 0)
                                    filtered = filtered.filter(d => filters.hours.includes(d.Time_Range.from));
                                if (filters.subscribers.length > 0)
                                    filtered = filtered.filter(d => filters.subscribers.includes(d.Subscriber_Class));
                                if (filters.purposes.length > 0)
                                    filtered = filtered.filter(d => filters.purposes.includes(d.Purpose));
                                if (filters.counties.length > 0) {
                                    filtered = filtered.filter(d => filters.counties.includes(d.Origin_County) || filters.counties.includes(d.Destination_County));
                                    let upperCaseCounties = filters.counties.map(c => c.toUpperCase());
                                    filteredGJ.features = filteredGJ.features.filter(f =>
                                        upperCaseCounties.includes(f.properties.COUNTY)
                                    );
                                    filteredCenters = filteredCenters.filter(c => filters.counties.includes(zoneCounties[c.TAZ_ID]));
                                }
                            }
                            window.direction = 'inbound';

                            let temp = {};
                            mapped.forEach(d => {
                                let key = `${d.Origin_Zone_Num}-${d.Destination_Zone_Num}`;
                                if (temp[key]) temp[key].Count_Num += d.Count_Num;
                                else temp[key] = Object.assign({}, d);
                            });
                            let topCongested = [];
                            for (let k in temp)
                                if (temp.hasOwnProperty(k) && temp[k].Count_Num) topCongested.push(temp[k]);
                            topCongested = topCongested.sort((a, b) => b.Count_Num - a.Count_Num).slice(0, 10);

                            // if (dayIndex < daysOfMonth.length - 1) loadCsv(daysOfMonth[++dayIndex], loaded.concat(mapped));
                            /*else*/ if (window.onDataReady) {
                                window.onDataReady({
                                    day: num,
                                    data: filtered,
                                    topCongested: topCongested
                                }, filteredCenters, filteredGJ, holidays);
                            }

                        });

                    });
                });
            };

            var dayIndex = 0;
            loadCsv(daysOfMonth[dayIndex], [], true);
        });
    });

})();