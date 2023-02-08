function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  $(document).ready(function () {
    $("img").css("pointer-events", "all");
  })
}

function safe(empresa) {
  var nombre = empresa;
  $(document).ready(function () {
    $("img").css("pointer-events", "none");
    $("#" + nombre).css("pointer-events", "all");
  })
}

function empresas() {
  var imagenes = document.getElementById("caja").getElementsByTagName("img");
  var idsImagenes = [];
  for (var i = 0; i < imagenes.length; i++) {
    idsImagenes.push(imagenes[i].id);
  }
  localStorage.setItem("idsImagenes", JSON.stringify(idsImagenes));
  cartas();
}

//Funcion de crear las cartas con el fetch de la base de datos del docker
function cartas() {
  var lastValue;
  $(".card").remove();
  var misEmpresas = JSON.parse(localStorage.getItem("idsImagenes"));

  // Fetch para conseguir el ultimo dato de la base de datos
  var getOptions = {
    method: "POST",
    redirect: "follow",
  };

  //Parte estatica de la carta:
  fetch("//HZ114487:8000/api/stocks", getOptions)
    .then((response) => response.json())
    .then((result) => {
      // Comparar cada nombre de las empresas con los nombres del localStorage
      result.data.forEach(function (element) {
        misEmpresas.forEach(function (nombre) {
          //En caso de que coincida el nombre se imprimira su imagen, nombre y valor
          if (element.nombre === nombre) {
            lastValue = element.valor;
            var cartahtml = `<div class="card" style="width: 300px; border: 2px solid black;">
                              <img src=Imagenes/${element.nombre}.png class="card-img-top" style="padding: 25px;"><br>
                              <div id="price${element.nombre}" class="card-body" style="display: flex; justify-content: center;"> 
                                <h2>${element.valor}</h2><br>
                              </div>
                          </div>`;
            var card = $(cartahtml);
            $("[name~='info']").css("margin-left", "10px");
            $(".card-columns").append(card);
          }
        });
      });
    })
    .catch((error) => {
      console.log("error", error);
    });
  setInterval(() => {
    var getOptions = {
      method: "POST",
      redirect: "follow",
    };

    fetch("//HZ114487:8000/api/stocks", getOptions)
      .then((response) => response.json())
      .then((result) => {
        result.data.forEach(function (element) {
          misEmpresas.forEach(function (nombre) {
            if (element.nombre === nombre) {
              if (lastValue > element.valor) {
                document.getElementById("price" + element.nombre).innerHTML =
                  "<h2 style='color: red;'>" + element.valor + "</h2>";
                setTimeout(function () {
                  document.getElementById("price" + element.nombre).innerHTML =
                    "<h2>" + element.valor + "</h2>";
                }, 3000);
              } else if (lastValue < element.valor) {
                document.getElementById("price" + element.nombre).innerHTML =
                  "<h2 style='color: green;'>" + element.valor + "</h2>";
                setTimeout(function () {
                  document.getElementById("price" + element.nombre).innerHTML =
                    "<h2>" + element.valor + "</h2>";
                }, 3000);
              }
              lastValue = element.valor;
            }
          });
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, 60 * 100);
}

function ocultar() {
  document.getElementById("tabla").style.display = "none";
  document.getElementById("caja").style.display = "none";
  document.getElementById("safebtn").style.display = "none";
  document.getElementById("backbtn").style.display = "flex";
}

function mostrar() {
  document.getElementById("tabla").style.display = "flex";
  document.getElementById("caja").style.display = "flex";
  document.getElementById("safebtn").style.display = "inline-block";
  document.getElementById("backbtn").style.display = "none";
}

//-----------------------------------------------------------------------//
// Modal login
var modal = document.getElementById("myModal");

function registro() {
  document.getElementsByClassName("formulario-register")[0].style.display = "block";
  document.getElementsByClassName("formulario-sign")[0].style.display = "none";
  document.getElementById("btn-signup").style.display = "block";
  document.getElementById("btn-login").style.display = "none";
}

function sign() {
  document.getElementsByClassName("formulario-register")[0].style.display = "none";
  document.getElementsByClassName("formulario-sign")[0].style.display = "block";
  document.getElementById("btn-signup").style.display = "none";
  document.getElementById("btn-login").style.display = "block";
}
//-----------------------------------------------------------------------//
// Modal chart
var modalChart = document.getElementById("myModalChart");
var btn = document.getElementById("chartbtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modalChart.style.display = "block";
}

span.onclick = function () {
  modalChart.style.display = "none";
}
//-----------------------------------------------------------------------//
// Funcion que comprueba si hay un token en localstorage, si es no hay (null) se mostraria el modal del login, si no el index
var token;

function start() {
  var token = localStorage.getItem("token");
  if (token == null) {
    modal.setAttribute('style', 'display:block !important')
    
  } else {
    modal.setAttribute('style', 'display:none !important')
  }
}
//-----------------------------------------------------------------------//
function registercheck() {
  const nombre = document.getElementById("user").value;
  const email = document.getElementById("email-register").value;
  const contraseña = document.getElementById("contraseña-register").value;

  var formdata = new FormData();
  formdata.append("name", nombre);
  formdata.append("email", email);
  formdata.append("password", contraseña);

  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  fetch("//HZ114487:8000/api/register", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result)
      const mensaje = document.getElementById("message-register");
      mensaje.innerHTML = "<p style='color: green;'>Registro Correcto</p>";
      setTimeout(function () {
        sign();
        document.getElementById("user").value = "";
        document.getElementById("email-register").value = "";
        document.getElementById("contraseña-register").value = "";
        mensaje.style.display = "none";
      }, 2000);
    })
    .catch((error) => {
      console.log("error", error);
      const mensaje = document.getElementById("message-register");
      mensaje.innerHTML = "<p style='color: red;'>Registro incorrecto</p>";
    });
}
//-----------------------------------------------------------------------//
function logincheck() {
  localStorage.removeItem("token");
  const email = document.getElementById("email-sign").value;
  const contraseña = document.getElementById("contraseña-sign").value;

  var formdata = new FormData();
  formdata.append("email", email);
  formdata.append("password", contraseña);

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  fetch("//HZ114487:8000/api/login", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result)
      localStorage.setItem("token", result['authorisation']['token']);
      const mensaje = document.getElementById("message-sign");
      mensaje.innerHTML = "<p style='color: green;'>Inicio de sesion correcto, entrando...</p>";
      setTimeout(function () {
        document.getElementById("email-sign").value = "";
        document.getElementById("contraseña-sign").value = "";
        mensaje.style.display = "none";
        modal.setAttribute('style', 'display:none !important')
      }, 2000);
    })
    .catch(error => {
      console.log('error', error)
      const mensaje = document.getElementById("message-sign");
      mensaje.innerHTML = "<p style='color: red;'>Email o password incorrectos</p>";
      setTimeout(function () {
        document.getElementById("email-sign").value = "";
        document.getElementById("contraseña-sign").value = "";
        mensaje.style.display = "none";
      }, 3000);
      mensaje.style.display = "flex";
    });
}
//-----------------------------------------------------------------------//
function logoutcheck() {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", 'Bearer ' + token);

  var formdata = new FormData();
  formdata.append("email", email);
  formdata.append("password", password);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };

  fetch("//HZ114487:8000/api/logout", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      localStorage.removeItem("idsImagenes");
      $(".modal").css('display', 'block');
    })
    .catch(error => console.log('error', error));
}
//-----------------------------------------------------------------------//
let valores = [];
var empresa;
var periodicidad;

