import Defect from './defect';
import Location from './location';

interface TestDefect {
  defect?: Defect;
  location?: Location;
  notes?: string;
  prs?: number;
  prohibitionIssued?: number;
}

export default TestDefect;
