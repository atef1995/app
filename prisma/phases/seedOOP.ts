import { populatePhaseWithContent } from "../seedPhases";

const seedOOPPhases = async () => {
  await populatePhaseWithContent(
    "oop-concepts",
    "oop",
    "Object-Oriented Programming"
  );
};

seedOOPPhases()
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
