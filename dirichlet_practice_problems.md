
---

## 第一部分：基础应用 - 直接应用与鸽巢原理

### 题目1.1 - 有理逼近的存在性
**难度**：⭐✅

给定无理数 $\alpha$，证明：存在无穷多个既约分数 $\frac{p}{q}$ 使得
$$\left|\alpha - \frac{p}{q}\right| < \frac{1}{q^2}$$

**提示**：这是Dirichlet定理的直接推论。考虑 $|q\alpha - p| < \frac{1}{q}$ 的含义。

---

### 题目1.2 - 整数点的分布
**难度**：⭐⭐✅

在 $n \times n$ 的网格中放置 $n^2 + 1$ 个点。证明：必存在两个点，它们的距离不超过 $\sqrt{2}$。

**提示**：将网格分成 $n^2$ 个单位正方形，使用鸽巢原理。

---

### 题目1.3 - 同余类的应用
**难度**：⭐⭐

给定整数 $a$ 与 $n$ 互质，证明：存在整数 $k$ 使得 $1 \leq k \leq n$，且
$$ka \equiv 1 \pmod{n}$$

即 $a$ 在模 $n$ 意义下有乘法逆元。

**提示**：考虑序列 $a, 2a, 3a, \ldots, na$ 在模 $n$ 下的余数。

---

### 题目1.4 - 鸽巢原理的威力
**难度**：⭐⭐

证明：对于任意$N$个实数$x_1, \ldots, x_N$和任意$M < N$，存在$i \neq j$使得
$$|x_i - x_j| < \frac{1}{M}$$

**应用**：如何用这个结果快速证明Dirichlet定理？

---

### 题目1.5 - 模n余数的分布
**难度**：⭐⭐

证明：在任意 $n+1$ 个不同的整数中，必存在两个数，其差能被 $n$ 整除。

**提示**：考虑这些整数模 $n$ 的余数。

---

## 第二部分：分析学基础 - 逼近与稠密性

### 题目2.1 - 稠密性与逼近
**难度**：⭐⭐

设$\alpha$是无理数，证明：集合$\{q\alpha - [q\alpha] : q \in \mathbb{N}^+\}$在$[0,1)$中稠密。

**提示**：利用Dirichlet定理的证明思路，说明对任意$\epsilon > 0$和任意$x \in [0,1)$，都存在某个$q$使得$|q\alpha - [q\alpha] - x| < \epsilon$。

---

### 题目2.2 - 均匀分布（Weyl定理）
**难度**：⭐⭐⭐

设$\alpha$是无理数，定义序列$a_n = \{n\alpha\}$（即$n\alpha$的小数部分）。证明：
$$\lim_{N \to \infty} \frac{1}{N} \sum_{n=1}^{N} \mathbb{1}_{[a,b]}(a_n) = b - a$$
对所有$0 \le a < b \le 1$成立。

**提示**：这是Weyl均匀分布定理的特殊情况。考虑如何利用Dirichlet定理中的鸽巢原理来处理区间$[a,b]$中的点的分布。

---

### 题目2.3 - 小数部分的均匀分布
**难度**：⭐⭐⭐

设 $\alpha$ 是无理数，对于任意 $0 < \delta < 1$，证明：存在正整数 $q$ 使得
$$\{q\alpha\} \in (0, \delta)$$

其中 $\{x\}$ 表示 $x$ 的小数部分。

**提示**：利用Dirichlet定理，考虑 $\{q\alpha\}$ 的分布。

---

### 题目2.4 - 三角函数的逼近
**难度**：⭐⭐⭐

证明：对于无理数 $\alpha$，存在无穷多个正整数 $q$ 使得
$$|\sin(q\pi\alpha)| < \frac{1}{q}$$

**提示**：将 $\sin(q\pi\alpha)$ 与 $q\alpha$ 的小数部分联系起来。

---

### 题目2.5 - 逼近速度的下界
**难度**：⭐⭐⭐