function tabla() {
  empresa = document.getElementById("emp").value;
  periodicidad = document.getElementById("per").value;

  if (periodicidad === "year") {
    anual();
  } else if (periodicidad === "month") {
    mensual();
  } else if (periodicidad === "week") {
    semanal();
  }
}

function anual() {
  console.log("Anual");
  valores = [];
  var requestOptions = {
    method: 'POST',
    redirect: 'follow'
  };

  fetch("//HZ114487:8000/api/year", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result)
      result.data.forEach(function (element) {
        if (element.nombre === empresa) {
          console.log(element);
          valores.push(element.media_valor);
        }
        Highcharts.chart('container-chart', {

          yAxis: {
            title: {
              text: 'Valor'
            }
          },
          xAxis: {
            categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            title: {
              text: 'Meses'
            }
          },

          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
          },

          plotOptions: {
            series: {
              label: {
                connectorAllowed: false
              },
            }
          },

          series: [{
            name: empresa,
            data: valores
          }],

          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
          }

        });
      });
    })
    .catch(error => console.log('error', error));
  console.log(valores)
}

function mensual() {
  console.log("Mensual");
  valores = [];
  let fechas = [];
  var requestOptions = {
    method: 'POST',
    redirect: 'follow'
  };

  fetch("//HZ114487:8000/api/month", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result)
      result.data.forEach(function (element) {
        if (element.nombre === empresa) {
          console.log(element);
          valores.push(element.valor);
          fechas.push(element.fecha);
        }
        Highcharts.chart('container-chart', {

          yAxis: {
            title: {
              text: 'Valor'
            }
          },
          xAxis: {
            categories: fechas,
            title: {
              text: 'dias del mes pasado'
            }
          },

          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
          },

          plotOptions: {
            series: {
              label: {
                connectorAllowed: false
              },
            }
          },

          series: [{
            name: empresa,
            data: valores
          }],

          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
          }

        });
      });
    })
    .catch(error => console.log('error', error));
  console.log(valores)
}

function semanal() {
  console.log("Semanal");
  valores = [];
  let fechas = [];
  var requestOptions = {
    method: 'POST',
    redirect: 'follow'
  };

  fetch("//HZ114487:8000/api/week", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result)
      result.data.forEach(function (element) {
        if (element.nombre === empresa) {
          console.log(element);
          valores.push(element.valor);
          fechas.push(element.fecha);
        }
        Highcharts.chart('container-chart', {

          yAxis: {
            title: {
              text: 'Valor'
            }
          },
          xAxis: {
            categories: fechas,
            title: {
              text: 'dias del mes pasado'
            }
          },

          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
          },

          plotOptions: {
            series: {
              label: {
                connectorAllowed: false
              },
            }
          },

          series: [{
            name: empresa,
            data: valores
          }],

          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
          }

        });
      });
    })
    .catch(error => console.log('error', error));
  console.log(valores)
}