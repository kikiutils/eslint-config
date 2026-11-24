import { fileURLToPath } from 'node:url';

import type { TypedFlatConfigItem } from '@antfu/eslint-config';
import { antfu } from '@antfu/eslint-config';
import { Linter } from 'eslint';
import {
    beforeAll,
    describe,
    it,
} from 'vitest';

import { createBaseConfigs } from '../src/base';

import { filterRules } from './utils';

const ruleId = 'kikiutils/no-thenable-zod-refinement';

// Minimal Zod and Mongoose shapes: Zod objects carry `_zod`, and a Mongoose Query is a thenable, not a Promise.
const declarations = [
    'interface Check<T> { _zod: { check: (value: T) => unknown } }',
    'interface Schema<T> {',
    '    _zod: unknown;',
    '    check: (...checks: Array<((payload: { value: T }) => unknown) | Check<T>>) => Schema<T>;',
    '    refine: (fn: (value: T) => unknown, params?: string) => Schema<T>;',
    '    superRefine: (fn: (value: T, ctx: unknown) => unknown) => Schema<T>;',
    '}',
    'declare const z: { objectId: () => Schema<string>; refine: <T>(fn: (value: T) => unknown) => Check<T> };',
    'interface Query<T> { exec: () => Promise<T>; then: <R>(onfulfilled?: (value: T) => R) => Promise<R> }',
    'declare function exists(id: string): Query<{ _id: string } | null>;',
    'declare const other: { refine: (fn: (value: string) => unknown) => void };',
].join('\n');

describe('no-thenable-zod-refinement', () => {
    let configs: TypedFlatConfigItem[];
    const filename = fileURLToPath(new URL('./fixtures/type-aware/fixture.ts', import.meta.url));
    const verify = (code: string) => new Linter().verify(`${declarations}\n${code}\nexport {};\n`, configs, { filename });

    beforeAll(async () => {
        configs = filterRules(await antfu({ typescript: true }, createBaseConfigs()), (id) => id === ruleId);
    });

    it.for([
        'z.objectId().refine((id) => exists(id));',
        'z.objectId().superRefine((id) => exists(id));',
        'z.objectId().check(z.refine((id: string) => exists(id)));',
        'z.objectId().check(() => undefined, (payload) => exists(payload.value));',
        'function find(id: string) { return exists(id); }\nz.objectId().refine(find);',
    ])(
        'should report a refinement returning a non-Promise thenable: %s',
        { timeout: 30_000 },
        (code, { expect }) => {
            expect(verify(code).map((message) => message.ruleId)).toEqual([ruleId]);
        },
    );

    it.for([
        'z.objectId().refine(async (id) => !!await exists(id));',
        'z.objectId().refine((id) => exists(id).exec());',
        'z.objectId().refine((id) => id.length > 0, \'Invalid\');',
        'other.refine((id) => exists(id));',
    ])(
        'should allow Promise and synchronous refinements: %s',
        { timeout: 30_000 },
        (code, { expect }) => {
            expect(verify(code)).toEqual([]);
        },
    );
});
