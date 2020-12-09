import java.io.File;
import java.io.FileNotFoundException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;
import java.util.TreeSet;

public class Nine {

    public static final long TARGET = 507622668;

    public static boolean check(long next, TreeSet<Long> set) {
        Iterator<Long> fwd = set.iterator();
        Iterator<Long> bwd = set.descendingIterator();

        long lo = fwd.next();
        long hi = bwd.next();

        while (lo != hi) {
            if (lo + hi < next) {
                lo = fwd.next();
            } else if (lo + hi > next) {
                hi = bwd.next();
            } else {
                return true;
            }
        }
        return false;
    }

    public static long search(long target, Queue<Long> queue) {
        Iterator<Long> lo = queue.iterator();
        Iterator<Long> hi = queue.iterator();
        long sum = 0;

        TreeSet<Long> set = new TreeSet<Long>();

        while (sum != target) {
            if (sum < target) {
                long next = hi.next();
                set.add(next);
                sum += next;
            } else {
                long next = lo.next();
                set.remove(next);
                sum -= next;
            }
        }
        set.ro

        return set.first() + set.last();
    }

    public static void main(String[] args) throws FileNotFoundException {
        Scanner input = new Scanner(new File("input.txt"));

        Queue<Long> queue = new LinkedList<>();
        TreeSet<Long> set = new TreeSet<>();

        while (input.hasNextLine()) {
            long next = Long.parseLong(input.nextLine());

            // if (queue.size() == 25) {
            if (next == TARGET) {
                long res = search(TARGET, queue);
                System.out.println(res);
            }

            // long old = queue.remove();
            // set.remove(old);
            // }

            queue.add(next);
            set.add(next);
        }
    }
}
