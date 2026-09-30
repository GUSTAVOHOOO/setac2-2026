import assert from 'node:assert/strict';
import test from 'node:test';
import { BonziEngine, type Bounds } from './engine.ts';

const bounds = (reserved: Bounds['reserved'] = []): Bounds => ({
  width: 1000,
  height: 700,
  reserved,
});
const advance = (engine: BonziEngine, milliseconds: number) => {
  for (let elapsed = 0; elapsed < milliseconds; elapsed += 100)
    engine.tick(Math.min(100, milliseconds - elapsed));
};

test('interaction holds patrol without freezing a requested gesture or bubble clock', () => {
  const engine = new BonziEngine(bounds(), () => 0);
  engine.speak();
  const first = engine.snapshot.frame;
  for (let i = 0; i < 5; i++) engine.tick(100, { holdMovement: true });
  assert.notEqual(engine.snapshot.frame, first);
  for (let i = 0; i < 55; i++) engine.tick(100, { holdMovement: true });
  assert.equal(engine.snapshot.text, '');
  const position = [engine.snapshot.x, engine.snapshot.y];
  for (let i = 0; i < 400; i++) engine.tick(100, { holdMovement: true });
  assert.deepEqual([engine.snapshot.x, engine.snapshot.y], position);
  assert.equal(engine.snapshot.text, '');
});

test('reading a bubble holds its expiry independently of the gesture', () => {
  const engine = new BonziEngine(bounds(), () => 0);
  engine.speak();
  for (let i = 0; i < 80; i++) engine.tick(100, { holdMovement: true, holdBubble: true });
  assert.notEqual(engine.snapshot.text, '');
  advance(engine, 6000);
  assert.equal(engine.snapshot.text, '');
});

test('starts at the lower right, greets, and settles on the neutral frame', () => {
  const engine = new BonziEngine(bounds(), () => 0);
  assert.deepEqual([engine.snapshot.x, engine.snapshot.y], [772, 412]);
  assert.equal(engine.snapshot.state, 'entering');
  assert.match(engine.snapshot.text, /Setac²/);
  advance(engine, 2000);
  assert.equal(engine.snapshot.state, 'idle');
  assert.equal(engine.snapshot.frame, 0);
});

test('initial placement and resize avoid reserved rectangles', () => {
  const reserved = { x: 700, y: 300, width: 300, height: 400 };
  const engine = new BonziEngine(bounds([reserved]), () => 0);
  assert.equal(overlaps(engine.snapshot.x, engine.snapshot.y, reserved), false);
  engine.resize({
    width: 320,
    height: 528,
    reserved: [{ x: 240, y: 230, width: 80, height: 298 }],
  });
  assert.equal(engine.snapshot.x >= 8 && engine.snapshot.x <= 92, true);
  assert.equal(engine.snapshot.y >= 8 && engine.snapshot.y <= 240, true);
  assert.equal(
    overlaps(engine.snapshot.x, engine.snapshot.y, { x: 240, y: 230, width: 80, height: 298 }),
    false,
  );
});

test('walking path never sweeps through a reserved rectangle', () => {
  const block = { x: 420, y: 200, width: 160, height: 400 };
  const engine = new BonziEngine(bounds([block]), () => 0);
  advance(engine, 16000);
  assert.equal(overlaps(engine.snapshot.x, engine.snapshot.y, block), false);
  let sawMovement = engine.snapshot.state === 'moving';
  for (let i = 0; i < 100; i++) {
    engine.tick(100);
    sawMovement ||= engine.snapshot.state === 'moving';
    assert.equal(overlaps(engine.snapshot.x, engine.snapshot.y, block), false);
  }
  assert.equal(sawMovement, true);
});

test('no tick suspends progress and one long tick does not replay missed events', () => {
  const engine = new BonziEngine(bounds(), () => 0);
  const before = engine.snapshot;
  assert.deepEqual(engine.snapshot, before);
  engine.tick(60_000);
  assert.notEqual(engine.snapshot.state, 'leaving');
  assert.equal(engine.snapshot.done, false);
});

test('click speech replaces current speech without a queue and expires after six seconds', () => {
  const engine = new BonziEngine(bounds(), () => 0);
  engine.speak();
  const first = engine.snapshot.text;
  advance(engine, 3000);
  engine.speak();
  assert.equal(engine.snapshot.state, 'speaking');
  assert.equal(engine.snapshot.announced, true);
  assert.notEqual(engine.snapshot.text, first);
  advance(engine, 5900);
  assert.equal(engine.snapshot.state, 'speaking');
  engine.tick(100);
  assert.equal(engine.snapshot.state, 'idle');
  assert.equal(engine.snapshot.text, '');
});

test('reduced motion keeps one static frame and disables automatic activity', () => {
  const engine = new BonziEngine(bounds(), () => 0, true);
  assert.equal(engine.snapshot.frame, 0);
  advance(engine, 100_000);
  assert.equal(engine.snapshot.state, 'idle');
  assert.equal(engine.snapshot.frame, 0);
  engine.speak();
  assert.equal(engine.snapshot.state, 'speaking');
  assert.equal(engine.snapshot.frame, 0);
  engine.setReduced(false);
  engine.setReduced(true);
  assert.equal(engine.snapshot.frame, 0);
});

test('leave interrupts movement and completes the exit sequence', () => {
  const engine = new BonziEngine(bounds(), () => 0);
  advance(engine, 10_000);
  assert.equal(engine.snapshot.state, 'moving');
  assert.equal(engine.snapshot.direction, -1);
  engine.leave();
  assert.equal(engine.snapshot.state, 'leaving');
  assert.match(engine.snapshot.text, /Salva/);
  advance(engine, 2000);
  assert.equal(engine.snapshot.done, true);
  engine.speak();
  assert.equal(engine.snapshot.done, true);
});

function overlaps(x: number, y: number, rect: Bounds['reserved'][number]) {
  return (
    x < rect.x + rect.width && x + 220 > rect.x && y < rect.y + rect.height && y + 280 > rect.y
  );
}
