import mockContext from 'aws-lambda-mock-context';
import _ from 'lodash';
import iopipe from 'iopipe';
import Profiler from './index';
import pkg from '../package.json';

jest.mock('./request');

test('Can instantiate plugin with or without options', () => {
  const plugin = Profiler();
  const inst = plugin({});
  const pluginWithOptions = Profiler({
    recSamples: false,
    sampleRate: 100,
    debug: true
  });
  const instWithOptions = pluginWithOptions({});
  expect(_.isFunction(inst.hooks['pre:invoke'])).toBe(true);
  expect(_.isFunction(inst.preInvoke)).toBe(true);
  expect(_.isFunction(inst.hooks['post:invoke'])).toBe(true);
  expect(_.isFunction(inst.postInvoke)).toBe(true);
  expect(_.isPlainObject(inst.config)).toBe(true);
  expect(inst.config.recSamples).toBe(true);
  expect(inst.config.sampleRate).toBe(1000);
  expect(inst.config.debug).toBe(false);
  expect(inst.meta.name).toBe('iopipe-plugin-profiler');
  expect(inst.meta.version).toBe(pkg.version);
  expect(inst.meta.homepage).toBe(
    'https://github.com/iopipe/iopipe-plugin-profiler#readme'
  );
  expect(instWithOptions.config.recSamples).toBe(false);
  expect(instWithOptions.config.sampleRate).toBe(100);
  expect(instWithOptions.config.debug).toBe(true);
});

test('works with iopipe', async function runTest() {
  const iopipeInstance = iopipe({
    token: 'test',
    plugins: [Profiler({ debug: true })]
  });
  const wrappedFn = iopipeInstance((event, context) => {
    context.succeed('wow');
  });
  const context = mockContext({ functionName: 'test-1' });
  wrappedFn({}, context);

  const val = await context.Promise;
  expect(val).toBe('wow');
});
