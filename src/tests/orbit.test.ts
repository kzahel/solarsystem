import { describe, it, expect } from 'vitest';
import * as Astronomy from 'astronomy-engine';

describe('Orbital Mechanics', () => {
    it('Earth should orbit the Sun in approx 365.25 days', () => {
        const start = new Date('2000-01-01T00:00:00Z');
        const end = new Date('2001-01-01T00:00:00Z'); // 366 days (leap year 2000)

        const pos1 = Astronomy.HelioVector(Astronomy.Body.Earth, start);
        const pos2 = Astronomy.HelioVector(Astronomy.Body.Earth, end);

        // Earth should be roughly in the same position
        // Distance between positions should be small relative to orbit radius (1 AU)
        const dist = Math.sqrt(
            Math.pow(pos1.x - pos2.x, 2) +
            Math.pow(pos1.y - pos2.y, 2) +
            Math.pow(pos1.z - pos2.z, 2)
        );

        // 366 days is slightly off 365.25, so there will be some drift.
        // Earth moves ~1 degree per day. 0.75 days diff is ~0.75 degrees.
        // 1 AU circumference ~ 2*PI AU. 0.75/360 * 2*PI ~ 0.013 AU.
        expect(dist).toBeLessThan(0.02);
    });

    it('Mercury should orbit faster than Earth', () => {
        const date = new Date('2000-01-01T00:00:00Z');
        const date2 = new Date('2000-01-10T00:00:00Z'); // 10 days later

        const earth1 = Astronomy.HelioVector(Astronomy.Body.Earth, date);
        const earth2 = Astronomy.HelioVector(Astronomy.Body.Earth, date2);

        const mercury1 = Astronomy.HelioVector(Astronomy.Body.Mercury, date);
        const mercury2 = Astronomy.HelioVector(Astronomy.Body.Mercury, date2);

        // Calculate angular change (simplified, assuming circular orbit for rough check)
        const earthAngle = Math.atan2(earth2.y, earth2.x) - Math.atan2(earth1.y, earth1.x);
        const mercuryAngle = Math.atan2(mercury2.y, mercury2.x) - Math.atan2(mercury1.y, mercury1.x);

        // Mercury angle change should be larger (absolute value, handling wrap around if needed but 10 days is small)
        expect(Math.abs(mercuryAngle)).toBeGreaterThan(Math.abs(earthAngle));
    });

    it('Keplers 2nd Law: Earth moves faster at Perihelion than Aphelion', () => {
        // Perihelion ~ Jan 3, Aphelion ~ July 4
        const perihelionDate = new Date('2000-01-03T00:00:00Z');
        const aphelionDate = new Date('2000-07-04T00:00:00Z');

        const delta = 1; // 1 day step

        const p1 = Astronomy.HelioVector(Astronomy.Body.Earth, perihelionDate);
        const p2 = Astronomy.HelioVector(Astronomy.Body.Earth, new Date(perihelionDate.getTime() + delta * 24 * 3600 * 1000));
        const speedP = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));

        const a1 = Astronomy.HelioVector(Astronomy.Body.Earth, aphelionDate);
        const a2 = Astronomy.HelioVector(Astronomy.Body.Earth, new Date(aphelionDate.getTime() + delta * 24 * 3600 * 1000));
        const speedA = Math.sqrt(Math.pow(a2.x - a1.x, 2) + Math.pow(a2.y - a1.y, 2) + Math.pow(a2.z - a1.z, 2));

        expect(speedP).toBeGreaterThan(speedA);
    });
});
