import React from 'react';

interface CircularityGaugeProps {
  score: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const CircularityGauge: React.FC<CircularityGaugeProps> = ({ score, size = 'md' }) => {
  // Define all sizes including 'sm'
  // const sizes = {
  //   xs: { width: 60, height: 60, strokeWidth: 6 },
  //   sm: { width: 80, height: 80, strokeWidth: 8 },
  //   md: { width: 120, height: 120, strokeWidth: 10 },
  //   lg: { width: 160, height: 160, strokeWidth: 12 },
  //   xl: { width: 200, height: 200, strokeWidth: 14 }
  // };
  const sizes = {
  xs: { width: 60, height: 60, strokeWidth: 6 },
  sm: { width: 80, height: 80, strokeWidth: 8 },
  md: { width: 120, height: 120, strokeWidth: 10 },
  lg: { width: 160, height: 160, strokeWidth: 12 },
  xl: { width: 200, height: 200, strokeWidth: 14 }
};

  const { width, height, strokeWidth } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green-500
    if (score >= 60) return '#f59e0b'; // amber-500
    if (score >= 40) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${
            size === 'xs' ? 'text-sm' :
            size === 'sm' ? 'text-lg' :
            size === 'md' ? 'text-xl' :
            size === 'lg' ? 'text-2xl' :
            'text-3xl'
          } text-slate-800`}>
            {Math.round(score)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CircularityGauge;
// my old code
// import React from 'react';

// interface CircularityGaugeProps {
//   score: number;
//   size?: 'small' | 'medium' | 'large';
//   showLabel?: boolean;
// }

// const CircularityGauge: React.FC<CircularityGaugeProps> = ({
//   score,
//   size = 'medium',
//   showLabel = true
// }) => {
//   const sizes = {
//     small: { width: 120, height: 120, strokeWidth: 8, fontSize: 'text-xl' },
//     medium: { width: 200, height: 200, strokeWidth: 12, fontSize: 'text-4xl' },
//     large: { width: 300, height: 300, strokeWidth: 16, fontSize: 'text-6xl' },
//   };

//   const { width, height, strokeWidth, fontSize } = sizes[size];
//   const radius = (width - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const offset = circumference - (score / 100) * circumference;

//   const getColor = (score: number) => {
//     if (score >= 80) return '#059669';
//     if (score >= 60) return '#F59E0B';
//     return '#DC2626';
//   };

//   const getLabel = (score: number) => {
//     if (score >= 80) return 'Excellent';
//     if (score >= 60) return 'Good';
//     if (score >= 40) return 'Fair';
//     return 'Needs Improvement';
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <div className="relative" style={{ width, height }}>
//         <svg width={width} height={height} className="transform -rotate-90">
//           <circle
//             cx={width / 2}
//             cy={height / 2}
//             r={radius}
//             stroke="#E2E8F0"
//             strokeWidth={strokeWidth}
//             fill="none"
//           />
//           <circle
//             cx={width / 2}
//             cy={height / 2}
//             r={radius}
//             stroke={getColor(score)}
//             strokeWidth={strokeWidth}
//             fill="none"
//             strokeDasharray={circumference}
//             strokeDashoffset={offset}
//             strokeLinecap="round"
//             className="transition-all duration-1000 ease-out"
//           />
//         </svg>
//         <div className="absolute inset-0 flex flex-col items-center justify-center">
//           <span className={`${fontSize} font-bold text-slate-800`}>{score}</span>
//           <span className="text-sm text-slate-600">/ 100</span>
//         </div>
//       </div>
//       {showLabel && (
//         <div className="mt-4 text-center">
//           <p className="text-sm font-semibold text-slate-700">Circularity Score</p>
//           <p className="text-xs text-slate-500 mt-1">{getLabel(score)}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CircularityGauge;
