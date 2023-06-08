let dataApi;

// fetch(
//   "https://raw.githubusercontent.com/lucasthaynan/apps-scripts/main/api/dados.json"
// )
//   .then((response) => response.json())
//   .then((data) => {
//     // Encontrar o valor mais alto de id_semana
//     const highestIdSemana = data.reduce((acc, cur) => {
//       const curIdSemana = parseInt(cur.id_semana);
//       return curIdSemana > acc ? curIdSemana : acc;
//     }, 0);
//     // Filtrar os dados usando o valor mais alto de id_semana
//     dataApi = data.filter((item) => item.id_semana === highestIdSemana.toString());
//     // Ordenar os dados em relação ao percentual
//     dataApi.sort((a, b) => b.percentual - a.percentual);
//     // Chamar a função para criar o treemap com os dados filtrados e ordenados
//     dataApi = dataApi.slice(0,5)
//     createdTreeMap(dataApi);
//   })
//   .catch((error) => console.error(error));

  fetch(
    "https://raw.githubusercontent.com/lucasthaynan/apps-scripts/main/api/dados.json"
  )
    .then((response) => response.json())
    .then((data) => {
      // Obter o valor desejado para id_semana
      let idSemanaDesejado = 4; // aqui é possível informar o valor desejado
      // Verificar se o valor é válido
      let idSemanas = data.map((item) => item.id_semana);
      if (!idSemanas.includes(idSemanaDesejado.toString())) {
        throw new Error(`id_semana ${idSemanaDesejado} não encontrado`);
      }
      // Filtrar os dados usando o valor desejado de id_semana
      dataApi = data.filter((item) => item.id_semana === idSemanaDesejado.toString());
      // Ordenar os dados em relação ao percentual
      dataApi.sort((a, b) => b.percentual - a.percentual);
      // Chamar a função para criar o treemap com os dados filtrados e ordenados
      dataApi = dataApi.slice(0,10);
      createdTreeMap(dataApi, "#treemap-week", 5, 7);
    })
    .catch((error) => console.error(error));

    fetch(
      "https://raw.githubusercontent.com/lucasthaynan/apps-scripts/main/api/dados.json"
    )
      .then((response) => response.json())
      .then((data) => {
        // Obter o valor desejado para id_semana
        let idSemanaDesejado = 3; // aqui é possível informar o valor desejado
        // Verificar se o valor é válido
        let idSemanas = data.map((item) => item.id_semana);
        if (!idSemanas.includes(idSemanaDesejado.toString())) {
          throw new Error(`id_semana ${idSemanaDesejado} não encontrado`);
        }
        // Filtrar os dados usando o valor desejado de id_semana
        dataApi = data.filter((item) => item.id_semana === idSemanaDesejado.toString());
        // Ordenar os dados em relação ao percentual
        dataApi.sort((a, b) => b.percentual - a.percentual);
        // Chamar a função para criar o treemap com os dados filtrados e ordenados
        dataApi = dataApi.slice(0,10);
        createdTreeMap(dataApi, "#treemap-month", 5, 8);
      })
      .catch((error) => console.error(error));
  


    function createdTreeMap(data, idMapa, viewsDesk, viewsMobile) {
      const margin = { top: 10, right: 0, bottom: 10, left: 0 };
      let dataIntervalo;
      let width, height;
    
      if (window.innerWidth - margin.left - margin.right < 660) {
        width = window.innerWidth - margin.left - margin.right;
        dataIntervalo = data.slice(0, viewsDesk);
      } else {
        width = 900;
        dataIntervalo = data.slice(0, viewsMobile);
      }
    
      height = 500;
    
      const svg = d3
        .select(idMapa)
        .append("svg")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
        )
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("id", "treemap")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
      const root = d3
        .hierarchy({ values: dataIntervalo }, function (d) {
          return d.values;
        })
        .sum(function (d) {
          return d.percentual;
        })
        .sort(function (a, b) {
          return b.value - a.value;
        });
    
      d3.treemap().size([width, height]).padding(4).round(true).paddingInner(5)(
        root
      );
    
      root.leaves().sort(function (a, b) {
        return b.value - a.value;
      });
    
      const top10 = root.leaves().slice(0, 10);
    
      const leaf = svg
        .selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("id", function (d) {
          return d.data.termo.replace(/\s+/g, "-");
        })
        .attr("percentual", function (d) {
          return d.data.percentual;
        })
        .attr("transform", function (d) {
          return "translate(" + d.x0 + "," + d.y0 + ")";
        })
        .on("click", function(d) {
          var dominioAtual = window.location.protocol + "//" + window.location.host;
          var termo = d3.select(this).attr("id").toLowerCase();
          window.location.href = dominioAtual + "/" + termo;
        });
        

    
      leaf
        .append("a") // Adiciona o elemento de âncora
        .attr("href", function (d) {
          // Define o link para cada retângulo
          return "https://www.example.com/" + d.data.termo;
        })
        .append("rect")
        .attr("width", function (d) {
          const termoWidth = d.data.termo.length > 10 ? Math.max(d.x1 - d.x0, 70) : d.x1 - d.x0;
          return termoWidth;
        })
        .attr("height", function (d) {
          return d.y1 - d.y0;
        })
        .style("stroke-width", "6px")
        .style("stroke", "#F9FBFD")
        .style("fill", function (d) {
          switch (d.data.categoria) {
            case "Economia":
              return "#4285F4";
            case "Saude":
              return "#43B97F";
            case "Cultura":
              return "#FFCA3A";
            case "Politica":
              return "#FD7E40";
            case "Esportes":
              return "#C280D2";
            case "Internacional":
              return "#9A9A9A";
            default:
              return "#CCCCCC";
          }
        })
        .style("rx", 15)
        .on("click", function(d) {
          window.open("https://www.example.com/" + d.data.termo, "_blank");
        });
    
      leaf
        .append("foreignObject")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", function (d) {
          return d.x1 - d.x0 - 0;
        })
        .attr("height", function (d) {
          return d.y1 - d.y0 - 0;
        })
        .append("xhtml:div")
        .style("font-size", "18px")
        .style("font-weight", "600")
        .style("color", "white")
        .style("padding", "20px")
        .style("padding-left", "5px")
        .style("box-sizing", "border-box")
        .html(function (d) {
          return (
            "<div class='termo'>" +
            d.data.termo +
            "</div><div class='vezes_subida'> ▴ " +
            Math.round(d.data.vezes_subida) +
            "x</div>"
          );
        });
    
      addTextFirstElement(idMapa);
    }
    
    

