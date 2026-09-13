import React from 'react';

export const PreparedBySignature: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 50"
    className={`h-10 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Authentic IT Dept Signature flourish */}
    <path
      d="M 22 42 L 35 18 L 48 36 L 65 32 Q 78 30 92 34 Q 105 32 120 30"
      stroke="#182233"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 52 38 Q 75 35 110 33"
      stroke="#182233"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M 124 28 Q 135 27 142 30"
      stroke="#182233"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const CheckedBySignature: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 50"
    className={`h-10 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Checked By signature stroke */}
    <path
      d="M 35 34 Q 52 16 64 22 C 70 26 58 38 48 38 Q 65 37 88 34"
      stroke="#182233"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="34" cy="38" r="1.5" fill="#182233" />
  </svg>
);

export const ControllerSignature: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 180 55"
    className={`h-12 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Controller of Examinations authentic signature loops */}
    <path
      d="M 32 30 C 22 18, 48 10, 56 22 C 62 32, 38 38, 28 34 C 20 30, 36 20, 50 20 L 72 26"
      stroke="#111827"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 74 24 Q 90 28 105 24 Q 115 20 125 24 C 135 28, 142 22, 148 24 Q 152 25 158 28"
      stroke="#111827"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 125 18 C 135 14, 145 16, 140 25 C 135 34, 118 36, 112 36 Q 135 35 155 34"
      stroke="#111827"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M 50 36 Q 80 34 115 35"
      stroke="#111827"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);
