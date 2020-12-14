use modinverse::egcd;
use std::env;
use std::fs;

fn one(time: &i128, buses: &Vec<&str>) {
    let buses: Vec<i128> = buses
        .into_iter()
        .filter_map(|bus| bus.parse::<i128>().ok())
        .collect();

    let res = buses
        .iter()
        .map(|bus_num| (bus_num, bus_num - (time % bus_num)))
        .min_by(|x, y| x.1.cmp(&y.1))
        .expect("Didn't get a min");

    println!("best: {}, {}, result: {}", res.0, res.1, res.0 * res.1);
}

fn find_offset(pa: i128, pb: i128, phi_a: i128, phi_b: i128, lcm: i128) -> i128 {
    let (gcd, s, _) = egcd(pa, pb);
    let z = (phi_a - phi_b) / gcd;
    let m = z * s;

    ((m * pa - phi_a) % lcm + lcm) % lcm
}

struct Agg {
    p_a: i128,   // period
    phi_a: i128, // phase
    count: i128,
}

fn two(buses: &Vec<&str>) {
    let mut iter = buses.iter();
    let first = Agg {
        p_a: iter
            .next()
            .expect("No first value")
            .parse::<i128>()
            .expect("Parse first num"),
        phi_a: 0,
        count: 0,
    };

    let res: Agg = iter.fold(first, |acc: Agg, next: &&str| {
        if *next == "x" {
            return Agg {
                count: acc.count + 1,
                ..acc
            };
        }
        let next: i128 = next.parse().expect("Can't parse number");
        let new_mod = num::integer::lcm(acc.p_a, next);
        let new_offset = find_offset(
            acc.p_a,
            next,
            acc.p_a - acc.phi_a,
            next - (acc.count + 1),
            new_mod,
        );
        Agg {
            p_a: new_mod,
            phi_a: new_offset,
            count: acc.count + 1,
        }
    });

    println!("{:?}", res.p_a - res.phi_a)
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let file = fs::read_to_string(&args[1]).expect("Couldn't read file");
    let lines: Vec<_> = file.split('\n').collect();

    let time: i128 = String::from(lines[0]).parse().expect("Couldn't parse time");
    let buses: Vec<&str> = lines[1].split(',').collect();

    one(&time, &buses);
    two(&buses);
}
