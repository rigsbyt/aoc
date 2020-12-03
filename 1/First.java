import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;

public class First {
    static class Pair {
        long first;
        long second;

        Pair(long first, long second) {
            this.first = first;
            this.second = second;
        }
    }

    public static void main(String[] args) throws FileNotFoundException {
        Scanner input = new Scanner(new File("input.txt"));

        List<Long> nums = new ArrayList<>();
        Map<Long, Pair> map = new HashMap<>();

        while (input.hasNextLine()) {
            String line = input.nextLine();
            nums.add(Long.parseLong(line));
        }

        for (int i = 0; i < nums.size(); i++) {
            for (int j = i + 1; j < nums.size(); j++) {
                map.put(nums.get(i) + nums.get(j), new Pair(nums.get(i), nums.get(j)));
            }
        }

        for (Long num : nums) {
            Long inv = 2020 - num;

            if (map.containsKey(inv)) {
                Pair p = map.get(inv);
                System.out.println(num * p.first * p.second);
            }
        }
    }
}