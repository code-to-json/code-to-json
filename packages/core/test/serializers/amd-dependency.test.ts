import { expect } from 'chai';
import { describe, it } from 'mocha';
import serializeAmdDependency from '../../src/serializers/amd-dependency';

describe('AMD dependency serialization tests', () => {
  it('basic tests', async () => {
    const serialized = serializeAmdDependency({ name: 'foo', path: 'bar' });
    expect(serialized).to.have.property('path', 'bar');
    expect(serialized).to.have.property('name', 'foo');
  });
});
