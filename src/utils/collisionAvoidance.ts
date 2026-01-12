import type { ParsedFeature, PositionedFeature } from '../types';

interface SlotOccupant {
  x: number;
  slot: number;
}

/**
 * Find the lowest available slot that doesn't collide with existing occupants
 */
function findAvailableSlot(
  x: number,
  occupiedSlots: SlotOccupant[],
  minSpacing: number
): number {
  let slot = 0;
  let collision = true;

  while (collision) {
    collision = occupiedSlots.some(
      (occ) => occ.slot === slot && Math.abs(occ.x - x) < minSpacing
    );
    if (collision) slot++;
  }

  return slot;
}

/**
 * Calculate card positions with collision avoidance
 * Cards are dynamically assigned above or below the line based on available space
 */
export function calculateCardPositions(
  features: ParsedFeature[],
  minSpacing: number = 200,
  baseYOffset: number = 100,
  slotHeight: number = 120
): PositionedFeature[] {
  // Sort all features by x position (left to right)
  const sorted = [...features].sort((a, b) => a.x - b.x);

  const positioned: PositionedFeature[] = [];
  const aboveSlots: SlotOccupant[] = [];
  const belowSlots: SlotOccupant[] = [];

  for (const feature of sorted) {
    // Find best available slot on each side
    const aboveSlot = findAvailableSlot(feature.x, aboveSlots, minSpacing);
    const belowSlot = findAvailableSlot(feature.x, belowSlots, minSpacing);

    // Choose the side with the lower slot number (closer to the timeline)
    // If equal, alternate based on position to create visual balance
    let side: 'above' | 'below';
    let slot: number;

    if (aboveSlot < belowSlot) {
      side = 'above';
      slot = aboveSlot;
    } else if (belowSlot < aboveSlot) {
      side = 'below';
      slot = belowSlot;
    } else {
      // Equal slots - alternate to balance visually
      side = aboveSlots.length <= belowSlots.length ? 'above' : 'below';
      slot = side === 'above' ? aboveSlot : belowSlot;
    }

    // Record the slot
    if (side === 'above') {
      aboveSlots.push({ x: feature.x, slot });
    } else {
      belowSlots.push({ x: feature.x, slot });
    }

    // Calculate Y offset
    const direction = side === 'above' ? -1 : 1;
    const yOffset = direction * (baseYOffset + slot * slotHeight);

    positioned.push({
      ...feature,
      side,
      slot,
      yOffset,
    });
  }

  return positioned;
}
