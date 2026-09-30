import { dialogue } from './dialogue.ts';

export type Rect = { x: number; y: number; width: number; height: number };
export type Bounds = { width: number; height: number; reserved: Rect[] };
export type Snapshot = {
  x: number;
  y: number;
  frame: number;
  direction: 1 | -1;
  state: 'entering' | 'idle' | 'moving' | 'acting' | 'speaking' | 'leaving';
  text: string;
  announced: boolean;
  done: boolean;
};

const WIDTH = 220;
const HEIGHT = 280;
const MARGIN = 8;
const FRAME_MS = 1000 / 15;
const INTRO = Array.from({ length: 26 }, (_, i) => 277 + i);
const EXIT = Array.from({ length: 23 }, (_, i) => 16 + i);
const SHRUG = [
  ...Array.from({ length: 11 }, (_, i) => 40 + i),
  ...Array.from({ length: 10 }, (_, i) => 49 - i),
];
const PRESENT = [137, 138, 139, 140, 141, 142, 141, 140, 139, 138, 137];
const CLAP = [10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10];

function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export class BonziEngine {
  private bounds: Bounds;
  private readonly random: () => number;
  private reduced: boolean;
  private current: Snapshot;
  private stateTime = 0;
  private bubbleTime = 6000;
  private actionTime = 0;
  private speechTime = 0;
  private actionAt = 0;
  private speechAt = 0;
  private actionSequence: readonly number[] = SHRUG;
  private target: { x: number; y: number } | null = null;
  private origin: { x: number; y: number } | null = null;
  private moveDuration = 1600;
  private lastPhrase = '';

  constructor(bounds: Bounds, random: () => number = Math.random, reduced = false) {
    this.bounds = bounds;
    this.random = random;
    this.reduced = reduced;
    const position = this.findPosition(this.maxX(), this.maxY());
    this.current = {
      ...position,
      frame: reduced ? 0 : INTRO[0]!,
      direction: 1,
      state: reduced ? 'idle' : 'entering',
      text: dialogue.entry,
      announced: false,
      done: false,
    };
    this.lastPhrase = dialogue.entry;
    this.scheduleAction();
    this.scheduleSpeech();
  }

  get snapshot(): Snapshot {
    return { ...this.current };
  }

  tick(
    deltaMs: number,
    held: { holdMovement?: boolean; holdBubble?: boolean; paused?: boolean } = {},
  ): void {
    if (this.current.done || !Number.isFinite(deltaMs) || deltaMs <= 0) return;
    // Pausing stops autonomous activity, but explicit conversation and goodbye still work.
    if (held.paused && this.current.state !== 'speaking' && this.current.state !== 'leaving')
      return;
    // A late RAF callback represents one resumed frame, not elapsed background time.
    const delta = Math.min(deltaMs, 100);
    if (!(held.holdMovement && this.current.state === 'moving')) this.stateTime += delta;
    if (this.current.text && this.current.state !== 'leaving' && !held.holdBubble) {
      this.bubbleTime -= delta;
      if (this.bubbleTime <= 0) this.clearBubble();
    }
    if (this.current.state === 'leaving') {
      if (!this.reduced) this.playSequence(EXIT);
      if (this.stateTime >= EXIT.length * FRAME_MS) this.current.done = true;
      return;
    }
    if (this.reduced) {
      this.current.frame = 0;
      if (this.current.state === 'speaking' && !this.current.text) this.setIdle();
      return;
    }
    if (this.current.state === 'entering') {
      this.playSequence(INTRO);
      if (this.stateTime >= INTRO.length * FRAME_MS) this.setIdle();
      return;
    }
    if (this.current.state === 'speaking') {
      this.playSequence(PRESENT);
      if (!this.current.text) this.setIdle();
      return;
    }
    if (this.current.state === 'acting') {
      this.playSequence(this.actionSequence);
      if (this.stateTime >= this.actionSequence.length * FRAME_MS) this.setIdle();
      return;
    }
    if (this.current.state === 'moving') {
      if (held.holdMovement) return;
      this.advanceMovement();
      return;
    }
    if (held.holdMovement) return;
    this.actionTime += delta;
    this.speechTime += delta;
    if (this.speechTime >= this.speechAt) {
      this.startSpeech(this.pick(dialogue.idle), false);
    } else if (this.actionTime >= this.actionAt) {
      this.startAction();
    }
  }

  speak(): void {
    if (this.current.done || this.current.state === 'leaving') return;
    this.startSpeech(this.pick(dialogue.click), true);
  }

  wave(): void {
    if (this.current.done || this.current.state === 'leaving') return;
    this.startSpeech(this.pick(dialogue.wave), true);
  }

  leave(): void {
    if (this.current.done || this.current.state === 'leaving') return;
    this.current.state = 'leaving';
    this.current.direction = 1;
    this.current.frame = this.reduced ? 0 : EXIT[0]!;
    this.current.text = dialogue.farewell;
    this.current.announced = false;
    this.stateTime = 0;
    this.target = null;
    this.origin = null;
  }

  resize(bounds: Bounds): void {
    this.bounds = bounds;
    this.target = null;
    this.origin = null;
    const position = this.findPosition(this.current.x, this.current.y);
    this.current.x = position.x;
    this.current.y = position.y;
    if (this.current.state === 'moving') this.setIdle();
  }

  setReduced(reduced: boolean): void {
    if (this.reduced === reduced) return;
    this.reduced = reduced;
    this.actionTime = 0;
    this.speechTime = 0;
    this.scheduleAction();
    this.scheduleSpeech();
    if (reduced && this.current.state !== 'leaving') {
      this.target = null;
      this.origin = null;
      if (this.current.state !== 'speaking') this.setIdle();
      this.current.frame = 0;
    }
  }

  private maxX(): number {
    return Math.max(MARGIN, this.bounds.width - WIDTH - MARGIN);
  }
  private maxY(): number {
    return Math.max(MARGIN, this.bounds.height - HEIGHT - MARGIN);
  }
  private clampX(x: number): number {
    return Math.max(MARGIN, Math.min(this.maxX(), x));
  }
  private clampY(y: number): number {
    return Math.max(MARGIN, Math.min(this.maxY(), y));
  }
  private footprint(x: number, y: number): Rect {
    return { x, y, width: WIDTH, height: HEIGHT };
  }
  private valid(x: number, y: number): boolean {
    const footprint = this.footprint(x, y);
    return (
      x >= MARGIN &&
      x <= this.maxX() &&
      y >= MARGIN &&
      y <= this.maxY() &&
      !this.bounds.reserved.some((rect) => overlaps(footprint, rect))
    );
  }
  private findPosition(preferredX: number, preferredY: number): { x: number; y: number } {
    const x = this.clampX(preferredX);
    const y = this.clampY(preferredY);
    if (this.valid(x, y)) return { x, y };
    const points: { x: number; y: number }[] = [];
    for (let cy = this.maxY(); cy >= MARGIN; cy -= 16) {
      for (let cx = this.maxX(); cx >= MARGIN; cx -= 16) points.push({ x: cx, y: cy });
    }
    points.push({ x: MARGIN, y: MARGIN });
    points.sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
    return points.find((point) => this.valid(point.x, point.y)) ?? { x, y };
  }

  private playSequence(sequence: readonly number[]): void {
    this.current.frame =
      sequence[Math.min(sequence.length - 1, Math.floor(this.stateTime / FRAME_MS))] ?? 0;
  }
  private setIdle(): void {
    this.current.direction = 1;
    this.current.state = 'idle';
    this.current.frame = 0;
    this.stateTime = 0;
  }
  private clearBubble(): void {
    this.current.text = '';
    this.current.announced = false;
  }
  private scheduleAction(): void {
    this.actionAt = 8000 + this.random() * 6000;
  }
  private scheduleSpeech(): void {
    this.speechAt = 25000 + this.random() * 15000;
  }
  private pick(phrases: readonly string[]): string {
    const choices = phrases.filter((phrase) => phrase !== this.lastPhrase);
    const phrase =
      choices[Math.min(choices.length - 1, Math.floor(this.random() * choices.length))] ??
      phrases[0] ??
      '';
    this.lastPhrase = phrase;
    return phrase;
  }
  private startSpeech(phrase: string, announced: boolean): void {
    this.current.direction = 1;
    this.current.state = 'speaking';
    this.current.text = phrase;
    this.current.announced = announced;
    this.current.frame = this.reduced ? 0 : PRESENT[0]!;
    this.bubbleTime = 6000;
    this.stateTime = 0;
    this.target = null;
    this.origin = null;
    this.speechTime = 0;
    this.scheduleSpeech();
    this.actionTime = 0;
    this.scheduleAction();
  }
  private startAction(): void {
    this.actionTime = 0;
    this.scheduleAction();
    if (this.random() < 0.5) {
      this.startMovement();
      return;
    }
    this.actionSequence = this.random() < 0.5 ? SHRUG : CLAP;
    this.current.state = 'acting';
    this.current.frame = this.actionSequence[0] ?? 0;
    this.stateTime = 0;
  }
  private startMovement(): boolean {
    const x = this.current.x;
    const y = this.current.y;
    const steps = [-160, 160, -100, 100];
    const candidates = steps.flatMap((step) => [
      { x: this.clampX(x + step), y },
      { x, y: this.clampY(y + step) },
    ]);
    const start = Math.floor(this.random() * candidates.length);
    for (let index = 0; index < candidates.length; index++) {
      const candidate = candidates[(start + index) % candidates.length]!;
      if (candidate.x === x && candidate.y === y) continue;
      const swept: Rect = {
        x: Math.min(x, candidate.x),
        y: Math.min(y, candidate.y),
        width: WIDTH + Math.abs(candidate.x - x),
        height: HEIGHT + Math.abs(candidate.y - y),
      };
      if (
        !this.valid(candidate.x, candidate.y) ||
        this.bounds.reserved.some((rect) => overlaps(swept, rect))
      )
        continue;
      this.origin = { x, y };
      this.target = candidate;
      this.moveDuration = 1200 + this.random() * 800;
      this.current.state = 'moving';
      this.current.direction = candidate.x < x ? -1 : 1;
      this.current.frame = 9;
      this.stateTime = 0;
      return true;
    }
    return false;
  }
  private advanceMovement(): void {
    if (!this.origin || !this.target) {
      this.setIdle();
      return;
    }
    const ratio = Math.min(1, this.stateTime / this.moveDuration);
    this.current.x = this.origin.x + (this.target.x - this.origin.x) * ratio;
    this.current.y = this.origin.y + (this.target.y - this.origin.y) * ratio;
    this.current.frame = 9;
    if (ratio === 1) {
      this.target = null;
      this.origin = null;
      this.setIdle();
    }
  }
}
