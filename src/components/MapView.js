import WebView from "react-native-webview";

    // const createMapHTML = (latitude, longitude, latitudeDelta, longitudeDelta) => {
    //     return `
    //       <!DOCTYPE html>
    //       <html>
    //       <head>
    //         <style>
    //           #map {
    //             height: 100%;
    //           }
    //         </style>
    //         <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4czKYn39MuQPVphHh3W4DdmEuOYKfjfw"></script>
    //         <script>
    //           function initMap() {
    //             var map = new google.maps.Map(document.getElementById('map'), {
    //               zoom: 10,
    //               center: { lat: ${markers[0].latitude}, lng: ${markers[0].longitude} }
    //             });
      
    //             var polygonCoords = ${JSON.stringify(polygonCoords)};
      
    //             var bermudaTriangle = new google.maps.Polygon({
    //               paths: polygonCoords,
    //               strokeColor: '#FF0000',
    //               strokeOpacity: 0.8,
    //               strokeWeight: 2,
    //               fillColor: '#FF0000',
    //               fillOpacity: 0.35
    //             }); 
    //             bermudaTriangle.setMap(map);
    //           }
    //         </script>
    //       </head>
    //       <body onload="initMap()">
    //         <div id="map"></div>
    //       </body>
    //       </html>`;
    //   };

      const createMapHTML = (latitude, longitude, latitudeDelta, longitudeDelta) => {
        // Calculate zoom level based on latitudeDelta
        // This is an approximation, as zoom levels in Google Maps JavaScript API do not correspond directly to latitudeDelta values
        const zoomLevel = Math.round(Math.log(360 / latitudeDelta) / Math.LN2);
      
        return `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              #map {
                height: 100%;
                width: 100%;
              }
            </style>
            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4czKYn39MuQPVphHh3W4DdmEuOYKfjfw"></script>
            <script>
              function initMap() {
                var map = new google.maps.Map(document.getElementById('map'), {
                  center: {lat: ${latitude}, lng: ${longitude}},
                  zoom: ${zoomLevel},
                  scrollwheel: false,
                  draggable: true
                });
              }
            </script>
          </head>
          <body onload="initMap()">
            <div id="map"></div>
          </body>
          </html>
        `;
      };
      
    const MapWebView = ({ latitude, longitude, latitudeDelta, longitudeDelta }) => {
    const htmlString = createMapHTML(latitude, longitude, latitudeDelta, longitudeDelta);
    
    return (
        <WebView
        style={{ flex: 1 }}
        originWhitelist={['*']}
        source={{ html: htmlString }}
        />
    );
    };
    
  
  export default MapWebView;
  