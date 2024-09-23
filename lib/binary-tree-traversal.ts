export type Leaf<D = any> = { data: D };

export type Pair = { left: Pair | Leaf; right: Pair | Leaf };

export function flatten<T>(cluster: Pair | Leaf<T>) {
  function loop(acc: T[], stack: (Pair | Leaf<T>)[]) {
    if (stack.length === 0) return acc;

    const head = stack.shift()!;

    if (isLeaf(head)) acc.push(head.data);
    else stack.push(head.left, head.right);

    return loop(acc, stack);
  }

  return loop([], [cluster]);
}

function isLeaf(cluster: Pair | Leaf): cluster is Leaf {
  return (cluster as Leaf).data !== undefined;
}
