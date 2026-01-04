# Smeagol Completion Reference Guide

## Quick Reference: All Supported Languages

### 🦀 Rust Completions (40+ items)

**Standard Types:**
- `Vec<T>` - Dynamic array
- `String` - UTF-8 string
- `HashMap<K, V>` - Hash map
- `Option<T>` - Optional value
- `Result<T, E>` - Error handling
- `Arc<T>` - Atomic reference counter
- `Mutex<T>` - Thread-safe lock
- `RwLock<T>` - Read-write lock

**Common Traits:**
- `Iterator` - Iteration trait
- `IntoIterator` - Into iterator conversion
- `Clone` - Deep copy
- `Copy` - Stack copy
- `Default` - Default values
- `Display` - String formatting
- `Debug` - Debug formatting
- `PartialEq, Eq` - Equality
- `Ord` - Ordering
- `From, Into` - Type conversion

**Popular Crates:**
- `tokio` - Async runtime
- `serde` - Serialization
- `anyhow` - Error handling
- `regex` - Regular expressions
- `chrono` - Date/time
- `clap` - CLI parsing
- `log` - Logging framework

---

### ☕ Java Completions (60+ items)

#### Core Annotations:
```java
@SpringBootApplication  // Main Spring Boot app
@RestController         // REST API controller
@Service               // Service layer
@Repository            // Data access layer
@Configuration         // Config class
@Bean                  // Define bean
@Autowired             // Dependency injection
@Qualifier("name")     // Specify bean by name
@Value("${prop}")      // Inject property
```

#### Web Annotations:
```java
@RequestMapping("/path")   // Map HTTP requests
@GetMapping("/path")       // Map GET requests
@PostMapping("/path")      // Map POST requests
@PutMapping("/path")       // Map PUT requests
@DeleteMapping("/path")    // Map DELETE requests
@PathVariable String id    // Extract path var
@RequestParam String name  // Extract query param
@RequestBody MyDto dto     // Bind request body
@ResponseStatus(...)       // Set HTTP status
```

#### JPA/Entity Annotations:
```java
@Entity                    // JPA entity
@Table(name="table")      // Map to table
@Id                       // Primary key
@GeneratedValue(...)      // Auto-generate ID
@Column(name="col")       // Map to column
@OneToMany(...)           // One-to-many relation
@ManyToOne               // Many-to-one relation
@ManyToMany              // Many-to-many relation
@JoinColumn(name="fk")   // Join column
```

#### Lombok Annotations (25+ items):
```java
@Data                        // Generate getters/setters/equals/hashCode/toString
@Getter, @Setter            // Individual accessors
@ToString                   // Generate toString()
@EqualsAndHashCode          // Generate equals/hashCode
@RequiredArgsConstructor    // Constructor for required fields
@AllArgsConstructor         // Constructor with all fields
@NoArgsConstructor          // No-arg constructor
@Builder                    // Builder pattern
@Value                      // Immutable data class
@NonNull                    // Non-null check
@Slf4j, @Log, @Log4j2      // Logging annotations
@Synchronized              // Synchronization
@SneakyThrows              // Hide checked exceptions
@Cleanup                   // Auto-close resources
@With                      // Generate with() for immutables
@Delegate                  // Delegate methods
```

#### Spring Boot Properties:
```properties
server.port=8080
server.servlet.context-path=/api
spring.application.name=myapp
spring.datasource.url=jdbc:mysql://...
spring.datasource.username=root
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
logging.level.root=INFO
spring.profiles.active=dev
spring.cache.type=redis
```

---

### 🐍 Python Completions (50+ items)

**Builtins:**
```python
print()         # Output
len()           # Length
range()         # Numeric range
enumerate()     # Index + value pairs
zip()           # Combine iterables
map()           # Apply function
filter()        # Filter items
sorted()        # Sort items
isinstance()    # Type check
dict, list, set, tuple, str, int, float, bool
```

