import { populatePhaseWithContent } from "../seedPhases";

const seedHtmlCssPhases = async () => {
  await Promise.all([
    populatePhaseWithContent("html-foundations", "html", "HTML Fundamentals"),
    populatePhaseWithContent("css-foundations", "css", "CSS Fundamentals"),
  ]);
};

seedHtmlCssPhases()
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
