import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { createQueue, Queue } from '../src/index';

@suite
export class DeferredProcessingTests {
  public q!: Queue<'foo', { idd: string }, any>;

  public before(): void {
    this.q = createQueue<{ foo: any }, 'foo', { idd: string }>(
      'foo',
      (val: { idd: string }) => `~~${val.idd}~~`,
    );
  }

  @test
  public '.queue returns a ref'(): void {
    const ref = this.q.queue({ idd: '12345' });
    expect(ref).to.deep.eq(['foo', '~~12345~~']);
  }

  @test
  public '.drain calls back w/ the original object'(): void {
    this.q.queue({ idd: '23456' });
    let iterationCount = 0;
    this.q.drain((ref, item) => {
      expect(ref).to.deep.eq(['foo', '~~23456~~']);
      expect(item).to.deep.eq({
        idd: '23456',
      });
      iterationCount++;
    });
    expect(iterationCount).to.eq(1);
  }

  @test
  public '.drain returns the processed object count'(): void {
    this.q.queue({ idd: 'asdklh' });
    const { processedCount } = this.q.drain((_ref, _item) => '');
    expect(processedCount).to.eq(1);
  }

  @test
  public '.drainUntilEmpty completely drains everything'(): void {
    this.q.queue({ idd: '23456' });
    let icount = 0;
    this.q.drainUntilEmpty((reff, item) => {
      expect(reff).to.deep.eq(['foo', '~~23456~~']);
      expect(item).to.deep.eq({
        idd: '23456',
      });
      icount++;
    });
    expect(icount).to.eq(1);
  }

  @test
  public '.queue de-duplicates repeated queues'(): void {
    const obj = { idd: '34567' };
    this.q.queue(obj);
    this.q.queue(obj);
    let iterationCount = 0;
    this.q.drain((r, item) => {
      expect(r).to.deep.eq(['foo', '~~34567~~']);
      expect(item).to.deep.eq({
        idd: '34567',
      });
      iterationCount++;
    });
    expect(iterationCount).to.eq(1);
  }
}
