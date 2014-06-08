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
  var groupedHeader = Backgrid.Extension.GroupedHeader = Backgrid.Header.extend({
    columnLayout: {},
    columnCollection: Backgrid.Columns,

    initialize: function() {
      Backgrid.Header.prototype.initialize.apply(this, arguments);
      this.attachEvents();
    },

    /**
     Renders this table head with a single row of header cells.
     */
    render: function () {
      var view = this;
      view.$el.empty();
      var levelColumns = view.columnLayout;
      var rowAmount = view.depthOf(levelColumns) / 2;

      var columnFilter = function(arr, end) {
          return _.filter(arr, function(obj) {
            return (end) ? !_.has(obj, "children") : _.has(obj, "children");
          });
      };

      var endCol = function(obj) {
        levelColumns.push.apply(levelColumns, obj.children);
      };

      var createColDef = function(cols, level) {
        var rowColDef = [];
        _.each(levelColumns, function(obj) {
          var columnModel = _.first(view.columns.where({ name: obj.name}));

          // Check if it already has a column definition and if its renderable
          var renderable = !columnModel || (typeof columnModel.get("renderable") == "undefined" || columnModel.get("renderable"));
          renderable = (obj.children) ? renderable && view.hasValidChildren(obj) : renderable && _.isObject(columnModel);

          if (renderable) {
            var newObj = _.clone(obj);
            var existingCol = view.columns.where({name: newObj.name});
            newObj.attributes = {
              colspan: view.countLeafs(newObj),
              rowspan: (newObj.children) ? 1 : level
            };
            if (newObj.children) {
              _.extend(newObj, {
                sortable: false,
                editable: false
              });
            }
            rowColDef.push((_.isEmpty(existingCol)) ? newObj : _.extend(newObj, existingCol[0].toJSON()));
          }
        });
        return rowColDef;
      };

      var colLayoutNames = [];
      var rows = [];
      for (var i = rowAmount; i > 0; i--) {
        // Get all columns on this level
        var endColumns = columnFilter(levelColumns, true);
        var nonEndColumns = columnFilter(levelColumns, false);

        // Get all names of columns which have been defined in the column layout
        colLayoutNames.push.apply(colLayoutNames, _.pluck(endColumns, "name"));

        // Generate column definition for this row
        rows.push(new view.columnCollection(createColDef(levelColumns, i)));

        // Set columns for next level
        levelColumns = [];
        _.each(nonEndColumns, endCol);
      }

      // Add columns which have not been defined in the column layout
      view.columns.each(function(col) {
        if (!_.contains(colLayoutNames, col.get("name"))) {
          col.set("attributes", {colspan: 1, rowspan: rowAmount});
          rows[0].add(col);
        }
      });

      // Render the rows
      _.each(rows, function(coll) {
        var row = new Backgrid.HeaderRow({
          columns: coll,
          collection: view.collection
        });
        view.$el.append(row.render().$el);
      });

      // Trigger event
      view.collection.trigger("backgrid:header:rendered");

      this.delegateEvents();
      return this;
    },
    depthOf: function(object) {
      var level = 1;
      var key;

      for(key in object) {
        if (object.hasOwnProperty(key)) {
          if(typeof object[key] == "object"){
            var depth = this.depthOf(object[key]) + 1;
            level = Math.max(depth, level);
          }
        }
      }
      return level;
    },
    countLeafs: function(object) {
      var leafs = 0;

      if (_.has(object, "children") && _.isArray(object.children) && !_.isEmpty(object.children)) {
        _.each(object.children, function(obj) {
          leafs += this.countLeafs(obj);
        }, this);
      }
      else {
        // No children, assume it's an existing column model
        var columnModel = _.first(this.columns.where({ name: object.name}));
        if (columnModel && (typeof columnModel.get("renderable") == "undefined" || columnModel.get("renderable"))) {
          leafs += 1;
        }
      }
      return leafs;
    },
    hasValidChildren: function(object) {
      var valid = false;
      if (_.has(object, "children") && _.isArray(object.children) && !_.isEmpty(object.children)) {
        _.each(object.children, function(obj) {
          if (this.hasValidChildren(obj)) {
            valid = true;
          }
        }, this);
      }
      else {
        // No children, assume it's an existing column model
        var columnModel = _.first(this.columns.where({ name: object.name}));
        valid = (typeof columnModel.get("renderable") == "undefined" || columnModel.get("renderable"));
      }
      return valid;
    },
    attachEvents: function() {
      this.listenTo(this.columns, "add remove change:renderable", this.render);
    }
  });
}));