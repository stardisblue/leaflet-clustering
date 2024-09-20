import RBush, { BBox } from 'rbush';
import { Ref } from './ref';

export type RbushOptions<T> = {
  bbox: (item: T) => BBox;
  compareMinX: (a: T, b: T) => number;
  compareMinY: (a: T, b: T) => number;
  maxEntries?: number;
};

export function rBush<T>(options: RbushOptions<T>): RBush<Ref<T>> {
  class RefRbush extends RBush<Ref<T>> {
    toBBox(µ_item: Ref<T>) {
      return options.bbox(µ_item.current);
    }

    compareMinX(µ_a: Ref<T>, µ_b: Ref<T>) {
      return options.compareMinX(µ_a.current, µ_b.current);
    }

    compareMinY(µ_a: Ref<T>, µ_b: Ref<T>) {
      return options.compareMinY(µ_a.current, µ_b.current);
    }
  }

  return new RefRbush(options.maxEntries);
}
