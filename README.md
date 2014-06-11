# Backgrid.js - Grouped columns PoC
Warning! This extension is not production ready yet, just a mere proof of concept. It lacks documentation, automatic testing and edge-case tests.

To discuss this extension, see [this](https://github.com/wyuenho/backgrid/issues/490) backgrid issue;

## Demo website
Online demo of PoC can be found [here](http://techwuppet.com/backgrid_poc_demo/)

## Browser support (tested)
- IE8+
- Firefox
- Chrome

## Grouped columns
- Easily replace current header with grouped version.
- Generates html5 compliant header elements
- You can either use a seperate top-down column definition to determine the layout or:
- use a bottom-up hierarchy definition

### Example
```javascript
// Set up a grid to use the pageable collection
// Grouped column definition
var colLayout = [
  {
    name: "rowSelect"
  },
  {
    name: "id"
  },
  {
    name: "Personal info",
    label: "Personal information",
    children: [
      {
        name: "name"
      },
      {
        name: "Physical info",
        children: [
          {
            name: "age"
          },
          {
            name: "gender"
          },
          {
            name: "eyeColor"
          }
        ]
      },
      {
        name: "Contact",
        children: [
          {
            name: "Analog",
            children: [
              {
                name: "phone"
              },
              {
                name: "address"
              }
            ]
          },
          {
            name: "Digital",
            children: [
              {
                name: "email"
              }
            ]
          }
        ]
      },
      {
        name: "company"
      }
    ]
  },
  {
    name: "Balance sheet",
    children: [
      {
        name: "Revenues",
        children: [
          {
            name: "domestic"
          },
          {
            name: "exports"
          },
          {
            name: "total"
          }
        ]
      },
      {
        name: "expenditure"
      },
      {
        name: "profits"
      }
    ]
  },
  {
    name: "registered"
  },
  {
    name: "isActive"
  },
  {
    name: "Location",
    children: [
      {
        name: "latitude"
      },
      {
        name: "longitude"
      }
    ]
  }
];

var groupedHeader = Backgrid.Extension.groupedHeader.extend({
  columnLayout: colLayout // Only needed in case of a top-down definition
});

var pageableGrid = new Backgrid.Grid({
  header: groupedHeader,
  columns: columns,
  collection: pageableTerritories
});

// If you want to use the bottom-up definition, the 'nesting' property is supported on the column definition
// Example (same balance sheet structure as above):
var columnDef = [
...
{
  name: "domestic",
  nesting: ["Revenues", "Balance sheet"]
},
{
  name: "exports",
  nesting: ["Revenues", "Balance sheet"]
},
{
  name: "total",
  nesting: ["Revenues", "Balance sheet"]
},
{
  name: "expenditure",
  nesting: ["Balance sheet"]
},
{
  name: "profits",
  nesting: ["Balance sheet"]
}
...
];
```

## License
Copyright (c) 2014 Wilbert van de Ridder
Licensed under the [MIT license](LICENSE-MIT "MIT License").
