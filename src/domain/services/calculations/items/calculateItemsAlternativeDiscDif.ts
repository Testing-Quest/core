import calculatePearson from "../calculatePearson";

const Alternatives: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U"];

export default function calculateAlternativeDiscriminationDifficulty(
  usersDirectScore: number[],
  matrix: string[][],
  numAlternatives: number,
): void {
  const numUsers = usersDirectScore.length;


  const alternativeDiscrimination = new Map<string, number[]>();
  const alternativeDifficulty = new Map<string, number[]>();

  const calculateDisrimination = (matrix: number[][]) => {
    return Array.from({ length: matrix[0].length }, (_, i) => {
      const item = matrix.map(row => row[i]);
      return calculatePearson(item, usersDirectScore);
    });
  };

  const calculateDifficulty = (directScore: number[]) =>
    directScore.map((item) => item / numUsers);

  const processAlternative = (alternative: string) => {
    const correctedMatrix = matrix.map(row => row.map(item => +(item === alternative)));
    const itemsDirectScore = Array.from({ length: numUsers }, (_, colIndex) =>
      correctedMatrix.reduce((acc, row) => acc + row[colIndex], 0)
    );

    alternativeDiscrimination.set(`Discrimination ${alternative}`, calculateDisrimination(correctedMatrix));
    alternativeDifficulty.set(`Difficulty ${alternative}`, calculateDifficulty(itemsDirectScore));
  };

  for (let i = 0; i < numAlternatives; i++) {
    const alternative = Alternatives[i];
    processAlternative(alternative);
  }
  processAlternative("X");
}
