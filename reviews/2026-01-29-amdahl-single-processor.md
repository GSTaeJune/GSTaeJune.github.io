---
title: "Validity of the Single Processor Approach to Achieving Large Scale Computing Capabilities"
date: 2026-01-29
authors: Gene M. Amdahl
venue: AFIPS 1967
tags: [Computer Architecture, Parallelism]
summary: Amdahl's Law — why an infinite number of processors does not make a task arbitrarily fast; speedup is bounded by the sequential portion.
---

*Amdahl, Gene M. "Validity of the single processor approach to achieving large scale computing capabilities." Proceedings of the April 18-20, 1967, spring joint computer conference. 1967.*

---
### 1. Brief Summary
The author demonstrates the importance of a single processor, arguing that an infinite number of processors does not necessarily speed up a task. This is due to:
1) Data management housekeeping
2) The physical problems characteristic
    - Interiors are likely to be irregular
    - Interiors are likely to be inhomogeneous
    - Computations required may be dependent on the states of the variables at each point
    etc

If a single processor cannot handle these sequential problems efficiently, the effort to achieve high parallel processing rates is wasted.

$$
\text{Speedup} = \frac{1}{(1 - P) + \frac{P}{N}}
$$

---
### 2. Strength
An infinite number of processors does not inherently make a task faster. The overall speedup is directly dictated by how effectively the system handles sequential bottlenecks.

---
### 3. Weakness

---
### 4. Can you do better?

---
### 5. What have you learned/enjoyed/disliked
I remember wondering, even before entering university, why we couldn't just achieve infinite speed by plugging in countless CPUs. This paper elegantly demonstrates that no problem in the real world is that simple, providing a sophisticated answer to my long-standing curiosity.
