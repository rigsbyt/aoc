import java.io.File;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Scanner;

public class Ten {

    public static int countGaps(PriorityQueue<Integer> pq) {
        int[] gaps = new int[] { 0, 0, 0 };
        int curVal = pq.remove();
        gaps[curVal - 1]++;

        while (!pq.isEmpty()) {
            int next = pq.remove();
            gaps[next - curVal - 1]++;
            curVal = next;
            System.out.println(curVal + ", " + Arrays.toString(gaps));
        }

        gaps[2]++;

        return gaps[0] * gaps[2];
    }

    public static long countWays(PriorityQueue<Integer> pq) {
        Map<Integer, Long> waysMemo = new HashMap<>();

        waysMemo.put(0, 1L);
        int last = 0;

        while (!pq.isEmpty()) {
            int next = pq.remove();
            long waysToNext = 0;
            for (int i = next - 3; i < next; i++) {
                waysToNext += waysMemo.getOrDefault(i, 0L);
            }
            waysMemo.put(next, waysToNext);
            last = next;
        }

        return waysMemo.get(last);
    }

    public static void main(String[] args) throws FileNotFoundException {
        Scanner input = new Scanner(new File("input.txt"));

        PriorityQueue<Integer> pq = new PriorityQueue<>();

        while (input.hasNextLine()) {
            pq.add(Integer.parseInt(input.nextLine()));
        }

        System.out.println(countWays(pq));

    }
}
