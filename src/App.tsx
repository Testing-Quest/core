import { Analysis } from "./analysis/multiChoice/Analysis"
import { MCQ } from "./analysis/multiChoice/domain/mcq"

function App() {
  const mcq = new MCQ()

  return (
    <>
      <Analysis test={mcq} />
    </>
  )
}

export default App
