// Run with: npm test
//
// Guards the two failures this module was written to fix:
//   1. elements that mount AFTER init (lazy routes) must still be revealed
//   2. the mutation debounce must not latch shut when its callback is deferred
//      (the original used requestAnimationFrame, which is paused in a hidden
//      tab — that left the whole page blank in a background tab)
import { test } from "node:test";
import assert from "node:assert/strict";

// --- minimal DOM stub: only what reveal.js actually touches -----------------
class El {
  constructor(delay) {
    this.dataset = delay === undefined ? {} : { aosDelay: String(delay) };
    this.style = {};
    this._classes = new Set();
    this.classList = {
      add: (c) => this._classes.add(c),
      remove: (c) => this._classes.delete(c),
      contains: (c) => this._classes.has(c),
    };
  }
  get revealed() {
    return this._classes.has("aos-animate");
  }
}

let elements = [];
let ioInstances = [];
let moInstances = [];
let pendingTimers = [];

class FakeIntersectionObserver {
  constructor(cb) {
    this.cb = cb;
    this.observed = new Set();
    this.disconnected = false;
    ioInstances.push(this);
  }
  observe(el) {
    this.observed.add(el);
  }
  unobserve(el) {
    this.observed.delete(el);
  }
  disconnect() {
    this.disconnected = true;
    this.observed.clear();
  }
  /** Simulate everything currently observed scrolling into view. */
  intersectAll() {
    this.cb([...this.observed].map((target) => ({ target, isIntersecting: true })));
  }
}

class FakeMutationObserver {
  constructor(cb) {
    this.cb = cb;
    this.disconnected = false;
    moInstances.push(this);
  }
  observe() {}
  disconnect() {
    this.disconnected = true;
  }
  fire() {
    this.cb([]);
  }
}

function setupDom() {
  elements = [];
  ioInstances = [];
  moInstances = [];
  pendingTimers = [];

  const htmlClasses = new Set();
  globalThis.document = {
    documentElement: {
      classList: {
        add: (c) => htmlClasses.add(c),
        remove: (c) => htmlClasses.delete(c),
        contains: (c) => htmlClasses.has(c),
      },
    },
    body: {},
    querySelectorAll: () => elements.filter((el) => !el.revealed),
  };
  globalThis.IntersectionObserver = FakeIntersectionObserver;
  globalThis.MutationObserver = FakeMutationObserver;
  globalThis.setTimeout = (fn) => {
    pendingTimers.push(fn);
    return pendingTimers.length;
  };
}

const flushTimers = () => {
  const due = pendingTimers;
  pendingTimers = [];
  due.forEach((fn) => fn());
};

const realSetTimeout = globalThis.setTimeout;
const loadModule = async () => {
  setupDom();
  // cache-bust so each test gets a module bound to the fresh stubs
  const mod = await import(`./reveal.js?t=${Math.random()}`);
  return mod.initReveal;
};

test("reveals elements that mount after init (lazy routes)", async () => {
  const initReveal = await loadModule();
  initReveal();

  const io = ioInstances.at(-1);
  assert.equal(io.observed.size, 0, "nothing to observe at init");

  // a lazy route mounts three animated blocks
  elements.push(new El(0), new El(100), new El(200));
  moInstances.at(-1).fire();
  flushTimers();

  assert.equal(io.observed.size, 3, "late-mounted elements must be observed");

  io.intersectAll();
  assert.ok(elements.every((el) => el.revealed), "all must reveal");
  assert.equal(elements[1].style.transitionDelay, "100ms", "delay is applied");
});

test("debounce latch reopens, so a second route change still scans", async () => {
  const initReveal = await loadModule();
  initReveal();
  const io = ioInstances.at(-1);
  const mo = moInstances.at(-1);

  elements.push(new El(0));
  mo.fire();
  flushTimers();
  io.intersectAll();
  assert.equal(elements[0].revealed, true);

  // navigate again — this is the case rAF broke in a hidden tab
  elements.push(new El(0), new El(50));
  mo.fire();
  flushTimers();
  assert.equal(io.observed.size, 2, "latch must not stay shut after first scan");

  io.intersectAll();
  assert.ok(elements.every((el) => el.revealed), "second batch reveals too");
});

test("cleanup disconnects both observers", async () => {
  const initReveal = await loadModule();
  const cleanup = initReveal();
  cleanup();

  assert.equal(ioInstances.at(-1).disconnected, true);
  assert.equal(moInstances.at(-1).disconnected, true);
  assert.equal(document.documentElement.classList.contains("reveal-ready"), false);
});

globalThis.setTimeout = realSetTimeout;
