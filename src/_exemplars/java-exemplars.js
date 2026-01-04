/**
 * Java Exemplars
 * Real code patterns from popular Java libraries
 */

const javaExemplars = [
  {
    framework: "spring",
    name: "Spring Controllers",
    code: `
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO dto) {
        UserDTO created = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
    `
  },
  {
    framework: "streams",
    name: "Java Streams",
    code: `
List<User> activeUsers = users.stream()
    .filter(User::isActive)
    .filter(u -> u.getAge() >= 18)
    .sorted(Comparator.comparing(User::getLastLogin).reversed())
    .collect(Collectors.toList());

Map<String, List<User>> byDepartment = users.stream()
    .collect(Collectors.groupingBy(User::getDepartment));

long count = users.stream()
    .filter(u -> u.isActive())
    .count();
    `
  },
  {
    framework: "optional",
    name: "Optional Handling",
    code: `
Optional<User> user = userRepository.findById(id);

// Chain operations
user.ifPresent(u -> sendEmail(u.getEmail()));
user.orElseThrow(() -> new UserNotFoundException(id));

String email = user
    .map(User::getEmail)
    .orElse("unknown@example.com");
    `
  },
  {
    framework: "guava",
    name: "Guava Collections",
    code: `
ImmutableList<String> names = ImmutableList.of("Alice", "Bob", "Charlie");
Map<String, Integer> ages = ImmutableMap.of("Alice", 30, "Bob", 25);

Iterable<String> filtered = Iterables.filter(names, s -> s.startsWith("A"));
List<Integer> lengths = Lists.transform(names, String::length);
    `
  },
  {
    framework: "lombok",
    name: "Lombok Annotations",
    code: `
@Data
@Builder
@AllArgsConstructor
public class User {
    private Long id;
    private String name;
    @NonNull
    private String email;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}

User user = User.builder()
    .id(1L)
    .name("Alice")
    .email("alice@example.com")
    .build();
    `
  },
  {
    framework: "exception-handling",
    name: "Try-with-Resources",
    code: `
try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
    String line;
    while ((line = reader.readLine()) != null) {
        process(line);
    }
} catch (IOException e) {
    logger.error("Error reading file", e);
}

try (Connection conn = getConnection();
     Statement stmt = conn.createStatement()) {
    ResultSet rs = stmt.executeQuery(query);
    // ...
}
    `
  }
];

module.exports = { javaExemplars };
