use std::env;
use std::fs;

#[derive(Copy, Clone, Debug)]
enum Dir {
    N = 0,
    E = 90,
    S = 180,
    W = 270,
}

impl Dir {
    fn from_val(val: i32) -> Dir {
        match val {
            0 => Dir::N,
            90 => Dir::E,
            180 => Dir::S,
            270 => Dir::W,
            _ => panic!("Invalid direction: {}", val),
        }
    }

    fn rotate(&self, amount: &i32) -> Dir {
        Dir::from_val(((*self as i32) + amount + 360) % 360)
    }
}

#[derive(Debug)]
struct Motion {
    dir: Dir,
    amount: i32,
}

impl Motion {
    fn execute(&self, pos: Position) -> Position {
        match *self {
            Motion {
                dir: Dir::N,
                amount,
            } => Position {
                y: pos.y + amount,
                ..pos
            },
            Motion {
                dir: Dir::E,
                amount,
            } => Position {
                x: pos.x + amount,
                ..pos
            },
            Motion {
                dir: Dir::S,
                amount,
            } => Position {
                y: pos.y - amount,
                ..pos
            },
            Motion {
                dir: Dir::W,
                amount,
            } => Position {
                x: pos.x - amount,
                ..pos
            },
        }
    }
}

#[derive(Debug)]
enum Op {
    F(i32),
    L(i32),
    R(i32),
}

impl Op {
    fn execute(&self, pos: Position) -> Position {
        match *self {
            Op::F(amount) => {
                let motion = Motion {
                    dir: pos.dir,
                    amount: amount,
                };
                motion.execute(pos)
            }
            Op::R(amount) => Position {
                dir: pos.dir.rotate(&amount),
                ..pos
            },
            Op::L(amount) => Position {
                dir: pos.dir.rotate(&(-1 * amount)),
                ..pos
            },
        }
    }
}

#[derive(Debug)]
enum Command {
    Motion(Motion),
    Op(Op),
}

impl Command {
    fn execute(&self, pos: Position) -> Position {
        match self {
            Command::Motion(motion) => motion.execute(pos),
            Command::Op(op) => op.execute(pos),
        }
    }
}

#[derive(Debug)]
struct Position {
    dir: Dir,
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
                'N' => Command::Motion(Motion {
                    dir: Dir::N,
                    amount,
                }),
                'S' => Command::Motion(Motion {
                    dir: Dir::S,
                    amount,
                }),
                'E' => Command::Motion(Motion {
                    dir: Dir::E,
                    amount,
                }),
                'W' => Command::Motion(Motion {
                    dir: Dir::W,
                    amount,
                }),
                'L' => Command::Op(Op::L(amount)),
                'R' => Command::Op(Op::R(amount)),
                'F' => Command::Op(Op::F(amount)),
                _ => panic!("Invalid command"),
            }
        })
        .collect();

    let mut pos = Position {
        dir: Dir::E,
        x: 0,
        y: 0,
    };

    for command in commands {
        pos = command.execute(pos);
        println!("{:?}, {:?}", command, pos)
    }

    println!(
        "Pos: ({}, {}), Manhattan distance: {}",
        pos.x,
        pos.y,
        pos.x + pos.y
    );
}
