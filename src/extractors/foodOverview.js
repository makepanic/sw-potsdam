// SWPTSDM.FoodOverview
(function (SWPTSDM) {
    'use strict';

    /*global
     exports,
     $,
     window,
     SWPTSDM
     */

    var FoodOverview = function () {
        var parse,
            i,
            max,
            parseTable,
            parseMeal;

        parseMeal = function (col, $table) {

            // select table column (ignore first row because there is the date
            var $col = $table.find('tr:not(:first-child) td:nth-child(' + (col + 1) + ')'),
                data = {},
                mealRow,
                titleRow,
                typeRow;

            if ($col.length !== 3) {
                throw 'there should be 3 rows for each meal';
            }

            titleRow = $col[0];
            mealRow = $col[1];
            typeRow = $col[2];

            data.title = SWPTSDM.$(titleRow).html().trim();
            data.meal = SWPTSDM.$(mealRow).text().trim();
            data.type = SWPTSDM.MealType.extract(SWPTSDM.$(typeRow));

            return data;
        };

        parseTable = function ($table) {
            var tableData = {
                    date: '',
                    meals: []
                },
                cols,
                i;

            cols = $table.find('tr:nth-child(2) td').length;
            tableData.date = $table.find('.date').text().trim();

            for (i = 0; i < cols; i += 1) {
                tableData.meals.push(parseMeal(i, $table));
            }

            return tableData;
        };

        parse = function ($tables) {
            var overViewData = [];

            $tables.each(function (index, elem) {
                overViewData.push(parseTable(SWPTSDM.$(elem)));
            });

            return overViewData;
        };
        return {
            extract: parse
        };
    };

    SWPTSDM.FoodOverview = FoodOverview();

}(SWPTSDM));