import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { createRef } from '../src/deferred-processing/ref';
import { createQueue, isRef, Queue } from '../src/index';

declare module '../src/deferred-processing/ref-registry' {
  export default interface RefRegistry {
    foo: ['foo', string];
  }
}

@suite
class DeferredProcessingTests {
  public q!: Queue<'foo', { idd: string }>;

  public before() {
    this.q = createQueue('foo', (val: { idd: string }) => `~~${val.idd}~~`);
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
    // tslint:disable-next-line:no-identical-functions
    const { processedCount } = this.q.drain((ref, item) => '');
    expect(processedCount).to.eq(1);
  }

  @test
  public '.drainUntilEmpty completely drains everything'(): void {
    this.q.queue({ idd: '23456' });
    let iterationCount = 0;
    // tslint:disable-next-line:no-identical-functions
    this.q.drainUntilEmpty((ref, item) => {
      expect(ref).to.deep.eq(['foo', '~~23456~~']);
      expect(item).to.deep.eq({
        idd: '23456',
      });
      iterationCount++;
    });
    expect(iterationCount).to.eq(1);
  }

  @test
  public '.queue de-duplicates repeated queues'(): void {
    const obj = { idd: '34567' };
    this.q.queue(obj);
    this.q.queue(obj);
    let iterationCount = 0;
    // tslint:disable-next-line:no-identical-functions
    this.q.drain((ref, item) => {
      expect(ref).to.deep.eq(['foo', '~~34567~~']);
      expect(item).to.deep.eq({
        idd: '34567',
      });
      iterationCount++;
    });
    expect(iterationCount).to.eq(1);
  }
}
