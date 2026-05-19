import { motionValue } from 'framer-motion';

/**
 * Shared MotionValue (0 → 1) representing the cinematic hero's reveal progress.
 * Written by CinematicHero, read by Header (and any other element) to
 * choreograph entrance animations driven by the same scroll lock.
 */
export const heroProgress = motionValue(0);
