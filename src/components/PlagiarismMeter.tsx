
import { Circle } from 'lucide-react';

interface PlagiarismMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'large';
  showLabel?: boolean;
}

/**
 * A component to visualize plagiarism scores
 */
const PlagiarismMeter = ({ score, size = 'md', showLabel = true }: PlagiarismMeterProps) => {
  // Determine the size class based on prop
  let sizeClass = '';
  switch (size) {
    case 'sm':
      sizeClass = 'h-3 w-3';
      break;
    case 'md':
      sizeClass = 'h-4 w-4';
      break;
    case 'lg':
    case 'large': // Support both 'lg' and 'large'
      sizeClass = 'h-6 w-6';
      break;
    default:
      sizeClass = 'h-4 w-4';
  }

  // Determine color based on plagiarism score
  let color = '';
  if (score <= 30) {
    color = 'text-green-500';
  } else if (score <= 60) {
    color = 'text-amber-500';
  } else {
    color = 'text-red-500';
  }

  return (
    <div className="flex items-center">
      <Circle className={`${sizeClass} ${color} fill-current`} />
      {showLabel && <span className="ml-2">{score}%</span>}
    </div>
  );
};

export default PlagiarismMeter;
