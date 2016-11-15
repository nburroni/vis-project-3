(function () {

    d3.json("/data/json/counties.json", function (err, counties) {
        if (err) {
            console.log("Error on counties.json load.");
            console.log(err);
            return;
        }

        var loadCsv = function (num) {
            d3.csv(`/data/csv/${num}.csv`, function (err, data) {
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

                if (num < 30) loadCsv(num + 1);
                if (window.onDataReady && num == 1) window.onDataReady(mapped, counties);

            });
        };

        loadCsv(1);
    });

})();