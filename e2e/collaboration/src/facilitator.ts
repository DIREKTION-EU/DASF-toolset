import { createScenario, printScenario } from "./scenario";

const args = process.argv.slice(2);
const getArg = (name: string) => {
  const prefix = `--${name}=`;
  const match = args.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
};

const scenario = await createScenario({
  baseUrl: getArg("base-url"),
  facilitatorName: getArg("facilitator-name"),
  facilitatorEmail: getArg("facilitator-email"),
});

printScenario(scenario);