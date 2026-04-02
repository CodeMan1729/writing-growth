---
tags:
  - 分析学
---
>[!note] 定理
>$\alpha$与$\beta$为$n$维向量，则
>$$|\alpha+\beta|\leq|\alpha|+|\beta|$$
>=成立当且仅当$\alpha$与$\beta$线性相关

# 证明方法1
>[!note] 二维情况使用几何
>第三条边是要小于其他两边之和的。而三线共线是取相等

# 证明方法2
>[!note] 结合二维的证明+[[边界思想]]
>那么就合理的去猜测N维的情况贡献的时候也是这样，根据[[边界思想]]，用取=时候的技术尝试去做一般情况。令$f(x)=|\alpha+x\beta|^2$, 把$f(x)$展开以后对$\sum a_ib_i$使用那么根据柯西施瓦兹不等式，得到$$f(x) \leq \left( \left(\sum_{i=1}^{n} a_i^2\right)^{\frac{1}{2}} + x\left(\sum_{i=1}^{n} b_i^2\right)^{\frac{1}{2}} \right)^2$$
>令$x=1$得证😘

>[!todo] ? 那么如果令$f(x)=|\alpha-x\beta|^2$, 可以得到什么结论
>111

