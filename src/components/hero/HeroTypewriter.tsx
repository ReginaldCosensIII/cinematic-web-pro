import React, { useEffect, useState } from 'react';

const ROTATING_WORDS = ['Envision', 'Design', 'Develop', 'Launch'];
const TYPING_SPEED = 100;
const DELETE_SPEED = 60;
const PAUSE_DURATION = 2000;

const HeroTypewriter: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = ROTATING_WORDS[currentWordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentWord.length) {
            setDisplayText(currentWord.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), PAUSE_DURATION);
          }
        } else if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        }
      },
      isDeleting ? DELETE_SPEED : TYPING_SPEED,
    );

    return () => clearTimeout(timeout);
  }, [currentWordIndex, displayText, isDeleting]);

  return (
    <>
      {displayText}
      <span className="inline-block w-[3px] h-[0.9em] bg-gradient-to-b from-webdev-gradient-blue to-webdev-gradient-purple ml-1 animate-pulse align-middle" />
    </>
  );
};

export default HeroTypewriter;