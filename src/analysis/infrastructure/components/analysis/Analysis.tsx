import { DeactivatedElements } from "./DeactivatedElements";
import { Panel } from "./Sidebar";
import { questMulti } from "../../../domain/quests/questMulti";

type AnalysisProps = {
  test: questMulti
}
export function Analysis({ test }: AnalysisProps) {
  console.log(test)
  return (
    <>
      <Panel />
      <div>
        <h1>Testing-Quest</h1>
        <DeactivatedElements />
        <p> Graficas </p>
      </div>

    </>
  );
}
