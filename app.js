let data = [];
let arr = [];
let map
let datainfo
let url_imagen = "https://sivem.blindin.mx/assets/images/medios/";
// let medio = ""
let url_base = "https://apisivem.blindin.mx/api/";
let imagenNoDisponible = url_imagen + "imagen_nodisponible.png";
const inputMedio = document.getElementById("medio");


$(".owl-carousel").owlCarousel({
    stagePadding: 10,
    loop: true,
    margin: 0,
    // nav:true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  });
getData();


  

// inputMedio.addEventListener("change", function (e) {
//   console.log(e.target.value);
//   filterMediosBy(e.target.value);
// });

function filterMediosBy(type) {
    if(type != ""){
        data = data.filter(medio => medio.tipo_medio == type );
        getPoints();
    }else{
        console.log("vacio")
        getData()
    }
    arr = []
    map = null
    // document.getElementById('map').innerHTML = ""
}

function getData() {
  $.get(`${url_base}getData`, function (response) {
    console.log(response);

    data = [...response.espectaculares, ...response.vallas];
    getPoints();
  });
}

function getPoints() {
  for (let i = 0; i < data.length; i++) {
    arr[i] = new ol.Feature(
      new ol.geom.Point([data[i].longitud, data[i].latitud])
    );
    arr[i].setId(data[i].id);
  }
  console.log(data);
  makeData();
}


function makeData() {
   map = new ol.Map({
    target: document.getElementById('map'),
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
    var feature = map.getFeaturesAtPixel(e.pixel)[0];
    datainfo = data.filter((info) => info.id == feature.id_);
    console.log(datainfo);
    postDataModal();
});
  ol.proj.useGeographic();
}

function postDataModal() {
    document.getElementById("img1").innerHTML = ""
    document.getElementById("img2").innerHTML = ""
    document.getElementById("img3").innerHTML = ""
    datainfo.map((element) => {
    document.getElementById("modalTitle").innerHTML = element.municipio;
    // la url de las imagenes estan enlazadas a la direccion de sivem, si se cambian, debera cambiar esta url
    document.getElementById("img1").innerHTML = `<img src='${url_imagen}${element.vista_larga}' class='img-modal'>` 
    document.getElementById("img2").innerHTML = `<img src='${url_imagen}${element.vista_media}' class='img-modal'>` 
    document.getElementById("img3").innerHTML = `<img src='${url_imagen}${element.vista_corta}' class='img-modal'>` 
  
    document.getElementById("modalContent").innerHTML = `
            <p><span class="titleText">CALLE:</span> ${element.calle}</p>
            <p><span class="titleText">COLONIA:</span> ${element.colonia}</p>
            <p><span class="titleText">LOCALIDAD:</span> ${element.localidad}</p>
            <p><span class="titleText TEXT-SUCCESS">REFERENCIA:</span> ${element.referencias}</p>
            <p><span class=" titleText">Status:</span> <span class="${element.status == "DISPONIBLE" ? "text-success" : element.status == "OCUPADO" ? "text-danger" : ""  }">${element.status}</span></p>
        `;
  });
  $("#modal").modal("show");

}

