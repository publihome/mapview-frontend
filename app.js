let data = [];
let arr = [];
let map
let datainfo = []
let url_imagen = "https://sivem.blindin.mx/assets/images/medios/";
// let medio = ""
let url_base = "https://apisivem.blindin.mx/api/";
let imagenNoDisponible = url_imagen + "imagen_nodisponible.png";
const inputMedio = document.getElementById("medio");


// $(".owl-carousel").owlCarousel({
//     stagePadding: 10,
//     loop: true,
//     margin: 0,
//     // nav:true,
//     responsive: {
//       0: {
//         items: 1,
//       },
//       600: {
//         items: 1,
//       },
//       1000: {
//         items: 1,
//       },
//     },
//   });
getData();


  

// inputMedio.addEventListener("change", function (e) {
//   console.log(e.target.value);
//   getData(e.target.value);
// });

function getData(medio = "") {
  // document.getElementById('map').innerHTML = ""
  delete map
  if(medio != ""){ 
    $.ajax({
      url:`${url_base}getDataByMedio`,
      type:'post',
      data:{type:medio}
    })
    .done(function(response){
      console.log(response)
      data = response
      getPoints();

    })
    .fail(function(err){
      console.log(err)
    })

  }else{
    $.get(`${url_base}getData`, function (response) {
      console.log(response);  
      data = [...response.espectaculares, ...response.vallas];
      getPoints();
    });
  }

}

function getPoints() {
  if(data.length == 0){
    arr = []
  }else{
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].latitud, data[i].longitud)
      arr[i] = new ol.Feature(
        new ol.geom.Point([data[i].longitud, data[i].latitud])
      );
      arr[i].setId(data[i].id);
      

    }
  }
  makeData();
}


function makeData() {
   map = new ol.Map({
    target: 'map',
    // layers: arr,
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
      new ol.layer.Vector({
        source: new ol.source.Vector({
          features: arr,
        }),
        style: new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color: "red" }),
          }),
        }),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([-96.7205, 17.0581]),
      zoom: 11,
    }),
  });

  map.on("click", function (e) {
    document.getElementById('modal-body').innerHTML = ""
    var feature = map.getFeaturesAtPixel(e.pixel)[0];
    datainfo = data.filter((info) => info.latitud == feature.geometryChangeKey_.target.extent_[1] && info.longitud == feature.geometryChangeKey_.target.extent_[0]);
    console.log(feature.geometryChangeKey_.target.extent_[1]);
    console.log(datainfo);
    postDataModal();
  });
  ol.proj.useGeographic();
}

function postDataModal() {
    datainfo.map((element) => {
      document.getElementById('modal-body').innerHTML += `
      <div class="my-2">
        <div class="row align-items-center" >
          <div class="col-md-6">
              <div class="" id="img1"> <img src="${url_imagen}${element.vista_larga}" alt="" class="img-modal"></div>
          </div>
          <div class="col-md-6 modalContent">
          <p><span class="titleText">CALLE:</span> ${element.calle}</p>
                <p><span class="titleText">COLONIA:</span> ${element.colonia}</p>
                <p><span class="titleText">LOCALIDAD:</span> ${element.localidad}</p>
                <p><span class="titleText TEXT-SUCCESS">REFERENCIA:</span> ${element.referencias}</p>
                <p><span class=" titleText">Status:</span> <span class="${element.status == "DISPONIBLE" ? "text-success" : element.status == "OCUPADO" ? "text-danger" : ""  }">${element.status}</span></p>
          </div>
        </div>
      </div>
      `
     });
  $("#modal").modal("show");

}

