/**
 * Rust Exemplars
 * Real code patterns from popular Rust libraries
 */

const rustExemplars = [
  {
    framework: "tokio",
    name: "Tokio Async",
    code: `
#[tokio::main]
async fn main() {
    let future1 = fetch_data("url1");
    let future2 = fetch_data("url2");
    
    let (result1, result2) = tokio::join!(future1, future2);
    println!("{:?}, {:?}", result1, result2);
}

async fn fetch_data(url: &str) -> Result<String, Error> {
    let response = reqwest::get(url).await?;
    response.text().await
}
    `
  },
  {
    framework: "serde",
    name: "Serde Serialization",
    code: `
#[derive(Serialize, Deserialize, Debug)]
struct User {
    #[serde(rename = "user_id")]
    id: u32,
    name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    email: Option<String>,
}

let json = serde_json::to_string(&user)?;
let user: User = serde_json::from_str(&json)?;
    `
  },
  {
    framework: "rayon",
    name: "Rayon Parallelism",
    code: `
use rayon::prelude::*;

let numbers: Vec<i32> = (1..1000).collect();
let sum: i32 = numbers.par_iter()
    .map(|x| x * x)
    .sum();

let results: Vec<_> = data.par_iter()
    .filter(|x| x.is_valid())
    .map(|x| process(x))
    .collect();
    `
  },
  {
    framework: "clap",
    name: "Clap CLI",
    code: `
use clap::{Parser};

#[derive(Parser)]
struct Args {
    #[arg(short, long)]
    input: String,
    
    #[arg(short, long, default_value = "output.txt")]
    output: String,
    
    #[arg(short, long)]
    verbose: bool,
}

fn main() {
    let args = Args::parse();
    println!("Input: {}", args.input);
}
    `
  },
  {
    framework: "error-handling",
    name: "Error Handling",
    code: `
fn parse_number(s: &str) -> Result<i32, ParseError> {
    s.parse::<i32>()
        .map_err(|e| ParseError::Invalid(e.to_string()))
}

fn process() -> Result<(), Box<dyn Error>> {
    let num = parse_number("42")?;
    let file = std::fs::File::open("data.txt")?;
    Ok(())
}

match result {
    Ok(value) => println!("{}", value),
    Err(e) => eprintln!("Error: {}", e),
}
    `
  },
  {
    framework: "pattern-matching",
    name: "Pattern Matching",
    code: `
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn process_message(msg: Message) {
    match msg {
        Message::Quit => println!("Quit"),
        Message::Move { x, y } => println!("Move to ({}, {})", x, y),
        Message::Write(text) => println!("Text: {}", text),
        Message::ChangeColor(r, g, b) => println!("Color: ({}, {}, {})", r, g, b),
    }
}
    `
  },
  {
    framework: "traits",
    name: "Trait Implementation",
    code: `
trait Drawable {
    fn draw(&self);
}

impl Drawable for Circle {
    fn draw(&self) {
        println!("Drawing circle with radius {}", self.radius);
    }
}

fn render<T: Drawable>(shape: &T) {
    shape.draw();
}
    `
  }
];

module.exports = { rustExemplars };
