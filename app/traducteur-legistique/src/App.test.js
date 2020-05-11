// Unit tests
// It only tests one thing
import { difflibCalculation } from "./index";

var text1 =
  "Les données à caractère personnel contenues dans le système de gestion informatisée ne peuvent faire l'objet d'aucune interconnexion avec un autre fichier ni d'aucune cession à des tiers.Le système de gestion informatisée transmet au système d'information Schengen les informations relatives aux numéros des cartes nationales d'identité perdues, volées ou invalidées et au pays émetteur de ces titres.La lecture de la carte nationale d'identité à l'aide de procédés optiques ne peut être utilisée pour accéder à tout autre fichier ou pour y mettre en mémoire des informations mentionnées sur la carte. Toutefois, la lecture à l'aide de procédés optiques peut être utilisée pour :1° L'accès au système de gestion informatisée dans les conditions prévues à l'article 10 ;2° La consultation du fichier des personnes recherchées et du fichier des cartes perdues ou volées par les fonctionnaires de la police nationale ou les militaires de la gendarmerie nationale ayant la qualité d'officier ou d'agent de police judiciaire.";
var text2 =
  "Les données à caractère personnel contenues dans le système de gestion informatisée ne peuvent faire l'objet test d'aucune interconnexion avec un autre fichier ni d'aucune cession à des tiers.Le système de gestion informatisée transmet au système d'information Schengen les informations relatives aux numéros des cartes nationales d'identité perdues, volées ou encore invalidées et au pays émetteur de ces titres.La lecture de la carte nationale d'identité à l'aide de procédés optiques ne peut être utilisée pour accéder à tout autre fichier ou pour y mettre en mémoire des informations mentionnées sur la carte. Toutefois, la lecture à l'aide de procédés optiques peut être utilisée pour :1° L'accès au système de gestion informatisée dans les conditions prévues à l'article 10 ;2° La consultation du fichier des personnes recherchées et du fichier des cartes perdues ou volées par les fonctionnaires de la police nationale ou les militaires de la gendarmerie nationale ayant la qualité d'officier ou d'agent de police judiciaire. test encore d'ajout de phrase";
var result = [
  { old: "caractère", par: 1, new: "" },
  { old: "d'aucune", par: 1, new: "test " },
  { new: "encore", par: 1 },
  { new: "test encore d'ajout de phrase", par: 1 }
];
// test should return empty array when the texts are the same
test("we should have the same old ", () => {
  expect(
    difflibCalculation("Ceci est le même texte", "Ceci est le même texte")
  ).toEqual([]);
});
// test if text is null
test("null", () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});
// exemple with array
const users = [
  { id: 1, name: "Hugo" },
  { id: 2, name: "Guillaume" }
];

test("example 1 > we should have ids 1 and 2", () => {
  const [first, second] = users;
  expect(first.id).toEqual(1);
  expect(second.id).toEqual(2);
});
test("example 2 > we should have par of paragraph = 1", () => {
  expect(result.some(({ par }) => par === 1)).toBe(true);
  expect(result.some(({ par }) => par === 1)).toBe(true);
});
// Use Mock Functions
describe("difflibCalculation", () => {
  it("calls the difflibCalculation function", () => {
    const difflibCalculationFunction = jest.fn();
    difflibCalculationFunction(difflibCalculation(text1, text2));
    expect(difflibCalculationFunction.mock.calls.length).toBe(1);
  });
});
// The exact same test using async/await
describe("get result should be defined using async/await", () => {
  it("should load array", async () => {
    const data = await difflibCalculation(text1, text2);
    expect(data).toBeDefined();
  });
});
