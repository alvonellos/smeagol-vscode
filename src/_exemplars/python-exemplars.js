/**
 * Python Exemplars
 * Real code patterns from popular Python libraries
 */

const pythonExemplars = [
  {
    framework: "django",
    name: "Django Views",
    code: `
class ArticleListView(ListView):
    model = Article
    template_name = 'articles/list.html'
    paginate_by = 10
    
    def get_queryset(self):
        return Article.objects.filter(published=True).order_by('-pub_date')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['featured'] = Article.objects.filter(featured=True)[:5]
        return context
    `
  },
  {
    framework: "flask",
    name: "Flask Routes",
    code: `
@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@app.route('/api/users', methods=['POST'])
@validate_json
def create_user():
    user = User.from_dict(request.get_json())
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201
    `
  },
  {
    framework: "numpy",
    name: "NumPy Operations",
    code: `
# Array operations instead of loops
arr = np.array([1, 2, 3, 4, 5])
squared = arr ** 2  # Vectorized operation

matrix = np.arange(12).reshape(3, 4)
mean_vals = np.mean(matrix, axis=1)
normalized = (matrix - mean_vals[:, np.newaxis]) / np.std(matrix)

# Broadcasting
a = np.array([[1, 2], [3, 4]])
b = np.array([10, 20])
result = a + b  # Broadcasting
    `
  },
  {
    framework: "pandas",
    name: "Pandas DataFrames",
    code: `
df = pd.read_csv('data.csv')
filtered = df[df['price'] > 100]
aggregated = df.groupby('category')['price'].agg(['mean', 'sum', 'count'])

# Chaining operations
result = (df
    .query('price > 100')
    .groupby('category')
    .agg({'price': 'mean', 'quantity': 'sum'})
    .reset_index()
    .sort_values('price', ascending=False))
    `
  },
  {
    framework: "requests",
    name: "Requests Library",
    code: `
# Using session for multiple requests
session = requests.Session()
session.headers.update({'User-Agent': 'MyApp/1.0'})

with session.get('https://api.example.com/data') as resp:
    if resp.status_code == 200:
        data = resp.json()
    else:
        resp.raise_for_status()

# Context manager for proper cleanup
    `
  },
  {
    framework: "asyncio",
    name: "Async/Await Patterns",
    code: `
async def fetch_data(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.json()

async def main():
    urls = ['url1', 'url2', 'url3']
    results = await asyncio.gather(*[fetch_data(url) for url in urls])
    return results

if __name__ == '__main__':
    asyncio.run(main())
    `
  },
  {
    framework: "pathlib",
    name: "Path Handling",
    code: `
from pathlib import Path

config_dir = Path.home() / '.config' / 'myapp'
config_file = config_dir / 'config.json'

if config_file.exists():
    with open(config_file) as f:
        config = json.load(f)

for py_file in Path('.').rglob('*.py'):
    print(py_file)
    `
  }
];

module.exports = { pythonExemplars };
