# GeoJSON converter: from Lambert 93 to WGS84

Convert GeoJSON coordinates from Lambert 93 encoded points to WGS84.


## Command Line Interface (CLI)

### Install

```sh
npm install --global geojson-lambert93-to-wgs84
```


### Usage

```
Usage:
  geojson-lambert93-to-wgs84 <file>

Convert the coordinates of a GeoJSON object from Lambert 93 encoded polylines to GPS like coordinates WGS84.
```


### Example

```sh
geojson-lambert93-to-wgs84 french-cities.geojson
 ```

## License

ISC
