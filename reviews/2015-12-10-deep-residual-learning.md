---
title: "Deep Residual Learning (ResNet) — Review"
date: 2015-12-10
authors: He et al.
venue: CVPR 2016
tags: [ResNet, Computer Vision, Deep Learning]
link: https://arxiv.org/abs/1512.03385
summary: Residual (skip) connections that let very deep networks train stably. (Example review)
---

> **This is an example review** included to show the format.

## One-line summary

The **degradation problem** — where deeper networks get *worse*, not better — is solved with **residual / skip connections** that add the input straight through.

## Key equation

Instead of learning the full mapping $H(x)$, a block learns the **difference** $F(x) = H(x) - x$:

$$
y = F(x, \{W_i\}) + x
$$

This makes it easy to learn the identity function, so gradients flow well even in very deep networks.

## My thoughts

- A simple idea with a strong effect — it became a default building block in most deep networks afterward.
- **Connection to my work**: (note here)
