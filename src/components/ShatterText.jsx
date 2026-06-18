import React, { useEffect, useRef } from 'react';
import ShatterLetter from './ShatterLetter';

export default function ShatterText({ text, onInit, fontSize = 36, fontStyle = '900 36px Montserrat', textColor = '#000000' }) {
  // Split the text into non-empty words to handle spacing and layout wrapping
  const words = text.split(' ').filter(word => word !== '');

  // Calculate the total number of non-space characters
  const charCount = words.reduce((acc, word) => acc + word.length, 0);

  // Initialize and persist progress objects for each letter
  const progressObjectsRef = useRef([]);
  if (progressObjectsRef.current.length !== charCount) {
    progressObjectsRef.current = Array.from({ length: charCount }, () => ({ progress: 0 }));
  }

  // Pass progress objects array up to the parent component on mount
  useEffect(() => {
    if (onInit) {
      onInit(progressObjectsRef.current);
    }
  }, [onInit, charCount]);

  let globalCharIndex = 0;

  return (
    <span className="shatter-text-wrapper" style={{ display: 'inline', lineHeight: '1.8' }}>
      {words.map((word, wIdx) => {
        const chars = word.split('');
        return (
          <span 
            key={wIdx} 
            className="shatter-word" 
            style={{ 
              display: 'inline-block', 
              whiteSpace: 'nowrap',
              marginRight: '0.25em' // Standard word spacing
            }}
          >
            {chars.map((char, cIdx) => {
              const currentProgressObj = progressObjectsRef.current[globalCharIndex];
              globalCharIndex++;
              return (
                <ShatterLetter
                  key={cIdx}
                  char={char}
                  progressObj={currentProgressObj}
                  fontSize={fontSize}
                  fontStyle={fontStyle}
                  textColor={textColor}
                />
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
