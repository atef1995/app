import { populatePhaseWithContent } from "../seedPhases";

const seedAdvancedPhases = async () => {
  await populatePhaseWithContent(
    "advanced-concepts",
    "advanced",
    "Advanced JavaScript"
  );
};

seedAdvancedPhases()
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
