# Backgrid.js - Grouped columns PoC
Warning! This is by far not production ready code, just a mere proof of concept. It lacks documentation, automatic testing and edge-case tests.

## Demo website
Online demo of PoC can be found [here](http://techwuppet.com/backgrid_poc_demo/)

## Grouped columns
- Easily replace current header with grouped version.
- Generates html5 compliant header elements
- Uses a seperate column definition to determine the layout

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
  columnLayout: colLayout
});
var pageableGrid = new Backgrid.Grid({
  header: groupedHeader,
  columns: columns,
  collection: pageableTerritories
});
```

## License
Copyright (c) 2014 Wilbert van de Ridder
Licensed under the [MIT license](LICENSE-MIT "MIT License").
