#!/usr/bin/env node
const [,,...args] = process.argv
const  inputFile = args[0];
let pointIndex = inputFile.lastIndexOf('.')
const  outputFile = inputFile.substring(0,pointIndex)+'_processed'+inputFile.substring(pointIndex);

console.log('\r');
console.log('\r');
console.log(`geojson-lambert93-to-wgs84 will process your file`);
console.log(`Results will be stored in the same folder`);
console.log('\r');

//var json = require("/Users/guillaumelancrenon/Downloads/secteurs_premier_depart_sdis91.geojson");
//var json = require("/Users/guillaumelancrenon/Downloads/test.geojson");

const fs = require('fs');
console.log('\r');

try {
    var json = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    //two options: Feature VS FeatureCollection
    if (json.type === 'Feature') {
        let jsonOutput = {};
        jsonOutput = transformFeature(json);
        fs.writeFileSync(outputFile,JSON.stringify(jsonOutput));

        console.log('\r');
        console.log('\r');
        console.log(`Your file is now converted. You can see read the result under ${outputFile}.`);
    }else if (json.type === 'FeatureCollection' && json.features.length > 0) {
        let featuresConverted = [];
        json.features.forEach(function(feature){
           featuresConverted.push( transformFeature(feature) )
        })
        json.features = featuresConverted
        fs.writeFileSync(outputFile,JSON.stringify(json));

        console.log('\r');
        console.log('\r');
        console.log(`Your file is now converted. You can see read the result under ${outputFile}.`);
    }else{
        console.log('\r');
        console.log('\r');
        console.log('Feature or FeatureCollection not recognised in the GeoJSON');
    }
} catch (err) {
    console.log('error detected: ',err.toString().substring(0, 150).replace(/[\r\n\v]/,' ') + '...\r\r')
    console.log('Maybe your geojson is in a wrong format? \rSee http://geojson.org/ for more information about the expected format');
}



console.log('\r');
console.log('\r');



//function definition
function lambert93toWGPS(lambertE, lambertN) {

    var constantes = {
        GRS80E: 0.081819191042816,
        LONG_0: 3,
        XS: 700000,
        YS: 12655612.0499,
        n: 0.7256077650532670,
        C: 11754255.4261
    }

    var delX = lambertE - constantes.XS;
    var delY = lambertN - constantes.YS;
    var gamma = Math.atan(-delX / delY);
    var R = Math.sqrt(delX * delX + delY * delY);
    var latiso = Math.log(constantes.C / R) / constantes.n;
    var sinPhiit0 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * Math.sin(1)));
    var sinPhiit1 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * sinPhiit0));
    var sinPhiit2 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * sinPhiit1));
    var sinPhiit3 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * sinPhiit2));
    var sinPhiit4 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * sinPhiit3));
    var sinPhiit5 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * sinPhiit4));
    var sinPhiit6 = Math.tanh(latiso + constantes.GRS80E * Math.atanh(constantes.GRS80E * sinPhiit5));

    var longRad = Math.asin(sinPhiit6);
    var latRad = gamma / constantes.n + constantes.LONG_0 / 180 * Math.PI;

    var longitude = latRad / Math.PI * 180;
    var latitude = longRad / Math.PI * 180;

    // return {longitude: longitude, latitude: latitude};
    return [longitude,latitude]
}



function transformFeature(json){
      let coord = json.geometry.coordinates;
      //console.log(JSON.stringify(coord).match(/[^\]]*/ || [])[0]);
      let arrayDepth = JSON.stringify(coord).match(/[^\]]*/ || [])[0].match(/\[/g).length;
      let newCoordinates, fileToWrite;
      switch (arrayDepth) {
        case 1:
          console.log('Format type "Point" detected');
          newCoordinates = lambert93toWGPS(coord[0], coord[1])
          fileToWrite = json
          fileToWrite.geometry.coordinates = newCoordinates;
          return fileToWrite;
          break;
        case 2:
          console.log('Format type "LineString" or "MultiPoint" detected');
          newCoordinates = [];
          for (var i = 0; i < coord.length; i++) {
              newCoordinates[i] = lambert93toWGPS(coord[i][0], coord[i][1])
          }
          fileToWrite = json
          fileToWrite.geometry.coordinates = newCoordinates;
          return fileToWrite;
          break;
        case 3:
          console.log('Format type "Polygon" or "MultiLineString" detected');
          newCoordinates = [];
          for (var i = 0; i < coord.length; i++) {
              newCoordinates[i] = []
              for (var j = 0; j < coord[i].length; j++) {
                  newCoordinates[i][j] = lambert93toWGPS(coord[i][j][0], coord[i][j][1])
              }
          }
          fileToWrite = json
          fileToWrite.geometry.coordinates = newCoordinates;
          return fileToWrite;
          break;
          case 4:
            console.log('Format type "MultiPolygon" detected');
            newCoordinates = [];
            for (var i = 0; i < coord.length; i++) {
                newCoordinates[i] = []
                for (var j = 0; j < coord[i].length; j++) {
                    newCoordinates[i][j] = []
                    for (var k = 0; k < coord[i][j].length; k++) {
                        newCoordinates[i][j][k] = lambert93toWGPS(coord[i][j][k][0], coord[i][j][k][1])
                    }
                }
            }
            fileToWrite = json
            fileToWrite.geometry.coordinates = newCoordinates;
            return fileToWrite;
            break;
        default:
          console.log('GeoJSON format not yet supported');
          return {};
      }
}
