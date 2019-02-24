import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import { createQueue, Queue } from '../src/index';

describe('Deferred processing tests', () => {
  let q: Queue<'foo', { idd: string }, any>;
  beforeEach(() => {
    q = createQueue<{ foo: any }, 'foo', { idd: string }>(
      'foo',
      (val: { idd: string }) => `~~${val.idd}~~`,
    );
  });

  it('.queue returns a ref', () => {
    const ref = q.queue({ idd: '12345' });
    expect(ref).to.deep.eq(['foo', '~~12345~~']);
  });

  it('.drain calls back w/ the original object', () => {
    q.queue({ idd: '23456' });
    let iterationCount = 0;
    q.drain((ref, item) => {
      expect(ref).to.deep.eq(['foo', '~~23456~~']);
      expect(item).to.deep.eq({
        idd: '23456',
      });
      iterationCount++;
    });
    expect(iterationCount).to.eq(1);
  });

  it('.drain returns the processed object count', () => {
    q.queue({ idd: 'asdklh' });
    const { processedCount } = q.drain((_ref, _item) => '');
    expect(processedCount).to.eq(1);
  });

  it('.drainUntilEmpty completely drains everything', () => {
    q.queue({ idd: '23456' });
    let icount = 0;
    q.drainUntilEmpty((reff, item) => {
      expect(reff).to.deep.eq(['foo', '~~23456~~']);
      expect(item).to.deep.eq({
        idd: '23456',
      });
      icount++;
    });
    expect(icount).to.eq(1);
  });

  it('.queue de-duplicates repeated queues', () => {
    const obj = { idd: '34567' };
    q.queue(obj);
    q.queue(obj);
    let iterationCount = 0;
    q.drain((r, item) => {
      expect(r).to.deep.eq(['foo', '~~34567~~']);
      expect(item).to.deep.eq({
        idd: '34567',
      });
      iterationCount++;
    });
    expect(iterationCount).to.eq(1);
  });
});
