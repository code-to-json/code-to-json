import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { pipe } from '../src/pipe';

function square(x: number): number {
  return x * x;
}

function addDigit(digit: number, x: number): string {
  return `${digit}${x}`;
}

function toInt(radix: number, val: string): number {
  return parseInt(val, radix);
}

function digitSum(x: number): number {
  const s = `${x}`;
  return s.split('').reduce((sum, y) => sum + parseInt(y, 10), 0);
}

@suite
export class PipeTests {
  @test public 'basic use'(): void {
    expect(pipe()(3)).to.eql(3);
    expect(pipe(square)(3)).to.eql(9);
    expect(
      pipe(
        square,
        square,
      )(3),
    ).to.eql(81);
    expect(
      pipe(
        square,
        square,
        addDigit.bind(null, 1),
      )(4),
    ).to.eql('1256');
    expect(
      pipe(
        square,
        square,
        addDigit.bind(null, 1),
        toInt.bind(null, 12),
      )(4),
    ).to.eql(2082);
    expect(
      pipe(
        square,
        square,
        addDigit.bind(null, 1),
        toInt.bind(null, 12),
        digitSum,
      )(4),
    ).to.eql(12);
  }
}
