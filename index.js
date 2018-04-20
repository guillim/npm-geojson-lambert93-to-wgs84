#!/usr/bin/env node
const [,,...args] = process.argv
console.log(`Hello, your file is called !${args} and will be processed now.`);



console.log('args[0]');
// var json = require("/Users/guillaumelancrenon/Downloads/secteurs_premier_depart_sdis91.geojson");
//var json = require("/Users/guillaumelancrenon/Downloads/test.geojson");

const fs = require('fs');
console.log('\r');

try {
    var json = JSON.parse(fs.readFileSync('/Users/guillaumelancrenon/Downloads/test.geojson', 'utf8'));
    console.log('json:',json.type);

    //two options: Feature VS FeatureCollection
    if (json.type === 'Feature') {
        let coord = json.geometry.coordinates;
        console.log('coord',typeof coord,coord);
        console.log(JSON.stringify(coord).match(/[^\]]*/ || [])[0]);
        let arrayDepth = JSON.stringify(coord).match(/[^\]]*/ || [])[0].match(/\[/g).length;

        switch (arrayDepth) {
          case 1:
            console.log('GeoJSON format supported');
            let res = lambert93toWGPS(coord[0], coord[1])
            console.log(res);
            let file = json
            file.geometry.coordinates = res;
            //fs.writeFileSync('/Users/guillaumelancrenon/Downloads/test2.geojson',JSON.stringify(file));
            break;
          default:
            console.log(' GeoJSON format not yet supported');
        }
    }else{
        console.log('coord FeatureCollection');
    }


} catch (err) {
    console.log('error detected: ',err.toString().substring(0, 150).replace(/[\r\n\v]/,' ') + '...\r\r')
    console.log('Maybe your geojson is in a wrong format? \rSee http://geojson.org/ for more information about the expected format');
}






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
