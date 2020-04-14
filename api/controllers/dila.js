const DilaApiClient = require("@socialgouv/dila-api-client");
const dilaApi = new DilaApiClient();

// TODO: REMOVE THIS !!!!!!!!!!!!
module.exports.dilaSearch = function(req, res) {
  const selectedText = req.body.selectedText;
  const selectedOptions = req.body.selectedOption;
  const searchString = req.body.searchValue;
  const page = req.body.page ? req.body.page.value : 1;
  const currentTime = new Date().getTime();
  let typePagination = "ARTICLE";
  let fond = "ALL";
  let filtres = [];
  if (selectedText.value === "all") {
    fond = "ALL";
    filtres = [
      {
        facette: "FOND",
        valeurs: ["CODE", "LEGI"]
      }
    ];
  } else if (selectedText.value === "code") {
    fond = "CODE_DATE";
    const codes = [];
    if (selectedOptions && selectedOptions.length > 0) {
      selectedOptions.forEach(element => {
        codes.push(element.label);
      });
    }
    filtres = [
      {
        facette: "NOM_CODE",
        valeurs: codes
      },
      {
        facette: "TEXT_LEGAL_STATUS",
        valeurs: ["VIGUEUR"]
      },
      {
        facette: "DATE_VERSION",
        singleDate: currentTime
      },
      {
        facette: "ARTICLE_LEGAL_STATUS",
        valeurs: ["VIGUEUR"]
      }
    ];
  } else if (selectedText.value === "legi") {
    fond = "LODA_ETAT";
    typePagination = "DEFAUT";
    let textes = [];
    if (selectedOptions && selectedOptions.length > 0) {
      selectedOptions.forEach(element => {
        textes.push(element.label);
      });
    } else {
      textes = ["LOI", "DECRET"];
    }
    filtres = [
      {
        facette: "NATURE",
        valeurs: textes
      },
      {
        facette: "ARTICLE_LEGAL_STATUS",
        valeurs: ["VIGUEUR"]
      },
      {
        facette: "TEXT_LEGAL_STATUS",
        valeurs: ["VIGUEUR"]
      }
    ];
  }
  //console.log(fond, searchString, filtres);

  // "Code des postes et des communications électroniques",
  // "Code civil",
  // "code de commerce",
  // "Code de justice administrative"

  dilaApi
    .fetch({
      path: "search",
      method: "POST",
      params: {
        fond: fond,
        recherche: {
          champs: [
            {
              typeChamp: "ALL",
              criteres: [
                {
                  typeRecherche: "EXACTE",
                  valeur: searchString,
                  operateur: "ET"
                }
              ],
              operateur: "ET"
            }
            // {
            //   typeChamp: "NUM_ARTICLE",
            //   criteres: [
            //     {
            //       typeRecherche: "EXACTE",
            //       valeur: "D1110-3-2",
            //       operateur: "ET"
            //     }
            //   ],
            //   operateur: "ET"
            // }
          ],
          filtres: filtres,
          pageNumber: page,
          pageSize: 10,
          operateur: "ET",
          sort: "SIGNATURE_DATE_DESC",
          typePagination: typePagination
        }
      }
    })
    .then(response => {
      handleResponse(res, 200, response);
    })
    .catch(console.log);
};

module.exports.dilaGetArticle = function(req, res) {
  const selectedText = req.body.articleId;
  if (selectedText) {
    dilaApi
      .fetch({
        path: "consult/getArticle",
        method: "POST",
        params: {
          id: selectedText
        }
      })
      .then(response => {
        handleResponse(res, 200, response);
      })
      .catch(console.log);
  }
};

module.exports.pingSearch = function(req, res) {
  dilaApi
    .fetch({
      path: "search/ping",
      method: "get"
    })
    .then(response => {
      console.log(response);
      handleResponse(res, 200, response);
    })
    .catch(console.log);
};

function handleResponse(res, code, statusMsg) {
  res.status(code).json(statusMsg);
}
