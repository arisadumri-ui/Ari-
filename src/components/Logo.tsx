import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  horizontal?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  horizontal = false,
}) => {
  const sizeMap = {
    sm: { icon: 36, title: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 56, title: 'text-base', sub: 'text-xs' },
    lg: { icon: 84, title: 'text-xl', sub: 'text-sm' },
    xl: { icon: 130, title: 'text-2xl sm:text-3xl', sub: 'text-base sm:text-lg' },
  };

  const currentSize = sizeMap[size];

  const roosterIcon = (
    <svg
      width={currentSize.icon}
      height={currentSize.icon}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
      aria-label="ตราสัญลักษณ์ บริษัท ไก่นำโชค จำกัด"
    >
      <defs>
        {/* Red gradient for crest and outer curves */}
        <linearGradient id="roosterRed" x1="40" y1="20" x2="160" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>

        {/* Golden yellow to orange gradient */}
        <linearGradient id="roosterGold" x1="100" y1="20" x2="180" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Tail feathers gradient */}
        <linearGradient id="roosterTail" x1="20" y1="60" x2="100" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#C81E1E" />
        </linearGradient>
      </defs>

      {/* Rooster Comb (หงอนไก่สีแดงสด) */}
      <path
        d="M 115 48 C 110 32, 125 24, 135 28 C 142 22, 155 26, 152 38 C 160 38, 166 48, 158 56 C 150 56, 142 54, 136 52 Z"
        fill="url(#roosterRed)"
      />

      {/* Wattle (เหนียงใต้คางสีแดง) */}
      <path
        d="M 152 75 C 164 78, 166 94, 156 98 C 150 100, 145 92, 146 84 Z"
        fill="url(#roosterRed)"
      />

      {/* Golden Head, Neck and Breast ribbon curve (เส้นโค้งส่วนคอและอกสีทอง/ส้ม) */}
      <path
        d="M 132 46 C 146 54, 156 68, 154 86 C 151 106, 162 128, 154 148 C 148 162, 136 172, 124 178 C 138 166, 144 146, 142 128 C 140 108, 134 94, 138 78 C 139 70, 132 58, 124 50 Z"
        fill="url(#roosterGold)"
      />

      {/* Beak (จะงอยปากสีทองส้ม) */}
      <path
        d="M 152 64 L 168 70 L 152 76 Z"
        fill="#F59E0B"
      />

      {/* Eye (ดวงตาสีแดงเข้ม/น้ำตาล) */}
      <circle cx="144" cy="62" r="4.5" fill="#991B1B" />
      <circle cx="145.5" cy="60.5" r="1.5" fill="#FFFFFF" />

      {/* Central Lucky Ring Body (วงกลมนำโชค ลูปกลางตัวสีแดงมงคล) */}
      <path
        d="M 112 92 C 132 92, 148 108, 148 128 C 148 148, 132 164, 112 164 C 92 164, 76 148, 76 128 C 76 108, 92 92, 112 92 Z"
        stroke="url(#roosterRed)"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />

      {/* Swooping Golden Back Neck Ribbon crossing into the ring */}
      <path
        d="M 128 48 C 104 68, 88 88, 86 112 C 84 126, 92 140, 106 146 C 122 152, 138 140, 140 124 C 142 108, 128 92, 112 90 C 98 88, 82 100, 78 116"
        stroke="url(#roosterGold)"
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
      />

      {/* Three Sweeping Red Tail Feathers (หางพริ้วไหว 3 แฉกสีแดงนำโชค) */}
      {/* Feather 1 (Top) */}
      <path
        d="M 96 82 C 78 72, 48 76, 36 94 C 54 88, 76 92, 92 104 Z"
        fill="url(#roosterTail)"
      />
      {/* Feather 2 (Middle) */}
      <path
        d="M 88 102 C 68 96, 42 104, 32 122 C 50 114, 72 118, 84 128 Z"
        fill="url(#roosterTail)"
      />
      {/* Feather 3 (Bottom) */}
      <path
        d="M 82 124 C 62 120, 44 130, 36 146 C 52 138, 70 140, 80 148 Z"
        fill="url(#roosterTail)"
      />
    </svg>
  );

  if (!showText) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{roosterIcon}</div>;
  }

  if (horizontal) {
    return (
      <div className={`flex items-center gap-3.5 ${className}`}>
        {roosterIcon}
        <div className="flex flex-col text-left">
          <span className={`font-extrabold tracking-tight text-slate-900 leading-none ${currentSize.title} font-['Prompt',sans-serif]`}>
            KAI NAM CHOK <span className="text-red-600 font-black">CO., LTD.</span>
          </span>
          <span className={`font-semibold text-slate-700 mt-1 tracking-wide ${currentSize.sub} font-['Prompt',sans-serif]`}>
            บริษัท ไก่นำโชค จำกัด
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {roosterIcon}
      <div className="mt-3 flex flex-col items-center">
        <h1 className={`font-extrabold tracking-tight text-slate-900 leading-tight ${currentSize.title} font-['Prompt',sans-serif]`}>
          KAI NAM CHOK CO., LTD.
        </h1>
        <p className={`font-semibold text-slate-700 tracking-wide mt-0.5 ${currentSize.sub} font-['Prompt',sans-serif]`}>
          บริษัท ไก่นำโชค จำกัด
        </p>
      </div>
    </div>
  );
};
