/*jslint nomen:true*/
/*global
 Paraclete
 */
var SWPTSDM = {
    v: '0.0.1',
    boot: function () {
        'use strict';

        SWPTSDM.MealType = SWPTSDM.MealType();
        SWPTSDM.FoodOverview = SWPTSDM.FoodOverview();
    }
};
console.log(this);