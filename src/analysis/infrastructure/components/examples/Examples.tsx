import { questMulti } from "../../../domain/quests/questMulti";

type AnalysisProps = {
  test: questMulti
}
export function Examples({ test }: AnalysisProps) {
  console.log(test)
  return (
    <>
      <div>
        <h1>Testing-Quest</h1>
        <p> Graficas </p>
      </div>

    </>
  );
}
