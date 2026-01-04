/**
 * Go Exemplars
 * Real code patterns from popular Go projects
 */

const goExemplars = [
  {
    framework: "stdlib",
    name: "Error Handling",
    code: `
file, err := os.Open("data.txt")
if err != nil {
    return fmt.Errorf("failed to open file: %w", err)
}
defer file.Close()

data, err := ioutil.ReadAll(file)
if err != nil {
    return fmt.Errorf("failed to read file: %w", err)
}
    `
  },
  {
    framework: "goroutines",
    name: "Concurrency",
    code: `
results := make(chan string, len(urls))

for _, url := range urls {
    go func(u string) {
        resp, err := http.Get(u)
        if err != nil {
            results <- ""
            return
        }
        results <- resp.Status
    }(url)
}

for range urls {
    fmt.Println(<-results)
}
    `
  },
  {
    framework: "interfaces",
    name: "Interface Usage",
    code: `
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type ReadWriter interface {
    Reader
    Writer
}

func Copy(dst Writer, src Reader) (written int64, err error) {
    // ...
}
    `
  },
  {
    framework: "defer",
    name: "Resource Management",
    code: `
func processFile(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()
    
    if err := validate(file); err != nil {
        return err
    }
    
    return process(file)
}
    `
  },
  {
    framework: "net/http",
    name: "HTTP Server",
    code: `
func handleUsers(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
        users, _ := getUsers()
        json.NewEncoder(w).Encode(users)
    case http.MethodPost:
        var user User
        json.NewDecoder(r.Body).Decode(&user)
        createUser(&user)
    }
}

http.HandleFunc("/users", handleUsers)
http.ListenAndServe(":8080", nil)
    `
  },
  {
    framework: "testing",
    name: "Table-Driven Tests",
    code: `
func TestAdd(t *testing.T) {
    tests := []struct {
        a, b, expected int
    }{
        {1, 2, 3},
        {-1, 1, 0},
        {0, 0, 0},
    }
    
    for _, tt := range tests {
        result := Add(tt.a, tt.b)
        if result != tt.expected {
            t.Errorf("Add(%d, %d) = %d; want %d", tt.a, tt.b, result, tt.expected)
        }
    }
}
    `
  }
];

module.exports = { goExemplars };
