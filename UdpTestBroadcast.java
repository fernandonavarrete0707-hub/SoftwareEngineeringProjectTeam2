

// to test use netcat : nc -l -u 127.0.0.1 7500
public class UdpTestBroadcast {
    public static void main(String[] args) throws Exception {
        UdpManager udp = new UdpManager("127.0.0.1");

        udp.broadcastInt(111);

        udp.setNetworkAddress("127.0.0.1"); // change it (same here, but exercises code)
        udp.broadcastInt(222);

        System.out.println("Sent 111 then 222 after setNetworkAddr()");
        udp.close();
    }
}
