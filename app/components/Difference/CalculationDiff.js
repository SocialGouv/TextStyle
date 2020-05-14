import React from "react";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";
import { difflibCalculation } from "@socialgouv/traducteur-legistique";

export default function CalculationDiff(props) {
  const { firstText, secondText, articleId } = props;

  // Get result of the modification in the article
  const getResult = (item, index) => {
    let sentence;
    if (item.par === 1) {
      sentence = "Au premier alinéa de l'article ";
    } else if (item.par === 2) {
      sentence = "Au second alinéa de l'article ";
    } else if (item.par === 3) {
      sentence = "Au troisième alinéa de l'article ";
    } else {
      sentence = index + "° " + "A l'article ";
    }
    if (item.new && item.old) {
      return (
        sentence +
        articleId +
        " << " +
        item.old +
        ">> est remplacé par " +
        "<<" +
        item.new +
        ">>"
      );
    } else if (item.new && !item.old) {
      return sentence + articleId + " << " + item.new + " >> est ajouté";
    } else if (item.old && !item.new) {
      return sentence + articleId + " << " + item.old + " >> est supprimé";
    } else if (item.newPar) {
      return (
        "Un nouveau aliné est ajouté à l'article " +
        articleId +
        " : << " +
        item.newPar +
        ">>"
      );
    }
  };
  let arrayResult = [];

  // return the list of changes between two strings
  const showResult = (firstText, secondText) => {
    arrayResult = difflibCalculation(firstText, secondText);
    return arrayResult.map((item, index) => (
      <ul className="m-0" key={index}>
        {item.par && <li>{getResult(item, index)}</li>}
      </ul>
    ));
  };

  return (
    <div>
      <Row className="my-1 mr-5">
        <div>{showResult(firstText, secondText)}</div>
      </Row>
    </div>
  );
}

CalculationDiff.propTypes = {
  firstText: PropTypes.string,
  secondText: PropTypes.string,
  articleId: PropTypes.string
};
