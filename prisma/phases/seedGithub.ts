import { populatePhaseWithContent } from "../seedPhases";
import { createPhase } from "./createPhase";

const githubPhase = {
  slug: "github",
  title: "Github",
  description: "Master Github",
  color: "from-blue-400 to-indigo-600",
  icon: "Github",
  order: 10,
  estimatedWeeks: 4,
  prerequisites: ["Terminal usage"],
  published: true,
};

const createGithubPhase = async () => await createPhase(githubPhase);

const seedGithub = async () => {
  await populatePhaseWithContent("github", "github", "Github Mastery");
};

createGithubPhase()
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
seedGithub()
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
