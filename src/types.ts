export interface SubjectRow {
  id: string;
  subject: string;
  part1MaxTh: string;
  part1MaxPr: string;
  part1SecTh: string;
  part1SecPr: string;
  part2MaxTh: string;
  part2MaxPr: string;
  part2SecTh: string;
  part2SecPr: string;
  combinedMaxTh: string;
  combinedMaxPr: string;
  combinedSecTh: string;
  combinedSecPr: string;
  percentage: string;
  remarks: string;
}

export interface MarksSheetData {
  serialNo: string;
  examTitle: string;
  examSession: string;
  marksSheetNo: string;
  group: string;
  rollNo: string;
  enrolmentNo: string;
  name: string;
  fatherName: string;
  college: string;
  candidatePhoto: string;
  barcodeValue: string;
  subjects: SubjectRow[];
  totals: {
    maxMarks1: string;
    secMarks1: string;
    maxMarks2: string;
    secMarks2: string;
    totalMaxMarks: string;
    totalSecMarks: string;
    overallPercentage: string;
    grade: string;
  };
  inWords: string;
  graceNote: string;
  issueDate: string;
  preparedBySig: boolean;
  checkedBySig: boolean;
  controllerSig: boolean;
  showWatermark: boolean;
}
