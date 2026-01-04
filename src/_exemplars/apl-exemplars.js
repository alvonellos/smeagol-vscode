/**
 * APL Exemplars
 * Real code patterns from Array Programming
 */

const aplExemplars = [
  {
    framework: "core",
    name: "Array Operations",
    code: `
⍝ Traditional loop (non-idiomatic)
result ← 0
:For i :In ⍳ ≢ array
    result ← result + array[i]
:EndFor

⍝ Idiomatic array operation
result ← +/ array  ⍝ Sum via reduction

⍝ More examples
product ← ×/ array  ⍝ Product
maximum ← ⌈/ array  ⍝ Maximum via reduction
    `
  },
  {
    framework: "tacit",
    name: "Tacit Programming",
    code: `
⍝ Traditional function with explicit arguments
sum_and_avg ← {(+/⍵) (average ⍵)}

⍝ Tacit (point-free) definition - more idiomatic
average ← +/ ÷ ≢  ⍝ sum / count
count ← ≢         ⍝ tally
sum ← +/          ⍝ reduction
    `
  },
  {
    framework: "higher-order",
    name: "Higher-Order Operators",
    code: `
⍝ Reduction operator /
sum ← +/ array          ⍝ Sum all elements
product ← ×/ array      ⍝ Multiply all
maximum ← ⌈/ array      ⍝ Max element

⍝ Scan operator \\
cumsum ← +\\ array       ⍝ Cumulative sum
cumprod ← ×\\ array      ⍝ Cumulative product

⍝ Each operator ¨
squared ← (×⍨)¨ array   ⍝ Square each element
negated ← -¨ array      ⍝ Negate each
    `
  },
  {
    framework: "composition",
    name: "Function Composition",
    code: `
⍝ Compose functions with ∘
twice ← {⍵ + ⍵}
quadruple ← twice ∘ twice

⍝ Apply with ⍨ (commute)
power_of_2 ← 2 ⋆ ⍨    ⍝ Raise 2 to power of each

⍝ Using .
sort_by_length ← {⍵[⍋≢¨⍵]}
    `
  },
  {
    framework: "structural",
    name: "Structural Functions",
    code: `
⍝ Reshape
matrix ← 3 4 ⍴ ⍳12    ⍝ Create 3×4 matrix

⍝ Transpose
transposed ← ⊖ matrix

⍝ Ravel/Flatten
flat ← , matrix

⍝ Mix/Rank operations
partitions ← ⊂ array   ⍝ Enclose (partition)
    `
  },
  {
    framework: "generators",
    name: "Vector Generation",
    code: `
⍝ Index generator
indices ← ⍳ 10         ⍝ 1 2 3 ... 10

⍝ Index of (find elements)
position ← array ⍳ 5   ⍝ Position of 5

⍝ Grade (sort indices)
sorted_idx ← ⍋ array   ⍝ Ascending order indices
reverse_idx ← ⍒ array  ⍝ Descending order indices
    `
  }
];

module.exports = { aplExemplars };
