---
title: "Why Systolic Architecture?"
date: 2026-01-27
authors: H. T. Kung
venue: Carnegie Mellon, 1982
tags: [Computer Architecture, Systolic Array, Hardware]
summary: Kung's foundational case for systolic architecture — simple, regular cells used repetitively, balancing computation with I/O.
---

*Kung, Hsiang-Tsung. "Why systolic architecture?". Pittsburgh, PA, USA: Design Research Center, Carnegie-Mellon University, 1982.*

---
## 1. Brief Summary

Most special-purpose systems are built on an ad hoc basis for specific tasks. Because the knowledge is gained individually, it cannot be properly accumulated or organized. Therefore, the author proposes a general guideline—specifically, the concept of systolic architecture.The design cost of a special-purpose system must be relatively small than General Purpose.→ It can achieved by decomposing into a few types of simple substructures, which are used 'repetitively' with 'simple interfaces'. 'simple' and 'regular' designs are likely to be modular and therefore adjustable to various performance goals.

I/O problem is related to I/O bandwidth and memory internal to the system. Internal memory can speed up the task, but there is an upper bounds due to the I/O bandwidth.The I/O problem is related not only to the available I/O bandwidth. The question is then is 'how to arrange a computation together with an appropriate memory structure so that computation time is balanced with I/O time'

A systolic system consists of a set of interconnected cells, each capable of performing simple operation. Information is flows between cells in a pipelined fashion, and communication with the outside world occurs only at the 'boundary cells'.

Sum of OP > I/O elements : compute bound
Sum of OP < I/O elements : I/O bound

Speeding up a compute-bound computation can often be accomplished in a simple and inexpensive manner by the systolic approach.

The challenge is to understand precisely the strenghts and drawbacks of each design so that an appropriate design can be selected for a given environment. For example, if there are more weights than cells, it's useful to know that a scheme where partial results stay generally requires less I/O than one where partial results move

---
## 2. Strength
(1) The design makes multiple use of each input data item.

(2)The design use extensive concurrency.
When the memory speed is more than cell speed, two-dimensional systolic arrays should be used. At each cycle, all the I/O ports on the array boundaries can input or output data items to or from the memory. As a result, the available memory bandwidth can be fully utilized.

(3) There are only a few types of simple cells.
Many cells to be implemented → each cell should probably contain simple logic, a few words of memory.
Less cells to be implemented → each cell could reasonably contain a high-performance arithmetic unit, a few thousand words of memory.
Trade-off between cell simplicity and flexibility.

(4) Data and control flows are simple and regular

---
## 3. Weakness
It's difficult to exploit data characteristics, such as sparsity or memory allocation. In large 2-D systolic arrays, it takes a long time for all PEs to become fully active, and the data skewing required for synchronization also increases overall latency.

---
## 4. Can you do better?
While it's not my own idea, a recent paper called AXON proposes feeding data along the principal diagonal and letting it propagate bi-directionally. This approach effectively reduces propagation latency. Also, papers like Eyeriss(also AXON) have introduced zero gating to handle sparsity; however, this mainly provides benefits in terms of power efficiency rather than significantly boosting throughput.

---
## 5. What have you learned/enjoyed/disliked
I found it really fascinating that you can achieve various computational results simply by how you connect simple PEs. I've been reading a lot of papers on systolic arrays lately, and the endless possibilities in how they can be utilized are truly exciting. On the other hand, I found it a bit disappointing that they aren't as flexible as SIMD when it comes to exploiting sparsity.
