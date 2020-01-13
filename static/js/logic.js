// Assign Variables 

// Fetch All earthquake data for Last month from USGS 
    var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

    d3.json(link,function(data){
    console.log(data);
   
    function createCircleMarker(feature,latlng){
        let options = {
            radius:feature.properties.mag*4,
            fillColor: chooseColor(feature.properties.mag),
            color: "black",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.6
        }
        return L.circleMarker( latlng, options );

    }


    var earthQuakes = L.geoJSON(data,{
        onEachFeature: function(feature,layer){
            layer.bindPopup("Place:"+feature.properties.place + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
        },
        pointToLayer: createCircleMarker

    });

    createMap(earthQuakes);

    });

    
  function createMap(earthQuakes) {

    
    var title =L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: config.API_KEY
    });
  
    
    // Create our map
    var myMap = L.map("map", {
      center: [
        37.0902405,-95.7128906
      ],
      zoom: 4,
      layers: [title,earthQuakes]
    });
  
    //Add Legend to map
     var info = L.control({
        position: "bottomleft"
    });

    info.onAdd = function(){
       var div = L.DomUtil.create("div","legend");
        return div;
    }

    info.addTo(myMap);

    document.querySelector(".legend").innerHTML=displayLegend();

  }


  function chooseColor(mag){
    switch(true){
        case (mag<1):
            return "chartreuse";
        case (mag<2):
            return "greenyellow";
        case (mag<3):
            return "yellow";
        case (mag<4):
            return "DarkOrange";
        case (mag<5):
            return "red";
        default:
            return "DarkRed";
    };
}

function displayLegend(){
    var legendInfo = [{
        limit: "Magnitude: 0-1",
        color: "chartreuse"
    },{
        limit: "Magnitude: 1-2",
        color: "greenyellow"
    },{
        limit:"Magnitude: 2-3",
        color:"yellow"
    },{
        limit:"Magnitude: 3-4",
        color:"DarkOrange"
    },{
        limit:"Magnitude: 4-5",
        color:"red"
    },{
        limit:"Magnitude: 5+",
        color:"DarkRed"
    }];

    var header = "<h3>Magnitude</h3><hr>";

    var strng = "";
   
    for (i = 0; i < legendInfo.length; i++){
        strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
    }
    
    return header+strng;

}