**Decorators:**
```python
@property              # Read-only property
@staticmethod          # Static method
@classmethod           # Class method
@abstractmethod        # Abstract method
@contextmanager        # Context manager
@lru_cache            # Function caching
```

**Async/Await:**
```python
async def               # Async function
await coroutine        # Wait for result
asyncio.run()          # Run async
asyncio.gather()       # Run concurrently
asyncio.create_task()  # Create task
```

**Popular Packages:**
```python
numpy          # Numerical computing
pandas         # Data analysis
matplotlib     # Plotting
requests       # HTTP library
flask          # Web framework
django         # Full-featured web framework
pytest         # Testing
sqlalchemy     # ORM
pydantic       # Data validation
pathlib        # File paths
typing         # Type hints
logging        # Logging
json           # JSON encoding/decoding
```

---

### ☸️ Kubernetes (40+ items)

**Resource Types:**
```yaml
Pod                  # Basic deployable unit
Deployment          # Replicated pods
Service             # Network service
ConfigMap           # Configuration data
Secret              # Sensitive data
StatefulSet         # Stateful applications
DaemonSet           # Run on every node
Job                 # Run to completion
CronJob             # Scheduled jobs
Ingress             # HTTP/HTTPS routing
PersistentVolume    # Cluster storage
PersistentVolumeClaim  # Storage request
Namespace           # Virtual clusters
NetworkPolicy       # Network access rules
```

**Common Fields:**
```yaml
apiVersion: v1              # API version
kind: Pod                   # Resource type
metadata:
  name: my-pod             # Resource name
  namespace: default       # Namespace
  labels:                  # Selection labels
    app: myapp
spec:                       # Resource spec
  containers:              # Container list
    - name: app
      image: myimage:latest
      ports:
        - containerPort: 8080
      volumeMounts:
        - mountPath: /data
          name: storage
  volumes:                 # Pod volumes
    - name: storage
      emptyDir: {}
```

---

### 🐚 Shell/Bash (40+ items)

**File Operations:**
```bash
ls [options] [path]         # List files
pwd                         # Print directory
cd [directory]              # Change directory
cp [options] src dst        # Copy
mv [options] src dst        # Move
rm [options] file           # Remove
mkdir [options] dir         # Create directory
rmdir dir                   # Remove directory
cat [files]                 # Display contents
```

**Text Processing:**
```bash
grep [options] pattern [files]   # Search
sed [options] script [files]     # Stream editor
awk [options] program [files]    # Text processing
cut [options] [files]            # Extract columns
sort [options] [files]           # Sort lines
uniq [options] [files]           # Remove duplicates
wc [options] [files]             # Count words/lines
head [options] [files]           # First lines
tail [options] [files]           # Last lines
```

**Process Management:**
```bash
ps [options]                # List processes
kill [signal] pid          # Kill process
killall [signal] name      # Kill all matching
bg [job]                   # Background job
fg [job]                   # Foreground job
nohup command              # Immune to hangup
top                        # Process monitor
```

**Control Flow:**
```bash
if [condition]; then ... fi     # Conditional
for var in list; do ... done    # For loop
while [condition]; do ... done  # While loop
case $var in ... esac          # Case statement
function name() { ... }        # Function definition
```

---

### 💻 PowerShell (40+ items)

**File/Folder Operations:**
```powershell
Get-ChildItem [-Path]           # List items
Get-Item [-Path]                # Get item
Copy-Item [-Path] [-Dest]       # Copy
Move-Item [-Path] [-Dest]       # Move
Remove-Item [-Path]             # Delete
New-Item [-Path] [-ItemType]    # Create
```

**Process Management:**
```powershell
Get-Process [[-Name]]           # List processes
Stop-Process [-Id] [-Force]     # Kill process
Start-Process [-FilePath]       # Start process
Get-Service [[-Name]]           # List services
Start-Service [-Name]           # Start service
Stop-Service [-Name]            # Stop service
```

**Text Processing:**
```powershell
Select-Object [-Property]       # Select properties
Where-Object { condition }      # Filter
ForEach-Object { ... }          # Iterate
Sort-Object [-Property]         # Sort
Group-Object [-Property]        # Group
Measure-Object [-Property]      # Statistics
```

