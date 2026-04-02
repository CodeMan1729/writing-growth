I've read all three notes carefully. Now I have a clear picture of your toolbox and thinking style. Here are the problems.

---

## Problems for Practice

These are chosen to be genuinely interesting — each one forces you to combine tools in a non-obvious way, or reveals something structurally deep.

---

### Problem 1 — Primitive Roots and Order

Find all $n$ such that $2^n \equiv 1 \pmod{31}$.

Then: compute $2^{1000000000000} \pmod{31}$.

Why it matters: 31 is prime so Fermat gives period divides 30. But the actual order of 2 mod 31 is a proper divisor of 30. You have to find it. This forces you to use the "阶整除性" tool properly, not just blindly apply $p-1$. The structure of divisors of 30 is also beautiful: $30 = 2 \times 3 \times 5$.

？try:  费马小定理只能写出一个解，中国剩余定理无法用


---

### Problem 2 — Tower of Powers 

Compute $2^{2^{2^{2^{\cdots}}}} \pmod{100}$ where the tower has height 2026.

More precisely: define $a_1 = 2$, $a_{k+1} = 2^{a_k}$. Compute $a_{2026} \pmod{100}$.

Why it matters: This is exactly the application your note flags with "?" for 推广版欧拉定理. The answer requires recursive降幂: $\varphi(100) = 40$, then $\varphi(40) = 16$, then $\varphi(16) = 8$, and so on. The tower stabilises. This is a real technique used in competition math and cryptography.

---

### Problem 3 — LTE in Action

Prove that $v_3(4^n - 1) = v_3(n) + 1$ for all $n \geq 1$.

Why it matters: Your LTE note states the lemma but the串讲 example avoided actually using it (题目三 was easier by direct mod). This problem is a clean, minimal case where LTE is the right tool and gives an exact result, not just a congruence. The $+1$ on the right side is the $v_p(a-b)$ contribution — you have to track it carefully.

---

### Problem 4 — CRT with a Twist 

Find all integers $x$ such that:

$$x^2 \equiv 1 \pmod{5}, \quad x^2 \equiv 1 \pmod{7}, \quad x^2 \equiv 1 \pmod{11}$$

How many solutions are there mod $385$? List all of them.

Why it matters: Each equation $x^2 \equiv 1 \pmod{p}$ has exactly 2 roots (by the Fundamental Theorem of Algebra over $\mathbb{Z}/p\mathbb{Z}$, which is a field). CRT says the system over $385 = 5 \times 7 \times 11$ then has $2^3 = 8$ solutions. This bridges your two notes: the algebraic closed field reasoning gives you the root count, CRT assembles them. The number $2^k$ of solutions for $k$ distinct odd primes is a clean structural result.

---

### Problem 5 — A Deeper Structural Question

Let $p$ be an odd prime. Show that the product of all primitive roots mod $p$ is congruent to $1 \pmod{p}$ when $p - 1$ has more than two divisors, and congruent to $-1 \pmod{p}$ when $p - 1 = 2$ (i.e. $p = 3$).

Why it matters: This is not a computation problem — it asks you to think about what the set of primitive roots looks like. The key insight is that primitive roots come in pairs $\{g, g^{-1}\}$ where $g^{-1}$ is also a primitive root (since $\text{ord}(g^{-1}) = \text{ord}(g)$), and the only self-inverse element among primitive roots would be one where $g \equiv g^{-1}$, i.e. $g^2 \equiv 1$, i.e. $g \equiv \pm 1$. But $g \equiv 1$ is never a primitive root, and $g \equiv -1$ is a primitive root only when $p-1=2$. This connects order theory, pairing arguments, and Wilson's theorem ($(-1) \equiv (p-1)! \pmod{p}$) in one clean argument.

---

### Suggested Order

Start with Problem 1 (warm-up, pure computation), then Problem 3 (first real LTE use), then Problem 4 (bridges your two notes), then Problem 2 (recursive depth), then Problem 5 (structural thinking, no computation).



## Problems in Advanced Mathematics — Grounded in Your Toolbox

The bridge from your notes to these fields: your 代数学基本定理 note gives you the factoring-roots philosophy; your 降幂 notes give you the modular-arithmetic and order machinery; your Dirichlet逼近 note gives you the lattice-geometry intuition (approximation = finding a short vector); your 分析学估计 note gives you the triangle-inequality / perturbation style of proof.

---

### Problem 6 — Algebraic Number Theory

The norm and the Fundamental Theorem

Let $\mathbb{Z}[i] = \{a + bi : a, b \in \mathbb{Z}\}$ be the Gaussian integers. Define the norm $N(a+bi) = a^2 + b^2$.

(a) Show that $N(\alpha\beta) = N(\alpha)N(\beta)$ for all $\alpha, \beta \in \mathbb{Z}[i]$.

