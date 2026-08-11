import {
  createRealWorldCollaborationScenarios,
  printRealWorldScenario,
} from "./real-world-scenarios";

const args = process.argv.slice(2);
const getArg = (name: string) => {
  const prefix = `--${name}=`;
  const match = args.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
};

const scenario = await createRealWorldCollaborationScenarios(
  getArg("base-url"),
);

printRealWorldScenario(scenario);