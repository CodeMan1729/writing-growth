>[!定理]
>
>设 $\alpha\geq 1$ 是任意给定实数，
>证明：对于任意实数$x$ 。均存在既约有理分数$\frac{p}{q}$，满足 $1 \leq q \leq \alpha$，使得：
>$$\left| x - \frac{p}{q} \right |< \frac{1}{q\alpha}$$
>

>[!core idea]
>把问题转化为$q\alpha$与一个整数$p$的最近的距离，然后转化后的目标是要找到这个$p$和$q$，让$q\alpha$与q的距离尽可能的小，然后使用估计的方法去解答

>[!证明思路]
>①就像[[epsilon room]]的思想一样，做分析的问题要把困难的转化为容易的，未知的$\to$ 已知的。原问题转化为$$|q\alpha - p|<\frac{1}{\alpha}$$，这意味着我们要寻找到$p$和$q$，满足：让$q\alpha$与一个整数$p$的距离充分的小
>②一种自然的想法是让$p=[q\alpha]$，且$\{q\alpha\}<\frac{1}{\alpha}$ (我尝试了，$\frac{1}{\alpha}也可以做，但下面使用{\frac{1}{[\alpha]+1}}$ 😎 (别忘了这里$\frac{1}{[\alpha]}$无法放缩) ）
>
>![[Pasted image 20260322101920.png]]
><small>*两种情况的图示，这样一画的话其实dirichlet的思路非常的简单而清晰*</small>
>
>③因为最近情况可以分成两种，所以下面的想法自然就是让$$1-\{q\alpha\}<\frac{1}{\alpha}$$ 就像之前的思路，使用$1-\{q\alpha\}<\frac{1}{[\alpha]+1}$，得到$\frac{[\alpha]}{[\alpha+1]}<\{q\alpha\}<1$
>
>④我们继续来研究小数$\{q\alpha\}$的性质，写出$\{q\alpha\}$的个数和我们还剩下哪些区间没有判断：
>![[Pasted image 20260322103937.png]]
>
>说明肯定有两个小数$\{i\alpha\},\{j\alpha\} (不妨有i<j\in\{1,2,...,[\alpha]\})$落在了同一个区间里，所以$$\{i\alpha\}-\{j\alpha\}<\frac{1}{[\alpha]+1}$$ 则令$q=i-j, p=[i]-[j]$得证。在证明的过程中，自然地使用到鸽巢原理，一点也不刻意

? 染色
# 可视化
这是逼近e
![[Pasted image 20260322112412.png|2000]]

# 推论，相关结果

 >[!命题] 有理逼近的存在性
 >给定无理数 $\alpha$，证明：存在无穷多个既约分数 $\frac{p}{q}$ 使得$$\left|\alpha - \frac{p}{q} \right| < \frac{1}{q^2}$$

> dirichlet逼近定理的推论


#  待整理？
 我来给你讲讲 Dirichlet 逼近定理的背景和应用。

**历史背景**

Dirichlet 逼近定理是由德国数学家 Peter Gustav Lejeune Dirichlet 在 1842 年发表的。这个定理出现在他的论文中，是丢番图逼近理论（Diophantine Approximation）的奠基性成果之一。

**为什么叫"定理"**

它被称为定理是因为：
1. **普遍性强**：对所有实数都成立，不仅仅是特殊情况
2. **证明严格**：使用鸽笼原理（Pigeonhole Principle）给出了优雅的证明
3. **影响深远**：开启了丢番图逼近这个重要的数论分支
4. **应用广泛**：在数论、密码学、计算机科学等领域都有应用

**主要应用领域**

1. **数论**：研究无理数的有理逼近性质，与连分数理论密切相关

2. **密码学**：
   - **RSA 破解**：在某些情况下，如果 RSA 的私钥泄露部分信息，可以用 Dirichlet 逼近定理结合 Wiener 攻击来恢复完整私钥
   - **格密码分析**：在格基密码的攻击中使用
   - **同余方程求解**：在密钥恢复攻击中有应用

3. **计算机科学**：
   - 算法分析中的复杂度估计
   - 伪随机数生成器的分析

4. **物理学**：天体力学中的轨道共振问题

**现代地位**

Dirichlet 逼近定理虽然是 19 世纪的成果，但它：
- 仍然是丢番图逼近理论的核心定理
- 在现代密码分析中仍有实际应用价值
- 是学习数论的必修内容

所以它不仅是历史上的重要定理，在当代也保持着活力和应用价值。

**他是逼近谁**

Dirichlet 逼近定理是用**有理数** $\frac{p}{q}$ 去逼近**无理数** $\alpha$。

核心思想是：对于任何无理数 $\alpha$，总能找到分母不超过 $N$ 的有理数 $\frac{p}{q}$，使得这个有理数与 $\alpha$ 的误差小于 $\frac{1}{qN}$。这说明无理数可以被有理数"相当好地"逼近。


B站视频：# 【数学竞赛】Dirichlet逼近定理：{sin n}的极限点集是 [-1,1]


出现了连分数 ：[lecture12.pdf](https://www.math.uzh.ch/gorodnik/nt/lecture12.pdf)
一个有趣的解法：[An Unconventional Proof for the Irrationality of √3 using Dirichlet Approximation - YouTube](https://www.youtube.com/watch?v=kqWajn3ivHE)

他的时代：
1. 连分数已经存在

- 连分数理论在 Dirichlet 之前就已经很成熟了（Euler、Lagrange 等人的工作）

- 当时数学家已经知道连分数给出最优逼近

- 所以如果要做数值计算，直接用连分数就行了

1. Dirichlet 定理的真实角色

- Dirichlet 的目标不是为了数值计算

- 他是为了解决理论问题（比如 Pell 方程）

- 他想证明的是"任何无理数都能被有理数很好地逼近"这个深层的数学事实

？讲出来