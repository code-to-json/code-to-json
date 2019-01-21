import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import serializeAmdDependency from '../../src/serializers/amd-dependency';

@suite
export class AMDDependencySerializationTests {
  @test
  public async 'basic tests'(): Promise<void> {
    const serialized = serializeAmdDependency({ name: 'foo', path: 'bar' });
    expect(serialized).to.have.property('path', 'bar');
    expect(serialized).to.have.property('name', 'foo');
  }
}
