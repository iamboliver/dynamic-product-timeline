import type { ParsedFeature, PositionedFeature } from '../types';

interface SlotOccupant {
  x: number;
  slot: number;
}

/**
 * Calculate card positions with collision avoidance
 * Cards in the same hemisphere are staggered vertically when too close horizontally
 */
export function calculateCardPositions(
  features: ParsedFeature[],
  minSpacing: number = 200,
  baseYOffset: number = 100,
  slotHeight: number = 120
): PositionedFeature[] {
  // Separate into above (future) and below (past)
  const above = features.filter((f) => !f.isPast).sort((a, b) => a.x - b.x);
  const below = features.filter((f) => f.isPast).sort((a, b) => a.x - b.x);

  const positioned: PositionedFeature[] = [];

  // Process each hemisphere independently
  for (const group of [
    { items: above, side: 'above' as const },
    { items: below, side: 'below' as const },
  ]) {
    const occupiedSlots: SlotOccupant[] = [];

    for (const feature of group.items) {
      // Find lowest available slot that doesn't collide
      let slot = 0;
      let collision = true;

      while (collision) {
        collision = occupiedSlots.some(
          (occ) => occ.slot === slot && Math.abs(occ.x - feature.x) < minSpacing
        );
        if (collision) slot++;
      }

      occupiedSlots.push({ x: feature.x, slot });

      // Calculate Y offset
      const direction = group.side === 'above' ? -1 : 1;
      const yOffset = direction * (baseYOffset + slot * slotHeight);

      positioned.push({
        ...feature,
        side: group.side,
        slot,
        yOffset,
      });
    }
  }

  return positioned;
}
