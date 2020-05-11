import * as difflib from "difflib";

// return the list of changes between two strings
export const difflibCalculation = (firstText, secondText) => {
  let objectDiff = {};
  const arrayDiff = [];
  let last = "";
  // Get result of the modification in the article
  const calculationDiff = (type, element, value, position) => {
    if (last === type && "undefined" !== typeof objectDiff[element]) {
      objectDiff[element] += " " + value;
      objectDiff.par = position;
    } else if (last !== type && "undefined" !== typeof objectDiff[element]) {
      arrayDiff.push(objectDiff);
      objectDiff = {};
      objectDiff[element] = value;
      objectDiff.par = position;
    } else {
      objectDiff[element] = value;
      objectDiff.par = position;
    }
    last = type;
  };
  // create div for each string to get un elemnt html
  const divFirst = document.createElement("div");
  divFirst.innerHTML = firstText;
  const divSecond = document.createElement("div");
  divSecond.innerHTML = secondText;

  // get the list of <p> to manipulate every paragraph apart
  const listFirstText = divFirst.getElementsByTagName("p");
  const listSecondText = divSecond.getElementsByTagName("p");

  for (let j = 0; j < listSecondText.length; j++) {
    if (listFirstText[j]) {
      const str = listFirstText[j].innerText;
      const strB = listSecondText[j].innerText;
      // use difflib library to compare the two string
      const diff = difflib.unifiedDiff(str.split(" "), strB.split(" "), {});
      for (let i = 0; i < diff.length; i++) {
        if (!(diff[i].includes("+++") || diff[i].includes("---"))) {
          // get words which are deleted starts with - returned by difflib
          if (diff[i].indexOf("-") === 0) {
            calculationDiff("removed", "old", diff[i].substr(1), j + 1);
          }
          // get words which are added starts with + returned by difflib
          else if (diff[i].indexOf("+") === 0) {
            calculationDiff("added", "new", diff[i].substr(1), j + 1);
          } else {
            if (diff[i] !== " ") {
              arrayDiff.push(objectDiff);
              objectDiff = {};
              last === "";
            }
          }
        }
      }
    } else {
      const obj = {}; // <---- Move declaration inside loop

      obj["newPar"] = listSecondText[j].innerText;
      obj["par"] = j + 1;
      arrayDiff.push(obj);
    }
    arrayDiff.push(objectDiff);
  }
  // return only the full objects of the array
  return arrayDiff.filter(value => JSON.stringify(value) !== "{}");
};
