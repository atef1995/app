import { populatePhaseWithContent } from "../seedPhases";

const seedAsyncJSPhases = async () => {
  await populatePhaseWithContent(
    "async-programming",
    "async",
    "Asynchronous JavaScript"
  );
};

seedAsyncJSPhases()
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
