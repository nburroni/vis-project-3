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

    /**
     *
     */
    d3.json("./data/json/zone-centers.json", function (err, zones) {
        const loader = d3.select('#loader');
        if (err) {
            console.log("Error on zone-centers.json load.");
            console.log(err);
            return;
        }
        d3.json("./data/json/zones-geo.json", function (err, zonesGeo) {
            if (err) {
                console.log("Error on zone-geo.json load.");
                console.log(err);
                return;
            }
            let zoneCounties = {};
            zonesGeo.features.forEach(f => zoneCounties[f.properties.TAZ_ID] = f.properties.COUNTY.charAt(0) + f.properties.COUNTY.substring(1).toLowerCase());

            var loadCsv = function (num, loadFilters, filters) {
                loader.classed('hidden', false);
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
                    });

                    if (loadFilters) {
                        let ranges = [];
                        mapped.forEach(d => ranges[d.Time_Range.from] = Object.assign({str: `${d.Time_Range_Str.from} to ${d.Time_Range_Str.to}`}, d.Time_Range));
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
                    }

                    let filtered = mapped;
                    if (filters) {
                        if (filters.hours.length > 0)
                            filtered = filtered.filter(d => filters.hours.includes(d.Time_Range.from));
                        if (filters.subscribers.length > 0)
                            filtered = filtered.filter(d => filters.subscribers.includes(d.Subscriber_Class));
                        if (filters.purposes.length > 0)
                            filtered = filtered.filter(d => filters.purposes.includes(d.Purpose));
                        if (filters.counties.length > 0)
                            filtered = filtered.filter(d => filters.counties.includes(d.Origin_County) || filters.counties.includes(d.Destination_County));
                    }

                    if (window.onDataReady) window.onDataReady({
                        day: num,
                        data: filtered,
                        direction: 'dest',
                        topCongested: mapped.sort((a, b) => b.Count_Num - a.Count_Num).slice(0, 10)
                    }, zones);
                    loader.classed('hidden', true);

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

                    loadCsv(parseInt(document.getElementById('day-of-month').value), false, {
                        hours: getValues('hour-range').map(h => parseInt(h)),
                        subscribers: getValues('subscriber'),
                        purposes: getValues('purpose'),
                        counties: getValues('county')
                    })
                })

            };

            loadCsv(1, true);
        });
    });

})();