use std::collections::HashMap;

fn both(starting_numbers: Vec<u32>, seek: usize) {
    let (mut track, last_num) = starting_numbers.iter().enumerate().fold((HashMap::new(), 0), |mut res, (idx, item)| {
        if idx != starting_numbers.len() - 1 {
            res.0.insert(*item, idx as u32); 
        }
        (res.0, *item)
    });

    let mut last_num = last_num;
    for i in (starting_numbers.len() - 1)..(seek - 1) {
        // println!("{}", last_num);
        let next_num = match track.get(&last_num) {
            Some(val) => (i as u32) - *val,
            None => 0
        };
        
        track.insert(last_num, i as u32);
        last_num = next_num;
    }

    println!("{}", last_num);
}

fn main() {
    let input = "0,13,16,17,1,10,6";
    let starting_numbers= input.split(",").map(|val| val.parse::<u32>().expect("Couldn't parse int")).collect();

    both(starting_numbers, 30000000);
}
