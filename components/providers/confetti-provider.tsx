'use client';
import { useConfettiStore } from '@/lib/hooks/use-confetti-store';
import ReactConfetti from 'react-confetti';

export const ConfettiProvider = () => {
  const confetti = useConfettiStore((state) => state);

  if (!confetti.isOpen) {
    return null;
  }

  return (
    <ReactConfetti
      className="pointer-events-none"
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={() => confetti.onClose()}
    />
  );
}