import { populatePhaseWithContent } from "../seedPhases";

const seedAsyncJSPhases = async () => {
  await populatePhaseWithContent(
    "data-structures",
    "data-structures",
    "Data structures and algorithms"
  );
};

seedAsyncJSPhases()
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