**Useful Variables:**
```powershell
$PSScriptRoot                   # Script directory
$PSCommandPath                  # Command path
$error                          # Error array
$env:PATH                       # Environment variables
$null                          # Null value
$true, $false                  # Booleans
$_                             # Current object
```

---

### 📦 Maven (30+ items)

**Goals:**
```bash
mvn clean                       # Clean build
mvn compile                     # Compile code
mvn test                        # Run tests
mvn package                     # Package app
mvn install                     # Install locally
mvn deploy                      # Deploy remote
mvn verify                      # Verify build
mvn dependency:tree            # Show dependencies
mvn dependency:analyze         # Analyze deps
```

**POM Elements:**
```xml
<project>...</project>         # Root element
<modelVersion>4.0.0</modelVersion>  # POM version
<groupId>com.example</groupId>      # Group ID
<artifactId>my-app</artifactId>    # Artifact ID
<version>1.0.0</version>           # Version
<packaging>jar</packaging>          # Package type
<dependencies>...</dependencies>    # Dependencies
<build>...</build>                  # Build config
<plugins>...</plugins>              # Plugins
<repositories>...</repositories>    # Repositories
```

**Popular Plugins:**
```xml
maven-compiler-plugin           # Java compilation
maven-surefire-plugin           # Unit tests
maven-jar-plugin                # JAR building
maven-war-plugin                # WAR building
maven-shade-plugin              # Fat JAR
spring-boot-maven-plugin        # Spring Boot
maven-assembly-plugin           # Assemblies
exec-maven-plugin               # Execute Java
```

---

### 🔄 Jenkins Pipeline (30+ items)

**Pipeline Structure:**
```groovy
pipeline {                      // Pipeline block
  agent any|none|label('...')  // Execution agent
  stages {                      // All stages
    stage('Build') {            // Single stage
      steps {                   // Stage steps
        sh 'command'            // Shell command
        bat 'command'           // Batch command (Windows)
      }
    }
  }
  post {                        // Post-stage
    always { ... }              // Always run
    success { ... }             // On success
    failure { ... }             // On failure
    unstable { ... }            // On unstable
    cleanup { ... }             // Final cleanup
  }
}
```

**Key Steps:**
```groovy
sh 'command'                    // Execute shell
bat 'command'                   // Execute batch
echo 'message'                  // Print message
timeout(time: 10, unit: 'MINUTES') { ... }  // Timeout
retry(3) { ... }                // Retry block
junit 'test-results/**/*.xml'   // Test results
```

**Credentials & Environment:**
```groovy
environment {                   // Environment vars
  VAR_NAME = 'value'
  BUILD_ID = "${BUILD_ID}"
}
credentials('id')               // Reference credential
withCredentials([...]) { ... }  // Use credentials
usernamePassword(...)           // Username/password
file(...)                       // File credential
string(...)                     // Secret text
```

---

## 🎯 AI Helper Commands

| Command | Description |
|---------|-------------|
| `smeagol.generateBoilerplate` | Generate starter template for language |
| `smeagol.refactorCode` | Get refactoring suggestions |
| `smeagol.generateDocs` | Insert documentation template |
| `smeagol.generateTests` | Create test file skeleton |
| `smeagol.explainCode` | Analyze selected code |
| `smeagol.optimizeCode` | Performance optimization tips |

---

## 💡 Pro Tips

1. **Type slowly** - Completions trigger on individual characters
2. **Hover for details** - Hover over suggestions for full documentation
3. **Use keyboard** - Navigate completions with arrow keys
4. **Custom snippets** - Combine with VS Code snippets for maximum power
5. **Settings** - Customize colors and behavior in `settings.json`
6. **Multiple languages** - Completions work in polyglot projects
7. **AI commands** - Use Cmd+Shift+P to access AI helpers

---

*Last updated: 2024 | Smeagol Extension v0.1.0*
