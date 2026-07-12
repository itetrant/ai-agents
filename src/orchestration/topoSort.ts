import type { PlanTask } from './types.js';
import { logger } from '../utils/logger.js';

/** Orders tasks so every dependency runs before its dependents (Kahn's algorithm). */
export function topoSort(tasks: PlanTask[]): PlanTask[] {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const inDegree = new Map(tasks.map((t) => [t.id, 0]));

  for (const task of tasks) {
    for (const dep of task.dependsOn) {
      if (!byId.has(dep)) continue; // ignore unknown dependency ids rather than fail the whole plan
      inDegree.set(task.id, (inDegree.get(task.id) ?? 0) + 1);
    }
  }

  const queue = tasks.filter((t) => (inDegree.get(t.id) ?? 0) === 0).map((t) => t.id);
  const ordered: PlanTask[] = [];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const task = byId.get(id)!;
    ordered.push(task);

    for (const other of tasks) {
      if (other.dependsOn.includes(id)) {
        const remaining = (inDegree.get(other.id) ?? 0) - 1;
        inDegree.set(other.id, remaining);
        if (remaining === 0) queue.push(other.id);
      }
    }
  }

  if (ordered.length < tasks.length) {
    logger.warn('Plan has a dependency cycle or unknown ids; falling back to original task order for the rest.');
    for (const task of tasks) {
      if (!visited.has(task.id)) ordered.push(task);
    }
  }

  return ordered;
}