(b) A Gaussian integer $\pi$ is called a Gaussian prime if whenever $\pi = \alpha\beta$ in $\mathbb{Z}[i]$, then $N(\alpha) = 1$ or $N(\beta) = 1$. Show that an ordinary prime $p \in \mathbb{Z}$ remains a Gaussian prime if and only if $p \equiv 3 \pmod{4}$.

(c) Use your 代数学基本定理 reasoning: the polynomial $x^2 + 1$ has roots $\pm i \in \mathbb{C}$, which means $x^2 \equiv -1 \pmod{p}$ has a solution if and only if $p$ splits in $\mathbb{Z}[i]$. Connect this to part (b).

Why it matters: The splitting of primes in $\mathbb{Z}[i]$ is governed by the same root-existence question from your note. The factorisation $p = (a+bi)(a-bi)$ is exactly the conjugate-pair structure from 推论二 of your note, now over $\mathbb{Z}[i]$ instead of $\mathbb{R}$.

---

### Problem 7 — Lattice Theory + Dirichlet Approximation

Lattices as geometry of numbers

Let $\Lambda = \mathbb{Z}^2$ be the standard 2D integer lattice. A vector $\mathbf{v} = (p, q) \in \Lambda$ with $q \geq 1$ represents the rational $p/q$.

(a) Restate the Dirichlet approximation theorem (which you proved using pigeonhole) as a statement about the existence of a short lattice vector in a certain region of $\mathbb{R}^2$. Specifically: given $\alpha \in \mathbb{R}$ and $N \geq 1$, show that the set

$$S = \{(p, q) \in \mathbb{Z}^2 : 1 \leq q \leq N,\ |q\alpha - p| < 1/N\}$$

is always non-empty, by your pigeonhole argument.

(b) Now consider the lattice $\Lambda_\alpha = \{(p,q) \in \mathbb{Z}^2 : p \equiv q\alpha \pmod{1} \text{ approximately}\}$. Minkowski's theorem says: any convex symmetric set of volume $> 4 \cdot \det(\Lambda)$ contains a non-zero lattice point. Use this to give a second proof of Dirichlet's theorem, this time by applying Minkowski to the rectangle $\{(x,y) : |y| \leq N,\ |x - y\alpha| \leq 1/N\}$ and the lattice generated by $(1, 0)$ and $(\alpha, 1)$.

(c) What is the determinant of this lattice? What does it say about the "density" of good rational approximations?

Why it matters: This problem shows that your Dirichlet proof and the geometry-of-numbers approach (the foundation of lattice-based cryptography) are the same argument in different language. The lattice $\Lambda_\alpha$ above is a rank-2 q-ary lattice — the same object that appears in LWE.

---

### Problem 8 — Computational / Algorithmic Number Theory

Order-finding and the structure of $(\mathbb{Z}/n\mathbb{Z})$

(a) Using your 阶的整除性 tool: given $n = pq$ with $p, q$ distinct odd primes, show that $\text{ord}n(a)$ divides $\text{lcm}(p-1, q-1)$ for any $a$ with $\gcd(a,n)=1$.

(b) Suppose you are given $n = pq$ (you do NOT know $p, q$) and you somehow find an element $a$ such that $a^{(n-1)/2} \not\equiv \pm 1 \pmod{n}$ but $a^{n-1} \equiv 1 \pmod{n}$. Show how to factor $n$ from this information.

Hint: $a^{n-1} \equiv 1$ means $n \mid a^{n-1} - 1$, but $n \nmid a^{(n-1)/2} - 1$ and $n \nmid a^{(n-1)/2} + 1$. What does $\gcd(a^{(n-1)/2} - 1, n)$ give you?

(c) This is the core of the Miller–Rabin primality test. If $n$ is prime, why must $a^{(n-1)/2} \equiv \pm 1 \pmod{n}$? (Use your Fermat + order tools.)

Why it matters: Part (b) is the exact step inside Shor's algorithm and classical factoring algorithms. Your降幂 toolbox is the computational engine. The $\gcd$ step is cheap; finding the right $a$ is the hard part — which is where quantum speedup lives.

---

### Problem 9 — Linear Algebra over Rings + Module Theory

$\mathbb{Z}/n\mathbb{Z}$ is not a field — what breaks?

Let $R = \mathbb{Z}/n\mathbb{Z}$ and consider the module $R^k$ (column vectors of length $k$ over $R$).

(a) When $n = p$ is prime, $R = \mathbb{F}p$ is a field. Show that every system $A\mathbf{x} \equiv \mathbf{b} \pmod{p}$ with $A$ an invertible $k \times k$ matrix over $\mathbb{F}_p$ has a unique solution.

