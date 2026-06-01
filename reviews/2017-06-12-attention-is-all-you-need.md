---
title: "Attention Is All You Need — Review"
date: 2017-06-12
authors: Vaswani et al.
venue: NeurIPS 2017
tags: [Transformer, NLP, Attention, Deep Learning]
link: https://arxiv.org/abs/1706.03762
summary: Proposes the Transformer, which models sequences using attention alone (no RNN/CNN). This file is an example that shows the review format.
---

> **This is an example.** Copy this file inside the `reviews/` folder and change the content to create a new review.
> Just fill in the header between the top `---` lines (title, date, tags, etc.) and it will appear in the list automatically.

## One-line summary

Proposes the **Transformer**, which models sequences using **self-attention** alone, without recurrence (RNN) or convolution (CNN), achieving state-of-the-art machine translation with less training cost.

## Background / Motivation

Previous sequence models used RNNs to process tokens **sequentially**. This made parallelization hard and made it difficult to learn dependencies between distant words.

## Key idea

The most important equation is **Scaled Dot-Product Attention**. Inline math is written like this: \( \mathrm{softmax} \).
Display math (centered) is wrapped in `$$ ... $$`:

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left( \frac{Q K^{\top}}{\sqrt{d_k}} \right) V
$$

- $Q, K, V$ are the query, key, and value matrices.
- We divide by $\sqrt{d_k}$ to prevent the dot products from growing large and pushing softmax into regions with vanishing gradients.

### Multi-head attention

Several attention operations run in parallel so the model attends to different representation subspaces at once.

| Component | Role |
| --- | --- |
| Multi-Head Attention | Capture token relations from multiple views |
| Position-wise FFN | Per-token nonlinear transform |
| Positional Encoding | Inject order information |

## In code

Code blocks are syntax-highlighted:

```python
import torch
import torch.nn.functional as F

def attention(q, k, v):
    d_k = q.size(-1)
    scores = q @ k.transpose(-2, -1) / d_k ** 0.5
    weights = F.softmax(scores, dim=-1)
    return weights @ v
```

## My thoughts

- Dropping sequential processing in favor of parallelism spread to nearly every field afterward (NLP, vision, speech).
- **Connection to my work**: (Jotting down how this relates to my research topic here pays off a lot later.)

## References

- Original paper: [arXiv:1706.03762](https://arxiv.org/abs/1706.03762)
