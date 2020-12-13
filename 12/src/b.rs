use std::env;
use std::fs;

#[derive(Copy, Clone, Debug)]
enum Dir {
    N(i32),
    E(i32),
    S(i32),
    W(i32),
}

impl Dir {
    fn execute(&self, pos: Position) -> Position {
        match *self {
            Dir::N(amount) => Position {
                y: pos.y + amount,
                ..pos
            },
            Dir::E(amount) => Position {
                x: pos.x + amount,
                ..pos
            },
            Dir::S(amount) => Position {
                y: pos.y - amount,
                ..pos
            },
            Dir::W(amount) => Position {
                x: pos.x - amount,
                ..pos
            },
        }
    }
}

#[derive(Copy, Clone, Debug)]
enum Rotation {
    L(i32),
    R(i32),
}

impl Rotation {
    fn execute(&self, pos: Position) -> Position {
        let degrees_clockwise = match *self {
            Rotation::L(degrees) => -1 * degrees + 360,
            Rotation::R(degrees) => degrees,
        };

        let num_rotations = degrees_clockwise / 90;

        let mut result_pos = pos;
        for _ in 0..num_rotations {
            result_pos = Position {
                x: result_pos.y,
                y: -1 * result_pos.x,
            };
        }

        result_pos
    }
}

#[derive(Copy, Clone, Debug)]
enum Forward {
    F(i32),
}

impl Forward {
    fn execute(&self, pos: Position, waypoint_rel: Position) -> Position {
        let Forward::F(count) = *self;
        Position {
            x: pos.x + waypoint_rel.x * count,
            y: pos.y + waypoint_rel.y * count,
        }
    }
}

#[derive(Copy, Clone, Debug)]
enum Command {
    Dir(Dir),
    Rotation(Rotation),
    Forward(Forward),
}

impl Command {
    fn execute(&self, pos: Position, waypoint_rel: Position) -> (Position, Position) {
        match self {
            Command::Dir(dir) => (pos, dir.execute(waypoint_rel)),
            Command::Rotation(rotation) => (pos, rotation.execute(waypoint_rel)),
            Command::Forward(forward) => (forward.execute(pos, waypoint_rel), waypoint_rel),
        }
    }
}

#[derive(Copy, Clone, Debug)]
struct Position {
    x: i32,
    y: i32,
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let filename = &args[1];
    let file = fs::read_to_string(filename).expect("Couldn't read file");
    let commands: Vec<Command> = file
        .lines()
        .map(|line: &str| {
            let mut chars = line.chars();
            let direction = chars.nth(0).expect("Empty string");
            let amount = &line[1..];
            let amount: i32 = String::from(amount).parse().expect("Couldn't parse number");
            match direction {
                'N' => Command::Dir(Dir::N(amount)),
                'S' => Command::Dir(Dir::S(amount)),
                'E' => Command::Dir(Dir::E(amount)),
                'W' => Command::Dir(Dir::W(amount)),
                'L' => Command::Rotation(Rotation::L(amount)),
                'R' => Command::Rotation(Rotation::R(amount)),
                'F' => Command::Forward(Forward::F(amount)),
                _ => panic!("Invalid command"),
            }
        })
        .collect();

    let mut waypoint_rel = Position { x: 10, y: 1 };
    let mut position = Position { x: 0, y: 0 };

    for command in commands {
        let (new_pos, new_way) = command.execute(position, waypoint_rel);
        position = new_pos;
        waypoint_rel = new_way;

        println!("{:?}, {:?}, {:?}", command, position, waypoint_rel)
    }

    println!(
        "Pos: ({}, {}), Manhattan distance: {}",
        position.x,
        position.y,
        position.x.abs() + position.y.abs()
    );
}