证明：对于任意无理数$\alpha$，存在无穷多个有理数$\frac{p}{q}$使得
$$\left|\alpha - \frac{p}{q}\right| < \frac{1}{q^2}$$

**提示**：从Dirichlet定理出发，$|q\alpha - p| < \frac{1}{q}$意味着什么？

---

## 第三部分：高等代数 - 线性结构与格论

### 题目3.1 - 连分数与最佳逼近
**难度**：⭐⭐

设 $\alpha$ 的连分数展开为 $[a_0; a_1, a_2, \ldots]$，$\frac{p_n}{q_n}$ 为第 $n$ 个渐进分数。

证明：$\frac{p_n}{q_n}$ 是 $\alpha$ 的最佳有理逼近，即对任意 $\frac{p}{q}$ 满足 $q < q_{n+1}$，都有
$$\left|\alpha - \frac{p_n}{q_n}\right| < \left|\alpha - \frac{p}{q}\right|$$

**提示**：利用连分数的递推关系和Dirichlet原理。

---

### 题目3.2 - 连分数与最优逼近
**难度**：⭐⭐⭐

设$\alpha = [a_0; a_1, a_2, \ldots]$是$\alpha$的连分数展开，$\frac{p_n}{q_n}$是第$n$个收敛子。证明：
$$\left|\alpha - \frac{p_n}{q_n}\right| < \frac{1}{q_n q_{n+1}}$$

**思考**：这与Dirichlet定理给出的界$\frac{1}{q^2}$相比如何？连分数为什么能给出更好的逼近？

---

### 题目3.3 - 格与最小向量
**难度**：⭐⭐⭐

在$\mathbb{R}^2$中，考虑格$\Lambda = \{(p, q) : p \in \mathbb{Z}, q \in \mathbb{Z}\}$。对于向量$(α, 1)$（其中$\alpha$是无理数），定义
$$d((α, 1), \Lambda) = \inf_{(p,q) \in \Lambda} \|(α, 1) - (p, q)\|$$

证明：$d((α, 1), \Lambda) = \inf_{q \in \mathbb{Z}^+} \min(|q\alpha - [q\alpha]|, 1 - |q\alpha - [q\alpha]|)$

**思考**：Dirichlet定理如何用格论的语言重新表述？

---

### 题目3.4 - 格的基变换
**难度**：⭐⭐⭐

设$\Lambda$是由向量$(1, 0)$和$(\alpha, 1)$生成的$\mathbb{R}^2$中的格（其中$\alpha$是无理数）。证明：存在$\Lambda$的一组基，使得基向量的范数尽可能小。

**提示**：这与Dirichlet定理中寻找"最优"的$(p, q)$有什么关系？

---

### 题目3.5 - 行列式与体积
**难度**：⭐⭐⭐

设$\Lambda$是由向量$\mathbf{v}_1 = (1, 0)$和$\mathbf{v}_2 = (\alpha, 1)$生成的格。计算$\Lambda$的基本域的体积，并说明它与Dirichlet定理中的常数$\frac{1}{[\alpha]+1}$的关系。

---

### 题目3.6 - 格点与Minkowski定理
**难度**：⭐⭐⭐⭐

在$\mathbb{R}^2$中，考虑凸集$K = \{(x, y) : |x| < \frac{1}{2}, |y| < \frac{1}{2}\}$和格$\mathbb{Z}^2$。

(a) 证明：$K$包含非零格点当且仅当$\text{vol}(K) > 4 \cdot \text{vol}(\mathbb{Z}^2 \text{的基本域})$

(b) 如何利用Minkowski定理来证明Dirichlet逼近定理？

---

### 题目3.7 - 格的秩与维数
**难度**：⭐⭐⭐⭐

设$\Lambda \subset \mathbb{R}^n$是一个秩为$n$的格。证明：对于任意向量$\mathbf{v} \in \mathbb{R}^n$，存在$\mathbf{p} \in \Lambda$使得
$$\|\mathbf{v} - \mathbf{p}\| \le C \cdot (\text{det}(\Lambda))^{1/n}$$
其中$C$是仅依赖于$n$的常数。

