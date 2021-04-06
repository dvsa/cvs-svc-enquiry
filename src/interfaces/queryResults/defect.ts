interface Defect {
  imNumber?: number;
  imDescription?: string;
  itemNumber?: number;
  itemDescription?: string;
  deficiencyRef?: string;
  deficiencyId?: string;
  deficiencySubId?: string;
  deficiencyCategory?: string;
  deficiencyText?: string;
  stdForProhibition?: boolean;
}

export default Defect;
