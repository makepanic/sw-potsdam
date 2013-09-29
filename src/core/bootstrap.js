/*jslint nomen:true*/
/*global
 Paraclete
 */
var SWPTSDM = {
    v: '0.0.1',
    $: null,
    boot: function ($) {
        'use strict';

        this.$ = $;
    }
};
console.log(this);