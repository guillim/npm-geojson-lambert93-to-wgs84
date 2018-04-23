# GeoJSON converter: from Lambert 93 to WGS84

Convert a geoJSON file from Lambert 93 encoded points to WGS84.  

The geoJSON file can be a Feature or a FeatureCollection, it doesn't matter.  
However, it must follow the http://geojson.org structure format.   
See https://en.wikipedia.org/wiki/GeoJSON for more information on accepted formats.

## Command Line Interface (CLI)

### Install

```sh
npm install --global geojson-lambert93-to-wgs84
```


### Usage

```
geojson-lambert93-to-wgs84 <Path_to_file>.geojson
```

Convert the coordinates of a GeoJSON object from Lambert 93 encoded polylines to GPS like coordinates WGS84.

### Example

```sh
geojson-lambert93-to-wgs84 /Desktop/french-cities.geojson
 ```
This will create /Desktop/french-cities_processed.geojson, which is the converted file.

## License

Copyright © 2018 Guillaume Lancrenon

Distributed under MIT licence.
