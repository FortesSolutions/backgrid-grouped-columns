/*
 backgrid-grouped-columns
 https://github.com/WRidder/backgrid-grouped-columns

 Copyright (c) 2014 Wilbert van de Ridder and contributors
 Licensed under the MIT @license.
 */
(function (root, factory) {

  // CommonJS
  if (typeof exports == "object") {
    module.exports = factory(require("underscore"), require("backgrid"));
  }
  // Browser
  else factory(root._, root.Backgrid, root.moment);

}(this, function (_, Backgrid) {
  "use strict";

  var groupedHeader = Backgrid.Extension.GroupedHeader = Backgrid.Header.extend({
    columnLayout: null,
    columnCollection: Backgrid.Columns,
    headerRows: [],

    initialize: function() {
      Backgrid.Header.prototype.initialize.apply(this, arguments);
      this.listenTo(this.columns, "change:renderable", this.render);
      this.listenTo(this.columns, "add remove", this.render);
    },

    /**
     Renders this table head with a single row of header cells.
     */
    render: function () {
      var view = this;
      view.$el.empty();

      // If a column layout has been defined, determine nesting
      if (view.columnLayout) {
        var key;
        for(key in view.columnLayout) {
          if (view.columnLayout.hasOwnProperty(key)) {
            view.calculateNesting(view.columnLayout[key]);
          }
        }
      }

      // Find amount of header rows
      var rowAmount = view.findDepth();
      var rows = Array.apply(null, new Array(rowAmount));
      rows = _.map(rows, function () { return []; });

      // Loop columns
      var lastNesting = [];
      view.columns.each(function(column) {
        var colNesting = column.get("nesting");
        var renderable = (typeof column.get("renderable") == "undefined" || column.get("renderable"));
        if (colNesting && !_.isEmpty(colNesting) && renderable)  {
          // Check for overlap and uniques with previous column; Use index based intersection
          var overlap = _.filter(lastNesting, function(num, ind) { return num == colNesting[ind];});
          var unique = _.difference(colNesting, overlap);

          // Create unique parents
          _.each(unique, function(element, index) {
            rows[index + overlap.length].push({
              name: element,
              sortable: false,
              editable: false,
              attributes: {
                colspan: 1,
                rowspan: 1
              },
              childColumns: [column.get("name")]
            });
          });

          // Increase colspan for every intersection
          _.each(overlap, function(element, index) {
            var lastElement = _.last(rows[index]);
            lastElement.attributes.colspan++;
            lastElement.childColumns.push(column.get("name"));
          });

          // Add main column
          rows[colNesting.length].push(_.extend({
            attributes: {
              colspan: 1,
              rowspan: rowAmount - colNesting.length
            }}, column.toJSON()));

          // Update nesting
          lastNesting = colNesting;
        }
        else if(renderable) {
          // Reset nesting
          lastNesting = [];

          // Create column definition attributes and add to rows
          rows[0].push(_.extend({
            attributes: {
              colspan: 1,
              rowspan: rowAmount
          }}, column.toJSON()));
        }
      });

      // Render the rows
      view.headerRows = [];
      _.each(rows, function(coll) {
        var row = new Backgrid.HeaderRow({
          columns: coll,
          collection: view.collection
        });
        view.$el.append(row.render().$el);
        view.headerRows.push(row);
      });

      // Trigger event
      view.collection.trigger("backgrid:header:rendered");

      this.delegateEvents();
      return this;
    },
    calculateNesting: function(object, nestArray) {
      var nestingArray = _.clone(nestArray || []);
      if (_.has(object, "children") && _.isArray(object.children) && !_.isEmpty(object.children)) {
        nestingArray.push(object.name);
        _.each(object.children, function(obj) {
          this.calculateNesting(obj, nestingArray);
        }, this);
      }
      else {
        // No children, assume it's an existing column model
        var columnModel = _.first(this.columns.where({ name: object.name}));
        if (columnModel && (typeof columnModel.get("renderable") == "undefined" || columnModel.get("renderable"))) {
          columnModel.set("nesting", nestingArray, {silent: true});
        }
      }
    },
    findDepth: function() {
      var view = this;
      var rows = 0;

      view.columns.each(function(col) {
        if (col.get('nesting')) {
          rows = Math.max(rows, col.get('nesting').length);
        }
      });

      return rows + 1;
    }
  });
}));