(b) Now let $n = pq$. Show that $A\mathbf{x} \equiv \mathbf{b} \pmod{pq}$ can have 0, 1, $p$, $q$, or $pq$ solutions, depending on $A$ and $\mathbf{b}$. Why does your 代数学基本定理 reasoning break down? (Hint: the polynomial $x^2 - 1 \pmod{pq}$ has 4 roots, not 2.)

(c) Using CRT: decompose $R^k = (\mathbb{Z}/p\mathbb{Z})^k \times (\mathbb{Z}/q\mathbb{Z})^k$, and show that solving $A\mathbf{x} \equiv \mathbf{b} \pmod{pq}$ reduces to solving two independent systems mod $p$ and mod $q$ separately, then lifting via CRT.

Why it matters: This is the structure behind the Chinese Remainder Theorem representation in ring-based cryptography (NTRU, lattice schemes over $\mathbb{Z}[x]/(x^n+1)$). The failure of unique factorisation over $\mathbb{Z}/n\mathbb{Z}$ is why RSA is hard, and the CRT decomposition is why NTT (Number Theoretic Transform) works efficiently.

---

### Problem 10 — Probability + Information Theory + Lattices (Min-entropy & Leftover Hash Lemma)

This is the hardest and most important one.

(a) Min-entropy definition. A random variable $X$ over a finite set $\mathcal{X}$ has min-entropy $H_\infty(X) = -\log_2 \max_{x} \Pr[X = x]$. Show that if $X$ is uniform over $\mathcal{X}$, then $H_\infty(X) = \log_2 |\mathcal{X}|$.

(b) Statistical distance. Define the statistical distance between two distributions $P, Q$ on $\mathcal{X}$ as

$$\text{SD}(P, Q) = \frac{1}{2}\sum_{x \in \mathcal{X}} |P(x) - Q(x)|.$$

Show that $\text{SD}(P,Q) = \max_{S \subseteq \mathcal{X}} |P(S) - Q(S)|$. This is the operational meaning: the best advantage any (even computationally unbounded) distinguisher can have.

(c) Leftover Hash Lemma. Let $X$ be a random variable over $\{0,1\}^n$ with $H_\infty(X) \geq k$. Let $H : \{0,1\}^n \to \{0,1\}^m$ be a random function drawn from a 2-universal hash family. The LHL states: if $m \leq k - 2\log_2(1/\varepsilon)$, then

$$\text{SD}((H, H(X)),\ (H, U_m)) \leq \varepsilon$$

where $U_m$ is uniform on $\{0,1\}^m$.

Prove the bound using the second-moment method: compute $\mathbb{E}H[\text{SD}^2]$ and apply Cauchy–Schwarz. (This is the standard proof — but work through each step carefully using your 分析学估计 triangle-inequality style of bounding.)

(d) Connection to your notes. Consider a random variable $X = a^r \pmod{p}$ where $a$ is a primitive root mod $p$ and $r$ is uniform in $\{0, \ldots, p-2\}$. What is $H_\infty(X)$? Can you apply LHL to extract a uniform bit from $X$?

Why it matters: LHL is the fundamental lemma behind randomness extraction, key derivation in cryptographic protocols, and the hardness proof of LWE: the LWE samples are shown to be indistinguishable from uniform using exactly this lemma applied to discrete Gaussian distributions over lattices.

---

### Problem 11 — Gaussian Measures on Lattices

Discrete Gaussian and the smoothing parameter

The discrete Gaussian distribution over $\mathbb{Z}$ with parameter $s > 0$ is:

$$D_{\mathbb{Z},s}(x) = \frac{e^{-\pi x^2 / s^2}}{\sum_{k \in \mathbb{Z}} e^{-\pi k^2 / s^2}}, \quad x \in \mathbb{Z}.$$

(a) Show that the denominator $\sum_{k \in \mathbb{Z}} e^{-\pi k^2/s^2}$ converges for all $s > 0$. (Use your 分析学估计 comparison method: bound by a geometric series or integral.)

(b) As $s \to \infty$, show that $D_{\mathbb{Z},s}$ approaches the uniform distribution on any fixed interval $\{-N, \ldots, N\}$ in the sense that all probabilities become approximately equal. As $s \to 0$, show it concentrates on $\{0\}$.

(c) Smoothing parameter intuition. The smoothing parameter $\eta_\varepsilon(\mathbb{Z})$ is roughly the smallest $s$ such that $D_{\mathbb{Z},s}$ "looks uniform" modulo any sublattice. Concretely: for the lattice $q\mathbb{Z} \subset \mathbb{Z}$, show that if $s \geq \sqrt{\ln(2q/\varepsilon)/\pi}$, then the distribution of $D_{\mathbb{Z},s} \pmod{q}$ is within statistical distance $\varepsilon$ of uniform