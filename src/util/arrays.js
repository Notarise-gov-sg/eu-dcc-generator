"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayEquals = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const arrayEquals = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);
exports.arrayEquals = arrayEquals;
