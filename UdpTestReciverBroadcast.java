public class UdpTestReciverBroadcast {
    public static void main(String[] args) throws Exception {
        UdpManager udp = new UdpManager("127.0.0.1");

        udp.startReceiverLoop(msg -> System.out.println("RECEIVED: " + msg));

        System.out.println("Listening on UDP 7501. Send packets now...");
        Thread.sleep(60_000); // keep program alive for 60 seconds
        udp.close();
    }
}
