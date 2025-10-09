import { populatePhaseWithContent } from "../seedPhases";

const seedJSPhases = async () => {
  await populatePhaseWithContent(
    "javascript-fundamentals",
    "fundamentals",
    "JavaScript Fundamentals"
  );
};

seedJSPhases()
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
