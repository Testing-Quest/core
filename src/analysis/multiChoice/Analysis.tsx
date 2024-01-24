import { DeactivatedElements } from "./DeactivatedElements";
import { Panel } from "./Sidebar";
import { MCQ } from "./domain/mcq";

type AnalysisProps = {
  test: MCQ
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
