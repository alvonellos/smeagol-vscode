/**
 * JavaScript Exemplars
 * Real code patterns from modern JavaScript
 */

const jsExemplars = [
  {
    framework: "es6+",
    name: "Modern JavaScript",
    code: `
// Arrow functions and destructuring
const users = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 }
];

const adults = users
    .filter(({ age }) => age >= 18)
    .map(({ id, name }) => ({ id, name }));

// Template literals
const greeting = users.map(({ name, age }) => 
    \`\${name} is \${age} years old\`
);
    `
  },
  {
    framework: "async-await",
    name: "Async/Await Patterns",
    code: `
async function fetchUserWithPosts(userId) {
    try {
        const user = await fetch(\`/api/users/\${userId}\`).then(r => r.json());
        const posts = await fetch(\`/api/users/\${userId}/posts\`).then(r => r.json());
        return { ...user, posts };
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
    }
}

async function batchFetch(urls) {
    const results = await Promise.all(urls.map(url => fetch(url)));
    return Promise.all(results.map(r => r.json()));
}
    `
  },
  {
    framework: "react",
    name: "React Components",
    code: `
const UserProfile = ({ userId }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    
    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await fetch(\`/api/users/\${userId}\`).then(r => r.json());
                setUser(data);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);
    
    if (loading) return <div>Loading...</div>;
    return <div>{user.name}</div>;
};
    `
  },
  {
    framework: "lodash",
    name: "Lodash Utilities",
    code: `
const users = [
    { id: 1, name: 'Alice', dept: 'Engineering' },
    { id: 2, name: 'Bob', dept: 'Sales' },
];

const grouped = _.groupBy(users, 'dept');
const names = _.map(users, 'name');
const maxAge = _.maxBy(users, 'age');
const paginated = _.chunk(users, 10);
    `
  },
  {
    framework: "spread-operator",
    name: "Spread and Rest",
    code: `
// Object spread
const user = { id: 1, name: 'Alice' };
const updated = { ...user, name: 'Bob' };

// Array spread
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];

// Rest parameters
const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0);
const [first, ...rest] = arr1;
    `
  },
  {
    framework: "promises",
    name: "Promise Patterns",
    code: `
// Promise chaining
fetch('/api/data')
    .then(response => response.json())
    .then(data => process(data))
    .catch(error => console.error('Error:', error));

// Promise.all for parallel operations
Promise.all([
    fetch('/api/users'),
    fetch('/api/posts'),
    fetch('/api/comments')
])
    .then(([u, p, c]) => ({ users: u, posts: p, comments: c }))
    .catch(err => console.error(err));
    `
  }
];

module.exports = { jsExemplars };