//  verifica se a tela mudou de resolucao para criar um novo grafico
window.addEventListener("resize", function (event) {
  // código a ser executado quando a dimensão da tela mudar
  document.querySelector("#treemap-week > svg").remove();
  document.querySelector("#treemap-month > svg").remove();
  createdTreeMap(dataApi, "#treemap-week");
  createdTreeMap(dataApi, "#treemap-month");
});

function addTextFirstElement(idMapa) {
  const text = document.querySelector(
    idMapa + " g g:nth-child(1) foreignObject > div .vezes_subida"
  );
  const infoText = text.innerHTML;
  console.log(text);
  text.innerHTML = `<strong>${infoText}</strong> mais buscas na última semana`;
}

// AJUSTA O TAMANHO DA FONTE

//   leaf
//     .append("foreignObject")
//     .attr("x", 0)
//     .attr("y", 0)
//     .attr("width", function (d) {
//     // calcula o tamanho necessário para o texto caber no retângulo
//     const w = d.x1 - d.x0 - 10;
//     const h = d.y1 - d.y0 - 10;
//     const size = Math.min(27, h / 2, w / 6); // tamanho máximo da fonte é 20, mas também é limitado pela altura e largura do retângulo
//     return w;
//     })
//     .attr("height", function (d) {
//     // calcula o tamanho necessário para o texto caber no retângulo
//     const w = d.x1 - d.x0 - 10;
//     const h = d.y1 - d.y0 - 10;
//     const size = Math.min(27, h / 2, w / 6); // tamanho máximo da fonte é 20, mas também é limitado pela altura e largura do retângulo
//     return h;
//     })
//     .append("xhtml:div")
//     .style("font-size", function (d) {
//     // calcula o tamanho da fonte para o texto caber no retângulo
//     const w = d.x1 - d.x0 - 10;
//     const h = d.y1 - d.y0 - 10;
//     const size = Math.min(27, h / 2, w / 6); // tamanho máximo da fonte é 20, mas também é limitado pela altura e largura do retângulo
//     return size + "px";
//     })
//     .style("color", "white")
//     .style("padding", "20px")
//     .style("box-sizing", "border-box")
//     .html(function (d) {
//       return d.data.termo;
//     });

// }

// .style("fill", function (d) {
//   switch (d.data.categoria) {
//     case "Atualidades":
//       return "#4B94B0"; // Blue-Two-Plus-Accent-3
//     case "Saude/Meio Ambiente":
//       return "#35697D"; // Blue-Two-Plus-Accent-4
//     case "Entretenimento":
//       return "#89AFBD"; // Blue-Two-Plus-Accent-2
//     case "Economia/Politica":
//       return "#213B45"; // Blue-Two-Plus-Accent-5
//     case "Variedades":
//       return "#DBCDB6"; // Blue-Two-Plus-Accent-1
//     default:
//       return "#ccc";
//   }
// })



// Seleciona os elementos dos menus
const menuWeek = document.querySelector('section.container.week > .menu-categories');
const menuMonth = document.querySelector('section.container.month > .menu-categories');