**思考**：这是Dirichlet定理在高维的推广吗？

---

## 第四部分：近世代数 - 数论与代数结构

### 题目4.1 - 有理数的稠密性
**难度**：⭐⭐

在$\mathbb{Q}$中定义度量$d(x, y) = |x - y|$。证明：$\mathbb{Q}$在$\mathbb{R}$中稠密。

**进阶**：考虑$p$-进度量$d_p(x, y) = |x - y|_p$（其中$|\cdot|_p$是$p$-进赋值）。在这个度量下，$\mathbb{Q}$在$\mathbb{Q}_p$中稠密吗？

---

### 题目4.2 - 有限域上的逼近
**难度**：⭐⭐⭐

设$p$是素数，$\mathbb{F}_p = \mathbb{Z}/p\mathbb{Z}$。定义$\alpha \in \mathbb{F}_p$的"逼近"为找到$q, r \in \mathbb{F}_p$使得$q\alpha \approx r$。

(a) 在有限域中，Dirichlet定理的类似物是什么？

(b) 证明：对任意$\alpha \in \mathbb{F}_p^*$，存在非零的$q, r \in \mathbb{F}_p$使得$q\alpha = r$。

---

### 题目4.3 - 高斯整数中的逼近
**难度**：⭐⭐⭐

在高斯整数$\mathbb{Z}[i]$中，考虑元素$\alpha = a + bi$（其中$a, b \in \mathbb{Q}$）。定义范数$N(\alpha) = a^2 + b^2$。

证明：对于任意$\alpha \in \mathbb{Q}(i)$，存在$p, q \in \mathbb{Z}[i]$使得
$$N(\alpha - \frac{p}{q}) < \frac{1}{N(q)}$$

**思考**：这如何推广到其他代数数域？

---

### 题目4.4 - 理想与逼近
**难度**：⭐⭐⭐

设$\mathcal{O}_K$是数域$K$的整数环，$\mathfrak{a}$是$\mathcal{O}_K$中的理想。对于$\alpha \in K$，定义
$$d(\alpha, \mathfrak{a}) = \inf_{\beta \in \mathfrak{a}} |\alpha - \beta|$$

证明：如果$\mathfrak{a}$是非零理想，则$d(\alpha, \mathfrak{a}) = 0$对所有$\alpha \in K$成立。

**提示**：利用理想的性质和Dirichlet定理的思想。

---

### 题目4.5 - 类数与逼近
**难度**：⭐⭐⭐⭐

设$K = \mathbb{Q}(\sqrt{d})$是二次数域，$h_K$是其类数。证明：

(a) 如果$h_K = 1$（即$\mathcal{O}_K$是主理想整环），则对任意$\alpha \in K$，存在$\beta \in \mathcal{O}_K$使得$|\alpha - \beta|$充分小。

(b) 当$h_K > 1$时，上述结论如何修改？

---

### 题目4.6 - Liouville定理
**难度**：⭐⭐⭐

设$\alpha$是代数数，次数为$d \ge 2$。证明：存在常数$C > 0$，使得对所有有理数$\frac{p}{q}$（$q > 0$）有
$$\left|\alpha - \frac{p}{q}\right| > \frac{C}{q^d}$$

**提示**：利用$\alpha$是某个$d$次不可约多项式的根这一事实。对比Dirichlet定理，为什么代数数的逼近有下界？

---

## 第五部分：综合问题 - 跨领域应用

### 题目5.1 - 周期序列与逼近
**难度**：⭐⭐⭐

设$\{a_n\}$是周期为$T$的整数序列。定义$\alpha = \sum_{n=1}^{\infty} \frac{a_n}{10^n}$（十进制展开）。

(a) 证明：$\alpha$是有理数。

(b) 如果$\{a_n\}$是最终周期的（但不是纯周期的），$\alpha$仍然是有理数吗？

