import React from 'react';

const NumberIcons = ({ number }) => {
  // Konvertiert die Zahl zu einer Zeichenkette und zerlegt sie in einzelne Ziffern
  const digits = number.toString().split('');

  return (
    <div className="flex">
      {digits.map((digit, index) => (
        <i key={index} className={`fas fa-${digit} text-2xl inline-block w-5`}></i>
      ))}
    </div>
  );
}

export default NumberIcons;