// Função para adicionar o evento de clique a cada botão do menu
const addMenuClickEvent = (menu) => {
  // Seleciona todos os botões do menu
  const menuButtons = menu.querySelectorAll('.btn');

  // Adiciona um evento de clique a cada botão do menu
  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Obtém a posição da div clicada em relação ao menu
      const position = button.getBoundingClientRect().left - 12; // Deixar margem left de 12px
      console.log(position);
      // Faz a rolagem para a posição desejada
      menu.scrollLeft += position;
    });
  });
};

// Adiciona o evento de clique ao menuWeek
addMenuClickEvent(menuWeek);

// Adiciona o evento de clique ao menuMonth
addMenuClickEvent(menuMonth);



// function createdTreeMap(data, idMapa) {
//   const margin = { top: 10, right: 0, bottom: 10, left: 0 };
//   const minWidth = 100;
//   const minHeight = 85;

//   if (window.innerWidth - margin.left - margin.right < 560) {
//     width = window.innerWidth - margin.left - margin.right;
//   } else {
//     width = 900;
//   }
  
//   const height = 500;

//   const svg = d3
//     .select(idMapa)
//     .append("svg")
//     .attr(
//       "viewBox",
//       `0 0 ${width + margin.left + margin.right} ${
//         height + margin.top + margin.bottom
//       }`
//     )
//     .attr("preserveAspectRatio", "xMidYMid meet")
//     .append("g")
//     .attr("id", "treemap")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

//   const root = d3
//     .hierarchy({ values: data }, function (d) {
//       return d.values;
//     })
//     .sum(function (d) {
//       return d.percentual;
//     })
//     .sort(function (a, b) {
//       return b.value - a.value;
//     });

//   d3.treemap().size([width, height]).padding(4).round(true).paddingInner(5)(
//     root
//   );

//   // Ordena os dados pelo percentual em ordem decrescente
//   root.leaves().sort(function (a, b) {
//     return b.value - a.value;
//   });

//   // Seleciona os 10 maiores valores de percentual
//   const top10 = root.leaves().slice(0, 10);

//   const leaf = svg
//     .selectAll("g")
//     .data(root.leaves())
//     .enter()
//     .append("g")
//     .attr("id", function (d) {
//       return d.data.termo.replace(/\s+/g, "_");
//     })
//     .attr("percentual", function (d) {
//       return d.data.percentual;
//     })
//     .attr("transform", function (d) {
//       return "translate(" + d.x0 + "," + d.y0 + ")";
//     });

//   leaf
//     .append("rect")
//     .attr("width", function (d) {
//       return Math.max(minWidth, d.x1 - d.x0);
//     })
//     .attr("height", function (d) {
//       return Math.max(minHeight, d.y1 - d.y0);
//     })
//     .style("stroke-width", "6px")
//     .style("stroke", "#F9FBFD")
//     .style("fill", function (d) {
//       switch (d.data.categoria) {
//         case "Economia":
//           return "#4285F4";
//         case "Saude":
//           return "#43B97F";
//         case "Cultura":
//           return "#FFCA3A";
//         case "Politica":
//           return "#FD7E40";
//         case "Esportes":
//           return "#C280D2";
//         case "Internacional":
//           return "#9A9A9A";
//         default:
//           return "#CCCCCC";
//       }
//     })
//     .style("rx", 15);

//     leaf
//     .append("foreignObject")
//     .attr("x", 0)
//     .attr("y", 0)
//     .attr("width", function (d) {
//       return d.x1 - d.x0 - 0; // desconta o padding de 20px em cada lado
//     })
//     .attr("height", function (d) {
//       return d.y1 - d.y0 - 0; // desconta o padding de 40px em cima e em baixo
//     })
//     .append("xhtml:div")
//     .style("font-size", "18px")
//     .style("font-weight", "600")
//     .style("color", "white")
//     .style("padding", "20px")
//     .style("box-sizing", "border-box")
//     .html(function (d) {
//       return (
//         "<div class='termo'>" +
//         d.data.termo +
//         "</div><div class='vezes_subida'> ▴ " +
//         Math.round(d.data.vezes_subida) +
//         "x</div>"
//       );
//     });

//   addTextFirstElement(idMapa);
// }


// ANIMACAO DA CAIXA DO QUE É

const tituloElement = document.getElementById('title-h1');
const textos = ['CPI?', 'BBB?'];
let index = 0;

function typeWriter() {
  const textoAtual = textos[index];
  const textoCompleto = tituloElement.textContent;
  
  if (textoCompleto !== textoAtual) {
    tituloElement.textContent = textoAtual.slice(0, textoCompleto.length + 1);
    tituloElement.style.borderRight = 'none'; // Remove a borda
    setTimeout(function() {
      tituloElement.style.borderRight = '0.15em solid #000'; // Reaplica a borda
    }, 50);
    setTimeout(typeWriter, 100);
  } else {
    setTimeout(function() {
      tituloElement.textContent = ''; // Apaga o texto anterior
      tituloElement.style.borderRight = 'none'; // Remove a borda
      index = (index + 1) % textos.length;
      typeWriter();
    }, 2000);
  }
}


typeWriter();