(c) 对于无理数$\alpha$，其十进制展开的"周期性"如何与Dirichlet定理相关？

---

### 题目5.2 - 三间隙定理（Three Distance Theorem）
**难度**：⭐⭐⭐⭐

设$\alpha$是无理数，$N$是正整数。考虑点集$\{0, \{α\}, \{2α\}, \ldots, \{(N-1)α\}, 1\}$在$[0,1]$上的分布。

证明：这些点将$[0,1]$分成的间隙中，最多出现三种不同的长度。

**提示**：这与Dirichlet定理中的鸽巢原理和区间划分有关。

---

### 题目5.3 - Beatty序列
**难度**：⭐⭐⭐

设 $\alpha, \beta > 1$ 且 $\frac{1}{\alpha} + \frac{1}{\beta} = 1$。

定义 Beatty 序列：
- $A = \{\lfloor n\alpha \rfloor : n \in \mathbb{Z}^+\}$
- $B = \{\lfloor n\beta \rfloor : n \in \mathbb{Z}^+\}$

证明：$A$ 和 $B$ 构成正整数集的一个分割（即 $A \cap B = \emptyset$ 且 $A \cup B = \mathbb{Z}^+$）。

**提示**：利用小数部分的性质和Dirichlet原理。

**思考**：这与Dirichlet定理中的稠密性有什么深层联系？

---

### 题目5.4 - Kronecker定理
**难度**：⭐⭐⭐⭐

设 $\alpha_1, \alpha_2, \ldots, \alpha_k$ 是 $1$ 上的线性无关的实数（即不存在不全为零的有理数使得线性组合为零）。

证明：对任意 $\epsilon > 0$ 和任意 $(x_1, x_2, \ldots, x_k) \in [0,1)^k$，存在正整数 $n$ 使得
$$\|\{n\alpha_i\} - x_i\| < \epsilon, \quad i = 1, 2, \ldots, k$$

其中 $\|\cdot\|$ 表示到最近整数的距离。

**提示**：这是Dirichlet定理的多维推广。考虑在 $[0,1)^k$ 中的点的分布。

---

### 题目5.5 - 同时逼近问题
**难度**：⭐⭐⭐⭐

考虑同时逼近问题：给定$\alpha_1, \ldots, \alpha_n$，找到$q$和$p_1, \ldots, p_n$使得
$$|q\alpha_i - p_i| < \epsilon_i, \quad i = 1, \ldots, n$$

当$\epsilon_i$的选择满足什么条件时，总是存在这样的$(q, p_1, \ldots, p_n)$？

---

### 题目5.6 - IMO风格问题
**难度**：⭐⭐⭐

给定正整数 $n$，在 $1$ 到 $n$ 之间选择 $k$ 个不同的整数 $a_1 < a_2 < \cdots < a_k$。

证明：必存在 $i < j$ 使得 $\gcd(a_i, a_j) = 1$ 且 $a_j - a_i \leq n/k$。

**提示**：结合鸽巢原理和数论性质。

---

### 题目5.7 - Erdős-Turán问题
**难度**：⭐⭐⭐⭐

设 $A \subseteq \{1, 2, \ldots, N\}$ 是一个无三项等差数列的集合（即不存在 $a, b, c \in A$ 使得 $a + c = 2b$）。

证明：$|A| = o(N)$（即 $|A|/N \to 0$ 当 $N \to \infty$）。

**提示**：这是加法组合学的经典问题，可用Fourier分析或鸽巢原理的高级应用。

---

## 第六部分：深度思考题

### 题目6.1 - 最优常数
**难度**：⭐⭐⭐⭐

在Dirichlet定理中，常数$\frac{1}{[\alpha]+1}$是否是最优的？即，是否存在更好的常数$C$使得对所有无理数$\alpha$和所有$q \le [\alpha]$，都有
$$\min(|q\alpha - [q\alpha]|, 1 - |q\alpha - [q\alpha]|) < C$$

---

### 题目6.2 - 例外集
**难度**：⭐⭐⭐⭐

