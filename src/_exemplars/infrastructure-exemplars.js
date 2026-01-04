/**
 * Kubernetes Exemplars
 */
const kubernetesExemplars = [{
    framework: "k8s",
    name: "Kubernetes Resources",
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:1.0
        ports:
        - containerPort: 8080
        env:
        - name: LOG_LEVEL
          value: INFO
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
`}];

/**
 * Maven Exemplars
 */
const mavenExemplars = [{
    framework: "maven",
    name: "Maven POM",
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>my-app</artifactId>
  <version>1.0.0</version>
  
  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.13</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
  
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.8.1</version>
      </plugin>
    </plugins>
  </build>
</project>
`}];

/**
 * Jenkins Exemplars
 */
const jenkinsExemplars = [{
    framework: "jenkins",
    name: "Jenkins Pipeline",
    code: `pipeline {
    agent any
    
    environment {
        BUILD_VERSION = '1.0'
        REGISTRY = 'docker.io'
    }
    
    stages {
        stage('Build') {
            steps {
                script {
                    echo "Building version \${BUILD_VERSION}"
                    sh 'mvn clean package'
                }
            }
        }
        
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }
        
        stage('Deploy') {
            steps {
                sh './deploy.sh'
            }
        }
    }
    
    post {
        always {
            junit 'target/surefire-reports/*.xml'
            archiveArtifacts artifacts: 'target/*.jar'
        }
        failure {
            emailext(subject: "Build failed", body: "Check logs")
        }
    }
}
`}];

/**
 * Spring Boot Exemplars
 */
const springBootExemplars = [{
    framework: "springboot",
    name: "Spring Boot Application",
    code: `@SpringBootApplication
@EnableCaching
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    
    @GetMapping
    public Page<ProductDTO> list(@PageableDefault(size = 20) Pageable page) {
        return productService.findAll(page);
    }
    
    @PostMapping
    public ResponseEntity<ProductDTO> create(@RequestBody @Valid ProductDTO dto) {
        return ResponseEntity
            .created(URI.create("/api/products/" + dto.getId()))
            .body(productService.create(dto));
    }
}

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repository;
    
    @Transactional(readOnly = true)
    @Cacheable("products")
    public List<Product> findAll() {
        return repository.findAll();
    }
}
`}];

module.exports = {
    kubernetesExemplars,
    mavenExemplars,
    jenkinsExemplars,
    springBootExemplars
};
