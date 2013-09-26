// SWPTSDM.MealType
(function (SWPTSDM) {
    'use strict';

    /*global
     exports,
     $,
     window,
     SWPTSDM
     */

    var MealType = function () {

        var type = {
                VEGAN: 'vegan',
                VITAL: 'mensaVital',
                FISH: 'mit Fisch',
                PORK: 'mit Schweinefleisch',
                VEGETABIL: 'ovo-lacto-vegetabil'
            },
            parse = function ($label) {
                var className = $label[0].className,
                    mealTypes = [],
                    $labelTypes,
                    i,
                    max;

                if (className.indexOf('label') !== 0) {
                    // expects <td class=label*>
                    throw "[mealType] className not expected";
                }

                $labelTypes = $label.find('img');
                $labelTypes.each(function (index, elem) {
                    var attr = elem.getAttribute('title'),
                        found = Object.keys(type).filter(function (key) {
                            // find the key for the given title attribute
                            return type[key] === attr;
                        })[0];
                    mealTypes.push(found);
                });

                return mealTypes;
            };

        return {
            type: type,
            extract: parse
        };
    };
    SWPTSDM.MealType = MealType;

}(SWPTSDM));