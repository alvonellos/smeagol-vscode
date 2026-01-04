⍝ Smeagol APL Test File
⍝ Try typing APL operators and see completions!
⍝ All 50+ APL operators are available

⍝ Basic Array Operators
array ← ⍴ 5 10  ⍝ Reshape
reversed ← ⌽ array  ⍝ Reverse  
sorted ← ⍒ array  ⍝ Grade Down
indices ← ⍋ array  ⍝ Grade Up

⍝ Structural Operators
transposed ← ⊖ array  ⍝ Transpose
flattened ← , array  ⍝ Ravel (flatten)
take ← ↑ array  ⍝ Take
drop ← ↓ array  ⍝ Drop
partitioned ← ⊂ array  ⍝ Enclose
disclosed ← ⊃ array  ⍝ Disclose

⍝ Set Operations
union ← a ∪ b  ⍝ Union
intersection ← a ∩ b  ⍝ Intersection
find ← a ⍳ b  ⍝ Index Of

⍝ Higher-Order Operators
each ← f ¨ array  ⍝ Each
reduce ← f / array  ⍝ Reduce (Insert)
scan ← f \ array  ⍝ Scan
compose ← f ∘ g  ⍝ Composition
commute ← f ⍨  ⍝ Commute

⍝ Arithmetic Operators
sum ← a + b
difference ← a - b
product ← a × b
quotient ← a ÷ b
power ← a ⋆ b
logarithm ← a ⍟ b

⍝ Comparison Operators
equal ← a = b
not_equal ← a ≠ b
less ← a < b
greater ← a > b
less_equal ← a ≤ b
greater_equal ← a ≥ b

⍝ Monadic Functions
absolute ← | a  ⍝ Absolute value
ceiling ← ⌈ a  ⍝ Ceiling
floor ← ⌊ a  ⍝ Floor
logical_not ← ¬ a  ⍝ Logical NOT
factorial ← ! n  ⍝ Factorial

⍝ System Functions
print ← ⎕CR function  ⍝ Canonical representation
names ← ⎕NL 3  ⍝ Names list (functions)
time ← ⎕TS  ⍝ Timestamp
io_index ← ⎕IO  ⍝ Index origin

⍝ Array Definition
data ← 1 2 3 4 5
matrix ← 3 4 ⍴ ⍳12

⍝ Simple Function Definition
average ← +⌿ ÷ ≢
square ← × ⍨

⍝ Try typing: ⍝ to comment, ← to assign
⍝ Type ⎕ to see system functions
⍝ Type / or \ for reduce/scan operators
⍝ All operators trigger completions with descriptions!