设$S = \{\alpha \in \mathbb{R} : \text{存在无穷多个有理数} \frac{p}{q} \text{使得} |\alpha - \frac{p}{q}| < \frac{1}{q^{2+\epsilon}}\}$

对于固定的$\epsilon > 0$，$S$的Hausdorff维数是多少？

---

### 题目6.3 - 代数数的特殊性
**难度**：⭐⭐⭐⭐

为什么代数数的逼近有下界（Liouville定理），而超越数可以被任意好地逼近？这反映了什么样的深层数学结构？

---

### 题目6.4 - 格论的本质
**难度**：⭐⭐⭐⭐

Dirichlet定理、Minkowski定理和Kronecker定理之间的本质联系是什么？它们都涉及什么样的"鸽巢"结构？

---

### 题目6.5 - Thue-Siegel-Roth定理的特例
**难度**：⭐⭐⭐⭐

证明：如果 $\alpha$ 是代数数（即某个整系数多项式的根），那么对于任意 $\epsilon > 0$，只有有限多个既约分数 $\frac{p}{q}$ 满足
$$\left|\alpha - \frac{p}{q}\right| < \frac{1}{q^{2+\epsilon}}$$

**提示**：这涉及代数数的性质。考虑最小多项式的应用。

---

## 学习建议

### 推荐学习路径
1. **第一阶段**：题目1.1-1.5（掌握基础思想）
2. **第二阶段**：题目2.1-2.5（理解分析学基础）
3. **第三阶段**：题目3.1-3.7（深化代数理解）
4. **第四阶段**：题目4.1-4.6（拓展到代数结构）
5. **第五阶段**：题目5.1-5.7（综合应用）
6. **第六阶段**：题目6.1-6.5（深度思考）

### 关键思想总结
| 思想 | 应用场景 | 核心技巧 |
|------|--------|--------|
| **转化** | 将复杂问题简化 | 找到合适的参数化表示 |
| **鸽巢原理** | 证明存在性 | 合理划分"鸽笼" |
| **距离估计** | 量化逼近程度 | 利用小数部分性质 |
| **区间划分** | 系统分析 | 确保覆盖所有情况 |
| **稠密性** | 理解分布 | 利用无理数的性质 |
| **格论** | 几何视角 | 从离散结构看逼近 |

---

## 参考思路与关键概念

- **鸽巢原理**：有限个对象放入有限个容器，必有容器包含多个对象
- **稠密性**：集合的闭包等于整个空间
- **均匀分布**：序列在区间上的分布趋于均匀
- **格论**：离散的加法子群，具有良好的几何性质
- **代数数与超越数**：代数数满足多项式方程，超越数不满足
- **连分数**：实数的一种特殊表示，与最优有理逼近密切相关
- **Minkowski定理**：凸集与格点的关系
- **Kronecker定理**：多维均匀分布的推广

---

## 参考资源

- **书籍**：
  - 《数论导引》- Hardy & Wright
  - 《Diophantine Approximation》- Wolfgang M. Schmidt
  - 《An Introduction to Diophantine Equations》- Titu Andreescu

- **主题关键词**：
  - Diophantine approximation（丢番图逼近）
  - Pigeonhole principle（鸽巢原理）
  - Continued fractions（连分数）
  - Equidistribution（等分布）
  - Additive combinatorics（加法组合学）

---

## 解题框架模板

当遇到类似问题时，可参考以下框架：

```
1. 问题转化
   ├─ 识别目标量（距离、余数、分布等）
   ├─ 建立参数化表示
   └─ 转化为容易处理的形式

2. 鸽巢设计
   ├─ 确定"对象"的个数
   ├─ 设计"鸽笼"的划分
   └─ 验证鸽笼数 < 对象数

3. 距离估计
   ├─ 利用小数部分性质
   ├─ 进行区间分析
   └─ 得出所需的界

4. 结论
   ├─ 综合以上步骤
   └─ 陈述最终结果
```

---

祝你学习愉快！🎯
