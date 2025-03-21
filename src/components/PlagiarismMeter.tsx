
import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

interface PlagiarismMeterProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const PlagiarismMeter = ({
  score,
  size = 'md',
  showLabel = true,
  animated = true,
}: PlagiarismMeterProps) => {
  const [currentScore, setCurrentScore] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        if (currentScore < score) {
          setCurrentScore((prev) => Math.min(prev + 1, score));
        }
      }, 20);
      
      return () => clearTimeout(timer);
    } else {
      setCurrentScore(score);
    }
  }, [currentScore, score, animated]);
  
  // Calculate color based on score
  const getColor = () => {
    if (currentScore < 20) return 'text-green-500';
    if (currentScore < 40) return 'text-emerald-500';
    if (currentScore < 60) return 'text-yellow-500';
    if (currentScore < 80) return 'text-orange-500';
    return 'text-red-500';
  };
  
  // Calculate background color for progress
  const getBackgroundColor = () => {
    if (currentScore < 20) return 'bg-green-500';
    if (currentScore < 40) return 'bg-emerald-500';
    if (currentScore < 60) return 'bg-yellow-500';
    if (currentScore < 80) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Get size dimensions
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-3';
      default: return 'h-2';
    }
  };
  
  // Get icon
  const getIcon = () => {
    if (currentScore < 30) {
      return <CheckCircle className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} text-green-500`} />;
    } else if (currentScore < 70) {
      return <HelpCircle className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} text-yellow-500`} />;
    } else {
      return <AlertTriangle className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} text-red-500`} />;
    }
  };
  
  // Get label text
  const getLabel = () => {
    if (currentScore < 20) return 'Original';
    if (currentScore < 40) return 'Mostly Original';
    if (currentScore < 60) return 'Partial Match';
    if (currentScore < 80) return 'High Similarity';
    return 'Plagiarized';
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-1.5">
          {getIcon()}
          <span className={`font-medium ${getColor()}`}>
            {currentScore}% Match
          </span>
        </div>
        {showLabel && (
          <span className="text-sm font-medium text-foreground/70">
            {getLabel()}
          </span>
        )}
      </div>
      
      <div className={`w-full bg-secondary rounded-full overflow-hidden ${getSizeClass()}`}>
        <div
          className={`${getBackgroundColor()} rounded-full transition-all duration-300 ease-out ${getSizeClass()}`}
          style={{ width: `${currentScore}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PlagiarismMeter;
